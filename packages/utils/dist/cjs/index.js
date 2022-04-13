'use strict';
Object.defineProperty(exports, '__esModule', { value: !0 });
var produce = require('immer'),
  isEqualWith = require('lodash/isEqualWith'),
  React = require('react'),
  invariant = require('tiny-invariant'),
  ReactDOM = require('react-dom');
function _interopDefaultLegacy(e) {
  return e && 'object' == typeof e && 'default' in e ? e : { default: e };
}
var produce__default = _interopDefaultLegacy(produce),
  isEqualWith__default = _interopDefaultLegacy(isEqualWith),
  React__default = _interopDefaultLegacy(React),
  invariant__default = _interopDefaultLegacy(invariant),
  ReactDOM__default = _interopDefaultLegacy(ReactDOM),
  ROOT_NODE = 'ROOT',
  DEPRECATED_ROOT_NODE = 'canvas-ROOT',
  ERROR_NOPARENT = 'Parent id cannot be ommited',
  ERROR_DUPLICATE_NODEID = 'Attempting to add a node with duplicated id',
  ERROR_INVALID_NODEID = 'Node does not exist, it may have been removed',
  ERROR_TOP_LEVEL_ELEMENT_NO_ID =
    'A <Element /> that is used inside a User Component must specify an `id` prop, eg: <Element id="text_element">...</Element> ',
  ERROR_MISSING_PLACEHOLDER_PLACEMENT =
    'Placeholder required placement info (parent, index, or where) is missing',
  ERROR_MOVE_CANNOT_DROP = 'Node cannot be dropped into target parent',
  ERROR_MOVE_INCOMING_PARENT = 'Target parent rejects incoming node',
  ERROR_MOVE_OUTGOING_PARENT = 'Current parent rejects outgoing node',
  ERROR_MOVE_NONCANVAS_CHILD =
    'Cannot move node that is not a direct child of a Canvas node',
  ERROR_MOVE_TO_NONCANVAS_PARENT = 'Cannot move node into a non-Canvas parent',
  ERROR_MOVE_TOP_LEVEL_NODE = 'A top-level Node cannot be moved',
  ERROR_MOVE_ROOT_NODE = 'Root Node cannot be moved',
  ERROR_MOVE_TO_DESCENDANT = 'Cannot move node into a descendant',
  ERROR_NOT_IN_RESOLVER =
    'The component type specified for this node does not exist in the resolver',
  ERROR_INFINITE_CANVAS =
    "The component specified in the <Canvas> `is` prop has additional Canvas specified in it's render template.",
  ERROR_CANNOT_DRAG =
    'The node has specified a canDrag() rule that prevents it from being dragged',
  ERROR_INVALID_NODE_ID = 'Invalid parameter Node Id specified',
  ERROR_DELETE_TOP_LEVEL_NODE = 'Attempting to delete a top-level Node',
  ERROR_RESOLVER_NOT_AN_OBJECT =
    'Resolver in <Editor /> has to be an object. For (de)serialization Craft.js needs a list of all the User Components. \n    \nMore info: https://craft.js.org/r/docs/api/editor#props',
  ERROR_DESERIALIZE_COMPONENT_NOT_IN_RESOLVER =
    'An Error occurred while deserializing components: Cannot find component <%displayName% /> in resolver map. Please check your resolver in <Editor />\n\nAvailable components in resolver: %availableComponents%\n\nMore info: https://craft.js.org/r/docs/api/editor#props',
  _assign = function () {
    return (_assign =
      Object.assign ||
      function (e) {
        for (var t, n = 1, r = arguments.length; n < r; n++)
          for (var o in (t = arguments[n]))
            Object.prototype.hasOwnProperty.call(t, o) && (e[o] = t[o]);
        return e;
      }).apply(this, arguments);
  },
  HISTORY_ACTIONS = {
    UNDO: 'HISTORY_UNDO',
    REDO: 'HISTORY_REDO',
    THROTTLE: 'HISTORY_THROTTLE',
    IGNORE: 'HISTORY_IGNORE',
  },
  History = (function () {
    function e() {
      (this.timeline = []), (this.pointer = -1);
    }
    return (
      (e.prototype.add = function (e, t) {
        (0 === e.length && 0 === t.length) ||
          ((this.pointer = this.pointer + 1),
          (this.timeline.length = this.pointer),
          (this.timeline[this.pointer] = {
            patches: e,
            inversePatches: t,
            timestamp: Date.now(),
          }));
      }),
      (e.prototype.throttleAdd = function (e, t, n) {
        if ((void 0 === n && (n = 500), 0 !== e.length || 0 !== t.length)) {
          if (this.timeline.length && this.pointer >= 0) {
            var r = this.timeline[this.pointer],
              o = r.patches,
              i = r.inversePatches,
              a = r.timestamp;
            if (new Date().getTime() - a < n)
              return void (this.timeline[this.pointer] = {
                timestamp: a,
                patches: o.concat(e),
                inversePatches: t.concat(i),
              });
          }
          this.add(e, t);
        }
      }),
      (e.prototype.canUndo = function () {
        return this.pointer >= 0;
      }),
      (e.prototype.canRedo = function () {
        return this.pointer < this.timeline.length - 1;
      }),
      (e.prototype.undo = function (e) {
        if (this.canUndo()) {
          var t = this.timeline[this.pointer].inversePatches;
          return (this.pointer = this.pointer - 1), produce.applyPatches(e, t);
        }
      }),
      (e.prototype.redo = function (e) {
        if (this.canRedo())
          return (
            (this.pointer = this.pointer + 1),
            produce.applyPatches(e, this.timeline[this.pointer].patches)
          );
      }),
      e
    );
  })();
function useMethods(e, t, n, r) {
  var o,
    i = React.useMemo(function () {
      return new History();
    }, []),
    a = React.useRef([]),
    c = React.useRef();
  'function' == typeof e
    ? (o = e)
    : ((o = e.methods),
      (a.current = e.ignoreHistoryForActions),
      (c.current = e.normalizeHistory));
  var s = React.useRef(r);
  s.current = r;
  var R = React.useMemo(
      function () {
        var e = c.current,
          t = a.current,
          r = s.current;
        return [
          function (a, c) {
            var s,
              R =
                n &&
                createQuery(
                  n,
                  function () {
                    return a;
                  },
                  i
                ),
              u = produce.produceWithPatches(a, function (e) {
                var t, n;
                switch (c.type) {
                  case HISTORY_ACTIONS.UNDO:
                    return i.undo(e);
                  case HISTORY_ACTIONS.REDO:
                    return i.redo(e);
                  case HISTORY_ACTIONS.IGNORE:
                  case HISTORY_ACTIONS.THROTTLE:
                    var r = c.payload,
                      a = r[0],
                      s = r.slice(1);
                    (t = o(e, R))[a].apply(t, s);
                    break;
                  default:
                    (n = o(e, R))[c.type].apply(n, c.payload);
                }
              }),
              O = u[0],
              E = u[1],
              _ = u[2];
            return (
              (s = O),
              r &&
                r(
                  O,
                  a,
                  { type: c.type, params: c.payload, patches: E },
                  R,
                  function (e) {
                    var t = produce.produceWithPatches(O, e);
                    (s = t[0]), (E = E.concat(t[1])), (_ = t[2].concat(_));
                  }
                ),
              [HISTORY_ACTIONS.UNDO, HISTORY_ACTIONS.REDO].includes(c.type) &&
                e &&
                (s = produce__default.default(s, e)),
              t
                .concat([
                  HISTORY_ACTIONS.UNDO,
                  HISTORY_ACTIONS.REDO,
                  HISTORY_ACTIONS.IGNORE,
                ])
                .includes(c.type) ||
                (c.type === HISTORY_ACTIONS.THROTTLE
                  ? i.throttleAdd(E, _, c.config && c.config.rate)
                  : i.add(E, _)),
              s
            );
          },
          o,
        ];
      },
      [i, o, n]
    ),
    u = R[1],
    O = React.useReducer(R[0], t),
    E = O[0],
    _ = O[1],
    p = React.useRef();
  p.current = E;
  var d = React.useMemo(
      function () {
        return n
          ? createQuery(
              n,
              function () {
                return p.current;
              },
              i
            )
          : [];
      },
      [i, n]
    ),
    l = React.useMemo(
      function () {
        var e = Object.keys(u(null, null)),
          t = a.current;
        return _assign(
          {},
          e.reduce(function (e, t) {
            return (
              (e[t] = function () {
                for (var e = [], n = 0; n < arguments.length; n++)
                  e[n] = arguments[n];
                return _({ type: t, payload: e });
              }),
              e
            );
          }, {}),
          {
            history: {
              undo: function () {
                return _({ type: HISTORY_ACTIONS.UNDO });
              },
              redo: function () {
                return _({ type: HISTORY_ACTIONS.REDO });
              },
              throttle: function (n) {
                return _assign(
                  {},
                  e
                    .filter(function (e) {
                      return !t.includes(e);
                    })
                    .reduce(function (e, t) {
                      return (
                        (e[t] = function () {
                          for (var e = [], r = 0; r < arguments.length; r++)
                            e[r] = arguments[r];
                          return _({
                            type: HISTORY_ACTIONS.THROTTLE,
                            payload: [t].concat(e),
                            config: { rate: n },
                          });
                        }),
                        e
                      );
                    }, {})
                );
              },
              ignore: function () {
                return _assign(
                  {},
                  e
                    .filter(function (e) {
                      return !t.includes(e);
                    })
                    .reduce(function (e, t) {
                      return (
                        (e[t] = function () {
                          for (var e = [], n = 0; n < arguments.length; n++)
                            e[n] = arguments[n];
                          return _({
                            type: HISTORY_ACTIONS.IGNORE,
                            payload: [t].concat(e),
                          });
                        }),
                        e
                      );
                    }, {})
                );
              },
            },
          }
        );
      },
      [u]
    ),
    f = React.useCallback(function () {
      return p.current;
    }, []),
    N = React.useMemo(
      function () {
        return new Watcher(f);
      },
      [f]
    );
  return (
    React.useEffect(
      function () {
        (p.current = E), N.notify();
      },
      [E, N]
    ),
    React.useMemo(
      function () {
        return {
          getState: f,
          subscribe: function (e, t, n) {
            return N.subscribe(e, t, n);
          },
          actions: l,
          query: d,
          history: i,
        };
      },
      [l, d, N, f, i]
    )
  );
}
function createQuery(e, t, n) {
  var r = Object.keys(e()).reduce(function (n, r) {
    var o;
    return _assign(
      {},
      n,
      (((o = {})[r] = function () {
        for (var n, o = [], i = 0; i < arguments.length; i++)
          o[i] = arguments[i];
        return (n = e(t()))[r].apply(n, o);
      }),
      o)
    );
  }, {});
  return _assign({}, r, {
    history: {
      canUndo: function () {
        return n.canUndo();
      },
      canRedo: function () {
        return n.canRedo();
      },
    },
  });
}
var Watcher = (function () {
    function e(e) {
      (this.subscribers = []), (this.getState = e);
    }
    return (
      (e.prototype.subscribe = function (e, t, n) {
        var r = this,
          o = new Subscriber(
            function () {
              return e(r.getState());
            },
            t,
            n
          );
        return this.subscribers.push(o), this.unsubscribe.bind(this, o);
      }),
      (e.prototype.unsubscribe = function (e) {
        if (this.subscribers.length) {
          var t = this.subscribers.indexOf(e);
          if (t > -1) return this.subscribers.splice(t, 1);
        }
      }),
      (e.prototype.notify = function () {
        this.subscribers.forEach(function (e) {
          return e.collect();
        });
      }),
      e
    );
  })(),
  Subscriber = (function () {
    function e(e, t, n) {
      void 0 === n && (n = !1),
        (this.collector = e),
        (this.onChange = t),
        n && this.collect();
    }
    return (
      (e.prototype.collect = function () {
        try {
          var e = this.collector();
          isEqualWith__default.default(e, this.collected) ||
            ((this.collected = e),
            this.onChange && this.onChange(this.collected));
        } catch (e) {
          console.warn(e);
        }
      }),
      e
    );
  })(),
  getComputedStyle = function (e) {
    return window.getComputedStyle(e);
  },
  getDOMPadding = function (e) {
    return {
      left: parseInt(getComputedStyle(e).paddingLeft),
      right: parseInt(getComputedStyle(e).paddingRight),
      bottom: parseInt(getComputedStyle(e).paddingTop),
      top: parseInt(getComputedStyle(e).paddingBottom),
    };
  },
  getDOMMargin = function (e) {
    return {
      left: parseInt(getComputedStyle(e).marginLeft),
      right: parseInt(getComputedStyle(e).marginRight),
      bottom: parseInt(getComputedStyle(e).marginTop),
      top: parseInt(getComputedStyle(e).marginBottom),
    };
  },
  getDOMInfo = function (e) {
    var t = e.getBoundingClientRect(),
      n = t.x,
      r = t.y,
      o = t.top,
      i = t.left,
      a = t.bottom,
      c = t.right,
      s = t.width,
      R = t.height,
      u = getDOMMargin(e),
      O = getDOMPadding(e);
    return {
      x: Math.round(n),
      y: Math.round(r),
      top: Math.round(o),
      left: Math.round(i),
      bottom: Math.round(a),
      right: Math.round(c),
      width: Math.round(s),
      height: Math.round(R),
      outerWidth: Math.round(s + u.left + u.right),
      outerHeight: Math.round(R + u.top + u.bottom),
      margin: u,
      padding: O,
      inFlow: e && e.parentElement && !!styleInFlow(e, e.parentElement),
    };
  },
  styleInFlow = function (e, t) {
    var n = getComputedStyle(e),
      r = getComputedStyle(t);
    if (
      !(
        (n.overflow && 'visible' !== n.overflow) ||
        'none' !== r.float ||
        (t && 'flex' === r.display && 'column' !== r['flex-direction'])
      )
    ) {
      switch (n.position) {
        case 'static':
        case 'relative':
          break;
        default:
          return;
      }
      switch (e.tagName) {
        case 'TR':
        case 'TBODY':
        case 'THEAD':
        case 'TFOOT':
          return !0;
      }
      switch (n.display) {
        case 'block':
        case 'list-item':
        case 'table':
        case 'flex':
        case 'grid':
          return !0;
      }
    }
  };
function useCollector(e, t) {
  var n = e.subscribe,
    r = e.getState,
    o = e.actions,
    i = e.query,
    a = React.useRef(!0),
    c = React.useRef(null),
    s = React.useRef(t);
  s.current = t;
  var R = React.useCallback(
    function (e) {
      return _assign({}, e, { actions: o, query: i });
    },
    [o, i]
  );
  a.current && t && ((c.current = t(r(), i)), (a.current = !1));
  var u = React.useState(R(c.current)),
    O = u[0],
    E = u[1];
  return (
    React.useEffect(
      function () {
        var e;
        return (
          s.current &&
            (e = n(
              function (e) {
                return s.current(e, i);
              },
              function (e) {
                E(R(e));
              }
            )),
          function () {
            e && e();
          }
        );
      },
      [R, i, n]
    ),
    O
  );
}
function setRef(e, t) {
  t && ('function' == typeof e ? e(t) : (e.current = t));
}
function cloneWithRef(e, t) {
  var n = e.ref;
  return (
    invariant__default.default(
      'string' != typeof n,
      'Cannot connect to an element with an existing string ref. Please convert it to use a callback ref instead, or wrap it into a <span> or <div>. Read more: https://facebook.github.io/react/docs/more-about-refs.html#the-ref-callback-attribute'
    ),
    React.cloneElement(
      e,
      n
        ? {
            ref: function (e) {
              setRef(n, e), setRef(t, e);
            },
          }
        : { ref: t }
    )
  );
}
function throwIfCompositeComponentElement(e) {
  if ('string' != typeof e.type) throw new Error();
}
function wrapHookToRecognizeElement(e) {
  return function (t, n) {
    if ((void 0 === t && (t = null), !React.isValidElement(t))) {
      var r = t;
      return r && e(r, n), r;
    }
    var o = t;
    return throwIfCompositeComponentElement(o), cloneWithRef(o, e);
  };
}
var RenderIndicator = function (e) {
    var t = e.parentDom,
      n = React__default.default.createElement('div', {
        style: _assign(
          {
            position: 'fixed',
            display: 'block',
            opacity: 1,
            borderStyle: 'solid',
            borderWidth: '1px',
            borderColor: 'transparent',
            zIndex: 99999,
          },
          e.style
        ),
      });
    return t && t.ownerDocument !== document
      ? ReactDOM__default.default.createPortal(n, t.ownerDocument.body)
      : n;
  },
  useEffectOnce = function (e) {
    React.useEffect(e, []);
  },
  deprecationWarning = function (e, t) {
    var n =
        'Deprecation warning: ' + e + ' will be deprecated in future relases.',
      r = t.suggest,
      o = t.doc;
    r && (n += ' Please use ' + r + ' instead.'),
      o && (n += '(' + o + ')'),
      console.warn(n);
  };
(exports.DEPRECATED_ROOT_NODE = DEPRECATED_ROOT_NODE),
  (exports.ERROR_CANNOT_DRAG = ERROR_CANNOT_DRAG),
  (exports.ERROR_DELETE_TOP_LEVEL_NODE = ERROR_DELETE_TOP_LEVEL_NODE),
  (exports.ERROR_DESERIALIZE_COMPONENT_NOT_IN_RESOLVER = ERROR_DESERIALIZE_COMPONENT_NOT_IN_RESOLVER),
  (exports.ERROR_DUPLICATE_NODEID = ERROR_DUPLICATE_NODEID),
  (exports.ERROR_INFINITE_CANVAS = ERROR_INFINITE_CANVAS),
  (exports.ERROR_INVALID_NODEID = ERROR_INVALID_NODEID),
  (exports.ERROR_INVALID_NODE_ID = ERROR_INVALID_NODE_ID),
  (exports.ERROR_MISSING_PLACEHOLDER_PLACEMENT = ERROR_MISSING_PLACEHOLDER_PLACEMENT),
  (exports.ERROR_MOVE_CANNOT_DROP = ERROR_MOVE_CANNOT_DROP),
  (exports.ERROR_MOVE_INCOMING_PARENT = ERROR_MOVE_INCOMING_PARENT),
  (exports.ERROR_MOVE_NONCANVAS_CHILD = ERROR_MOVE_NONCANVAS_CHILD),
  (exports.ERROR_MOVE_OUTGOING_PARENT = ERROR_MOVE_OUTGOING_PARENT),
  (exports.ERROR_MOVE_ROOT_NODE = ERROR_MOVE_ROOT_NODE),
  (exports.ERROR_MOVE_TOP_LEVEL_NODE = ERROR_MOVE_TOP_LEVEL_NODE),
  (exports.ERROR_MOVE_TO_DESCENDANT = ERROR_MOVE_TO_DESCENDANT),
  (exports.ERROR_MOVE_TO_NONCANVAS_PARENT = ERROR_MOVE_TO_NONCANVAS_PARENT),
  (exports.ERROR_NOPARENT = ERROR_NOPARENT),
  (exports.ERROR_NOT_IN_RESOLVER = ERROR_NOT_IN_RESOLVER),
  (exports.ERROR_RESOLVER_NOT_AN_OBJECT = ERROR_RESOLVER_NOT_AN_OBJECT),
  (exports.ERROR_TOP_LEVEL_ELEMENT_NO_ID = ERROR_TOP_LEVEL_ELEMENT_NO_ID),
  (exports.HISTORY_ACTIONS = HISTORY_ACTIONS),
  (exports.History = History),
  (exports.ROOT_NODE = ROOT_NODE),
  (exports.RenderIndicator = RenderIndicator),
  (exports.cloneWithRef = cloneWithRef),
  (exports.createQuery = createQuery),
  (exports.deprecationWarning = deprecationWarning),
  (exports.getComputedStyle = getComputedStyle),
  (exports.getDOMInfo = getDOMInfo),
  (exports.getDOMMargin = getDOMMargin),
  (exports.getDOMPadding = getDOMPadding),
  (exports.styleInFlow = styleInFlow),
  (exports.useCollector = useCollector),
  (exports.useEffectOnce = useEffectOnce),
  (exports.useMethods = useMethods),
  (exports.wrapHookToRecognizeElement = wrapHookToRecognizeElement);
