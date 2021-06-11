import { ROOT_NODE } from '@craftjs/utils';
import mapValues from 'lodash/mapValues';

import { CoreEventHandlers } from './CoreEventHandlers';
import { createShadow } from './createShadow';

import { Indicator, Node, NodeId, NodeTree } from '../interfaces';
import { CraftDOMEvent, defineEventListener } from '../utils/Handlers';

export * from '../utils/Handlers';

type DraggedElement = NodeId | NodeTree;

const canvasType = (type: string) =>
  type === 'GroupingContainer' || type === 'Display';

/**
 * Checks node for being a Grouping Container and searches through its
 * ancestors if it's not, returning the first one found or the root.
 */
const getClosestAncestorGroupingContainer = (allNodes, node) => {
  if (canvasType(node.data.name)) {
    return node;
  }

  const parent = allNodes.find((n) => n.data.nodes.includes(node.id));

  if (!parent) {
    return allNodes.find((n) => n.id === ROOT_NODE);
  }

  return getClosestParentGroupingContainer(allNodes, parent);
};

/**
 * Specifies Editor-wide event handlers and connectors
 */
export class DefaultEventHandlers extends CoreEventHandlers {
  static draggedElementShadow: HTMLElement;
  static draggedElement: DraggedElement;
  static indicator: Indicator = null;

  // Safely run handler if Node Id exists
  defineNodeEventListener(
    eventName: string,
    handler: (e: CraftDOMEvent<Event>, id: NodeId) => void,
    capture?: boolean
  ) {
    return defineEventListener(
      eventName,
      (e: CraftDOMEvent<Event>, id: NodeId) => {
        if (id) {
          const node = this.store.query.node(id).get();
          if (!node) {
            return;
          }
        }

        handler(e, id);
      },
      capture
    );
  }

  handlers() {
    return {
      connect: {
        init: (el, id) => {
          this.connectors().select(el, id);
          this.connectors().hover(el, id);
          this.connectors().drop(el, id);
          this.store.actions.setDOM(id, el);
        },
      },
      select: {
        init: () => () => this.store.actions.setNodeEvent('selected', null),
        events: [
          this.defineNodeEventListener(
            'mousedown',
            (e: CraftDOMEvent<MouseEvent>, id: NodeId) => {
              e.craft.stopPropagation();
              this.store.actions.setNodeEvent('selected', id);
            }
          ),
        ],
      },
      hover: {
        init: () => () => this.store.actions.setNodeEvent('hovered', null),
        events: [
          this.defineNodeEventListener(
            'mouseover',
            (e: CraftDOMEvent<MouseEvent>, id: NodeId) => {
              e.craft.stopPropagation();
              this.store.actions.setNodeEvent('hovered', id);
            }
          ),
        ],
      },
      drop: {
        events: [
          defineEventListener('dragover', (e: CraftDOMEvent<MouseEvent>) => {
            e.craft.stopPropagation();
            e.preventDefault();
          }),
          this.defineNodeEventListener(
            'dragenter',
            (e: CraftDOMEvent<MouseEvent>, targetId: NodeId) => {
              e.craft.stopPropagation();
              e.preventDefault();

              const draggedElement = DefaultEventHandlers.draggedElement;
              if (!draggedElement) {
                return;
              }

              let node = (draggedElement as unknown) as Node;

              if ((draggedElement as NodeTree).rootNodeId) {
                const nodeTree = draggedElement as NodeTree;
                node = nodeTree.nodes[nodeTree.rootNodeId];
              }

              const { clientX: x, clientY: y } = e;
              const indicator = this.store.query.getDropPlaceholder(
                node,
                targetId,
                { x, y }
              );

              if (!indicator) {
                return;
              }
              this.store.actions.setIndicator(indicator);
              DefaultEventHandlers.indicator = indicator;
            }
          ),
        ],
      },

      drag: {
        init: (el, id) => {
          if (!this.store.query.node(id).isDraggable()) {
            return () => {};
          }

          el.setAttribute('draggable', 'true');
          return () => el.setAttribute('draggable', 'false');
        },
        events: [
          this.defineNodeEventListener(
            'dragstart',
            (e: CraftDOMEvent<DragEvent>, id: NodeId) => {
              e.craft.stopPropagation();
              this.store.actions.setNodeEvent('dragged', id);

              DefaultEventHandlers.draggedElementShadow = createShadow(e);
              DefaultEventHandlers.draggedElement = id;
            }
          ),
          defineEventListener('dragend', (e: CraftDOMEvent<DragEvent>) => {
            e.craft.stopPropagation();
            const onDropElement = (draggedElement, placement) => {
              const index =
                placement.index + (placement.where === 'after' ? 1 : 0);
              this.store.actions.move(
                draggedElement,
                placement.parent.id,
                index
              );
            };
            this.dropElement(onDropElement);
          }),
        ],
      },
      create: {
        init: (el) => {
          el.setAttribute('draggable', 'true');
          return () => el.removeAttribute('draggable');
        },
        events: [
          defineEventListener(
            'dragstart',
            (e: CraftDOMEvent<DragEvent>, userElement: React.ReactElement) => {
              e.craft.stopPropagation();
              const tree = this.store.query
                .parseReactElement(userElement)
                .toNodeTree();

              DefaultEventHandlers.draggedElementShadow = createShadow(e);
              DefaultEventHandlers.draggedElement = tree;
            }
          ),
          defineEventListener('dragend', (e: CraftDOMEvent<DragEvent>) => {
            e.craft.stopPropagation();
            const onDropElement = (draggedElement, placement) => {
              const allNodes = Object.values(this.store.getState().nodes);
              const ancestorGroupingContainer = getClosestAncestorGroupingContainer(
                allNodes,
                placement.parent
              );

              const { position, parentId } = (function () {
                const clientX = e.clientX;
                const clientY = e.clientY;

                // Add node to the closest ancestor Grouping Container
                const {
                  x: elementX,
                  y: elementY,
                } = ancestorGroupingContainer.dom.getBoundingClientRect();

                return {
                  parentId: ancestorGroupingContainer.id,
                  position: {
                    x: clientX - elementX,
                    y: clientY - elementY,
                  },
                };
              })();

              // HACK: augment dropped node with cursor position at the time of dropping
              const nodesWithPositionSet = {
                ...draggedElement,
                nodes: mapValues(draggedElement.nodes, (node) => ({
                  ...node,
                  data: {
                    ...node.data,
                    props: {
                      ...node.data.props,
                      ...position,
                    },
                  },
                })),
              };

              this.store.actions.addNodeTree(
                nodesWithPositionSet,
                parentId,
                // HACK: make each new element last, so it appears above the rest
                Infinity
              );
            };
            this.dropElement(onDropElement);
          }),
        ],
      },
    };
  }

  private dropElement(
    onDropNode: (
      draggedElement: DraggedElement,
      placement: Indicator['placement']
    ) => void
  ) {
    const {
      draggedElement,
      draggedElementShadow,
      indicator,
    } = DefaultEventHandlers;
    if (draggedElement && indicator && !indicator.error) {
      const { placement } = indicator;
      onDropNode(draggedElement, placement);
    }

    if (draggedElementShadow) {
      draggedElementShadow.parentNode.removeChild(draggedElementShadow);
      DefaultEventHandlers.draggedElementShadow = null;
    }

    DefaultEventHandlers.draggedElement = null;
    DefaultEventHandlers.indicator = null;

    this.store.actions.setIndicator(null);
    this.store.actions.setNodeEvent('dragged', null);
  }
}
