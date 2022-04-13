import t, { applyPatches as e, produceWithPatches as n } from 'immer';
import r from 'lodash/isEqualWith';
import o, {
  useMemo as i,
  useRef as a,
  useReducer as c,
  useCallback as s,
  useEffect as u,
  useState as p,
  cloneElement as d,
  isValidElement as l,
} from 'react';
import f from 'tiny-invariant';
import h from 'react-dom';
var m = 'ROOT',
  g = 'canvas-ROOT',
  v = 'Parent id cannot be ommited',
  y = 'Attempting to add a node with duplicated id',
  b = 'Node does not exist, it may have been removed',
  O =
    'A <Element /> that is used inside a User Component must specify an `id` prop, eg: <Element id="text_element">...</Element> ',
  R =
    'Placeholder required placement info (parent, index, or where) is missing',
  T = 'Node cannot be dropped into target parent',
  w = 'Target parent rejects incoming node',
  E = 'Current parent rejects outgoing node',
  D = 'Cannot move node that is not a direct child of a Canvas node',
  C = 'Cannot move node into a non-Canvas parent',
  I = 'A top-level Node cannot be moved',
  N = 'Root Node cannot be moved',
  x = 'Cannot move node into a descendant',
  H =
    'The component type specified for this node does not exist in the resolver',
  M =
    "The component specified in the <Canvas> `is` prop has additional Canvas specified in it's render template.",
  U =
    'The node has specified a canDrag() rule that prevents it from being dragged',
  P = 'Invalid parameter Node Id specified',
  j = 'Attempting to delete a top-level Node',
  k =
    'Resolver in <Editor /> has to be an object. For (de)serialization Craft.js needs a list of all the User Components. \n    \nMore info: https://craft.js.org/r/docs/api/editor#props',
  A =
    'An Error occurred while deserializing components: Cannot find component <%displayName% /> in resolver map. Please check your resolver in <Editor />\n\nAvailable components in resolver: %availableComponents%\n\nMore info: https://craft.js.org/r/docs/api/editor#props',
  S = function () {
    return (S =
      Object.assign ||
      function (t) {
        for (var e, n = 1, r = arguments.length; n < r; n++)
          for (var o in (e = arguments[n]))
            Object.prototype.hasOwnProperty.call(e, o) && (t[o] = e[o]);
        return t;
      }).apply(this, arguments);
  },
  L = {
    UNDO: 'HISTORY_UNDO',
    REDO: 'HISTORY_REDO',
    THROTTLE: 'HISTORY_THROTTLE',
    IGNORE: 'HISTORY_IGNORE',
  },
  q = (function () {
    function t() {
      (this.timeline = []), (this.pointer = -1);
    }
    return (
      (t.prototype.add = function (t, e) {
        (0 === t.length && 0 === e.length) ||
          ((this.pointer = this.pointer + 1),
          (this.timeline.length = this.pointer),
          (this.timeline[this.pointer] = {
            patches: t,
            inversePatches: e,
            timestamp: Date.now(),
          }));
      }),
      (t.prototype.throttleAdd = function (t, e, n) {
        if ((void 0 === n && (n = 500), 0 !== t.length || 0 !== e.length)) {
          if (this.timeline.length && this.pointer >= 0) {
            var r = this.timeline[this.pointer],
              o = r.patches,
              i = r.inversePatches,
              a = r.timestamp;
            if (new Date().getTime() - a < n)
              return void (this.timeline[this.pointer] = {
                timestamp: a,
                patches: o.concat(t),
                inversePatches: e.concat(i),
              });
          }
          this.add(t, e);
        }
      }),
      (t.prototype.canUndo = function () {
        return this.pointer >= 0;
      }),
      (t.prototype.canRedo = function () {
        return this.pointer < this.timeline.length - 1;
      }),
      (t.prototype.undo = function (t) {
        if (this.canUndo()) {
          var n = this.timeline[this.pointer].inversePatches;
          return (this.pointer = this.pointer - 1), e(t, n);
        }
      }),
      (t.prototype.redo = function (t) {
        if (this.canRedo())
          return (
            (this.pointer = this.pointer + 1),
            e(t, this.timeline[this.pointer].patches)
          );
      }),
      t
    );
  })();
function G(e, r, o, p) {
  var d,
    l = i(function () {
      return new q();
    }, []),
    f = a([]),
    h = a();
  'function' == typeof e
    ? (d = e)
    : ((d = e.methods),
      (f.current = e.ignoreHistoryForActions),
      (h.current = e.normalizeHistory));
  var m = a(p);
  m.current = p;
  var g = i(
      function () {
        var e = h.current,
          r = f.current,
          i = m.current;
        return [
          function (a, c) {
            var s,
              u =
                o &&
                Y(
                  o,
                  function () {
                    return a;
                  },
                  l
                ),
              p = n(a, function (t) {
                var e, n;
                switch (c.type) {
                  case L.UNDO:
                    return l.undo(t);
                  case L.REDO:
                    return l.redo(t);
                  case L.IGNORE:
                  case L.THROTTLE:
                    var r = c.payload,
                      o = r[0],
                      i = r.slice(1);
                    (e = d(t, u))[o].apply(e, i);
                    break;
                  default:
                    (n = d(t, u))[c.type].apply(n, c.payload);
                }
              }),
              f = p[0],
              h = p[1],
              m = p[2];
            return (
              (s = f),
              i &&
                i(
                  f,
                  a,
                  { type: c.type, params: c.payload, patches: h },
                  u,
                  function (t) {
                    var e = n(f, t);
                    (s = e[0]), (h = h.concat(e[1])), (m = e[2].concat(m));
                  }
                ),
              [L.UNDO, L.REDO].includes(c.type) && e && (s = t(s, e)),
              r.concat([L.UNDO, L.REDO, L.IGNORE]).includes(c.type) ||
                (c.type === L.THROTTLE
                  ? l.throttleAdd(h, m, c.config && c.config.rate)
                  : l.add(h, m)),
              s
            );
          },
          d,
        ];
      },
      [l, d, o]
    ),
    v = g[1],
    y = c(g[0], r),
    b = y[0],
    O = y[1],
    R = a();
  R.current = b;
  var T = i(
      function () {
        return o
          ? Y(
              o,
              function () {
                return R.current;
              },
              l
            )
          : [];
      },
      [l, o]
    ),
    w = i(
      function () {
        var t = Object.keys(v(null, null)),
          e = f.current;
        return S(
          {},
          t.reduce(function (t, e) {
            return (
              (t[e] = function () {
                for (var t = [], n = 0; n < arguments.length; n++)
                  t[n] = arguments[n];
                return O({ type: e, payload: t });
              }),
              t
            );
          }, {}),
          {
            history: {
              undo: function () {
                return O({ type: L.UNDO });
              },
              redo: function () {
                return O({ type: L.REDO });
              },
              throttle: function (n) {
                return S(
                  {},
                  t
                    .filter(function (t) {
                      return !e.includes(t);
                    })
                    .reduce(function (t, e) {
                      return (
                        (t[e] = function () {
                          for (var t = [], r = 0; r < arguments.length; r++)
                            t[r] = arguments[r];
                          return O({
                            type: L.THROTTLE,
                            payload: [e].concat(t),
                            config: { rate: n },
                          });
                        }),
                        t
                      );
                    }, {})
                );
              },
              ignore: function () {
                return S(
                  {},
                  t
                    .filter(function (t) {
                      return !e.includes(t);
                    })
                    .reduce(function (t, e) {
                      return (
                        (t[e] = function () {
                          for (var t = [], n = 0; n < arguments.length; n++)
                            t[n] = arguments[n];
                          return O({ type: L.IGNORE, payload: [e].concat(t) });
                        }),
                        t
                      );
                    }, {})
                );
              },
            },
          }
        );
      },
      [v]
    ),
    E = s(function () {
      return R.current;
    }, []),
    D = i(
      function () {
        return new _(E);
      },
      [E]
    );
  return (
    u(
      function () {
        (R.current = b), D.notify();
      },
      [b, D]
    ),
    i(
      function () {
        return {
          getState: E,
          subscribe: function (t, e, n) {
            return D.subscribe(t, e, n);
          },
          actions: w,
          query: T,
          history: l,
        };
      },
      [w, T, D, E, l]
    )
  );
}
function Y(t, e, n) {
  var r = Object.keys(t()).reduce(function (n, r) {
    var o;
    return S(
      {},
      n,
      (((o = {})[r] = function () {
        for (var n, o = [], i = 0; i < arguments.length; i++)
          o[i] = arguments[i];
        return (n = t(e()))[r].apply(n, o);
      }),
      o)
    );
  }, {});
  return S({}, r, {
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
var _ = (function () {
    function t(t) {
      (this.subscribers = []), (this.getState = t);
    }
    return (
      (t.prototype.subscribe = function (t, e, n) {
        var r = this,
          o = new z(
            function () {
              return t(r.getState());
            },
            e,
            n
          );
        return this.subscribers.push(o), this.unsubscribe.bind(this, o);
      }),
      (t.prototype.unsubscribe = function (t) {
        if (this.subscribers.length) {
          var e = this.subscribers.indexOf(t);
          if (e > -1) return this.subscribers.splice(e, 1);
        }
      }),
      (t.prototype.notify = function () {
        this.subscribers.forEach(function (t) {
          return t.collect();
        });
      }),
      t
    );
  })(),
  z = (function () {
    function t(t, e, n) {
      void 0 === n && (n = !1),
        (this.collector = t),
        (this.onChange = e),
        n && this.collect();
    }
    return (
      (t.prototype.collect = function () {
        try {
          var t = this.collector();
          r(t, this.collected) ||
            ((this.collected = t),
            this.onChange && this.onChange(this.collected));
        } catch (t) {
          console.warn(t);
        }
      }),
      t
    );
  })(),
  B = function (t) {
    return window.getComputedStyle(t);
  },
  F = function (t) {
    return {
      left: parseInt(B(t).paddingLeft),
      right: parseInt(B(t).paddingRight),
      bottom: parseInt(B(t).paddingTop),
      top: parseInt(B(t).paddingBottom),
    };
  },
  W = function (t) {
    return {
      left: parseInt(B(t).marginLeft),
      right: parseInt(B(t).marginRight),
      bottom: parseInt(B(t).marginTop),
      top: parseInt(B(t).marginBottom),
    };
  },
  J = function (t) {
    var e = t.getBoundingClientRect(),
      n = e.x,
      r = e.y,
      o = e.top,
      i = e.left,
      a = e.bottom,
      c = e.right,
      s = e.width,
      u = e.height,
      p = W(t),
      d = F(t);
    return {
      x: Math.round(n),
      y: Math.round(r),
      top: Math.round(o),
      left: Math.round(i),
      bottom: Math.round(a),
      right: Math.round(c),
      width: Math.round(s),
      height: Math.round(u),
      outerWidth: Math.round(s + p.left + p.right),
      outerHeight: Math.round(u + p.top + p.bottom),
      margin: p,
      padding: d,
      inFlow: t && t.parentElement && !!K(t, t.parentElement),
    };
  },
  K = function (t, e) {
    var n = B(t),
      r = B(e);
    if (
      !(
        (n.overflow && 'visible' !== n.overflow) ||
        'none' !== r.float ||
        (e && 'flex' === r.display && 'column' !== r['flex-direction'])
      )
    ) {
      switch (n.position) {
        case 'static':
        case 'relative':
          break;
        default:
          return;
      }
      switch (t.tagName) {
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
function Q(t, e) {
  var n = t.subscribe,
    r = t.getState,
    o = t.actions,
    i = t.query,
    c = a(!0),
    d = a(null),
    l = a(e);
  l.current = e;
  var f = s(
    function (t) {
      return S({}, t, { actions: o, query: i });
    },
    [o, i]
  );
  c.current && e && ((d.current = e(r(), i)), (c.current = !1));
  var h = p(f(d.current)),
    m = h[0],
    g = h[1];
  return (
    u(
      function () {
        var t;
        return (
          l.current &&
            (t = n(
              function (t) {
                return l.current(t, i);
              },
              function (t) {
                g(f(t));
              }
            )),
          function () {
            t && t();
          }
        );
      },
      [f, i, n]
    ),
    m
  );
}
function V(t, e) {
  e && ('function' == typeof t ? t(e) : (t.current = e));
}
function X(t, e) {
  var n = t.ref;
  return (
    f(
      'string' != typeof n,
      'Cannot connect to an element with an existing string ref. Please convert it to use a callback ref instead, or wrap it into a <span> or <div>. Read more: https://facebook.github.io/react/docs/more-about-refs.html#the-ref-callback-attribute'
    ),
    d(
      t,
      n
        ? {
            ref: function (t) {
              V(n, t), V(e, t);
            },
          }
        : { ref: e }
    )
  );
}
function Z(t) {
  return function (e, n) {
    if ((void 0 === e && (e = null), !l(e))) {
      var r = e;
      return r && t(r, n), r;
    }
    var o = e;
    return (
      (function (t) {
        if ('string' != typeof t.type) throw new Error();
      })(o),
      X(o, t)
    );
  };
}
var $ = function (t) {
    var e = t.parentDom,
      n = o.createElement('div', {
        style: S(
          {
            position: 'fixed',
            display: 'block',
            opacity: 1,
            borderStyle: 'solid',
            borderWidth: '1px',
            borderColor: 'transparent',
            zIndex: 99999,
          },
          t.style
        ),
      });
    return e && e.ownerDocument !== document
      ? h.createPortal(n, e.ownerDocument.body)
      : n;
  },
  tt = function (t) {
    u(t, []);
  },
  et = function (t, e) {
    var n =
        'Deprecation warning: ' + t + ' will be deprecated in future relases.',
      r = e.suggest,
      o = e.doc;
    r && (n += ' Please use ' + r + ' instead.'),
      o && (n += '(' + o + ')'),
      console.warn(n);
  };
export {
  g as DEPRECATED_ROOT_NODE,
  U as ERROR_CANNOT_DRAG,
  j as ERROR_DELETE_TOP_LEVEL_NODE,
  A as ERROR_DESERIALIZE_COMPONENT_NOT_IN_RESOLVER,
  y as ERROR_DUPLICATE_NODEID,
  M as ERROR_INFINITE_CANVAS,
  b as ERROR_INVALID_NODEID,
  P as ERROR_INVALID_NODE_ID,
  R as ERROR_MISSING_PLACEHOLDER_PLACEMENT,
  T as ERROR_MOVE_CANNOT_DROP,
  w as ERROR_MOVE_INCOMING_PARENT,
  D as ERROR_MOVE_NONCANVAS_CHILD,
  E as ERROR_MOVE_OUTGOING_PARENT,
  N as ERROR_MOVE_ROOT_NODE,
  I as ERROR_MOVE_TOP_LEVEL_NODE,
  x as ERROR_MOVE_TO_DESCENDANT,
  C as ERROR_MOVE_TO_NONCANVAS_PARENT,
  v as ERROR_NOPARENT,
  H as ERROR_NOT_IN_RESOLVER,
  k as ERROR_RESOLVER_NOT_AN_OBJECT,
  O as ERROR_TOP_LEVEL_ELEMENT_NO_ID,
  L as HISTORY_ACTIONS,
  q as History,
  m as ROOT_NODE,
  $ as RenderIndicator,
  X as cloneWithRef,
  Y as createQuery,
  et as deprecationWarning,
  B as getComputedStyle,
  J as getDOMInfo,
  W as getDOMMargin,
  F as getDOMPadding,
  K as styleInFlow,
  Q as useCollector,
  tt as useEffectOnce,
  G as useMethods,
  Z as wrapHookToRecognizeElement,
};
