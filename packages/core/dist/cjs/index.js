'use strict';
Object.defineProperty(exports, '__esModule', { value: !0 });
var utils = require('@craftjs/utils'),
  React = require('react'),
  invariant = require('tiny-invariant'),
  mapValues = require('lodash/mapValues'),
  immer = require('immer'),
  shortid = require('shortid'),
  cloneDeep = require('lodash/cloneDeep');
function _interopDefaultLegacy(e) {
  return e && 'object' == typeof e && 'default' in e ? e : { default: e };
}
var React__default = _interopDefaultLegacy(React),
  invariant__default = _interopDefaultLegacy(invariant),
  mapValues__default = _interopDefaultLegacy(mapValues),
  shortid__default = _interopDefaultLegacy(shortid),
  cloneDeep__default = _interopDefaultLegacy(cloneDeep),
  _extendStatics = function (e, t) {
    return (_extendStatics =
      Object.setPrototypeOf ||
      ({ __proto__: [] } instanceof Array &&
        function (e, t) {
          e.__proto__ = t;
        }) ||
      function (e, t) {
        for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n]);
      })(e, t);
  };
function __extends(e, t) {
  function n() {
    this.constructor = e;
  }
  _extendStatics(e, t),
    (e.prototype =
      null === t ? Object.create(t) : ((n.prototype = t.prototype), new n()));
}
var _assign = function () {
  return (_assign =
    Object.assign ||
    function (e) {
      for (var t, n = 1, r = arguments.length; n < r; n++)
        for (var o in (t = arguments[n]))
          Object.prototype.hasOwnProperty.call(t, o) && (e[o] = t[o]);
      return e;
    }).apply(this, arguments);
};
function __rest(e, t) {
  var n = {};
  for (var r in e)
    Object.prototype.hasOwnProperty.call(e, r) &&
      t.indexOf(r) < 0 &&
      (n[r] = e[r]);
  if (null != e && 'function' == typeof Object.getOwnPropertySymbols) {
    var o = 0;
    for (r = Object.getOwnPropertySymbols(e); o < r.length; o++)
      t.indexOf(r[o]) < 0 &&
        Object.prototype.propertyIsEnumerable.call(e, r[o]) &&
        (n[r[o]] = e[r[o]]);
  }
  return n;
}
var EventHandlerContext = React.createContext(null),
  useEventHandler = function () {
    return React.useContext(EventHandlerContext);
  },
  defineEventListener = function (e, t, n) {
    return [e, t, n];
  },
  isEventBlockedByDescendant = function (e, t, n) {
    for (
      var r = (e.craft && e.craft.blockedEvents[t]) || [], o = 0;
      o < r.length;
      o++
    ) {
      var a = r[o];
      if (n !== a && n.contains(a)) return !0;
    }
    return !1;
  },
  WatchHandler = (function () {
    function e(e, t, n, r) {
      var o = this;
      (this.el = t),
        (this.opts = n),
        (this.handler = r),
        (this.unsubscribe = e.subscribe(
          function (e) {
            return { enabled: e.options.enabled };
          },
          function (e) {
            var n = e.enabled;
            if (!t.ownerDocument.body.contains(t))
              return o.remove(), o.unsubscribe();
            n ? o.add() : o.remove();
          },
          !0
        ));
    }
    return (
      (e.prototype.add = function () {
        var e = this,
          t = this.handler,
          n = t.init,
          r = t.events;
        (this.cleanDOM = n && n(this.el, this.opts)),
          (this.listenersToRemove =
            r &&
            r.map(function (t) {
              var n = t[0],
                r = t[1],
                o = t[2],
                a = function (t) {
                  t.craft ||
                    (t.craft = {
                      blockedEvents: {},
                      stopPropagation: function () {},
                    }),
                    isEventBlockedByDescendant(t, n, e.el) ||
                      ((t.craft.stopPropagation = function () {
                        t.craft.blockedEvents[n] ||
                          (t.craft.blockedEvents[n] = []),
                          t.craft.blockedEvents[n].push(e.el);
                      }),
                      r(t, e.opts));
                };
              return (
                e.el.addEventListener(n, a, o),
                function () {
                  return e.el.removeEventListener(n, a, o);
                }
              );
            }));
      }),
      (e.prototype.remove = function () {
        this.cleanDOM && (this.cleanDOM(), (this.cleanDOM = null)),
          this.listenersToRemove &&
            (this.listenersToRemove.forEach(function (e) {
              return e();
            }),
            (this.listenersToRemove = null));
      }),
      e
    );
  })(),
  Handlers = (function () {
    function e(e) {
      (this.wm = new WeakMap()), (this.store = e);
    }
    return (
      (e.prototype.connectors = function () {
        var e = this,
          t = this.handlers() || {};
        return Object.keys(t).reduce(function (n, r) {
          var o = t[r],
            a = o.init,
            i = o.events;
          return a || i
            ? ((n[r] = utils.wrapHookToRecognizeElement(function (t, n) {
                var o;
                if (t && t.ownerDocument.body.contains(t)) {
                  var d = e.wm.get(t);
                  (d && d[r]) ||
                    e.wm.set(
                      t,
                      _assign(
                        {},
                        d,
                        (((o = {})[r] = new WatchHandler(e.store, t, n, {
                          init: a,
                          events: i,
                        })),
                        o)
                      )
                    );
                } else e.wm.delete(t);
              })),
              n)
            : ((n[r] = function () {}), n);
        }, {});
      }),
      (e.getConnectors = function () {
        for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
        var n = new (this.bind.apply(this, [void 0].concat(e)))();
        return n.connectors();
      }),
      e
    );
  })(),
  CoreEventHandlers = (function (e) {
    function t() {
      return (null !== e && e.apply(this, arguments)) || this;
    }
    return (
      __extends(t, e),
      (t.prototype.derive = function (e) {
        for (var t = [], n = 1; n < arguments.length; n++)
          t[n - 1] = arguments[n];
        return new (e.bind.apply(e, [void 0, this.store, this].concat(t)))();
      }),
      t
    );
  })(Handlers),
  DerivedEventHandlers = (function (e) {
    function t(t, n) {
      var r = e.call(this, t) || this;
      return (r.derived = n), r;
    }
    return __extends(t, e), t;
  })(Handlers),
  createShadow = function (e) {
    var t = e.target.cloneNode(!0),
      n = e.target.getBoundingClientRect(),
      r = n.height;
    return (
      (t.style.width = n.width + 'px'),
      (t.style.height = r + 'px'),
      (t.style.position = 'fixed'),
      (t.style.left = '-100%'),
      (t.style.top = '-100%'),
      document.body.appendChild(t),
      e.dataTransfer.setDragImage(t, 0, 0),
      t
    );
  },
  canvasType = function (e) {
    return 'GroupingContainer' === e || 'Display' === e;
  },
  getClosestAncestorGroupingContainer = function (e, t) {
    if (canvasType(t.data.name)) return t;
    var n = e.find(function (e) {
      return e.data.nodes.includes(t.id);
    });
    return n
      ? getClosestParentGroupingContainer(e, n)
      : e.find(function (e) {
          return e.id === utils.ROOT_NODE;
        });
  },
  DefaultEventHandlers = (function (e) {
    function t() {
      return (null !== e && e.apply(this, arguments)) || this;
    }
    return (
      __extends(t, e),
      (t.prototype.defineNodeEventListener = function (e, t, n) {
        var r = this;
        return defineEventListener(
          e,
          function (e, n) {
            (n && !r.store.query.node(n).get()) || t(e, n);
          },
          n
        );
      }),
      (t.prototype.handlers = function () {
        var e = this;
        return {
          connect: {
            init: function (t, n) {
              e.connectors().select(t, n),
                e.connectors().hover(t, n),
                e.connectors().drop(t, n),
                e.store.actions.setDOM(n, t);
            },
          },
          select: {
            init: function () {
              return function () {
                return e.store.actions.setNodeEvent('selected', null);
              };
            },
            events: [
              this.defineNodeEventListener('mousedown', function (t, n) {
                t.craft.stopPropagation(),
                  e.store.actions.setNodeEvent('selected', n);
              }),
            ],
          },
          hover: {
            init: function () {
              return function () {
                return e.store.actions.setNodeEvent('hovered', null);
              };
            },
            events: [
              this.defineNodeEventListener('mouseover', function (t, n) {
                t.craft.stopPropagation(),
                  e.store.actions.setNodeEvent('hovered', n);
              }),
            ],
          },
          drop: {
            events: [
              defineEventListener('dragover', function (e) {
                e.craft.stopPropagation(), e.preventDefault();
              }),
              this.defineNodeEventListener('dragenter', function (n, r) {
                n.craft.stopPropagation(), n.preventDefault();
                var o = t.draggedElement;
                if (o) {
                  var a = o;
                  o.rootNodeId && (a = o.nodes[o.rootNodeId]);
                  var i = e.store.query.getDropPlaceholder(a, r, {
                    x: n.clientX,
                    y: n.clientY,
                  });
                  i && (e.store.actions.setIndicator(i), (t.indicator = i));
                }
              }),
            ],
          },
          drag: {
            init: function (t, n) {
              return e.store.query.node(n).isDraggable()
                ? function () {
                    return t.setAttribute('draggable', 'false');
                  }
                : function () {};
            },
            events: [
              this.defineNodeEventListener('dragstart', function (n, r) {
                n.craft.stopPropagation(),
                  e.store.actions.setNodeEvent('dragged', r),
                  (t.draggedElementShadow = createShadow(n)),
                  (t.draggedElement = r);
              }),
              defineEventListener('dragend', function (t) {
                t.craft.stopPropagation(),
                  e.dropElement(function (t, n) {
                    e.store.actions.move(
                      t,
                      n.parent.id,
                      n.index + ('after' === n.where ? 1 : 0)
                    );
                  });
              }),
            ],
          },
          create: {
            init: function (e) {
              return (
                e.setAttribute('draggable', 'true'),
                function () {
                  return e.removeAttribute('draggable');
                }
              );
            },
            events: [
              defineEventListener('dragstart', function (n, r) {
                n.craft.stopPropagation();
                var o = e.store.query.parseReactElement(r).toNodeTree();
                (t.draggedElementShadow = createShadow(n)),
                  (t.draggedElement = o);
              }),
              defineEventListener('dragend', function (t) {
                t.craft.stopPropagation(),
                  e.dropElement(function (n, r) {
                    var o = Object.values(e.store.getState().nodes),
                      a = getClosestAncestorGroupingContainer(o, r.parent),
                      i = (function () {
                        var e = t.clientX,
                          n = t.clientY,
                          r = a.dom.getBoundingClientRect();
                        return {
                          parentId: a.id,
                          position: { x: e - r.x, y: n - r.y },
                        };
                      })(),
                      d = i.position,
                      s = i.parentId,
                      u = _assign({}, n, {
                        nodes: mapValues__default.default(n.nodes, function (
                          e
                        ) {
                          return _assign({}, e, {
                            data: _assign({}, e.data, {
                              props: _assign({}, e.data.props, d),
                            }),
                          });
                        }),
                      });
                    e.store.actions.addNodeTree(u, s, Infinity);
                  });
              }),
            ],
          },
        };
      }),
      (t.prototype.dropElement = function (e) {
        var n = t.draggedElement,
          r = t.draggedElementShadow,
          o = t.indicator;
        n && o && !o.error && e(n, o.placement),
          r && (r.parentNode.removeChild(r), (t.draggedElementShadow = null)),
          (t.draggedElement = null),
          (t.indicator = null),
          this.store.actions.setIndicator(null),
          this.store.actions.setNodeEvent('dragged', null);
      }),
      (t.indicator = null),
      t
    );
  })(CoreEventHandlers);
function movePlaceholder(e, t, n) {
  var r = 0,
    o = 0,
    a = 0,
    i = 0,
    d = e.where;
  return (
    n
      ? n.inFlow
        ? ((a = n.outerWidth),
          (i = 2),
          (r = 'before' === d ? n.top : n.bottom),
          (o = n.left))
        : ((a = 2),
          (i = n.outerHeight),
          (r = n.top),
          (o = 'before' === d ? n.left : n.left + n.outerWidth))
      : t &&
        ((r = t.top + t.padding.top),
        (o = t.left + t.padding.left),
        (a =
          t.outerWidth -
          t.padding.right -
          t.padding.left -
          t.margin.left -
          t.margin.right),
        (i = 2)),
    { top: r + 'px', left: o + 'px', width: a + 'px', height: i + 'px' }
  );
}
var EditorContext = React.createContext({});
function useInternalEditor(e) {
  var t = useEventHandler(),
    n = React.useContext(EditorContext),
    r = utils.useCollector(n, e),
    o = React.useMemo(
      function () {
        return t && t.connectors();
      },
      [t]
    );
  return _assign({}, r, { connectors: o || {}, inContext: !!n, store: n });
}
var Events = function (e) {
    var t = e.children,
      n = useInternalEditor(function (e) {
        return {
          indicator: e.events.indicator,
          indicatorOptions: e.options.indicator,
          handlers: e.handlers,
          handlersFactory: e.options.handlers,
        };
      }),
      r = n.actions,
      o = n.indicator,
      a = n.indicatorOptions,
      i = n.store,
      d = n.handlers,
      s = n.handlersFactory,
      u = React.useRef(i);
    return (
      (u.current = i),
      React.useEffect(
        function () {
          r.history.ignore().setState(function (e) {
            return (e.handlers = s(u.current));
          });
        },
        [r, s]
      ),
      d
        ? React__default.default.createElement(
            EventHandlerContext.Provider,
            { value: d },
            o &&
              React__default.default.createElement(utils.RenderIndicator, {
                style: _assign(
                  {},
                  movePlaceholder(
                    o.placement,
                    utils.getDOMInfo(o.placement.parent.dom),
                    o.placement.currentNode &&
                      utils.getDOMInfo(o.placement.currentNode.dom)
                  ),
                  {
                    backgroundColor: o.error ? a.error : a.success,
                    transition: '0.2s ease-in',
                  }
                ),
                parentDom: o.placement.parent.dom,
              }),
            t
          )
        : null
    );
  },
  NodeHandlers = (function (e) {
    function t(t, n, r) {
      var o = e.call(this, t, n) || this;
      return (o.id = r), o;
    }
    return (
      __extends(t, e),
      (t.prototype.handlers = function () {
        var e = this,
          t = this.derived.connectors();
        return {
          connect: {
            init: function (n) {
              t.connect(n, e.id);
            },
          },
          drag: {
            init: function (n) {
              t.drag(n, e.id);
            },
          },
        };
      }),
      t
    );
  })(DerivedEventHandlers),
  NodeContext = React__default.default.createContext(null),
  NodeProvider = function (e) {
    var t = e.id,
      n = e.related,
      r = void 0 !== n && n,
      o = e.children,
      a = useEventHandler(),
      i = useInternalEditor(function (e) {
        return {
          hydrationTimestamp: e.nodes[t] && e.nodes[t]._hydrationTimestamp,
        };
      }).hydrationTimestamp,
      d = React.useMemo(
        function () {
          return a.derive(NodeHandlers, t).connectors();
        },
        [a, i, t]
      );
    return React__default.default.createElement(
      NodeContext.Provider,
      { value: { id: t, related: r, connectors: d } },
      o
    );
  };
function useInternalNode(e) {
  var t = React.useContext(NodeContext),
    n = t.id,
    r = t.related,
    o = t.connectors,
    a = useInternalEditor(function (t) {
      return n && t.nodes[n] && e && e(t.nodes[n]);
    }),
    i = a.actions,
    d = __rest(a, ['actions', 'query']),
    s = React.useMemo(
      function () {
        return {
          setProp: function (e, t) {
            t ? i.history.throttle(t).setProp(n, e) : i.setProp(n, e);
          },
          setCustom: function (e, t) {
            t ? i.history.throttle(t).setCustom(n, e) : i.setCustom(n, e);
          },
          setHidden: function (e) {
            return i.setHidden(n, e);
          },
        };
      },
      [i, n]
    );
  return _assign({}, d, {
    id: n,
    related: r,
    inNodeContext: !!t,
    actions: s,
    connectors: o,
  });
}
function useNode(e) {
  var t = useInternalNode(e),
    n = t.id,
    r = t.related,
    o = t.actions,
    a = t.inNodeContext,
    i = t.connectors,
    d = __rest(t, ['id', 'related', 'actions', 'inNodeContext', 'connectors']);
  return _assign({}, d, {
    actions: o,
    id: n,
    related: r,
    setProp: function (e) {
      return (
        utils.deprecationWarning('useNode().setProp()', {
          suggest: 'useNode().actions.setProp()',
        }),
        o.setProp(e)
      );
    },
    inNodeContext: a,
    connectors: i,
  });
}
var SimpleElement = function (e) {
    var t = e.render,
      n = useNode().connectors;
    return 'string' == typeof t.type
      ? (0, n.connect)((0, n.drag)(React__default.default.cloneElement(t)))
      : t;
  },
  Render = function () {
    var e = useInternalNode(function (e) {
        return {
          type: e.data.type,
          props: e.data.props,
          nodes: e.data.nodes,
          hydrationTimestamp: e._hydrationTimestamp,
        };
      }),
      t = e.type,
      n = e.props,
      r = e.nodes;
    return React.useMemo(
      function () {
        var e = n.children;
        r &&
          r.length > 0 &&
          (e = React__default.default.createElement(
            React__default.default.Fragment,
            null,
            r.map(function (e) {
              return React__default.default.createElement(NodeElement, {
                id: e,
                key: e,
              });
            })
          ));
        var o = React__default.default.createElement(t, n, e);
        return 'string' == typeof t
          ? React__default.default.createElement(SimpleElement, { render: o })
          : o;
      },
      [t, n, e.hydrationTimestamp, r]
    );
  },
  RenderNodeToElement = function () {
    var e = useInternalNode(function (e) {
        return { hidden: e.data.hidden };
      }).hidden,
      t = useInternalEditor(function (e) {
        return { onRender: e.options.onRender };
      }).onRender;
    return e
      ? null
      : React__default.default.createElement(t, {
          render: React__default.default.createElement(Render, null),
        });
  },
  NodeElement = React__default.default.memo(function (e) {
    return React__default.default.createElement(
      NodeProvider,
      { id: e.id },
      React__default.default.createElement(RenderNodeToElement, null)
    );
  }),
  defaultElementProps = { is: 'div', canvas: !1, custom: {}, hidden: !1 },
  elementPropToNodeData = { is: 'type', canvas: 'isCanvas' };
function Element(e) {
  var t = e.id,
    n = e.children,
    r = __rest(e, ['id', 'children']),
    o = _assign({}, defaultElementProps, r),
    a = o.is,
    i = __rest(o, ['is', 'custom', 'canvas']),
    d = useInternalEditor(),
    s = d.query,
    u = d.actions,
    c = useInternalNode(function (e) {
      return { node: { id: e.id, data: e.data } };
    }),
    l = c.node,
    f = c.inNodeContext,
    p = React.useState(null),
    v = p[0],
    _ = p[1];
  return (
    utils.useEffectOnce(function () {
      invariant__default.default(!!t, utils.ERROR_TOP_LEVEL_ELEMENT_NO_ID);
      var e = l.id,
        o = l.data;
      if (f) {
        var d,
          c =
            o.linkedNodes && o.linkedNodes[t] && s.node(o.linkedNodes[t]).get();
        if (c && c.data.type === a) {
          d = c.id;
          var p = _assign({}, c.data.props, i);
          u.history.ignore().setProp(d, function (e) {
            return Object.keys(p).forEach(function (t) {
              return (e[t] = p[t]);
            });
          });
        } else {
          var v = React__default.default.createElement(Element, r, n),
            N = s.parseReactElement(v).toNodeTree();
          (d = N.rootNodeId), u.history.ignore().addLinkedNodeFromTree(N, e, t);
        }
        _(d);
      }
    }),
    v ? React__default.default.createElement(NodeElement, { id: v }) : null
  );
}
var deprecateCanvasComponent = function () {
  return utils.deprecationWarning('<Canvas />', {
    suggest: '<Element canvas={true} />',
  });
};
function Canvas(e) {
  var t = __rest(e, []);
  return (
    React.useEffect(function () {
      return deprecateCanvasComponent();
    }, []),
    React__default.default.createElement(
      Element,
      _assign({}, t, { canvas: !0 })
    )
  );
}
var Frame = function (e) {
    var t = e.children,
      n = e.json,
      r = e.data,
      o = useInternalEditor(),
      a = o.actions,
      i = o.query,
      d = React.useState(null),
      s = d[0],
      u = d[1];
    n &&
      utils.deprecationWarning('<Frame json={...} />', {
        suggest: '<Frame data={...} />',
      });
    var c = React.useRef({ initialChildren: t, initialData: r || n });
    return (
      React.useEffect(
        function () {
          var e = c.current,
            t = e.initialChildren,
            n = e.initialData;
          if (n) a.history.ignore().deserialize(n);
          else if (t) {
            var r = React__default.default.Children.only(t),
              o = i.parseReactElement(r).toNodeTree(function (e, t) {
                return t === r && (e.id = utils.ROOT_NODE), e;
              });
            a.history.ignore().addNodeTree(o);
          }
          u(
            React__default.default.createElement(NodeElement, {
              id: utils.ROOT_NODE,
            })
          );
        },
        [a, i]
      ),
      s
    );
  },
  getPublicActions = function (e) {
    return __rest(e, [
      'addLinkedNodeFromTree',
      'setDOM',
      'setNodeEvent',
      'replaceNodes',
      'reset',
    ]);
  };
function useEditor(e) {
  var t = useInternalEditor(e),
    n = t.connectors,
    r = t.actions,
    o = __rest(t.query, ['deserialize']),
    a = t.store,
    i = __rest(t, ['connectors', 'actions', 'query', 'store']),
    d = getPublicActions(r),
    s = React.useMemo(
      function () {
        return _assign({}, d, {
          history: _assign({}, d.history, {
            ignore: function () {
              for (var e, t = [], n = 0; n < arguments.length; n++)
                t[n] = arguments[n];
              return getPublicActions((e = d.history).ignore.apply(e, t));
            },
            throttle: function () {
              for (var e, t = [], n = 0; n < arguments.length; n++)
                t[n] = arguments[n];
              return getPublicActions((e = d.history).throttle.apply(e, t));
            },
          }),
        });
      },
      [d]
    );
  return _assign({ connectors: n, actions: s, query: o, store: a }, i);
}
function connectEditor(e) {
  return function (t) {
    return function (n) {
      var r = e ? useEditor(e) : useEditor();
      return React__default.default.createElement(t, _assign({}, r, n));
    };
  };
}
function connectNode(e) {
  return function (t) {
    return function (n) {
      var r = useNode(e);
      return React__default.default.createElement(t, _assign({}, r, n));
    };
  };
}
var fromEntries = function (e) {
    return Object.fromEntries
      ? Object.fromEntries(e)
      : e.reduce(function (e, t) {
          var n;
          return _assign({}, e, (((n = {})[t[0]] = t[1]), n));
        }, {});
  },
  removeNodeFromEvents = function (e, t) {
    return Object.keys(e.events).forEach(function (n) {
      e.events[n] && e.events[n] === t && (e.events[n] = null);
    });
  },
  Methods = function (e, t) {
    var n = function (t, n, r) {
        var a = o(n);
        a.data.nodes || (a.data.nodes = []),
          a.data.props.children && delete a.data.props.children,
          null != r ? a.data.nodes.splice(r, 0, t.id) : a.data.nodes.push(t.id),
          (t.data.parent = a.id),
          (e.nodes[t.id] = t);
      },
      r = function (t, o, a) {
        var i = t.nodes[t.rootNodeId];
        if ((null != o && n(i, o, a), i.data.nodes)) {
          var d = i.data.nodes.slice();
          (i.data.nodes = []),
            d.forEach(function (e, n) {
              return r({ rootNodeId: e, nodes: t.nodes }, i.id, n);
            });
        }
        i.data.linkedNodes &&
          Object.keys(i.data.linkedNodes).forEach(function (n) {
            var o = i.data.linkedNodes[n];
            (e.nodes[o] = t.nodes[o]), r({ rootNodeId: o, nodes: t.nodes });
          });
      },
      o = function (t) {
        invariant__default.default(t, utils.ERROR_NOPARENT);
        var n = e.nodes[t];
        return invariant__default.default(n, utils.ERROR_INVALID_NODEID), n;
      },
      a = function (t) {
        var n = e.nodes[t],
          r = e.nodes[n.data.parent];
        if (
          (n.data.nodes &&
            n.data.nodes.slice().forEach(function (e) {
              return a(e);
            }),
          n.data.linkedNodes &&
            Object.values(n.data.linkedNodes).map(function (e) {
              return a(e);
            }),
          r.data.nodes.includes(t))
        ) {
          var o = r.data.nodes;
          o.splice(o.indexOf(t), 1);
        } else {
          var i = Object.keys(r.data.linkedNodes).find(function (e) {
            return r.data.linkedNodes[e] === e;
          });
          i && delete r.data.linkedNodes[i];
        }
        removeNodeFromEvents(e, t), delete e.nodes[t];
      };
    return {
      addLinkedNodeFromTree: function (t, n, i) {
        var d = o(n);
        d.data.linkedNodes || (d.data.linkedNodes = {});
        var s = d.data.linkedNodes[i];
        s && a(s),
          (d.data.linkedNodes[i] = t.rootNodeId),
          (t.nodes[t.rootNodeId].data.parent = n),
          (e.nodes[t.rootNodeId] = t.nodes[t.rootNodeId]),
          r(t);
      },
      add: function (e, t, r) {
        var o = [e];
        Array.isArray(e) &&
          (utils.deprecationWarning('actions.add(node: Node[])', {
            suggest: 'actions.add(node: Node)',
          }),
          (o = e)),
          o.forEach(function (e) {
            n(e, t, r);
          });
      },
      addNodeTree: function (t, n, o) {
        var a = t.nodes[t.rootNodeId];
        n ||
          (invariant__default.default(
            t.rootNodeId === utils.ROOT_NODE,
            'Cannot add non-root Node without a parent'
          ),
          (e.nodes[t.rootNodeId] = a)),
          r(t, n, o);
      },
      delete: function (e) {
        invariant__default.default(
          !t.node(e).isTopLevelNode(),
          utils.ERROR_DELETE_TOP_LEVEL_NODE
        ),
          a(e);
      },
      deserialize: function (e) {
        var n = 'string' == typeof e ? JSON.parse(e) : e,
          r = Object.keys(n).map(function (e) {
            var r = e;
            return (
              e === utils.DEPRECATED_ROOT_NODE && (r = utils.ROOT_NODE),
              [
                r,
                t.parseSerializedNode(n[e]).toNode(function (e) {
                  return (e.id = r);
                }),
              ]
            );
          });
        this.replaceNodes(fromEntries(r));
      },
      move: function (n, r, o) {
        var a = e.nodes[n],
          i = a.data.parent,
          d = e.nodes[r].data.nodes;
        t.node(r).isDroppable(a, function (e) {
          throw new Error(e);
        });
        var s = e.nodes[i].data.nodes;
        (s[s.indexOf(n)] = 'marked'),
          d.splice(o, 0, n),
          (e.nodes[n].data.parent = r),
          s.splice(s.indexOf('marked'), 1);
      },
      replaceNodes: function (t) {
        this.clearEvents(), (e.nodes = t);
      },
      clearEvents: function () {
        this.setNodeEvent('selected', null),
          this.setNodeEvent('hovered', null),
          this.setNodeEvent('dragged', null),
          this.setIndicator(null);
      },
      reset: function () {
        this.clearEvents(), this.replaceNodes({});
      },
      setOptions: function (t) {
        t(e.options);
      },
      setNodeEvent: function (t, n) {
        var r = e.events[t];
        r && n !== r && (e.nodes[r].events[t] = !1),
          n
            ? ((e.nodes[n].events[t] = !0), (e.events[t] = n))
            : (e.events[t] = null);
      },
      setCustom: function (t, n) {
        n(e.nodes[t].data.custom);
      },
      setDOM: function (t, n) {
        e.nodes[t] && (e.nodes[t].dom = n);
      },
      setIndicator: function (t) {
        (t &&
          (!t.placement.parent.dom ||
            (t.placement.currentNode && !t.placement.currentNode.dom))) ||
          (e.events.indicator = t);
      },
      setHidden: function (t, n) {
        e.nodes[t].data.hidden = n;
      },
      setProp: function (t, n) {
        invariant__default.default(e.nodes[t], utils.ERROR_INVALID_NODEID),
          n(e.nodes[t].data.props);
      },
      selectNode: function (e) {
        this.setNodeEvent('selected', null != e ? e : null),
          this.setNodeEvent('hovered', null);
      },
    };
  },
  ActionMethods = function (e, t) {
    return _assign({}, Methods(e, t), {
      setState: function (t) {
        var n = __rest(this, ['history']);
        t(e, n);
      },
    });
  },
  resolveComponent = function (e, t) {
    var n = t.name || t.displayName;
    if (t === Canvas) return 'Canvas';
    if (e[n]) return n;
    for (var r = 0; r < Object.keys(e).length; r++) {
      var o = Object.keys(e)[r];
      if (e[o] === t) return o;
    }
    return 'string' == typeof t ? t : void 0;
  },
  reduceType = function (e, t) {
    return 'string' == typeof e ? e : { resolvedName: resolveComponent(t, e) };
  },
  serializeComp = function (e, t) {
    var n = e.type,
      r = e.isCanvas,
      o = e.props;
    return (
      (o = Object.keys(o).reduce(function (e, n) {
        var r = o[n];
        return null == r
          ? e
          : ((e[n] =
              'children' === n && 'string' != typeof r
                ? React.Children.map(r, function (e) {
                    return 'string' == typeof e ? e : serializeComp(e, t);
                  })
                : r.type
                ? serializeComp(r, t)
                : r),
            e);
      }, {})),
      { type: reduceType(n, t), isCanvas: !!r, props: o }
    );
  },
  serializeNode = function (e, t) {
    var n = e.type,
      r = e.props,
      o = e.isCanvas,
      a = __rest(e, ['type', 'props', 'isCanvas', 'name']),
      i = serializeComp({ type: n, isCanvas: o, props: r }, t);
    return _assign({}, i, a);
  };
function NodeHelpers(e, t) {
  invariant__default.default('string' == typeof t, utils.ERROR_INVALID_NODE_ID);
  var n = e.nodes[t],
    r = function (t) {
      return NodeHelpers(e, t);
    };
  return {
    isCanvas: function () {
      return !!n.data.isCanvas;
    },
    isRoot: function () {
      return n.id === utils.ROOT_NODE;
    },
    isLinkedNode: function () {
      return n.data.parent && r(n.data.parent).linkedNodes().includes(n.id);
    },
    isTopLevelNode: function () {
      return this.isRoot() || this.isLinkedNode();
    },
    isDeletable: function () {
      return !this.isTopLevelNode();
    },
    isParentOfTopLevelNodes: function () {
      return n.data.linkedNodes && Object.keys(n.data.linkedNodes).length > 0;
    },
    isParentOfTopLevelCanvas: function () {
      return (
        utils.deprecationWarning('query.node(id).isParentOfTopLevelCanvas', {
          suggest: 'query.node(id).isParentOfTopLevelNodes',
        }),
        this.isParentOfTopLevelNodes()
      );
    },
    get: function () {
      return n;
    },
    ancestors: function (t) {
      return (
        void 0 === t && (t = !1),
        (function n(r, o, a) {
          void 0 === o && (o = []), void 0 === a && (a = 0);
          var i = e.nodes[r];
          return i
            ? (o.push(r),
              i.data.parent
                ? ((t || (!t && 0 === a)) && (o = n(i.data.parent, o, a + 1)),
                  o)
                : o)
            : o;
        })(n.data.parent)
      );
    },
    descendants: function (n, o) {
      return (
        void 0 === n && (n = !1),
        (function t(a, i, d) {
          return (
            void 0 === i && (i = []),
            void 0 === d && (d = 0),
            (n || (!n && 0 === d)) && e.nodes[a]
              ? ('childNodes' !== o &&
                  r(a)
                    .linkedNodes()
                    .forEach(function (e) {
                      i.push(e), (i = t(e, i, d + 1));
                    }),
                'linkedNodes' !== o &&
                  r(a)
                    .childNodes()
                    .forEach(function (e) {
                      i.push(e), (i = t(e, i, d + 1));
                    }),
                i)
              : i
          );
        })(t)
      );
    },
    linkedNodes: function () {
      return Object.values(n.data.linkedNodes || {});
    },
    childNodes: function () {
      return n.data.nodes || [];
    },
    isDraggable: function (t) {
      try {
        var o = n;
        return (
          invariant__default.default(
            !this.isTopLevelNode(),
            utils.ERROR_MOVE_TOP_LEVEL_NODE
          ),
          invariant__default.default(
            NodeHelpers(e, o.data.parent).isCanvas(),
            utils.ERROR_MOVE_NONCANVAS_CHILD
          ),
          invariant__default.default(
            o.rules.canDrag(o, r),
            utils.ERROR_CANNOT_DRAG
          ),
          !0
        );
      } catch (e) {
        return t && t(e), !1;
      }
    },
    isDroppable: function (t, o) {
      var a = 'object' == typeof t && !e.nodes[t.id],
        i = (function (t) {
          return 'string' == typeof t ? e.nodes[t] : t;
        })(t),
        d = n;
      try {
        if (
          ('string' == typeof t &&
            invariant__default.default(
              !r(t).isTopLevelNode(),
              utils.ERROR_MOVE_TOP_LEVEL_NODE
            ),
          invariant__default.default(
            this.isCanvas(),
            utils.ERROR_MOVE_TO_NONCANVAS_PARENT
          ),
          invariant__default.default(
            d.rules.canMoveIn(i, d, r),
            utils.ERROR_MOVE_INCOMING_PARENT
          ),
          invariant__default.default(
            i.rules.canDrop(d, i, r),
            utils.ERROR_MOVE_CANNOT_DROP
          ),
          a)
        )
          return !0;
        var s = r(i.id).descendants(!0);
        invariant__default.default(
          !s.includes(d.id) && d.id !== i.id,
          utils.ERROR_MOVE_TO_DESCENDANT
        );
        var u = i.data.parent && e.nodes[i.data.parent];
        return (
          invariant__default.default(
            u.data.isCanvas,
            utils.ERROR_MOVE_NONCANVAS_CHILD
          ),
          invariant__default.default(
            u || (!u && !e.nodes[i.id]),
            utils.ERROR_DUPLICATE_NODEID
          ),
          n !== u &&
            invariant__default.default(
              u.rules.canMoveOut(i, u, r),
              utils.ERROR_MOVE_OUTGOING_PARENT
            ),
          !0
        );
      } catch (e) {
        return o && o(e), !1;
      }
    },
    toSerializedNode: function () {
      return serializeNode(n.data, e.options.resolver);
    },
    toNodeTree: function (e) {
      var n = [t].concat(this.descendants(!0, e)).reduce(function (e, t) {
        return (e[t] = r(t).get()), e;
      }, {});
      return { rootNodeId: t, nodes: n };
    },
    decendants: function (e) {
      return (
        void 0 === e && (e = !1),
        utils.deprecationWarning('query.node(id).decendants', {
          suggest: 'query.node(id).descendants',
        }),
        this.descendants(e)
      );
    },
    isTopLevelCanvas: function () {
      return !this.isRoot() && !n.data.parent;
    },
  };
}
function findPosition(e, t, n, r) {
  for (
    var o = { parent: e, index: 0, where: 'before' },
      a = 0,
      i = 0,
      d = 0,
      s = 0,
      u = 0,
      c = 0,
      l = 0,
      f = t.length;
    l < f;
    l++
  ) {
    var p = t[l];
    if (
      ((c = p.top + p.outerHeight),
      (s = p.left + p.outerWidth / 2),
      (u = p.top + p.outerHeight / 2),
      !((i && p.left > i) || (d && u >= d) || (a && p.left + p.outerWidth < a)))
    )
      if (((o.index = l), p.inFlow)) {
        if (r < u) {
          o.where = 'before';
          break;
        }
        o.where = 'after';
      } else
        r < c && (d = c),
          n < s
            ? ((i = s), (o.where = 'before'))
            : ((a = s), (o.where = 'after'));
  }
  return o;
}
var getRandomNodeId = shortid__default.default;
function createNode(e, t) {
  var n = e.data.type,
    r = e.id || getRandomNodeId();
  return immer.produce({}, function (o) {
    if (
      ((o.id = r),
      (o._hydrationTimestamp = Date.now()),
      (o.data = _assign(
        {
          type: n,
          props: _assign({}, e.data.props),
          name: 'string' == typeof n ? n : n.name,
          displayName: 'string' == typeof n ? n : n.name,
          custom: {},
          isCanvas: !1,
          hidden: !1,
          nodes: [],
          linkedNodes: {},
        },
        e.data
      )),
      (o.related = {}),
      (o.events = { selected: !1, dragged: !1, hovered: !1 }),
      (o.rules = _assign(
        {
          canDrag: function () {
            return !0;
          },
          canDrop: function () {
            return !0;
          },
          canMoveIn: function () {
            return !0;
          },
          canMoveOut: function () {
            return !0;
          },
        },
        (n.craft && n.craft.rules) || {}
      )),
      o.data.type === Element || o.data.type === Canvas)
    ) {
      var a = o.data.type === Canvas,
        i = _assign({}, defaultElementProps, o.data.props);
      Object.keys(defaultElementProps).forEach(function (e) {
        (o.data[elementPropToNodeData[e] || e] = i[e]), delete o.data.props[e];
      }),
        (n = o.data.type),
        a && ((o.data.isCanvas = !0), deprecateCanvasComponent());
    }
    if ((t && t(o), n.craft)) {
      o.data.props = _assign(
        {},
        n.craft.props || n.craft.defaultProps || {},
        o.data.props
      );
      var d = n.craft.displayName || n.craft.name;
      if (
        (d && (o.data.displayName = d),
        n.craft.isCanvas &&
          (o.data.isCanvas = o.data.isCanvas || n.craft.isCanvas),
        n.craft.rules &&
          Object.keys(n.craft.rules).forEach(function (e) {
            ['canDrag', 'canDrop', 'canMoveIn', 'canMoveOut'].includes(e) &&
              (o.rules[e] = n.craft.rules[e]);
          }),
        n.craft.custom &&
          (o.data.custom = _assign({}, n.craft.custom, o.data.custom)),
        n.craft.related)
      ) {
        o.related = {};
        var s = { id: o.id, related: !0 };
        Object.keys(n.craft.related).forEach(function (e) {
          o.related[e] = function () {
            return React__default.default.createElement(
              NodeProvider,
              s,
              React__default.default.createElement(n.craft.related[e])
            );
          };
        });
      }
    }
  });
}
var restoreType = function (e, t) {
    return 'object' == typeof e && e.resolvedName
      ? 'Canvas' === e.resolvedName
        ? Canvas
        : t[e.resolvedName]
      : 'string' == typeof e
      ? e
      : null;
  },
  deserializeComp = function (e, t, n) {
    var r = e.props,
      o = restoreType(e.type, t);
    if (o) {
      (r = Object.keys(r).reduce(function (e, n) {
        var o = r[n];
        return (
          (e[n] =
            null == o
              ? null
              : 'object' == typeof o && o.resolvedName
              ? deserializeComp(o, t)
              : 'children' === n && Array.isArray(o)
              ? o.map(function (e) {
                  return 'string' == typeof e ? e : deserializeComp(e, t);
                })
              : o),
          e
        );
      }, {})),
        n && (r.key = n);
      var a = _assign(
        {},
        React__default.default.createElement(o, _assign({}, r))
      );
      return _assign({}, a, { name: resolveComponent(t, a.type) });
    }
  },
  deserializeNode = function (e, t) {
    var n = e.type,
      r = __rest(e, ['type', 'props']);
    invariant__default.default(
      (void 0 !== n && 'string' == typeof n) ||
        (void 0 !== n && void 0 !== n.resolvedName),
      utils.ERROR_DESERIALIZE_COMPONENT_NOT_IN_RESOLVER.replace(
        '%displayName%',
        e.displayName
      ).replace('%availableComponents%', Object.keys(t).join(', '))
    );
    var o = deserializeComp(e, t),
      a = o.name;
    return {
      type: o.type,
      name: a,
      displayName: r.displayName || a,
      props: o.props,
      custom: r.custom || {},
      isCanvas: !!r.isCanvas,
      hidden: !!r.hidden,
      parent: r.parent,
      linkedNodes: r.linkedNodes || r._childCanvas || {},
      nodes: r.nodes || [],
    };
  },
  mergeNodes = function (e, t) {
    var n, r;
    if (t.length < 1) return ((n = {})[e.id] = e), n;
    var o = t.map(function (e) {
        return e.rootNodeId;
      }),
      a = _assign({}, e, { data: _assign({}, e.data, { nodes: o }) }),
      i = (((r = {})[e.id] = a), r);
    return t.reduce(function (t, n) {
      var r,
        o = n.nodes[n.rootNodeId];
      return _assign(
        {},
        t,
        n.nodes,
        (((r = {})[o.id] = _assign({}, o, {
          data: _assign({}, o.data, { parent: e.id }),
        })),
        r)
      );
    }, i);
  },
  mergeTrees = function (e, t) {
    return { rootNodeId: e.id, nodes: mergeNodes(e, t) };
  };
function parseNodeFromJSX(e, t) {
  var n = e;
  return (
    'string' == typeof n &&
      (n = React__default.default.createElement(React.Fragment, {}, n)),
    createNode(
      { data: { type: n.type, props: _assign({}, n.props) } },
      function (e) {
        t && t(e, n);
      }
    )
  );
}
function QueryMethods(e) {
  var t = e && e.options,
    n = function () {
      return QueryMethods(e);
    };
  return {
    getDropPlaceholder: function (t, r, o, a) {
      if (
        (void 0 === a &&
          (a = function (t) {
            return e.nodes[t.id].dom;
          }),
        t !== r)
      ) {
        var i = 'string' == typeof t && e.nodes[t],
          d = e.nodes[r],
          s = n().node(d.id).isCanvas() ? d : e.nodes[d.data.parent];
        if (s) {
          var u = s.data.nodes || [],
            c = findPosition(
              s,
              u
                ? u.reduce(function (t, n) {
                    var r = a(e.nodes[n]);
                    if (r) {
                      var o = _assign({ id: n }, utils.getDOMInfo(r));
                      t.push(o);
                    }
                    return t;
                  }, [])
                : [],
              o.x,
              o.y
            ),
            l = {
              placement: _assign({}, c, {
                currentNode: u.length && e.nodes[u[c.index]],
              }),
              error: !1,
            };
          return (
            i &&
              n()
                .node(i.id)
                .isDraggable(function (e) {
                  return (l.error = e);
                }),
            n()
              .node(s.id)
              .isDroppable(t, function (e) {
                return (l.error = e);
              }),
            l
          );
        }
      }
    },
    getOptions: function () {
      return t;
    },
    node: function (t) {
      return NodeHelpers(e, t);
    },
    getSerializedNodes: function () {
      var t = this,
        n = Object.keys(e.nodes).map(function (e) {
          return [e, t.node(e).toSerializedNode()];
        });
      return fromEntries(n);
    },
    serialize: function () {
      return JSON.stringify(this.getSerializedNodes());
    },
    parseReactElement: function (t) {
      return {
        toNodeTree: function (r) {
          var o = parseNodeFromJSX(t, function (t, n) {
              var o = resolveComponent(e.options.resolver, t.data.type);
              invariant__default.default(
                null !== o,
                utils.ERROR_NOT_IN_RESOLVER
              ),
                (t.data.displayName = t.data.displayName || o),
                (t.data.name = o),
                r && r(t, n);
            }),
            a = [];
          return (
            t.props &&
              t.props.children &&
              (a = React__default.default.Children.toArray(
                t.props.children
              ).reduce(function (e, t) {
                return (
                  React__default.default.isValidElement(t) &&
                    e.push(n().parseReactElement(t).toNodeTree(r)),
                  e
                );
              }, [])),
            mergeTrees(o, a)
          );
        },
      };
    },
    parseSerializedNode: function (t) {
      return {
        toNode: function (r) {
          var o = deserializeNode(t, e.options.resolver);
          invariant__default.default(o.type, utils.ERROR_NOT_IN_RESOLVER);
          var a = 'string' == typeof r && r;
          return (
            a &&
              utils.deprecationWarning(
                'query.parseSerializedNode(...).toNode(id)',
                {
                  suggest:
                    'query.parseSerializedNode(...).toNode(node => node.id = id)',
                }
              ),
            n()
              .parseFreshNode(_assign({}, a ? { id: a } : {}, { data: o }))
              .toNode(!a && r)
          );
        },
      };
    },
    parseFreshNode: function (t) {
      return {
        toNode: function (n) {
          return createNode(t, function (t) {
            t.data.parent === utils.DEPRECATED_ROOT_NODE &&
              (t.data.parent = utils.ROOT_NODE);
            var r = resolveComponent(e.options.resolver, t.data.type);
            invariant__default.default(null !== r, utils.ERROR_NOT_IN_RESOLVER),
              (t.data.displayName = t.data.displayName || r),
              (t.data.name = r),
              n && n(t);
          });
        },
      };
    },
    createNode: function (e, t) {
      utils.deprecationWarning('query.createNode(' + e + ')', {
        suggest: 'query.parseReactElement(' + e + ').toNodeTree()',
      });
      var n = this.parseReactElement(e).toNodeTree(),
        r = n.nodes[n.rootNodeId];
      return t
        ? (t.id && (r.id = t.id),
          t.data && (r.data = _assign({}, r.data, t.data)),
          r)
        : r;
    },
    getState: function () {
      return e;
    },
  };
}
var editorInitialState = {
    nodes: {},
    events: { dragged: null, selected: null, hovered: null, indicator: null },
    handlers: null,
    options: {
      onNodesChange: function () {
        return null;
      },
      onRender: function (e) {
        return e.render;
      },
      resolver: {},
      enabled: !0,
      indicator: { error: 'red', success: 'rgb(98, 196, 98)' },
      handlers: function (e) {
        return new DefaultEventHandlers(e);
      },
    },
  },
  ActionMethodsWithConfig = {
    methods: ActionMethods,
    ignoreHistoryForActions: [
      'setDOM',
      'setNodeEvent',
      'selectNode',
      'clearEvents',
      'setOptions',
      'setIndicator',
    ],
    normalizeHistory: function (e) {
      Object.keys(e.events).forEach(function (t) {
        var n = e.events[t];
        n && !e.nodes[n] && (e.events[t] = !1);
      }),
        Object.keys(e.nodes).forEach(function (t) {
          var n = e.nodes[t];
          Object.keys(n.events).forEach(function (t) {
            n.events[t] && !e.events[t] !== n.id && (n.events[t] = !1);
          });
        });
    },
  },
  useEditorStore = function (e) {
    return utils.useMethods(
      ActionMethodsWithConfig,
      _assign({}, editorInitialState, {
        options: _assign({}, editorInitialState.options, e),
      }),
      QueryMethods
    );
  },
  Editor = function (e) {
    var t = e.children,
      n = __rest(e, ['children']);
    void 0 !== n.resolver &&
      invariant__default.default(
        'object' == typeof n.resolver && !Array.isArray(n.resolver),
        utils.ERROR_RESOLVER_NOT_AN_OBJECT
      );
    var r = useEditorStore(n);
    return (
      React.useEffect(
        function () {
          r && n && r.actions.setOptions(function (e) {});
        },
        [r, n]
      ),
      React.useEffect(
        function () {
          r.subscribe(
            function (e) {
              return { json: r.query.serialize() };
            },
            function () {
              r.query.getOptions().onNodesChange(r.query);
            }
          );
        },
        [r]
      ),
      r
        ? React__default.default.createElement(
            EditorContext.Provider,
            { value: r },
            React__default.default.createElement(Events, null, t)
          )
        : null
    );
  },
  getTestNode = function (e) {
    var t = e.events,
      n = e.data,
      r = n.nodes,
      o = n.linkedNodes,
      a = __rest(e, ['events', 'data']),
      i = createNode(cloneDeep__default.default(e));
    return {
      node: (e = _assign({}, i, a, {
        events: _assign({}, i.events, t),
        dom: e.dom || i.dom,
      })),
      childNodes: r,
      linkedNodes: o,
    };
  },
  expectEditorState = function (e, t) {
    var n = t.nodes,
      r = __rest(t, ['nodes']),
      o = e.nodes,
      a = __rest(e, ['nodes']);
    expect(a).toEqual(r);
    var i = Object.keys(n).reduce(function (e, t) {
        var r = __rest(n[t], ['_hydrationTimestamp', 'rules']);
        return (e[t] = r), e;
      }, {}),
      d = Object.keys(o).reduce(function (e, t) {
        var n = __rest(o[t], ['_hydrationTimestamp', 'rules']);
        return (e[t] = n), e;
      }, {});
    expect(d).toEqual(i);
  },
  createTestNodes = function (e) {
    var t = {},
      n = function (e) {
        var r = getTestNode(e),
          o = r.node,
          a = r.childNodes,
          i = r.linkedNodes;
        (t[o.id] = o),
          a &&
            a.forEach(function (e, r) {
              var a = getTestNode(e),
                i = a.node,
                d = a.childNodes,
                s = a.linkedNodes;
              (i.data.parent = o.id),
                (t[i.id] = i),
                (o.data.nodes[r] = i.id),
                n(
                  _assign({}, i, {
                    data: _assign({}, i.data, {
                      nodes: d || [],
                      linkedNodes: s || {},
                    }),
                  })
                );
            }),
          i &&
            Object.keys(i).forEach(function (e) {
              var r = getTestNode(i[e]),
                a = r.node,
                d = r.childNodes,
                s = r.linkedNodes;
              (o.data.linkedNodes[e] = a.id),
                (a.data.parent = o.id),
                (t[a.id] = a),
                n(
                  _assign({}, a, {
                    data: _assign({}, a.data, {
                      nodes: d || [],
                      linkedNodes: s || {},
                    }),
                  })
                );
            });
      };
    return n(e), t;
  },
  createTestState = function (e) {
    void 0 === e && (e = {});
    var t = e.nodes,
      n = e.events;
    return _assign({}, editorInitialState, e, {
      nodes: t ? createTestNodes(t) : {},
      events: _assign({}, editorInitialState.events, n || {}),
    });
  };
Object.defineProperty(exports, 'ROOT_NODE', {
  enumerable: !0,
  get: function () {
    return utils.ROOT_NODE;
  },
}),
  (exports.ActionMethodsWithConfig = ActionMethodsWithConfig),
  (exports.Canvas = Canvas),
  (exports.CoreEventHandlers = CoreEventHandlers),
  (exports.DefaultEventHandlers = DefaultEventHandlers),
  (exports.DerivedEventHandlers = DerivedEventHandlers),
  (exports.Editor = Editor),
  (exports.Element = Element),
  (exports.Events = Events),
  (exports.Frame = Frame),
  (exports.Handlers = Handlers),
  (exports.NodeContext = NodeContext),
  (exports.NodeHelpers = NodeHelpers),
  (exports.NodeProvider = NodeProvider),
  (exports.QueryMethods = QueryMethods),
  (exports.connectEditor = connectEditor),
  (exports.connectNode = connectNode),
  (exports.createTestNodes = createTestNodes),
  (exports.createTestState = createTestState),
  (exports.defaultElementProps = defaultElementProps),
  (exports.defineEventListener = defineEventListener),
  (exports.deprecateCanvasComponent = deprecateCanvasComponent),
  (exports.editorInitialState = editorInitialState),
  (exports.elementPropToNodeData = elementPropToNodeData),
  (exports.expectEditorState = expectEditorState),
  (exports.useEditor = useEditor),
  (exports.useEditorStore = useEditorStore),
  (exports.useEventHandler = useEventHandler),
  (exports.useNode = useNode);
