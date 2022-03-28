import {
  wrapHookToRecognizeElement as e,
  ROOT_NODE as t,
  useCollector as n,
  RenderIndicator as r,
  getDOMInfo as o,
  deprecationWarning as a,
  useEffectOnce as i,
  ERROR_TOP_LEVEL_ELEMENT_NO_ID as d,
  ERROR_DELETE_TOP_LEVEL_NODE as s,
  ERROR_INVALID_NODEID as c,
  ERROR_NOPARENT as u,
  DEPRECATED_ROOT_NODE as l,
  ERROR_INVALID_NODE_ID as f,
  ERROR_MOVE_TOP_LEVEL_NODE as p,
  ERROR_MOVE_NONCANVAS_CHILD as v,
  ERROR_CANNOT_DRAG as h,
  ERROR_MOVE_TO_NONCANVAS_PARENT as m,
  ERROR_MOVE_INCOMING_PARENT as y,
  ERROR_MOVE_CANNOT_DROP as g,
  ERROR_MOVE_TO_DESCENDANT as N,
  ERROR_DUPLICATE_NODEID as E,
  ERROR_MOVE_OUTGOING_PARENT as b,
  ERROR_DESERIALIZE_COMPONENT_NOT_IN_RESOLVER as O,
  ERROR_NOT_IN_RESOLVER as k,
  useMethods as C,
  ERROR_RESOLVER_NOT_AN_OBJECT as j,
} from '@craftjs/utils';
export { ROOT_NODE } from '@craftjs/utils';
import T, {
  createContext as w,
  useContext as P,
  useMemo as D,
  useRef as x,
  useEffect as I,
  useState as q,
  Children as L,
  Fragment as R,
} from 'react';
import S from 'tiny-invariant';
import M from 'lodash/mapValues';
import { produce as _ } from 'immer';
import z from 'shortid';
import F from 'lodash/cloneDeep';
/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */ var A = function (
  e,
  t
) {
  return (A =
    Object.setPrototypeOf ||
    ({ __proto__: [] } instanceof Array &&
      function (e, t) {
        e.__proto__ = t;
      }) ||
    function (e, t) {
      for (var n in t) t.hasOwnProperty(n) && (e[n] = t[n]);
    })(e, t);
};
function H(e, t) {
  function n() {
    this.constructor = e;
  }
  A(e, t),
    (e.prototype =
      null === t ? Object.create(t) : ((n.prototype = t.prototype), new n()));
}
var W = function () {
  return (W =
    Object.assign ||
    function (e) {
      for (var t, n = 1, r = arguments.length; n < r; n++)
        for (var o in (t = arguments[n]))
          Object.prototype.hasOwnProperty.call(t, o) && (e[o] = t[o]);
      return e;
    }).apply(this, arguments);
};
function B(e, t) {
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
var G = w(null),
  J = function () {
    return P(G);
  },
  V = function (e, t, n) {
    return [e, t, n];
  },
  X = (function () {
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
                    (function (e, t, n) {
                      for (
                        var r = (e.craft && e.craft.blockedEvents[t]) || [],
                          o = 0;
                        o < r.length;
                        o++
                      ) {
                        var a = r[o];
                        if (n !== a && n.contains(a)) return !0;
                      }
                      return !1;
                    })(t, n, e.el) ||
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
  Y = (function () {
    function t(e) {
      (this.wm = new WeakMap()), (this.store = e);
    }
    return (
      (t.prototype.connectors = function () {
        var t = this,
          n = this.handlers() || {};
        return Object.keys(n).reduce(function (r, o) {
          var a = n[o],
            i = a.init,
            d = a.events;
          return i || d
            ? ((r[o] = e(function (e, n) {
                var r;
                if (e && e.ownerDocument.body.contains(e)) {
                  var a = t.wm.get(e);
                  (a && a[o]) ||
                    t.wm.set(
                      e,
                      W(
                        {},
                        a,
                        (((r = {})[o] = new X(t.store, e, n, {
                          init: i,
                          events: d,
                        })),
                        r)
                      )
                    );
                } else t.wm.delete(e);
              })),
              r)
            : ((r[o] = function () {}), r);
        }, {});
      }),
      (t.getConnectors = function () {
        for (var e = [], t = 0; t < arguments.length; t++) e[t] = arguments[t];
        var n = new (this.bind.apply(this, [void 0].concat(e)))();
        return n.connectors();
      }),
      t
    );
  })(),
  K = (function (e) {
    function t() {
      return (null !== e && e.apply(this, arguments)) || this;
    }
    return (
      H(t, e),
      (t.prototype.derive = function (e) {
        for (var t = [], n = 1; n < arguments.length; n++)
          t[n - 1] = arguments[n];
        return new (e.bind.apply(e, [void 0, this.store, this].concat(t)))();
      }),
      t
    );
  })(Y),
  Q = (function (e) {
    function t(t, n) {
      var r = e.call(this, t) || this;
      return (r.derived = n), r;
    }
    return H(t, e), t;
  })(Y),
  U = function (e) {
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
  Z = (function (e) {
    function n() {
      return (null !== e && e.apply(this, arguments)) || this;
    }
    return (
      H(n, e),
      (n.prototype.defineNodeEventListener = function (e, t, n) {
        var r = this;
        return V(
          e,
          function (e, n) {
            (n && !r.store.query.node(n).get()) || t(e, n);
          },
          n
        );
      }),
      (n.prototype.handlers = function () {
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
              V('dragover', function (e) {
                e.craft.stopPropagation(), e.preventDefault();
              }),
              this.defineNodeEventListener('dragenter', function (t, r) {
                t.craft.stopPropagation(), t.preventDefault();
                var o = n.draggedElement;
                if (o) {
                  var a = o;
                  o.rootNodeId && (a = o.nodes[o.rootNodeId]);
                  var i = e.store.query.getDropPlaceholder(a, r, {
                    x: t.clientX,
                    y: t.clientY,
                  });
                  i && (e.store.actions.setIndicator(i), (n.indicator = i));
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
              this.defineNodeEventListener('dragstart', function (t, r) {
                t.craft.stopPropagation(),
                  e.store.actions.setNodeEvent('dragged', r),
                  (n.draggedElementShadow = U(t)),
                  (n.draggedElement = r);
              }),
              V('dragend', function (t) {
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
              V('dragstart', function (t, r) {
                t.craft.stopPropagation();
                var o = e.store.query.parseReactElement(r).toNodeTree();
                (n.draggedElementShadow = U(t)), (n.draggedElement = o);
              }),
              V('dragend', function (n) {
                n.craft.stopPropagation(),
                  e.dropElement(function (r, o) {
                    var a = (function (e, n) {
                        if (
                          'GroupingContainer' === (r = n.data.name) ||
                          'Display' === r
                        )
                          return n;
                        var r,
                          o = e.find(function (e) {
                            return e.data.nodes.includes(n.id);
                          });
                        return o
                          ? getClosestParentGroupingContainer(e, o)
                          : e.find(function (e) {
                              return e.id === t;
                            });
                      })(Object.values(e.store.getState().nodes), o.parent),
                      i = (function () {
                        var e = n.clientX,
                          t = n.clientY,
                          r = a.dom.getBoundingClientRect();
                        return {
                          parentId: a.id,
                          position: { x: e - r.x, y: t - r.y },
                        };
                      })(),
                      d = i.position,
                      s = i.parentId,
                      c = W({}, r, {
                        nodes: M(r.nodes, function (e) {
                          return W({}, e, {
                            data: W({}, e.data, {
                              props: W({}, e.data.props, d),
                            }),
                          });
                        }),
                      });
                    e.store.actions.addNodeTree(c, s, Infinity);
                  });
              }),
            ],
          },
        };
      }),
      (n.prototype.dropElement = function (e) {
        var t = n.draggedElement,
          r = n.draggedElementShadow,
          o = n.indicator;
        t && o && !o.error && e(t, o.placement),
          r && (r.parentNode.removeChild(r), (n.draggedElementShadow = null)),
          (n.draggedElement = null),
          (n.indicator = null),
          this.store.actions.setIndicator(null),
          this.store.actions.setNodeEvent('dragged', null);
      }),
      (n.indicator = null),
      n
    );
  })(K),
  $ = w({});
function ee(e) {
  var t = J(),
    r = P($),
    o = n(r, e),
    a = D(
      function () {
        return t && t.connectors();
      },
      [t]
    );
  return W({}, o, { connectors: a || {}, inContext: !!r, store: r });
}
var te = function (e) {
    var t,
      n,
      a,
      i,
      d,
      s,
      c,
      u,
      l = e.children,
      f = ee(function (e) {
        return {
          indicator: e.events.indicator,
          indicatorOptions: e.options.indicator,
          handlers: e.handlers,
          handlersFactory: e.options.handlers,
        };
      }),
      p = f.actions,
      v = f.indicator,
      h = f.indicatorOptions,
      m = f.store,
      y = f.handlers,
      g = f.handlersFactory,
      N = x(m);
    return (
      (N.current = m),
      I(
        function () {
          p.history.ignore().setState(function (e) {
            return (e.handlers = g(N.current));
          });
        },
        [p, g]
      ),
      y
        ? T.createElement(
            G.Provider,
            { value: y },
            v &&
              T.createElement(r, {
                style: W(
                  {},
                  ((t = v.placement),
                  (n = o(v.placement.parent.dom)),
                  (a =
                    v.placement.currentNode && o(v.placement.currentNode.dom)),
                  (i = 0),
                  (d = 0),
                  (s = 0),
                  (c = 0),
                  (u = t.where),
                  a
                    ? a.inFlow
                      ? ((s = a.outerWidth),
                        (c = 2),
                        (i = 'before' === u ? a.top : a.bottom),
                        (d = a.left))
                      : ((s = 2),
                        (c = a.outerHeight),
                        (i = a.top),
                        (d = 'before' === u ? a.left : a.left + a.outerWidth))
                    : n &&
                      ((i = n.top + n.padding.top),
                      (d = n.left + n.padding.left),
                      (s =
                        n.outerWidth -
                        n.padding.right -
                        n.padding.left -
                        n.margin.left -
                        n.margin.right),
                      (c = 2)),
                  {
                    top: i + 'px',
                    left: d + 'px',
                    width: s + 'px',
                    height: c + 'px',
                  }),
                  {
                    backgroundColor: v.error ? h.error : h.success,
                    transition: '0.2s ease-in',
                  }
                ),
                parentDom: v.placement.parent.dom,
              }),
            l
          )
        : null
    );
  },
  ne = (function (e) {
    function t(t, n, r) {
      var o = e.call(this, t, n) || this;
      return (o.id = r), o;
    }
    return (
      H(t, e),
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
  })(Q),
  re = T.createContext(null),
  oe = function (e) {
    var t = e.id,
      n = e.related,
      r = void 0 !== n && n,
      o = e.children,
      a = J(),
      i = ee(function (e) {
        return {
          hydrationTimestamp: e.nodes[t] && e.nodes[t]._hydrationTimestamp,
        };
      }).hydrationTimestamp,
      d = D(
        function () {
          return a.derive(ne, t).connectors();
        },
        [a, i, t]
      );
    return T.createElement(
      re.Provider,
      { value: { id: t, related: r, connectors: d } },
      o
    );
  };
function ae(e) {
  var t = P(re),
    n = t.id,
    r = t.related,
    o = t.connectors,
    a = ee(function (t) {
      return n && t.nodes[n] && e && e(t.nodes[n]);
    }),
    i = a.actions,
    d = B(a, ['actions', 'query']),
    s = D(
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
  return W({}, d, {
    id: n,
    related: r,
    inNodeContext: !!t,
    actions: s,
    connectors: o,
  });
}
function ie(e) {
  var t = ae(e),
    n = t.id,
    r = t.related,
    o = t.actions,
    i = t.inNodeContext,
    d = t.connectors,
    s = B(t, ['id', 'related', 'actions', 'inNodeContext', 'connectors']);
  return W({}, s, {
    actions: o,
    id: n,
    related: r,
    setProp: function (e) {
      return (
        a('useNode().setProp()', { suggest: 'useNode().actions.setProp()' }),
        o.setProp(e)
      );
    },
    inNodeContext: i,
    connectors: d,
  });
}
var de = function (e) {
    var t = e.render,
      n = ie().connectors;
    return 'string' == typeof t.type
      ? (0, n.connect)((0, n.drag)(T.cloneElement(t)))
      : t;
  },
  se = function () {
    var e = ae(function (e) {
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
    return D(
      function () {
        var e = n.children;
        r &&
          r.length > 0 &&
          (e = T.createElement(
            T.Fragment,
            null,
            r.map(function (e) {
              return T.createElement(ue, { id: e, key: e });
            })
          ));
        var o = T.createElement(t, n, e);
        return 'string' == typeof t ? T.createElement(de, { render: o }) : o;
      },
      [t, n, e.hydrationTimestamp, r]
    );
  },
  ce = function () {
    var e = ae(function (e) {
        return { hidden: e.data.hidden };
      }).hidden,
      t = ee(function (e) {
        return { onRender: e.options.onRender };
      }).onRender;
    return e ? null : T.createElement(t, { render: T.createElement(se, null) });
  },
  ue = T.memo(function (e) {
    return T.createElement(oe, { id: e.id }, T.createElement(ce, null));
  }),
  le = { is: 'div', canvas: !1, custom: {}, hidden: !1 },
  fe = { is: 'type', canvas: 'isCanvas' };
function pe(e) {
  var t = e.id,
    n = e.children,
    r = B(e, ['id', 'children']),
    o = W({}, le, r),
    a = o.is,
    s = B(o, ['is', 'custom', 'canvas']),
    c = ee(),
    u = c.query,
    l = c.actions,
    f = ae(function (e) {
      return { node: { id: e.id, data: e.data } };
    }),
    p = f.node,
    v = f.inNodeContext,
    h = q(null),
    m = h[0],
    y = h[1];
  return (
    i(function () {
      S(!!t, d);
      var e = p.id,
        o = p.data;
      if (v) {
        var i,
          c =
            o.linkedNodes && o.linkedNodes[t] && u.node(o.linkedNodes[t]).get();
        if (c && c.data.type === a) {
          i = c.id;
          var f = W({}, c.data.props, s);
          l.history.ignore().setProp(i, function (e) {
            return Object.keys(f).forEach(function (t) {
              return (e[t] = f[t]);
            });
          });
        } else {
          var h = T.createElement(pe, r, n),
            m = u.parseReactElement(h).toNodeTree();
          (i = m.rootNodeId), l.history.ignore().addLinkedNodeFromTree(m, e, t);
        }
        y(i);
      }
    }),
    m ? T.createElement(ue, { id: m }) : null
  );
}
var ve = function () {
  return a('<Canvas />', { suggest: '<Element canvas={true} />' });
};
function Canvas(e) {
  var t = B(e, []);
  return (
    I(function () {
      return ve();
    }, []),
    T.createElement(pe, W({}, t, { canvas: !0 }))
  );
}
var he = function (e) {
    var n = e.children,
      r = e.json,
      o = e.data,
      i = ee(),
      d = i.actions,
      s = i.query,
      c = q(null),
      u = c[0],
      l = c[1];
    r && a('<Frame json={...} />', { suggest: '<Frame data={...} />' });
    var f = x({ initialChildren: n, initialData: o || r });
    return (
      I(
        function () {
          var e = f.current,
            n = e.initialChildren,
            r = e.initialData;
          if (r) d.history.ignore().deserialize(r);
          else if (n) {
            var o = T.Children.only(n),
              a = s.parseReactElement(o).toNodeTree(function (e, n) {
                return n === o && (e.id = t), e;
              });
            d.history.ignore().addNodeTree(a);
          }
          l(T.createElement(ue, { id: t }));
        },
        [d, s]
      ),
      u
    );
  },
  me = function (e) {
    return B(e, [
      'addLinkedNodeFromTree',
      'setDOM',
      'setNodeEvent',
      'replaceNodes',
      'reset',
    ]);
  };
function ye(e) {
  var t = ee(e),
    n = t.connectors,
    r = t.actions,
    o = B(t.query, ['deserialize']),
    a = t.store,
    i = B(t, ['connectors', 'actions', 'query', 'store']),
    d = me(r),
    s = D(
      function () {
        return W({}, d, {
          history: W({}, d.history, {
            ignore: function () {
              for (var e, t = [], n = 0; n < arguments.length; n++)
                t[n] = arguments[n];
              return me((e = d.history).ignore.apply(e, t));
            },
            throttle: function () {
              for (var e, t = [], n = 0; n < arguments.length; n++)
                t[n] = arguments[n];
              return me((e = d.history).throttle.apply(e, t));
            },
          }),
        });
      },
      [d]
    );
  return W({ connectors: n, actions: s, query: o, store: a }, i);
}
function ge(e) {
  return function (t) {
    return function (n) {
      var r = e ? ye(e) : ye();
      return T.createElement(t, W({}, r, n));
    };
  };
}
function Ne(e) {
  return function (t) {
    return function (n) {
      var r = ie(e);
      return T.createElement(t, W({}, r, n));
    };
  };
}
var Ee = function (e) {
    return Object.fromEntries
      ? Object.fromEntries(e)
      : e.reduce(function (e, t) {
          var n;
          return W({}, e, (((n = {})[t[0]] = t[1]), n));
        }, {});
  },
  be = function (e, t) {
    var n = t.name || t.displayName;
    if (t === Canvas) return 'Canvas';
    if (e[n]) return n;
    for (var r = 0; r < Object.keys(e).length; r++) {
      var o = Object.keys(e)[r];
      if (e[o] === t) return o;
    }
    return 'string' == typeof t ? t : void 0;
  },
  Oe = function (e, t) {
    return 'string' == typeof e ? e : { resolvedName: be(t, e) };
  },
  ke = function (e, t) {
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
                ? L.map(r, function (e) {
                    return 'string' == typeof e ? e : ke(e, t);
                  })
                : r.type
                ? ke(r, t)
                : r),
            e);
      }, {})),
      { type: Oe(n, t), isCanvas: !!r, props: o }
    );
  },
  Ce = function (e, t) {
    var n = e.type,
      r = e.props,
      o = e.isCanvas,
      a = B(e, ['type', 'props', 'isCanvas', 'name']),
      i = ke({ type: n, isCanvas: o, props: r }, t);
    return W({}, i, a);
  };
function je(e, n) {
  S('string' == typeof n, f);
  var r = e.nodes[n],
    o = function (t) {
      return je(e, t);
    };
  return {
    isCanvas: function () {
      return !!r.data.isCanvas;
    },
    isRoot: function () {
      return r.id === t;
    },
    isLinkedNode: function () {
      return r.data.parent && o(r.data.parent).linkedNodes().includes(r.id);
    },
    isTopLevelNode: function () {
      return this.isRoot() || this.isLinkedNode();
    },
    isDeletable: function () {
      return !this.isTopLevelNode();
    },
    isParentOfTopLevelNodes: function () {
      return r.data.linkedNodes && Object.keys(r.data.linkedNodes).length > 0;
    },
    isParentOfTopLevelCanvas: function () {
      return (
        a('query.node(id).isParentOfTopLevelCanvas', {
          suggest: 'query.node(id).isParentOfTopLevelNodes',
        }),
        this.isParentOfTopLevelNodes()
      );
    },
    get: function () {
      return r;
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
        })(r.data.parent)
      );
    },
    descendants: function (t, r) {
      return (
        void 0 === t && (t = !1),
        (function n(a, i, d) {
          return (
            void 0 === i && (i = []),
            void 0 === d && (d = 0),
            (t || (!t && 0 === d)) && e.nodes[a]
              ? ('childNodes' !== r &&
                  o(a)
                    .linkedNodes()
                    .forEach(function (e) {
                      i.push(e), (i = n(e, i, d + 1));
                    }),
                'linkedNodes' !== r &&
                  o(a)
                    .childNodes()
                    .forEach(function (e) {
                      i.push(e), (i = n(e, i, d + 1));
                    }),
                i)
              : i
          );
        })(n)
      );
    },
    linkedNodes: function () {
      return Object.values(r.data.linkedNodes || {});
    },
    childNodes: function () {
      return r.data.nodes || [];
    },
    isDraggable: function (t) {
      try {
        var n = r;
        return (
          S(!this.isTopLevelNode(), p),
          S(je(e, n.data.parent).isCanvas(), v),
          S(n.rules.canDrag(n, o), h),
          !0
        );
      } catch (e) {
        return t && t(e), !1;
      }
    },
    isDroppable: function (t, n) {
      var a = 'object' == typeof t && !e.nodes[t.id],
        i = (function (t) {
          return 'string' == typeof t ? e.nodes[t] : t;
        })(t),
        d = r;
      try {
        if (
          ('string' == typeof t && S(!o(t).isTopLevelNode(), p),
          S(this.isCanvas(), m),
          S(d.rules.canMoveIn(i, d, o), y),
          S(i.rules.canDrop(d, i, o), g),
          a)
        )
          return !0;
        var s = o(i.id).descendants(!0);
        S(!s.includes(d.id) && d.id !== i.id, N);
        var c = i.data.parent && e.nodes[i.data.parent];
        return (
          S(c.data.isCanvas, v),
          S(c || (!c && !e.nodes[i.id]), E),
          r !== c && S(c.rules.canMoveOut(i, c, o), b),
          !0
        );
      } catch (e) {
        return n && n(e), !1;
      }
    },
    toSerializedNode: function () {
      return Ce(r.data, e.options.resolver);
    },
    toNodeTree: function (e) {
      var t = [n].concat(this.descendants(!0, e)).reduce(function (e, t) {
        return (e[t] = o(t).get()), e;
      }, {});
      return { rootNodeId: n, nodes: t };
    },
    decendants: function (e) {
      return (
        void 0 === e && (e = !1),
        a('query.node(id).decendants', {
          suggest: 'query.node(id).descendants',
        }),
        this.descendants(e)
      );
    },
    isTopLevelCanvas: function () {
      return !this.isRoot() && !r.data.parent;
    },
  };
}
var Te = z;
function we(e, t) {
  var n = e.data.type,
    r = e.id || Te();
  return _({}, function (o) {
    if (
      ((o.id = r),
      (o._hydrationTimestamp = Date.now()),
      (o.data = W(
        {
          type: n,
          props: W({}, e.data.props),
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
      (o.rules = W(
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
      o.data.type === pe || o.data.type === Canvas)
    ) {
      var a = o.data.type === Canvas,
        i = W({}, le, o.data.props);
      Object.keys(le).forEach(function (e) {
        (o.data[fe[e] || e] = i[e]), delete o.data.props[e];
      }),
        (n = o.data.type),
        a && ((o.data.isCanvas = !0), ve());
    }
    if ((t && t(o), n.craft)) {
      o.data.props = W(
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
          (o.data.custom = W({}, n.craft.custom, o.data.custom)),
        n.craft.related)
      ) {
        o.related = {};
        var s = { id: o.id, related: !0 };
        Object.keys(n.craft.related).forEach(function (e) {
          o.related[e] = function () {
            return T.createElement(oe, s, T.createElement(n.craft.related[e]));
          };
        });
      }
    }
  });
}
var Pe = function (e, t, n) {
    var r = e.props,
      o = (function (e, t) {
        return 'object' == typeof e && e.resolvedName
          ? 'Canvas' === e.resolvedName
            ? Canvas
            : t[e.resolvedName]
          : 'string' == typeof e
          ? e
          : null;
      })(e.type, t);
    if (o) {
      (r = Object.keys(r).reduce(function (e, n) {
        var o = r[n];
        return (
          (e[n] =
            null == o
              ? null
              : 'object' == typeof o && o.resolvedName
              ? Pe(o, t)
              : 'children' === n && Array.isArray(o)
              ? o.map(function (e) {
                  return 'string' == typeof e ? e : Pe(e, t);
                })
              : o),
          e
        );
      }, {})),
        n && (r.key = n);
      var a = W({}, T.createElement(o, W({}, r)));
      return W({}, a, { name: be(t, a.type) });
    }
  },
  De = function (e, t) {
    var n = e.type,
      r = B(e, ['type', 'props']);
    S(
      (void 0 !== n && 'string' == typeof n) ||
        (void 0 !== n && void 0 !== n.resolvedName),
      O.replace('%displayName%', e.displayName).replace(
        '%availableComponents%',
        Object.keys(t).join(', ')
      )
    );
    var o = Pe(e, t),
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
  xe = function (e, t) {
    var n, r;
    if (t.length < 1) return ((n = {})[e.id] = e), n;
    var o = t.map(function (e) {
        return e.rootNodeId;
      }),
      a = W({}, e, { data: W({}, e.data, { nodes: o }) }),
      i = (((r = {})[e.id] = a), r);
    return t.reduce(function (t, n) {
      var r,
        o = n.nodes[n.rootNodeId];
      return W(
        {},
        t,
        n.nodes,
        (((r = {})[o.id] = W({}, o, { data: W({}, o.data, { parent: e.id }) })),
        r)
      );
    }, i);
  },
  Ie = function (e, t) {
    return { rootNodeId: e.id, nodes: xe(e, t) };
  };
function qe(e) {
  var n = e && e.options,
    r = function () {
      return qe(e);
    };
  return {
    getDropPlaceholder: function (t, n, a, i) {
      if (
        (void 0 === i &&
          (i = function (t) {
            return e.nodes[t.id].dom;
          }),
        t !== n)
      ) {
        var d = 'string' == typeof t && e.nodes[t],
          s = e.nodes[n],
          c = r().node(s.id).isCanvas() ? s : e.nodes[s.data.parent];
        if (c) {
          var u = c.data.nodes || [],
            l = (function (e, t, n, r) {
              for (
                var o = { parent: e, index: 0, where: 'before' },
                  a = 0,
                  i = 0,
                  d = 0,
                  s = 0,
                  c = 0,
                  u = 0,
                  l = 0,
                  f = t.length;
                l < f;
                l++
              ) {
                var p = t[l];
                if (
                  ((u = p.top + p.outerHeight),
                  (s = p.left + p.outerWidth / 2),
                  (c = p.top + p.outerHeight / 2),
                  !(
                    (i && p.left > i) ||
                    (d && c >= d) ||
                    (a && p.left + p.outerWidth < a)
                  ))
                )
                  if (((o.index = l), p.inFlow)) {
                    if (r < c) {
                      o.where = 'before';
                      break;
                    }
                    o.where = 'after';
                  } else
                    r < u && (d = u),
                      n < s
                        ? ((i = s), (o.where = 'before'))
                        : ((a = s), (o.where = 'after'));
              }
              return o;
            })(
              c,
              u
                ? u.reduce(function (t, n) {
                    var r = i(e.nodes[n]);
                    if (r) {
                      var a = W({ id: n }, o(r));
                      t.push(a);
                    }
                    return t;
                  }, [])
                : [],
              a.x,
              a.y
            ),
            f = {
              placement: W({}, l, {
                currentNode: u.length && e.nodes[u[l.index]],
              }),
              error: !1,
            };
          return (
            d &&
              r()
                .node(d.id)
                .isDraggable(function (e) {
                  return (f.error = e);
                }),
            r()
              .node(c.id)
              .isDroppable(t, function (e) {
                return (f.error = e);
              }),
            f
          );
        }
      }
    },
    getOptions: function () {
      return n;
    },
    node: function (t) {
      return je(e, t);
    },
    getSerializedNodes: function () {
      var t = this,
        n = Object.keys(e.nodes).map(function (e) {
          return [e, t.node(e).toSerializedNode()];
        });
      return Ee(n);
    },
    serialize: function () {
      return JSON.stringify(this.getSerializedNodes());
    },
    parseReactElement: function (t) {
      return {
        toNodeTree: function (n) {
          var o = (function (e, t) {
              var n = e;
              return (
                'string' == typeof n && (n = T.createElement(R, {}, n)),
                we({ data: { type: n.type, props: W({}, n.props) } }, function (
                  e
                ) {
                  t && t(e, n);
                })
              );
            })(t, function (t, r) {
              var o = be(e.options.resolver, t.data.type);
              S(null !== o, k),
                (t.data.displayName = t.data.displayName || o),
                (t.data.name = o),
                n && n(t, r);
            }),
            a = [];
          return (
            t.props &&
              t.props.children &&
              (a = T.Children.toArray(t.props.children).reduce(function (e, t) {
                return (
                  T.isValidElement(t) &&
                    e.push(r().parseReactElement(t).toNodeTree(n)),
                  e
                );
              }, [])),
            Ie(o, a)
          );
        },
      };
    },
    parseSerializedNode: function (t) {
      return {
        toNode: function (n) {
          var o = De(t, e.options.resolver);
          S(o.type, k);
          var i = 'string' == typeof n && n;
          return (
            i &&
              a('query.parseSerializedNode(...).toNode(id)', {
                suggest:
                  'query.parseSerializedNode(...).toNode(node => node.id = id)',
              }),
            r()
              .parseFreshNode(W({}, i ? { id: i } : {}, { data: o }))
              .toNode(!i && n)
          );
        },
      };
    },
    parseFreshNode: function (n) {
      return {
        toNode: function (r) {
          return we(n, function (n) {
            n.data.parent === l && (n.data.parent = t);
            var o = be(e.options.resolver, n.data.type);
            S(null !== o, k),
              (n.data.displayName = n.data.displayName || o),
              (n.data.name = o),
              r && r(n);
          });
        },
      };
    },
    createNode: function (e, t) {
      a('query.createNode(' + e + ')', {
        suggest: 'query.parseReactElement(' + e + ').toNodeTree()',
      });
      var n = this.parseReactElement(e).toNodeTree(),
        r = n.nodes[n.rootNodeId];
      return t
        ? (t.id && (r.id = t.id), t.data && (r.data = W({}, r.data, t.data)), r)
        : r;
    },
    getState: function () {
      return e;
    },
  };
}
var Le = {
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
        return new Z(e);
      },
    },
  },
  Re = {
    methods: function (e, n) {
      return W(
        {},
        (function (e, n) {
          var r = function (t, n, r) {
              var o = i(n);
              o.data.nodes || (o.data.nodes = []),
                o.data.props.children && delete o.data.props.children,
                null != r
                  ? o.data.nodes.splice(r, 0, t.id)
                  : o.data.nodes.push(t.id),
                (t.data.parent = o.id),
                (e.nodes[t.id] = t);
            },
            o = function (t, n, a) {
              var i = t.nodes[t.rootNodeId];
              if ((null != n && r(i, n, a), i.data.nodes)) {
                var d = i.data.nodes.slice();
                (i.data.nodes = []),
                  d.forEach(function (e, n) {
                    return o({ rootNodeId: e, nodes: t.nodes }, i.id, n);
                  });
              }
              i.data.linkedNodes &&
                Object.keys(i.data.linkedNodes).forEach(function (n) {
                  var r = i.data.linkedNodes[n];
                  (e.nodes[r] = t.nodes[r]),
                    o({ rootNodeId: r, nodes: t.nodes });
                });
            },
            i = function (t) {
              S(t, u);
              var n = e.nodes[t];
              return S(n, c), n;
            },
            d = function (t) {
              var n = e.nodes[t],
                r = e.nodes[n.data.parent];
              if (
                (n.data.nodes &&
                  n.data.nodes.slice().forEach(function (e) {
                    return d(e);
                  }),
                n.data.linkedNodes &&
                  Object.values(n.data.linkedNodes).map(function (e) {
                    return d(e);
                  }),
                r.data.nodes.includes(t))
              ) {
                var o = r.data.nodes;
                o.splice(o.indexOf(t), 1);
              } else {
                var a = Object.keys(r.data.linkedNodes).find(function (e) {
                  return r.data.linkedNodes[e] === e;
                });
                a && delete r.data.linkedNodes[a];
              }
              !(function (e, t) {
                Object.keys(e.events).forEach(function (n) {
                  e.events[n] && e.events[n] === t && (e.events[n] = null);
                });
              })(e, t),
                delete e.nodes[t];
            };
          return {
            addLinkedNodeFromTree: function (t, n, r) {
              var a = i(n);
              a.data.linkedNodes || (a.data.linkedNodes = {});
              var s = a.data.linkedNodes[r];
              s && d(s),
                (a.data.linkedNodes[r] = t.rootNodeId),
                (t.nodes[t.rootNodeId].data.parent = n),
                (e.nodes[t.rootNodeId] = t.nodes[t.rootNodeId]),
                o(t);
            },
            add: function (e, t, n) {
              var o = [e];
              Array.isArray(e) &&
                (a('actions.add(node: Node[])', {
                  suggest: 'actions.add(node: Node)',
                }),
                (o = e)),
                o.forEach(function (e) {
                  r(e, t, n);
                });
            },
            addNodeTree: function (n, r, a) {
              var i = n.nodes[n.rootNodeId];
              r ||
                (S(
                  n.rootNodeId === t,
                  'Cannot add non-root Node without a parent'
                ),
                (e.nodes[n.rootNodeId] = i)),
                o(n, r, a);
            },
            delete: function (e) {
              S(!n.node(e).isTopLevelNode(), s), d(e);
            },
            deserialize: function (e) {
              var r = 'string' == typeof e ? JSON.parse(e) : e,
                o = Object.keys(r).map(function (e) {
                  var o = e;
                  return (
                    e === l && (o = t),
                    [
                      o,
                      n.parseSerializedNode(r[e]).toNode(function (e) {
                        return (e.id = o);
                      }),
                    ]
                  );
                });
              this.replaceNodes(Ee(o));
            },
            move: function (t, r, o) {
              var a = e.nodes[t],
                i = a.data.parent,
                d = e.nodes[r].data.nodes;
              n.node(r).isDroppable(a, function (e) {
                throw new Error(e);
              });
              var s = e.nodes[i].data.nodes;
              (s[s.indexOf(t)] = 'marked'),
                d.splice(o, 0, t),
                (e.nodes[t].data.parent = r),
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
              S(e.nodes[t], c), n(e.nodes[t].data.props);
            },
            selectNode: function (e) {
              this.setNodeEvent('selected', null != e ? e : null),
                this.setNodeEvent('hovered', null);
            },
          };
        })(e, n),
        {
          setState: function (t) {
            var n = B(this, ['history']);
            t(e, n);
          },
        }
      );
    },
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
  Se = function (e) {
    return C(Re, W({}, Le, { options: W({}, Le.options, e) }), qe);
  },
  Me = function (e) {
    var t = e.children,
      n = B(e, ['children']);
    void 0 !== n.resolver &&
      S('object' == typeof n.resolver && !Array.isArray(n.resolver), j);
    var r = Se(n);
    return (
      I(
        function () {
          r && n && r.actions.setOptions(function (e) {});
        },
        [r, n]
      ),
      I(
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
        ? T.createElement(
            $.Provider,
            { value: r },
            T.createElement(te, null, t)
          )
        : null
    );
  },
  _e = function (e) {
    var t = e.events,
      n = e.data,
      r = n.nodes,
      o = n.linkedNodes,
      a = B(e, ['events', 'data']),
      i = we(F(e));
    return {
      node: (e = W({}, i, a, {
        events: W({}, i.events, t),
        dom: e.dom || i.dom,
      })),
      childNodes: r,
      linkedNodes: o,
    };
  },
  ze = function (e, t) {
    var n = t.nodes,
      r = B(t, ['nodes']),
      o = e.nodes,
      a = B(e, ['nodes']);
    expect(a).toEqual(r);
    var i = Object.keys(n).reduce(function (e, t) {
        var r = B(n[t], ['_hydrationTimestamp', 'rules']);
        return (e[t] = r), e;
      }, {}),
      d = Object.keys(o).reduce(function (e, t) {
        var n = B(o[t], ['_hydrationTimestamp', 'rules']);
        return (e[t] = n), e;
      }, {});
    expect(d).toEqual(i);
  },
  Fe = function (e) {
    var t = {},
      n = function (e) {
        var r = _e(e),
          o = r.node,
          a = r.childNodes,
          i = r.linkedNodes;
        (t[o.id] = o),
          a &&
            a.forEach(function (e, r) {
              var a = _e(e),
                i = a.node,
                d = a.childNodes,
                s = a.linkedNodes;
              (i.data.parent = o.id),
                (t[i.id] = i),
                (o.data.nodes[r] = i.id),
                n(
                  W({}, i, {
                    data: W({}, i.data, {
                      nodes: d || [],
                      linkedNodes: s || {},
                    }),
                  })
                );
            }),
          i &&
            Object.keys(i).forEach(function (e) {
              var r = _e(i[e]),
                a = r.node,
                d = r.childNodes,
                s = r.linkedNodes;
              (o.data.linkedNodes[e] = a.id),
                (a.data.parent = o.id),
                (t[a.id] = a),
                n(
                  W({}, a, {
                    data: W({}, a.data, {
                      nodes: d || [],
                      linkedNodes: s || {},
                    }),
                  })
                );
            });
      };
    return n(e), t;
  },
  Ae = function (e) {
    void 0 === e && (e = {});
    var t = e.nodes,
      n = e.events;
    return W({}, Le, e, {
      nodes: t ? Fe(t) : {},
      events: W({}, Le.events, n || {}),
    });
  };
export {
  Re as ActionMethodsWithConfig,
  Canvas,
  K as CoreEventHandlers,
  Z as DefaultEventHandlers,
  Q as DerivedEventHandlers,
  Me as Editor,
  pe as Element,
  te as Events,
  he as Frame,
  Y as Handlers,
  re as NodeContext,
  je as NodeHelpers,
  oe as NodeProvider,
  qe as QueryMethods,
  ge as connectEditor,
  Ne as connectNode,
  Fe as createTestNodes,
  Ae as createTestState,
  le as defaultElementProps,
  V as defineEventListener,
  ve as deprecateCanvasComponent,
  Le as editorInitialState,
  fe as elementPropToNodeData,
  ze as expectEditorState,
  ye as useEditor,
  Se as useEditorStore,
  J as useEventHandler,
  ie as useNode,
};
