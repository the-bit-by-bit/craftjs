import { useEditor } from '@craftjs/core';
import React from 'react';
import styled from 'styled-components';

import Arrow from './svg/arrow.svg';
import Eye from './svg/eye.svg';
import Linked from './svg/linked.svg';

import { useLayer } from '../useLayer';

const StyledDiv = styled.div<{ depth: number; selected: boolean }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 4px 15px;
  background: ${(props) => (props.selected ? '#2680eb' : 'transparent')};
  color: ${(props) => (props.selected ? '#fff' : 'inherit')};
  svg {
    fill: ${(props) => (props.selected ? '#fff' : '#808184')};
    margin-bottom: 2px;
    vertical-align: baseline;
  }
  .inner {
    flex: 1;
    > div {
      padding: 0px;
      flex: 1;
      display: flex;
      margin-left: ${(props) => props.depth * 10}px;
      align-items: center;
      div.layer-name {
        flex: 1;
        h2 {
          font-size: 15px;
          line-height: 26px;
        }
      }
    }
  }
`;

const Expand = styled.a<{ expanded: boolean }>`
  width: 8px;
  display: block;
  transform: rotate(${(props) => (props.expanded ? 180 : 0)}deg);
  opacity: 0.7;
  cursor: pointer;
`;

const Hide = styled.a<{ selected: boolean; isHidden: boolean }>`
  width: 14px;
  height: 14px;
  margin-right: 10px;
  position: relative;
  transition: 0.4s cubic-bezier(0.19, 1, 0.22, 1);
  cursor: pointer;

  svg {
    width: 100%;
    height: 100%;
    object-fit: contain;
    opacity: ${(props) => (props.isHidden ? 0.2 : 1)};
  }
  &:after {
    content: ' ';
    width: 2px;
    height: ${(props) => (props.isHidden ? 100 : 0)}%;
    position: absolute;
    left: 2px;
    top: 3px;
    background: ${(props) => (props.selected ? '#fff' : '#808184')};
    transform: rotate(-45deg);
    transition: 0.4s cubic-bezier(0.19, 1, 0.22, 1);
    transform-origin: 0% 0%;
    opacity: ${(props) => (props.isHidden ? 0.4 : 1)};
  }
`;

const TopLevelIndicator = styled.div`
  margin-left: -22px;
  margin-right: 10px;

  svg {
    width: 12px;
    height: 12px;
  }
`;

const Name = styled.div`
  cursor: default;
`;

export const DefaultLayerHeader: React.FC = () => {
  const {
    id,
    depth,
    expanded,
    children,
    connectors: { layerHeader },
    actions: { toggleLayer },
  } = useLayer((layer) => {
    return {
      expanded: layer.expanded,
    };
  });

  const { hidden, actions, selected, topLevel, displayName } = useEditor(
    (state, query) => ({
      hidden: state.nodes[id] && state.nodes[id].data.hidden,
      selected: state.events.selected === id,
      topLevel: query.node(id).isTopLevelCanvas(),
      displayName:
        (state.nodes[id] && state.nodes[id].data.name) ||
        state.nodes[id].data.displayName,
    })
  );

  // Removing ref={drag} from StyledDiv and setting attribute in DefaultEventHandlers block dragging layers functionality.
  // Drag is getting from connectors.
  return (
    <StyledDiv selected={selected} depth={depth} onClick={() => toggleLayer()}>
      <Hide
        selected={selected}
        isHidden={hidden}
        onClick={(event) => {
          event.stopPropagation();
          actions.setHidden(id, !hidden);
        }}
      >
        <Eye />
      </Hide>
      <div className="inner">
        <div ref={layerHeader}>
          {topLevel ? (
            <TopLevelIndicator>
              <Linked />
            </TopLevelIndicator>
          ) : null}

          <Name className="layer-name s">{displayName}</Name>
          <div>
            {children && children.length ? (
              <Expand expanded={expanded}>
                <Arrow />
              </Expand>
            ) : null}
          </div>
        </div>
      </div>
    </StyledDiv>
  );
};
