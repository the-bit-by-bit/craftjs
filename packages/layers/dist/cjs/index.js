'use strict';
Object.defineProperty(exports, '__esModule', { value: !0 });
var utils = require('@craftjs/utils'),
  React = require('react'),
  core = require('@craftjs/core'),
  ContentEditable = require('react-contenteditable'),
  styled = require('styled-components');
function _interopDefaultLegacy(e) {
  return e && 'object' == typeof e && 'default' in e ? e : { default: e };
}
var React__default = _interopDefaultLegacy(React),
  ContentEditable__default = _interopDefaultLegacy(ContentEditable),
  styled__default = _interopDefaultLegacy(styled),
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
      for (var t, n = 1, a = arguments.length; n < a; n++)
        for (var r in (t = arguments[n]))
          Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r]);
      return e;
    }).apply(this, arguments);
};
function __rest(e, t) {
  var n = {};
  for (var a in e)
    Object.prototype.hasOwnProperty.call(e, a) &&
      t.indexOf(a) < 0 &&
      (n[a] = e[a]);
  if (null != e && 'function' == typeof Object.getOwnPropertySymbols) {
    var r = 0;
    for (a = Object.getOwnPropertySymbols(e); r < a.length; r++)
      t.indexOf(a[r]) < 0 &&
        Object.prototype.propertyIsEnumerable.call(e, a[r]) &&
        (n[a[r]] = e[a[r]]);
  }
  return n;
}
function __makeTemplateObject(e, t) {
  return (
    Object.defineProperty
      ? Object.defineProperty(e, 'raw', { value: t })
      : (e.raw = t),
    e
  );
}
var LayerContext = React__default.default.createContext({}),
  LayerManagerContext = React.createContext({});
function useLayerManager(e) {
  var t = React.useContext(LayerManagerContext).store;
  return utils.useCollector(t, e);
}
function useLayer(e) {
  var t = React.useContext(LayerContext),
    n = t.id,
    a = t.depth,
    r = t.connectors,
    o = useLayerManager(function (t) {
      return n && t.layers[n] && e && e(t.layers[n]);
    }),
    i = o.actions,
    d = __rest(o, ['actions']),
    l = core.useEditor(function (e, t) {
      return { children: e.nodes[n] && t.node(n).descendants() };
    }).children,
    c = React.useMemo(
      function () {
        return {
          toggleLayer: function () {
            return i.toggleLayer(n);
          },
        };
      },
      [i, n]
    );
  return _assign(
    { id: n, depth: a, children: l, actions: c, connectors: r },
    d
  );
}
var LayerNode = function () {
    var e = useLayer(function (e) {
        return { expanded: e.expanded };
      }),
      t = e.id,
      n = e.depth,
      a = e.children,
      r = e.expanded,
      o = core.useEditor(function (e, n) {
        return {
          data: e.nodes[t] && e.nodes[t].data,
          shouldBeExpanded:
            e.events.selected &&
            n.node(e.events.selected).ancestors(!0).includes(t),
        };
      }),
      i = o.data,
      d = o.shouldBeExpanded,
      l = useLayerManager(function (e) {
        return {
          renderLayer: e.options.renderLayer,
          expandRootOnLoad: e.options.expandRootOnLoad,
        };
      }),
      c = l.actions,
      s = l.renderLayer,
      u = l.expandRootOnLoad,
      f = React.useRef(r);
    f.current = r;
    var p = React.useRef(u && t === core.ROOT_NODE);
    React.useEffect(
      function () {
        !f.current && d && c.toggleLayer(t);
      },
      [c, t, d]
    ),
      React.useEffect(
        function () {
          p.current && c.toggleLayer(t);
        },
        [c, t]
      );
    var v = React.useRef(!1);
    return (
      v.current || (c.registerLayer(t), (v.current = !0)),
      i
        ? React__default.default.createElement(
            'div',
            { className: 'craft-layer-node ' + t },
            React__default.default.createElement(
              s,
              {},
              a && r
                ? a.map(function (e) {
                    return React__default.default.createElement(
                      LayerContextProvider,
                      { key: e, id: e, depth: n + 1 }
                    );
                  })
                : null
            )
          )
        : null
    );
  },
  LayerHandlers = (function (e) {
    function t(t, n, a, r) {
      var o = e.call(this, t, n) || this;
      return (o.id = r), (o.layerStore = a), o;
    }
    return (
      __extends(t, e),
      (t.prototype.getLayer = function (e) {
        return this.layerStore.getState().layers[e];
      }),
      (t.prototype.handlers = function () {
        var e = this,
          n = this.derived.connectors();
        return {
          layer: {
            init: function (t) {
              n.select(t, e.id),
                n.hover(t, e.id),
                n.drag(t, e.id),
                e.layerStore.actions.setDOM(e.id, { dom: t });
            },
            events: [
              core.defineEventListener('mouseover', function (t, n) {
                t.craft.stopPropagation(),
                  e.layerStore.actions.setLayerEvent('hovered', n);
              }),
              core.defineEventListener('dragover', function (n) {
                n.craft.stopPropagation(), n.preventDefault();
                var a = t.events,
                  r = a.indicator,
                  o = a.currentCanvasHovered;
                if (o && r && o.data.nodes) {
                  var i = e.getLayer(o.id).headingDom.getBoundingClientRect();
                  if (n.clientY > i.top + 10 && n.clientY < i.bottom - 10) {
                    var d = o.data.nodes[o.data.nodes.length - 1];
                    if (!d) return;
                    (r.placement.currentNode = e.store.query.node(d).get()),
                      (r.placement.index = o.data.nodes.length),
                      (r.placement.where = 'after'),
                      (r.placement.parent = o),
                      (t.events.indicator = _assign({}, r, { onCanvas: !0 })),
                      e.layerStore.actions.setIndicator(t.events.indicator);
                  }
                }
              }),
              core.defineEventListener('dragenter', function (n) {
                n.craft.stopPropagation(), n.preventDefault();
                var a = t.draggedElement;
                if (a) {
                  var r = e.store.query.getDropPlaceholder(
                    a,
                    e.id,
                    { x: n.clientX, y: n.clientY },
                    function (t) {
                      var n = e.getLayer(t.id);
                      return n && n.dom;
                    }
                  );
                  if (r) {
                    var o = r.placement.parent,
                      i = e.getLayer(o.id).headingDom.getBoundingClientRect();
                    if (
                      ((t.events.currentCanvasHovered = null),
                      e.store.query.node(o.id).isCanvas() && o.data.parent)
                    ) {
                      var d = e.store.query.node(o.data.parent).get();
                      e.store.query.node(d.id).isCanvas() &&
                        ((t.events.currentCanvasHovered = o),
                        ((n.clientY > i.bottom - 10 &&
                          !e.getLayer(o.id).expanded) ||
                          n.clientY < i.top + 10) &&
                          ((r.placement.parent = d),
                          (r.placement.currentNode = o),
                          (r.placement.index = d.data.nodes
                            ? d.data.nodes.indexOf(o.id)
                            : 0),
                          n.clientY > i.bottom - 10 &&
                          !e.getLayer(o.id).expanded
                            ? (r.placement.where = 'after')
                            : n.clientY < i.top + 10 &&
                              (r.placement.where = 'before')));
                    }
                    (t.events.indicator = _assign({}, r, { onCanvas: !1 })),
                      e.layerStore.actions.setIndicator(t.events.indicator);
                  }
                }
              }),
            ],
          },
          layerHeader: {
            init: function (t) {
              e.layerStore.actions.setDOM(e.id, { headingDom: t });
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
              core.defineEventListener('dragstart', function (n) {
                n.craft.stopPropagation(), (t.draggedElement = e.id);
              }),
              core.defineEventListener('dragend', function (n, a) {
                n.craft.stopPropagation();
                var r = t.events;
                if (r.indicator && !r.indicator.error) {
                  var o = r.indicator.placement;
                  e.store.actions.move(
                    t.draggedElement,
                    o.parent.id,
                    o.index + ('after' === o.where ? 1 : 0)
                  );
                }
                (t.draggedElement = null),
                  (t.events.indicator = null),
                  e.layerStore.actions.setIndicator(null);
              }),
            ],
          },
        };
      }),
      (t.events = { indicator: null, currentCanvasHovered: null }),
      t
    );
  })(core.DerivedEventHandlers),
  LayerContextProvider = function (e) {
    var t = e.id,
      n = e.depth,
      a = core.useEventHandler(),
      r = React.useContext(LayerManagerContext).store,
      o = React.useMemo(
        function () {
          return a.derive(LayerHandlers, r, t).connectors();
        },
        [a, t, r]
      );
    return core.useEditor(function (e) {
      return { exists: !!e.nodes[t] };
    }).exists
      ? React__default.default.createElement(
          LayerContext.Provider,
          { value: { id: t, depth: n, connectors: o } },
          React__default.default.createElement(LayerNode, null)
        )
      : null;
  },
  LayerMethods = function (e) {
    return {
      setLayerEvent: function (t, n) {
        if (null === n || e.layers[n]) {
          var a = e.events[t];
          a && n !== a && (e.layers[a].event[t] = !1),
            n
              ? ((e.layers[n].event[t] = !0), (e.events[t] = n))
              : (e.events[t] = null);
        }
      },
      registerLayer: function (t) {
        e.layers[t] ||
          (e.layers[t] = {
            expanded: !1,
            id: t,
            event: { selected: !1, hovered: !1 },
          });
      },
      setDOM: function (t, n) {
        e.layers[t] = _assign(
          {},
          e.layers[t],
          n.dom ? { dom: n.dom } : {},
          n.headingDom ? { headingDom: n.headingDom } : {}
        );
      },
      toggleLayer: function (t) {
        e.layers[t].expanded = !e.layers[t].expanded;
      },
      setIndicator: function (t) {
        e.events.indicator = t;
      },
    };
  },
  EventManager = function (e) {
    var t = e.children,
      n = useLayerManager(function (e) {
        return e;
      }),
      a = n.layers,
      r = n.events,
      o = core
        .useEditor(function (e) {
          return { enabled: e.options.enabled };
        })
        .query.getOptions().indicator,
      i = React.useMemo(
        function () {
          var e = r.indicator;
          if (e) {
            var t = e.placement,
              n = t.where,
              i = t.parent,
              d = t.currentNode,
              l = d ? d.id : i.id,
              c = e.error ? o.error : o.success;
            if (e.onCanvas && null != a[i.id].dom) {
              var s = a[i.id].dom.getBoundingClientRect(),
                u = a[i.id].headingDom.getBoundingClientRect();
              return {
                top: u.top,
                left: s.left,
                width: s.width,
                height: u.height,
                background: 'transparent',
                borderWidth: '1px',
                borderColor: c,
              };
            }
            if (!a[l]) return;
            var f = a[l].headingDom.getBoundingClientRect(),
              p = a[l].dom.getBoundingClientRect();
            return {
              top: 'after' !== n && d ? p.top : p.top + p.height,
              left: f.left,
              width: p.width - f.left,
              height: 2,
              borderWidth: 0,
              background: c,
            };
          }
        },
        [r, o.error, o.success, a]
      );
    return React__default.default.createElement(
      'div',
      null,
      r.indicator
        ? React__default.default.createElement(utils.RenderIndicator, {
            style: i,
          })
        : null,
      t
    );
  };
function _extends$2() {
  return (_extends$2 =
    Object.assign ||
    function (e) {
      for (var t = 1; t < arguments.length; t++) {
        var n = arguments[t];
        for (var a in n)
          Object.prototype.hasOwnProperty.call(n, a) && (e[a] = n[a]);
      }
      return e;
    }).apply(this, arguments);
}
var _ref$2 = React__default.default.createElement('path', {
    d:
      'M9.99 1.01A1 1 0 008.283.303L5 3.586 1.717.303A1 1 0 10.303 1.717l3.99 3.98a1 1 0 001.414 0l3.99-3.98a.997.997 0 00.293-.707z',
  }),
  SvgArrow = function (e) {
    return React__default.default.createElement(
      'svg',
      _extends$2({ viewBox: '0 0 10 6' }, e),
      _ref$2
    );
  },
  EditableLayerName = function () {
    var e = useLayer().id,
      t = core.useEditor(function (t) {
        return {
          displayName:
            (t.nodes[e] && t.nodes[e].data.name) || t.nodes[e].data.displayName,
          hidden: t.nodes[e] && t.nodes[e].data.hidden,
        };
      }),
      n = t.displayName,
      a = t.actions,
      r = React.useState(!1),
      o = r[0],
      i = r[1],
      d = React.useRef(null),
      l = React.useCallback(function (e) {
        d.current && !d.current.contains(e.target) && i(!1);
      }, []);
    return (
      React.useEffect(
        function () {
          return function () {
            window.removeEventListener('click', l);
          };
        },
        [l]
      ),
      React__default.default.createElement(ContentEditable__default.default, {
        html: n,
        disabled: !o,
        ref: function (e) {
          e &&
            ((d.current = e.el.current),
            window.removeEventListener('click', l),
            window.addEventListener('click', l));
        },
        onChange: function (t) {
          a.setCustom(e, function (e) {
            return (e.displayName = t.target.value);
          });
        },
        tagName: 'div',
      })
    );
  };
function _extends$1() {
  return (_extends$1 =
    Object.assign ||
    function (e) {
      for (var t = 1; t < arguments.length; t++) {
        var n = arguments[t];
        for (var a in n)
          Object.prototype.hasOwnProperty.call(n, a) && (e[a] = n[a]);
      }
      return e;
    }).apply(this, arguments);
}
var _ref$1 = React__default.default.createElement('path', {
    fill: 'none',
    d: 'M0 0h24v24H0z',
  }),
  _ref2$1 = React__default.default.createElement('path', {
    d:
      'M1.181 12C2.121 6.88 6.608 3 12 3c5.392 0 9.878 3.88 10.819 9-.94 5.12-5.427 9-10.819 9-5.392 0-9.878-3.88-10.819-9zM12 17a5 5 0 100-10 5 5 0 000 10zm0-2a3 3 0 110-6 3 3 0 010 6z',
  }),
  SvgEye = function (e) {
    return React__default.default.createElement(
      'svg',
      _extends$1({ viewBox: '0 0 24 24', width: 16, height: 16 }, e),
      _ref$1,
      _ref2$1
    );
  };
function _extends() {
  return (_extends =
    Object.assign ||
    function (e) {
      for (var t = 1; t < arguments.length; t++) {
        var n = arguments[t];
        for (var a in n)
          Object.prototype.hasOwnProperty.call(n, a) && (e[a] = n[a]);
      }
      return e;
    }).apply(this, arguments);
}
var templateObject_1$1,
  templateObject_2$1,
  templateObject_3,
  templateObject_4,
  templateObject_5,
  templateObject_1,
  templateObject_2,
  _ref = React__default.default.createElement('path', {
    className: 'linked_svg__a',
    d:
      'M16.5 9h-1a.5.5 0 00-.5.5V15H3V3h5.5a.5.5 0 00.5-.5v-1a.5.5 0 00-.5-.5h-7a.5.5 0 00-.5.5v15a.5.5 0 00.5.5h15a.5.5 0 00.5-.5v-7a.5.5 0 00-.5-.5z',
  }),
  _ref2 = React__default.default.createElement('path', {
    className: 'linked_svg__a',
    d:
      'M16.75 1h-5.373a.4.4 0 00-.377.4.392.392 0 00.117.28l1.893 1.895-3.52 3.521a.5.5 0 000 .707l.706.708a.5.5 0 00.708 0l3.521-3.521 1.893 1.892A.39.39 0 0016.6 7a.4.4 0 00.4-.377V1.25a.25.25 0 00-.25-.25z',
  }),
  SvgLinked = function (e) {
    return React__default.default.createElement(
      'svg',
      _extends({ viewBox: '0 0 18 18' }, e),
      _ref,
      _ref2
    );
  },
  StyledDiv = styled__default.default.div(
    templateObject_1$1 ||
      (templateObject_1$1 = __makeTemplateObject(
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
  Expand = styled__default.default.a(
    templateObject_2$1 ||
      (templateObject_2$1 = __makeTemplateObject(
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
  Hide = styled__default.default.a(
    templateObject_3 ||
      (templateObject_3 = __makeTemplateObject(
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
  TopLevelIndicator = styled__default.default.div(
    templateObject_4 ||
      (templateObject_4 = __makeTemplateObject(
        [
          '\n  margin-left: -22px;\n  margin-right: 10px;\n\n  svg {\n    width: 12px;\n    height: 12px;\n  }\n',
        ],
        [
          '\n  margin-left: -22px;\n  margin-right: 10px;\n\n  svg {\n    width: 12px;\n    height: 12px;\n  }\n',
        ]
      ))
  ),
  Name = styled__default.default.div(
    templateObject_5 ||
      (templateObject_5 = __makeTemplateObject(
        [
          '\n  cursor: default;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n',
        ],
        [
          '\n  cursor: default;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none;\n',
        ]
      ))
  ),
  DefaultLayerHeader = function () {
    var e = useLayer(function (e) {
        return { expanded: e.expanded };
      }),
      t = e.id,
      n = e.depth,
      a = e.expanded,
      r = e.children,
      o = e.connectors.layerHeader,
      i = e.actions.toggleLayer,
      d = core.useEditor(function (e, n) {
        return {
          hidden: e.nodes[t] && e.nodes[t].data.hidden,
          selected: e.events.selected === t,
          topLevel: n.node(t).isTopLevelCanvas(),
        };
      }),
      l = d.hidden,
      c = d.actions,
      s = d.selected,
      u = d.topLevel;
    return React__default.default.createElement(
      StyledDiv,
      {
        selected: s,
        depth: n,
        onClick: function () {
          return i();
        },
      },
      React__default.default.createElement(
        Hide,
        {
          selected: s,
          isHidden: l,
          onClick: function (e) {
            e.stopPropagation(), c.setHidden(t, !l);
          },
        },
        React__default.default.createElement(SvgEye, null)
      ),
      React__default.default.createElement(
        'div',
        { className: 'inner' },
        React__default.default.createElement(
          'div',
          { ref: o },
          u
            ? React__default.default.createElement(
                TopLevelIndicator,
                null,
                React__default.default.createElement(SvgLinked, null)
              )
            : null,
          React__default.default.createElement(
            Name,
            { className: 'layer-name s' },
            React__default.default.createElement(EditableLayerName, null)
          ),
          React__default.default.createElement(
            'div',
            null,
            r && r.length
              ? React__default.default.createElement(
                  Expand,
                  { expanded: a },
                  React__default.default.createElement(SvgArrow, null)
                )
              : null
          )
        )
      )
    );
  },
  LayerNodeDiv = styled__default.default.div(
    templateObject_1 ||
      (templateObject_1 = __makeTemplateObject(
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
  LayerChildren = styled__default.default.div(
    templateObject_2 ||
      (templateObject_2 = __makeTemplateObject(
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
  DefaultLayer = function (e) {
    var t = e.children,
      n = useLayer(function (e) {
        return { hovered: e.event.hovered, expanded: e.expanded };
      }),
      a = n.id,
      r = n.expanded,
      o = n.hovered,
      i = n.connectors.layer,
      d = core.useEditor(function (e, t) {
        return { hasChildCanvases: t.node(a).isParentOfTopLevelNodes() };
      }).hasChildCanvases;
    return React__default.default.createElement(
      LayerNodeDiv,
      { ref: i, expanded: r, hasCanvases: d, hovered: o },
      React__default.default.createElement(DefaultLayerHeader, null),
      t
        ? React__default.default.createElement(
            LayerChildren,
            { hasCanvases: d, className: 'craft-layer-children' },
            t
          )
        : null
    );
  },
  LayerManagerProvider = function (e) {
    var t = e.children,
      n = utils.useMethods(LayerMethods, {
        layers: {},
        events: { selected: null, dragged: null, hovered: null },
        options: _assign({ renderLayer: DefaultLayer }, e.options),
      });
    return React__default.default.createElement(
      LayerManagerContext.Provider,
      { value: { store: n } },
      React__default.default.createElement(EventManager, null, t)
    );
  },
  Layers = function (e) {
    var t = __rest(e, []);
    return React__default.default.createElement(
      LayerManagerProvider,
      { options: t },
      React__default.default.createElement(LayerContextProvider, {
        id: utils.ROOT_NODE,
        depth: 0,
      })
    );
  };
(exports.Layers = Layers), (exports.useLayer = useLayer);
