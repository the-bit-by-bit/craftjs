import {
  useCollector as e,
  RenderIndicator as n,
  useMethods as t,
  ROOT_NODE as r,
} from '@craftjs/utils';
import a, {
  createContext as o,
  useContext as i,
  useMemo as d,
  useRef as c,
  useEffect as l,
  useState as s,
  useCallback as u,
} from 'react';
import {
  useEditor as p,
  ROOT_NODE as f,
  defineEventListener as v,
  DerivedEventHandlers as g,
  useEventHandler as h,
} from '@craftjs/core';
import m from 'styled-components';
import y from 'react-contenteditable';
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
***************************************************************************** */ var x = function (
    e,
    n
  ) {
    return (x =
      Object.setPrototypeOf ||
      ({ __proto__: [] } instanceof Array &&
        function (e, n) {
          e.__proto__ = n;
        }) ||
      function (e, n) {
        for (var t in n) n.hasOwnProperty(t) && (e[t] = n[t]);
      })(e, n);
  },
  b = function () {
    return (b =
      Object.assign ||
      function (e) {
        for (var n, t = 1, r = arguments.length; t < r; t++)
          for (var a in (n = arguments[t]))
            Object.prototype.hasOwnProperty.call(n, a) && (e[a] = n[a]);
        return e;
      }).apply(this, arguments);
  };
function E(e, n) {
  var t = {};
  for (var r in e)
    Object.prototype.hasOwnProperty.call(e, r) &&
      n.indexOf(r) < 0 &&
      (t[r] = e[r]);
  if (null != e && 'function' == typeof Object.getOwnPropertySymbols) {
    var a = 0;
    for (r = Object.getOwnPropertySymbols(e); a < r.length; a++)
      n.indexOf(r[a]) < 0 &&
        Object.prototype.propertyIsEnumerable.call(e, r[a]) &&
        (t[r[a]] = e[r[a]]);
  }
  return t;
}
function w(e, n) {
  return (
    Object.defineProperty
      ? Object.defineProperty(e, 'raw', { value: n })
      : (e.raw = n),
    e
  );
}
var O = a.createContext({}),
  C = o({});
function L(n) {
  var t = i(C).store;
  return e(t, n);
}
function k(e) {
  var n = i(O),
    t = n.id,
    r = n.depth,
    a = n.connectors,
    o = L(function (n) {
      return t && n.layers[t] && e && e(n.layers[t]);
    }),
    c = o.actions,
    l = E(o, ['actions']),
    s = p(function (e, n) {
      return { children: e.nodes[t] && n.node(t).descendants() };
    }).children,
    u = d(
      function () {
        return {
          toggleLayer: function () {
            return c.toggleLayer(t);
          },
        };
      },
      [c, t]
    );
  return b({ id: t, depth: r, children: s, actions: u, connectors: a }, l);
}
var P = function () {
    var e = k(function (e) {
        return { expanded: e.expanded };
      }),
      n = e.id,
      t = e.depth,
      r = e.children,
      o = e.expanded,
      i = p(function (e, t) {
        return {
          data: e.nodes[n] && e.nodes[n].data,
          shouldBeExpanded:
            e.events.selected &&
            t.node(e.events.selected).ancestors(!0).includes(n),
        };
      }),
      d = i.data,
      s = i.shouldBeExpanded,
      u = L(function (e) {
        return {
          renderLayer: e.options.renderLayer,
          expandRootOnLoad: e.options.expandRootOnLoad,
        };
      }),
      v = u.actions,
      g = u.renderLayer,
      h = u.expandRootOnLoad,
      m = c(o);
    m.current = o;
    var y = c(h && n === f);
    l(
      function () {
        !m.current && s && v.toggleLayer(n);
      },
      [v, n, s]
    ),
      l(
        function () {
          y.current && v.toggleLayer(n);
        },
        [v, n]
      );
    var x = c(!1);
    return (
      x.current || (v.registerLayer(n), (x.current = !0)),
      d
        ? a.createElement(
            'div',
            { className: 'craft-layer-node ' + n },
            a.createElement(
              g,
              {},
              r && o
                ? r.map(function (e) {
                    return a.createElement(N, { key: e, id: e, depth: t + 1 });
                  })
                : null
            )
          )
        : null
    );
  },
  j = (function (e) {
    function n(n, t, r, a) {
      var o = e.call(this, n, t) || this;
      return (o.id = a), (o.layerStore = r), o;
    }
    return (
      (function (e, n) {
        function t() {
          this.constructor = e;
        }
        x(e, n),
          (e.prototype =
            null === n
              ? Object.create(n)
              : ((t.prototype = n.prototype), new t()));
      })(n, e),
      (n.prototype.getLayer = function (e) {
        return this.layerStore.getState().layers[e];
      }),
      (n.prototype.handlers = function () {
        var e = this,
          t = this.derived.connectors();
        return {
          layer: {
            init: function (n) {
              t.select(n, e.id),
                t.hover(n, e.id),
                t.drag(n, e.id),
                e.layerStore.actions.setDOM(e.id, { dom: n });
            },
            events: [
              v('mouseover', function (n, t) {
                n.craft.stopPropagation(),
                  e.layerStore.actions.setLayerEvent('hovered', t);
              }),
              v('dragover', function (t) {
                t.craft.stopPropagation(), t.preventDefault();
                var r = n.events,
                  a = r.indicator,
                  o = r.currentCanvasHovered;
                if (o && a && o.data.nodes) {
                  var i = e.getLayer(o.id).headingDom.getBoundingClientRect();
                  if (t.clientY > i.top + 10 && t.clientY < i.bottom - 10) {
                    var d = o.data.nodes[o.data.nodes.length - 1];
                    if (!d) return;
                    (a.placement.currentNode = e.store.query.node(d).get()),
                      (a.placement.index = o.data.nodes.length),
                      (a.placement.where = 'after'),
                      (a.placement.parent = o),
                      (n.events.indicator = b({}, a, { onCanvas: !0 })),
                      e.layerStore.actions.setIndicator(n.events.indicator);
                  }
                }
              }),
              v('dragenter', function (t) {
                t.craft.stopPropagation(), t.preventDefault();
                var r = n.draggedElement;
                if (r) {
                  var a = e.store.query.getDropPlaceholder(
                    r,
                    e.id,
                    { x: t.clientX, y: t.clientY },
                    function (n) {
                      var t = e.getLayer(n.id);
                      return t && t.dom;
                    }
                  );
                  if (a) {
                    var o = a.placement.parent,
                      i = e.getLayer(o.id).headingDom.getBoundingClientRect();
                    if (
                      ((n.events.currentCanvasHovered = null),
                      e.store.query.node(o.id).isCanvas() && o.data.parent)
                    ) {
                      var d = e.store.query.node(o.data.parent).get();
                      e.store.query.node(d.id).isCanvas() &&
                        ((n.events.currentCanvasHovered = o),
                        ((t.clientY > i.bottom - 10 &&
                          !e.getLayer(o.id).expanded) ||
                          t.clientY < i.top + 10) &&
                          ((a.placement.parent = d),
                          (a.placement.currentNode = o),
                          (a.placement.index = d.data.nodes
                            ? d.data.nodes.indexOf(o.id)
                            : 0),
                          t.clientY > i.bottom - 10 &&
                          !e.getLayer(o.id).expanded
                            ? (a.placement.where = 'after')
                            : t.clientY < i.top + 10 &&
                              (a.placement.where = 'before')));
                    }
                    (n.events.indicator = b({}, a, { onCanvas: !1 })),
                      e.layerStore.actions.setIndicator(n.events.indicator);
                  }
                }
              }),
            ],
          },
          layerHeader: {
            init: function (n) {
              e.layerStore.actions.setDOM(e.id, { headingDom: n });
            },
          },
          drag: {
            init: function (e) {
              return (
                e.setAttribute('draggable', !0),
                function () {
                  e.removeAttribute('draggable');
                }
              );
            },
            events: [
              v('dragstart', function (t) {
                t.craft.stopPropagation(), (n.draggedElement = e.id);
              }),
              v('dragend', function (t, r) {
                t.craft.stopPropagation();
                var a = n.events;
                if (a.indicator && !a.indicator.error) {
                  var o = a.indicator.placement;
                  e.store.actions.move(
                    n.draggedElement,
                    o.parent.id,
                    o.index + ('after' === o.where ? 1 : 0)
                  );
                }
                (n.draggedElement = null),
                  (n.events.indicator = null),
                  e.layerStore.actions.setIndicator(null);
              }),
            ],
          },
        };
      }),
      (n.events = { indicator: null, currentCanvasHovered: null }),
      n
    );
  })(g),
  N = function (e) {
    var n = e.id,
      t = e.depth,
      r = h(),
      o = i(C).store,
      c = d(
        function () {
          return r.derive(j, o, n).connectors();
        },
        [r, n, o]
      );
    return p(function (e) {
      return { exists: !!e.nodes[n] };
    }).exists
      ? a.createElement(
          O.Provider,
          { value: { id: n, depth: t, connectors: c } },
          a.createElement(P, null)
        )
      : null;
  },
  z = function (e) {
    return {
      setLayerEvent: function (n, t) {
        if (null === t || e.layers[t]) {
          var r = e.events[n];
          r && t !== r && (e.layers[r].event[n] = !1),
            t
              ? ((e.layers[t].event[n] = !0), (e.events[n] = t))
              : (e.events[n] = null);
        }
      },
      registerLayer: function (n) {
        e.layers[n] ||
          (e.layers[n] = {
            expanded: !1,
            id: n,
            event: { selected: !1, hovered: !1 },
          });
      },
      setDOM: function (n, t) {
        e.layers[n] = b(
          {},
          e.layers[n],
          t.dom ? { dom: t.dom } : {},
          t.headingDom ? { headingDom: t.headingDom } : {}
        );
      },
      toggleLayer: function (n) {
        e.layers[n].expanded = !e.layers[n].expanded;
      },
      setIndicator: function (n) {
        e.events.indicator = n;
      },
    };
  },
  D = function (e) {
    var t = e.children,
      r = L(function (e) {
        return e;
      }),
      o = r.layers,
      i = r.events,
      c = p(function (e) {
        return { enabled: e.options.enabled };
      }).query.getOptions().indicator,
      l = d(
        function () {
          var e = i.indicator;
          if (e) {
            var n = e.placement,
              t = n.where,
              r = n.parent,
              a = n.currentNode,
              d = a ? a.id : r.id,
              l = e.error ? c.error : c.success;
            if (e.onCanvas && null != o[r.id].dom) {
              var s = o[r.id].dom.getBoundingClientRect(),
                u = o[r.id].headingDom.getBoundingClientRect();
              return {
                top: u.top,
                left: s.left,
                width: s.width,
                height: u.height,
                background: 'transparent',
                borderWidth: '1px',
                borderColor: l,
              };
            }
            if (!o[d]) return;
            var p = o[d].headingDom.getBoundingClientRect(),
              f = o[d].dom.getBoundingClientRect();
            return {
              top: 'after' !== t && a ? f.top : f.top + f.height,
              left: p.left,
              width: f.width - p.left,
              height: 2,
              borderWidth: 0,
              background: l,
            };
          }
        },
        [i, c.error, c.success, o]
      );
    return a.createElement(
      'div',
      null,
      i.indicator ? a.createElement(n, { style: l }) : null,
      t
    );
  },
  _ = function () {
    var e = k().id,
      n = p(function (n) {
        return {
          displayName:
            (n.nodes[e] && n.nodes[e].data.name) || n.nodes[e].data.displayName,
          hidden: n.nodes[e] && n.nodes[e].data.hidden,
        };
      }),
      t = n.displayName,
      r = n.actions,
      o = s(!1),
      i = o[0],
      d = o[1],
      f = c(null),
      v = u(function (e) {
        f.current && !f.current.contains(e.target) && d(!1);
      }, []);
    return (
      l(
        function () {
          return function () {
            window.removeEventListener('click', v);
          };
        },
        [v]
      ),
      a.createElement(y, {
        html: t,
        disabled: !i,
        ref: function (e) {
          e &&
            ((f.current = e.el.current),
            window.removeEventListener('click', v),
            window.addEventListener('click', v));
        },
        onChange: function (n) {
          r.setCustom(e, function (e) {
            return (e.displayName = n.target.value);
          });
        },
        tagName: 'div',
      })
    );
  };
function H() {
  return (H =
    Object.assign ||
    function (e) {
      for (var n = 1; n < arguments.length; n++) {
        var t = arguments[n];
        for (var r in t)
          Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r]);
      }
      return e;
    }).apply(this, arguments);
}
var B = a.createElement('path', {
    d:
      'M9.99 1.01A1 1 0 008.283.303L5 3.586 1.717.303A1 1 0 10.303 1.717l3.99 3.98a1 1 0 001.414 0l3.99-3.98a.997.997 0 00.293-.707z',
  }),
  S = function (e) {
    return a.createElement('svg', H({ viewBox: '0 0 10 6' }, e), B);
  };
function R() {
  return (R =
    Object.assign ||
    function (e) {
      for (var n = 1; n < arguments.length; n++) {
        var t = arguments[n];
        for (var r in t)
          Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r]);
      }
      return e;
    }).apply(this, arguments);
}
var M = a.createElement('path', { fill: 'none', d: 'M0 0h24v24H0z' }),
  Y = a.createElement('path', {
    d:
      'M1.181 12C2.121 6.88 6.608 3 12 3c5.392 0 9.878 3.88 10.819 9-.94 5.12-5.427 9-10.819 9-5.392 0-9.878-3.88-10.819-9zM12 17a5 5 0 100-10 5 5 0 000 10zm0-2a3 3 0 110-6 3 3 0 010 6z',
  }),
  q = function (e) {
    return a.createElement(
      'svg',
      R({ viewBox: '0 0 24 24', width: 16, height: 16 }, e),
      M,
      Y
    );
  };
function A() {
  return (A =
    Object.assign ||
    function (e) {
      for (var n = 1; n < arguments.length; n++) {
        var t = arguments[n];
        for (var r in t)
          Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r]);
      }
      return e;
    }).apply(this, arguments);
}
var I,
  T,
  V,
  W,
  X,
  F,
  G,
  J = a.createElement('path', {
    className: 'linked_svg__a',
    d:
      'M16.5 9h-1a.5.5 0 00-.5.5V15H3V3h5.5a.5.5 0 00.5-.5v-1a.5.5 0 00-.5-.5h-7a.5.5 0 00-.5.5v15a.5.5 0 00.5.5h15a.5.5 0 00.5-.5v-7a.5.5 0 00-.5-.5z',
  }),
  K = a.createElement('path', {
    className: 'linked_svg__a',
    d:
      'M16.75 1h-5.373a.4.4 0 00-.377.4.392.392 0 00.117.28l1.893 1.895-3.52 3.521a.5.5 0 000 .707l.706.708a.5.5 0 00.708 0l3.521-3.521 1.893 1.892A.39.39 0 0016.6 7a.4.4 0 00.4-.377V1.25a.25.25 0 00-.25-.25z',
  }),
  Q = function (e) {
    return a.createElement('svg', A({ viewBox: '0 0 18 18' }, e), J, K);
  },
  U = m.div(
    I ||
      (I = w(
        [
          '\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n  padding: 4px 15px;\n  background: ',
          ';\n  color: ',
          ';\n  svg {\n    fill: ',
          ';\n    margin-bottom: 2px;\n    vertical-align: baseline;\n  }\n  .inner {\n    flex: 1;\n    > div {\n      padding: 0px;\n      flex: 1;\n      display: flex;\n      margin-left: ',
          'px;\n      align-items: center;\n      div.layer-name {\n        flex: 1;\n        h2 {\n          font-size: 15px;\n          line-height: 26px;\n        }\n      }\n    }\n  }\n',
        ],
        [
          '\n  display: flex;\n  flex-direction: row;\n  align-items: center;\n  padding: 4px 15px;\n  background: ',
          ';\n  color: ',
          ';\n  svg {\n    fill: ',
          ';\n    margin-bottom: 2px;\n    vertical-align: baseline;\n  }\n  .inner {\n    flex: 1;\n    > div {\n      padding: 0px;\n      flex: 1;\n      display: flex;\n      margin-left: ',
          'px;\n      align-items: center;\n      div.layer-name {\n        flex: 1;\n        h2 {\n          font-size: 15px;\n          line-height: 26px;\n        }\n      }\n    }\n  }\n',
        ]
      )),
    function (e) {
      return e.selected ? '#2680eb' : 'transparent';
    },
    function (e) {
      return e.selected ? '#fff' : 'inherit';
    },
    function (e) {
      return e.selected ? '#fff' : '#808184';
    },
    function (e) {
      return 10 * e.depth;
    }
  ),
  Z = m.a(
    T ||
      (T = w(
        [
          '\n  width: 8px;\n  display: block;\n  transform: rotate(',
          'deg);\n  opacity: 0.7;\n  cursor: pointer;\n',
        ],
        [
          '\n  width: 8px;\n  display: block;\n  transform: rotate(',
          'deg);\n  opacity: 0.7;\n  cursor: pointer;\n',
        ]
      )),
    function (e) {
      return e.expanded ? 180 : 0;
    }
  ),
  $ = m.a(
    V ||
      (V = w(
        [
          '\n  width: 14px;\n  height: 14px;\n  margin-right: 10px;\n  position: relative;\n  transition: 0.4s cubic-bezier(0.19, 1, 0.22, 1);\n  cursor: pointer;\n\n  svg {\n    width: 100%;\n    height: 100%;\n    object-fit: contain;\n    opacity: ',
          ";\n  }\n  &:after {\n    content: ' ';\n    width: 2px;\n    height: ",
          '%;\n    position: absolute;\n    left: 2px;\n    top: 3px;\n    background: ',
          ';\n    transform: rotate(-45deg);\n    transition: 0.4s cubic-bezier(0.19, 1, 0.22, 1);\n    transform-origin: 0% 0%;\n    opacity: ',
          ';\n  }\n',
        ],
        [
          '\n  width: 14px;\n  height: 14px;\n  margin-right: 10px;\n  position: relative;\n  transition: 0.4s cubic-bezier(0.19, 1, 0.22, 1);\n  cursor: pointer;\n\n  svg {\n    width: 100%;\n    height: 100%;\n    object-fit: contain;\n    opacity: ',
          ";\n  }\n  &:after {\n    content: ' ';\n    width: 2px;\n    height: ",
          '%;\n    position: absolute;\n    left: 2px;\n    top: 3px;\n    background: ',
          ';\n    transform: rotate(-45deg);\n    transition: 0.4s cubic-bezier(0.19, 1, 0.22, 1);\n    transform-origin: 0% 0%;\n    opacity: ',
          ';\n  }\n',
        ]
      )),
    function (e) {
      return e.isHidden ? 0.2 : 1;
    },
    function (e) {
      return e.isHidden ? 100 : 0;
    },
    function (e) {
      return e.selected ? '#fff' : '#808184';
    },
    function (e) {
      return e.isHidden ? 0.4 : 1;
    }
  ),
  ee = m.div(
    W ||
      (W = w(
        [
          '\n  margin-left: -22px;\n  margin-right: 10px;\n\n  svg {\n    width: 12px;\n    height: 12px;\n  }\n',
        ],
        [
          '\n  margin-left: -22px;\n  margin-right: 10px;\n\n  svg {\n    width: 12px;\n    height: 12px;\n  }\n',
        ]
      ))
  ),
  ne = m.div(
    X ||
      (X = w(
        [
          '\n  cursor: default;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n',
        ],
        [
          '\n  cursor: default;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n',
        ]
      ))
  ),
  te = function () {
    var e = k(function (e) {
        return { expanded: e.expanded };
      }),
      n = e.id,
      t = e.depth,
      r = e.expanded,
      o = e.children,
      i = e.connectors.layerHeader,
      d = e.actions.toggleLayer,
      c = p(function (e, t) {
        return {
          hidden: e.nodes[n] && e.nodes[n].data.hidden,
          selected: e.events.selected === n,
          topLevel: t.node(n).isTopLevelCanvas(),
        };
      }),
      l = c.hidden,
      s = c.actions,
      u = c.selected,
      f = c.topLevel;
    return a.createElement(
      U,
      {
        selected: u,
        depth: t,
        onClick: function () {
          return d();
        },
      },
      a.createElement(
        $,
        {
          selected: u,
          isHidden: l,
          onClick: function (e) {
            e.stopPropagation(), s.setHidden(n, !l);
          },
        },
        a.createElement(q, null)
      ),
      a.createElement(
        'div',
        { className: 'inner' },
        a.createElement(
          'div',
          { ref: i },
          f ? a.createElement(ee, null, a.createElement(Q, null)) : null,
          a.createElement(
            ne,
            { className: 'layer-name s' },
            a.createElement(_, null)
          ),
          a.createElement(
            'div',
            null,
            o && o.length
              ? a.createElement(Z, { expanded: r }, a.createElement(S, null))
              : null
          )
        )
      )
    );
  },
  re = m.div(
    F ||
      (F = w(
        [
          '\n  background: ',
          ';\n  display: block;\n  padding-bottom: ',
          'px;\n',
        ],
        [
          '\n  background: ',
          ';\n  display: block;\n  padding-bottom: ',
          'px;\n',
        ]
      )),
    function (e) {
      return e.hovered ? '#f1f1f1' : 'transparent';
    },
    function (e) {
      return e.hasCanvases && e.expanded ? 5 : 0;
    }
  ),
  ae = m.div(
    G ||
      (G = w(
        [
          '\n  margin: 0 0 0 ',
          'px;\n  background: ',
          ';\n  position: relative;\n\n  ',
          '\n',
        ],
        [
          '\n  margin: 0 0 0 ',
          'px;\n  background: ',
          ';\n  position: relative;\n\n  ',
          '\n',
        ]
      )),
    function (e) {
      return e.hasCanvases ? 35 : 0;
    },
    function (e) {
      return e.hasCanvases ? 'rgba(255, 255, 255, 0.02)' : 'transparent';
    },
    function (e) {
      return e.hasCanvases
        ? '\n  \n  box-shadow: 0px 0px 44px -1px #00000014;\n  border-radius: 10px;\n  margin-right: 5px;\n  margin-bottom:5px;\n  margin-top:5px; \n  > * { overflow:hidden; }\n    &:before { \n      position:absolute;\n      left:-19px;\n      width: 2px;\n      height:100%;\n      content: " ";\n      background:#00000012;\n    }\n  '
        : '';
    }
  ),
  oe = function (e) {
    var n = e.children,
      t = k(function (e) {
        return { hovered: e.event.hovered, expanded: e.expanded };
      }),
      r = t.id,
      o = t.expanded,
      i = t.hovered,
      d = t.connectors.layer,
      c = p(function (e, n) {
        return { hasChildCanvases: n.node(r).isParentOfTopLevelNodes() };
      }).hasChildCanvases;
    return a.createElement(
      re,
      { ref: d, expanded: o, hasCanvases: c, hovered: i },
      a.createElement(te, null),
      n
        ? a.createElement(
            ae,
            { hasCanvases: c, className: 'craft-layer-children' },
            n
          )
        : null
    );
  },
  ie = function (e) {
    var n = e.children,
      r = t(z, {
        layers: {},
        events: { selected: null, dragged: null, hovered: null },
        options: b({ renderLayer: oe }, e.options),
      });
    return a.createElement(
      C.Provider,
      { value: { store: r } },
      a.createElement(D, null, n)
    );
  },
  de = function (e) {
    var n = E(e, []);
    return a.createElement(
      ie,
      { options: n },
      a.createElement(N, { id: r, depth: 0 })
    );
  };
export { de as Layers, k as useLayer };
