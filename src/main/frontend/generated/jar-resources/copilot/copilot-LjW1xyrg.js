class Do {
  constructor() {
    this.eventBuffer = [], this.handledTypes = [], this.copilotMain = null, this.debug = !1, this.eventProxy = {
      functionCallQueue: [],
      dispatchEvent(...t) {
        return this.functionCallQueue.push({ name: "dispatchEvent", args: t }), !0;
      },
      removeEventListener(...t) {
        this.functionCallQueue.push({ name: "removeEventListener", args: t });
      },
      addEventListener(...t) {
        this.functionCallQueue.push({ name: "addEventListener", args: t });
      },
      processQueue(t) {
        this.functionCallQueue.forEach((n) => {
          t[n.name].call(t, ...n.args);
        }), this.functionCallQueue = [];
      }
    };
  }
  getEventTarget() {
    return this.copilotMain ? this.copilotMain : (this.copilotMain = document.querySelector("copilot-main"), this.copilotMain ? (this.eventProxy.processQueue(this.copilotMain), this.copilotMain) : this.eventProxy);
  }
  on(t, n) {
    const r = n;
    return this.getEventTarget().addEventListener(t, r), this.handledTypes.push(t), this.flush(t), () => this.off(t, r);
  }
  once(t, n) {
    this.getEventTarget().addEventListener(t, n, { once: !0 });
  }
  off(t, n) {
    this.getEventTarget().removeEventListener(t, n);
    const r = this.handledTypes.indexOf(t, 0);
    r > -1 && this.handledTypes.splice(r, 1);
  }
  emit(t, n) {
    const r = new CustomEvent(t, { detail: n, cancelable: !0 });
    return this.handledTypes.includes(t) || this.eventBuffer.push(r), this.debug && console.debug("Emit event", r), this.getEventTarget().dispatchEvent(r), r.defaultPrevented;
  }
  emitUnsafe({ type: t, data: n }) {
    return this.emit(t, n);
  }
  // Communication with server via eventbus
  send(t, n) {
    const r = new CustomEvent("copilot-send", { detail: { command: t, data: n } });
    this.getEventTarget().dispatchEvent(r);
  }
  // Listeners for Copilot itself
  onSend(t) {
    this.on("copilot-send", t);
  }
  offSend(t) {
    this.off("copilot-send", t);
  }
  flush(t) {
    const n = [];
    this.eventBuffer.filter((r) => r.type === t).forEach((r) => {
      this.getEventTarget().dispatchEvent(r), n.push(r);
    }), this.eventBuffer = this.eventBuffer.filter((r) => !n.includes(r));
  }
}
var To = {
  0: "Invalid value for configuration 'enforceActions', expected 'never', 'always' or 'observed'",
  1: function(t, n) {
    return "Cannot apply '" + t + "' to '" + n.toString() + "': Field not found.";
  },
  /*
  2(prop) {
      return `invalid decorator for '${prop.toString()}'`
  },
  3(prop) {
      return `Cannot decorate '${prop.toString()}': action can only be used on properties with a function value.`
  },
  4(prop) {
      return `Cannot decorate '${prop.toString()}': computed can only be used on getter properties.`
  },
  */
  5: "'keys()' can only be used on observable objects, arrays, sets and maps",
  6: "'values()' can only be used on observable objects, arrays, sets and maps",
  7: "'entries()' can only be used on observable objects, arrays and maps",
  8: "'set()' can only be used on observable objects, arrays and maps",
  9: "'remove()' can only be used on observable objects, arrays and maps",
  10: "'has()' can only be used on observable objects, arrays and maps",
  11: "'get()' can only be used on observable objects, arrays and maps",
  12: "Invalid annotation",
  13: "Dynamic observable objects cannot be frozen. If you're passing observables to 3rd party component/function that calls Object.freeze, pass copy instead: toJS(observable)",
  14: "Intercept handlers should return nothing or a change object",
  15: "Observable arrays cannot be frozen. If you're passing observables to 3rd party component/function that calls Object.freeze, pass copy instead: toJS(observable)",
  16: "Modification exception: the internal structure of an observable array was changed.",
  17: function(t, n) {
    return "[mobx.array] Index out of bounds, " + t + " is larger than " + n;
  },
  18: "mobx.map requires Map polyfill for the current browser. Check babel-polyfill or core-js/es6/map.js",
  19: function(t) {
    return "Cannot initialize from classes that inherit from Map: " + t.constructor.name;
  },
  20: function(t) {
    return "Cannot initialize map from " + t;
  },
  21: function(t) {
    return "Cannot convert to map from '" + t + "'";
  },
  22: "mobx.set requires Set polyfill for the current browser. Check babel-polyfill or core-js/es6/set.js",
  23: "It is not possible to get index atoms from arrays",
  24: function(t) {
    return "Cannot obtain administration from " + t;
  },
  25: function(t, n) {
    return "the entry '" + t + "' does not exist in the observable map '" + n + "'";
  },
  26: "please specify a property",
  27: function(t, n) {
    return "no observable property '" + t.toString() + "' found on the observable object '" + n + "'";
  },
  28: function(t) {
    return "Cannot obtain atom from " + t;
  },
  29: "Expecting some object",
  30: "invalid action stack. did you forget to finish an action?",
  31: "missing option for computed: get",
  32: function(t, n) {
    return "Cycle detected in computation " + t + ": " + n;
  },
  33: function(t) {
    return "The setter of computed value '" + t + "' is trying to update itself. Did you intend to update an _observable_ value, instead of the computed property?";
  },
  34: function(t) {
    return "[ComputedValue '" + t + "'] It is not possible to assign a new value to a computed value.";
  },
  35: "There are multiple, different versions of MobX active. Make sure MobX is loaded only once or use `configure({ isolateGlobalState: true })`",
  36: "isolateGlobalState should be called before MobX is running any reactions",
  37: function(t) {
    return "[mobx] `observableArray." + t + "()` mutates the array in-place, which is not allowed inside a derivation. Use `array.slice()." + t + "()` instead";
  },
  38: "'ownKeys()' can only be used on observable objects",
  39: "'defineProperty()' can only be used on observable objects"
}, Ro = process.env.NODE_ENV !== "production" ? To : {};
function h(e) {
  for (var t = arguments.length, n = new Array(t > 1 ? t - 1 : 0), r = 1; r < t; r++)
    n[r - 1] = arguments[r];
  if (process.env.NODE_ENV !== "production") {
    var i = typeof e == "string" ? e : Ro[e];
    throw typeof i == "function" && (i = i.apply(null, n)), new Error("[MobX] " + i);
  }
  throw new Error(typeof e == "number" ? "[MobX] minified error nr: " + e + (n.length ? " " + n.map(String).join(",") : "") + ". Find the full error at: https://github.com/mobxjs/mobx/blob/main/packages/mobx/src/errors.ts" : "[MobX] " + e);
}
var Vo = {};
function kn() {
  return typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : Vo;
}
var Qr = Object.assign, Mt = Object.getOwnPropertyDescriptor, Y = Object.defineProperty, Yt = Object.prototype, jt = [];
Object.freeze(jt);
var Ln = {};
Object.freeze(Ln);
var Io = typeof Proxy < "u", ko = /* @__PURE__ */ Object.toString();
function $r() {
  Io || h(process.env.NODE_ENV !== "production" ? "`Proxy` objects are not available in the current environment. Please configure MobX to enable a fallback implementation.`" : "Proxy not available");
}
function $e(e) {
  process.env.NODE_ENV !== "production" && f.verifyProxies && h("MobX is currently configured to be able to run in ES5 mode, but in ES5 MobX won't be able to " + e);
}
function F() {
  return ++f.mobxGuid;
}
function Mn(e) {
  var t = !1;
  return function() {
    if (!t)
      return t = !0, e.apply(this, arguments);
  };
}
var ze = function() {
};
function S(e) {
  return typeof e == "function";
}
function Se(e) {
  var t = typeof e;
  switch (t) {
    case "string":
    case "symbol":
    case "number":
      return !0;
  }
  return !1;
}
function Qt(e) {
  return e !== null && typeof e == "object";
}
function C(e) {
  if (!Qt(e))
    return !1;
  var t = Object.getPrototypeOf(e);
  if (t == null)
    return !0;
  var n = Object.hasOwnProperty.call(t, "constructor") && t.constructor;
  return typeof n == "function" && n.toString() === ko;
}
function ei(e) {
  var t = e?.constructor;
  return t ? t.name === "GeneratorFunction" || t.displayName === "GeneratorFunction" : !1;
}
function $t(e, t, n) {
  Y(e, t, {
    enumerable: !1,
    writable: !0,
    configurable: !0,
    value: n
  });
}
function ti(e, t, n) {
  Y(e, t, {
    enumerable: !1,
    writable: !1,
    configurable: !0,
    value: n
  });
}
function Ve(e, t) {
  var n = "isMobX" + e;
  return t.prototype[n] = !0, function(r) {
    return Qt(r) && r[n] === !0;
  };
}
function Ke(e) {
  return e != null && Object.prototype.toString.call(e) === "[object Map]";
}
function Lo(e) {
  var t = Object.getPrototypeOf(e), n = Object.getPrototypeOf(t), r = Object.getPrototypeOf(n);
  return r === null;
}
function ne(e) {
  return e != null && Object.prototype.toString.call(e) === "[object Set]";
}
var ni = typeof Object.getOwnPropertySymbols < "u";
function Mo(e) {
  var t = Object.keys(e);
  if (!ni)
    return t;
  var n = Object.getOwnPropertySymbols(e);
  return n.length ? [].concat(t, n.filter(function(r) {
    return Yt.propertyIsEnumerable.call(e, r);
  })) : t;
}
var ht = typeof Reflect < "u" && Reflect.ownKeys ? Reflect.ownKeys : ni ? function(e) {
  return Object.getOwnPropertyNames(e).concat(Object.getOwnPropertySymbols(e));
} : (
  /* istanbul ignore next */
  Object.getOwnPropertyNames
);
function En(e) {
  return typeof e == "string" ? e : typeof e == "symbol" ? e.toString() : new String(e).toString();
}
function ri(e) {
  return e === null ? null : typeof e == "object" ? "" + e : e;
}
function Z(e, t) {
  return Yt.hasOwnProperty.call(e, t);
}
var jo = Object.getOwnPropertyDescriptors || function(t) {
  var n = {};
  return ht(t).forEach(function(r) {
    n[r] = Mt(t, r);
  }), n;
};
function T(e, t) {
  return !!(e & t);
}
function R(e, t, n) {
  return n ? e |= t : e &= ~t, e;
}
function nr(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, r = Array(t); n < t; n++) r[n] = e[n];
  return r;
}
function Uo(e, t) {
  for (var n = 0; n < t.length; n++) {
    var r = t[n];
    r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(e, Bo(r.key), r);
  }
}
function He(e, t, n) {
  return t && Uo(e.prototype, t), Object.defineProperty(e, "prototype", {
    writable: !1
  }), e;
}
function Be(e, t) {
  var n = typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (n) return (n = n.call(e)).next.bind(n);
  if (Array.isArray(e) || (n = Fo(e)) || t) {
    n && (e = n);
    var r = 0;
    return function() {
      return r >= e.length ? {
        done: !0
      } : {
        done: !1,
        value: e[r++]
      };
    };
  }
  throw new TypeError(`Invalid attempt to iterate non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function de() {
  return de = Object.assign ? Object.assign.bind() : function(e) {
    for (var t = 1; t < arguments.length; t++) {
      var n = arguments[t];
      for (var r in n) ({}).hasOwnProperty.call(n, r) && (e[r] = n[r]);
    }
    return e;
  }, de.apply(null, arguments);
}
function ii(e, t) {
  e.prototype = Object.create(t.prototype), e.prototype.constructor = e, On(e, t);
}
function On(e, t) {
  return On = Object.setPrototypeOf ? Object.setPrototypeOf.bind() : function(n, r) {
    return n.__proto__ = r, n;
  }, On(e, t);
}
function zo(e, t) {
  if (typeof e != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var r = n.call(e, t);
    if (typeof r != "object") return r;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return String(e);
}
function Bo(e) {
  var t = zo(e, "string");
  return typeof t == "symbol" ? t : t + "";
}
function Fo(e, t) {
  if (e) {
    if (typeof e == "string") return nr(e, t);
    var n = {}.toString.call(e).slice(8, -1);
    return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? nr(e, t) : void 0;
  }
}
var re = /* @__PURE__ */ Symbol("mobx-stored-annotations");
function Q(e) {
  function t(n, r) {
    if (At(r))
      return e.decorate_20223_(n, r);
    wt(n, r, e);
  }
  return Object.assign(t, e);
}
function wt(e, t, n) {
  if (Z(e, re) || $t(e, re, de({}, e[re])), process.env.NODE_ENV !== "production" && Ut(n) && !Z(e[re], t)) {
    var r = e.constructor.name + ".prototype." + t.toString();
    h("'" + r + "' is decorated with 'override', but no such decorated member was found on prototype.");
  }
  Wo(e, n, t), Ut(n) || (e[re][t] = n);
}
function Wo(e, t, n) {
  if (process.env.NODE_ENV !== "production" && !Ut(t) && Z(e[re], n)) {
    var r = e.constructor.name + ".prototype." + n.toString(), i = e[re][n].annotationType_, o = t.annotationType_;
    h("Cannot apply '@" + o + "' to '" + r + "':" + (`
The field is already decorated with '@` + i + "'.") + `
Re-decorating fields is not allowed.
Use '@override' decorator for methods overridden by subclass.`);
  }
}
function At(e) {
  return typeof e == "object" && typeof e.kind == "string";
}
function en(e, t) {
  process.env.NODE_ENV !== "production" && !t.includes(e.kind) && h("The decorator applied to '" + String(e.name) + "' cannot be used on a " + e.kind + " element");
}
var b = /* @__PURE__ */ Symbol("mobx administration"), ve = /* @__PURE__ */ function() {
  function e(n) {
    n === void 0 && (n = process.env.NODE_ENV !== "production" ? "Atom@" + F() : "Atom"), this.name_ = void 0, this.flags_ = 0, this.observers_ = /* @__PURE__ */ new Set(), this.lastAccessedBy_ = 0, this.lowestObserverState_ = y.NOT_TRACKING_, this.onBOL = void 0, this.onBUOL = void 0, this.name_ = n;
  }
  var t = e.prototype;
  return t.onBO = function() {
    this.onBOL && this.onBOL.forEach(function(r) {
      return r();
    });
  }, t.onBUO = function() {
    this.onBUOL && this.onBUOL.forEach(function(r) {
      return r();
    });
  }, t.reportObserved = function() {
    return wi(this);
  }, t.reportChanged = function() {
    j(), Ai(this), U();
  }, t.toString = function() {
    return this.name_;
  }, He(e, [{
    key: "isBeingObserved",
    get: function() {
      return T(this.flags_, e.isBeingObservedMask_);
    },
    set: function(r) {
      this.flags_ = R(this.flags_, e.isBeingObservedMask_, r);
    }
  }, {
    key: "isPendingUnobservation",
    get: function() {
      return T(this.flags_, e.isPendingUnobservationMask_);
    },
    set: function(r) {
      this.flags_ = R(this.flags_, e.isPendingUnobservationMask_, r);
    }
  }, {
    key: "diffValue",
    get: function() {
      return T(this.flags_, e.diffValueMask_) ? 1 : 0;
    },
    set: function(r) {
      this.flags_ = R(this.flags_, e.diffValueMask_, r === 1);
    }
  }]);
}();
ve.isBeingObservedMask_ = 1;
ve.isPendingUnobservationMask_ = 2;
ve.diffValueMask_ = 4;
var jn = /* @__PURE__ */ Ve("Atom", ve);
function oi(e, t, n) {
  t === void 0 && (t = ze), n === void 0 && (n = ze);
  var r = new ve(e);
  return t !== ze && ts(r, t), n !== ze && Ti(r, n), r;
}
function Zo(e, t) {
  return e === t;
}
function Go(e, t) {
  return Zn(e, t);
}
function qo(e, t) {
  return Zn(e, t, 1);
}
function Ko(e, t) {
  return Object.is ? Object.is(e, t) : e === t ? e !== 0 || 1 / e === 1 / t : e !== e && t !== t;
}
var Fe = {
  identity: Zo,
  structural: Go,
  default: Ko,
  shallow: qo
};
function Ne(e, t, n) {
  return gt(e) ? e : Array.isArray(e) ? N.array(e, {
    name: n
  }) : C(e) ? N.object(e, void 0, {
    name: n
  }) : Ke(e) ? N.map(e, {
    name: n
  }) : ne(e) ? N.set(e, {
    name: n
  }) : typeof e == "function" && !We(e) && !pt(e) ? ei(e) ? Ze(e) : vt(n, e) : e;
}
function Ho(e, t, n) {
  if (e == null || Xe(e) || cn(e) || pe(e) || J(e))
    return e;
  if (Array.isArray(e))
    return N.array(e, {
      name: n,
      deep: !1
    });
  if (C(e))
    return N.object(e, void 0, {
      name: n,
      deep: !1
    });
  if (Ke(e))
    return N.map(e, {
      name: n,
      deep: !1
    });
  if (ne(e))
    return N.set(e, {
      name: n,
      deep: !1
    });
  process.env.NODE_ENV !== "production" && h("The shallow modifier / decorator can only used in combination with arrays, objects, maps and sets");
}
function tn(e) {
  return e;
}
function Jo(e, t) {
  return process.env.NODE_ENV !== "production" && gt(e) && h("observable.struct should not be used with observable values"), Zn(e, t) ? t : e;
}
var Xo = "override";
function Ut(e) {
  return e.annotationType_ === Xo;
}
function Et(e, t) {
  return {
    annotationType_: e,
    options_: t,
    make_: Yo,
    extend_: Qo,
    decorate_20223_: $o
  };
}
function Yo(e, t, n, r) {
  var i;
  if ((i = this.options_) != null && i.bound)
    return this.extend_(e, t, n, !1) === null ? 0 : 1;
  if (r === e.target_)
    return this.extend_(e, t, n, !1) === null ? 0 : 2;
  if (We(n.value))
    return 1;
  var o = ai(e, this, t, n, !1);
  return Y(r, t, o), 2;
}
function Qo(e, t, n, r) {
  var i = ai(e, this, t, n);
  return e.defineProperty_(t, i, r);
}
function $o(e, t) {
  process.env.NODE_ENV !== "production" && en(t, ["method", "field"]);
  var n = t.kind, r = t.name, i = t.addInitializer, o = this, a = function(c) {
    var u, d, v, g;
    return xe((u = (d = o.options_) == null ? void 0 : d.name) != null ? u : r.toString(), c, (v = (g = o.options_) == null ? void 0 : g.autoAction) != null ? v : !1);
  };
  if (n == "field")
    return function(l) {
      var c, u = l;
      return We(u) || (u = a(u)), (c = o.options_) != null && c.bound && (u = u.bind(this), u.isMobxAction = !0), u;
    };
  if (n == "method") {
    var s;
    return We(e) || (e = a(e)), (s = this.options_) != null && s.bound && i(function() {
      var l = this, c = l[r].bind(l);
      c.isMobxAction = !0, l[r] = c;
    }), e;
  }
  h("Cannot apply '" + o.annotationType_ + "' to '" + String(r) + "' (kind: " + n + "):" + (`
'` + o.annotationType_ + "' can only be used on properties with a function value."));
}
function ea(e, t, n, r) {
  var i = t.annotationType_, o = r.value;
  process.env.NODE_ENV !== "production" && !S(o) && h("Cannot apply '" + i + "' to '" + e.name_ + "." + n.toString() + "':" + (`
'` + i + "' can only be used on properties with a function value."));
}
function ai(e, t, n, r, i) {
  var o, a, s, l, c, u, d;
  i === void 0 && (i = f.safeDescriptors), ea(e, t, n, r);
  var v = r.value;
  if ((o = t.options_) != null && o.bound) {
    var g;
    v = v.bind((g = e.proxy_) != null ? g : e.target_);
  }
  return {
    value: xe(
      (a = (s = t.options_) == null ? void 0 : s.name) != null ? a : n.toString(),
      v,
      (l = (c = t.options_) == null ? void 0 : c.autoAction) != null ? l : !1,
      // https://github.com/mobxjs/mobx/discussions/3140
      (u = t.options_) != null && u.bound ? (d = e.proxy_) != null ? d : e.target_ : void 0
    ),
    // Non-configurable for classes
    // prevents accidental field redefinition in subclass
    configurable: i ? e.isPlainObject_ : !0,
    // https://github.com/mobxjs/mobx/pull/2641#issuecomment-737292058
    enumerable: !1,
    // Non-obsevable, therefore non-writable
    // Also prevents rewriting in subclass constructor
    writable: !i
  };
}
function si(e, t) {
  return {
    annotationType_: e,
    options_: t,
    make_: ta,
    extend_: na,
    decorate_20223_: ra
  };
}
function ta(e, t, n, r) {
  var i;
  if (r === e.target_)
    return this.extend_(e, t, n, !1) === null ? 0 : 2;
  if ((i = this.options_) != null && i.bound && (!Z(e.target_, t) || !pt(e.target_[t])) && this.extend_(e, t, n, !1) === null)
    return 0;
  if (pt(n.value))
    return 1;
  var o = li(e, this, t, n, !1, !1);
  return Y(r, t, o), 2;
}
function na(e, t, n, r) {
  var i, o = li(e, this, t, n, (i = this.options_) == null ? void 0 : i.bound);
  return e.defineProperty_(t, o, r);
}
function ra(e, t) {
  var n;
  process.env.NODE_ENV !== "production" && en(t, ["method"]);
  var r = t.name, i = t.addInitializer;
  return pt(e) || (e = Ze(e)), (n = this.options_) != null && n.bound && i(function() {
    var o = this, a = o[r].bind(o);
    a.isMobXFlow = !0, o[r] = a;
  }), e;
}
function ia(e, t, n, r) {
  var i = t.annotationType_, o = r.value;
  process.env.NODE_ENV !== "production" && !S(o) && h("Cannot apply '" + i + "' to '" + e.name_ + "." + n.toString() + "':" + (`
'` + i + "' can only be used on properties with a generator function value."));
}
function li(e, t, n, r, i, o) {
  o === void 0 && (o = f.safeDescriptors), ia(e, t, n, r);
  var a = r.value;
  if (pt(a) || (a = Ze(a)), i) {
    var s;
    a = a.bind((s = e.proxy_) != null ? s : e.target_), a.isMobXFlow = !0;
  }
  return {
    value: a,
    // Non-configurable for classes
    // prevents accidental field redefinition in subclass
    configurable: o ? e.isPlainObject_ : !0,
    // https://github.com/mobxjs/mobx/pull/2641#issuecomment-737292058
    enumerable: !1,
    // Non-obsevable, therefore non-writable
    // Also prevents rewriting in subclass constructor
    writable: !o
  };
}
function Un(e, t) {
  return {
    annotationType_: e,
    options_: t,
    make_: oa,
    extend_: aa,
    decorate_20223_: sa
  };
}
function oa(e, t, n) {
  return this.extend_(e, t, n, !1) === null ? 0 : 1;
}
function aa(e, t, n, r) {
  return la(e, this, t, n), e.defineComputedProperty_(t, de({}, this.options_, {
    get: n.get,
    set: n.set
  }), r);
}
function sa(e, t) {
  process.env.NODE_ENV !== "production" && en(t, ["getter"]);
  var n = this, r = t.name, i = t.addInitializer;
  return i(function() {
    var o = Je(this)[b], a = de({}, n.options_, {
      get: e,
      context: this
    });
    a.name || (a.name = process.env.NODE_ENV !== "production" ? o.name_ + "." + r.toString() : "ObservableObject." + r.toString()), o.values_.set(r, new B(a));
  }), function() {
    return this[b].getObservablePropValue_(r);
  };
}
function la(e, t, n, r) {
  var i = t.annotationType_, o = r.get;
  process.env.NODE_ENV !== "production" && !o && h("Cannot apply '" + i + "' to '" + e.name_ + "." + n.toString() + "':" + (`
'` + i + "' can only be used on getter(+setter) properties."));
}
function nn(e, t) {
  return {
    annotationType_: e,
    options_: t,
    make_: ca,
    extend_: ua,
    decorate_20223_: da
  };
}
function ca(e, t, n) {
  return this.extend_(e, t, n, !1) === null ? 0 : 1;
}
function ua(e, t, n, r) {
  var i, o;
  return fa(e, this, t, n), e.defineObservableProperty_(t, n.value, (i = (o = this.options_) == null ? void 0 : o.enhancer) != null ? i : Ne, r);
}
function da(e, t) {
  if (process.env.NODE_ENV !== "production") {
    if (t.kind === "field")
      throw h("Please use `@observable accessor " + String(t.name) + "` instead of `@observable " + String(t.name) + "`");
    en(t, ["accessor"]);
  }
  var n = this, r = t.kind, i = t.name, o = /* @__PURE__ */ new WeakSet();
  function a(s, l) {
    var c, u, d = Je(s)[b], v = new Oe(l, (c = (u = n.options_) == null ? void 0 : u.enhancer) != null ? c : Ne, process.env.NODE_ENV !== "production" ? d.name_ + "." + i.toString() : "ObservableObject." + i.toString(), !1);
    d.values_.set(i, v), o.add(s);
  }
  if (r == "accessor")
    return {
      get: function() {
        return o.has(this) || a(this, e.get.call(this)), this[b].getObservablePropValue_(i);
      },
      set: function(l) {
        return o.has(this) || a(this, l), this[b].setObservablePropValue_(i, l);
      },
      init: function(l) {
        return o.has(this) || a(this, l), l;
      }
    };
}
function fa(e, t, n, r) {
  var i = t.annotationType_;
  process.env.NODE_ENV !== "production" && !("value" in r) && h("Cannot apply '" + i + "' to '" + e.name_ + "." + n.toString() + "':" + (`
'` + i + "' cannot be used on getter/setter properties"));
}
var ha = "true", va = /* @__PURE__ */ ci();
function ci(e) {
  return {
    annotationType_: ha,
    options_: e,
    make_: pa,
    extend_: ga,
    decorate_20223_: ba
  };
}
function pa(e, t, n, r) {
  var i, o;
  if (n.get)
    return rn.make_(e, t, n, r);
  if (n.set) {
    var a = xe(t.toString(), n.set);
    return r === e.target_ ? e.defineProperty_(t, {
      configurable: f.safeDescriptors ? e.isPlainObject_ : !0,
      set: a
    }) === null ? 0 : 2 : (Y(r, t, {
      configurable: !0,
      set: a
    }), 2);
  }
  if (r !== e.target_ && typeof n.value == "function") {
    var s;
    if (ei(n.value)) {
      var l, c = (l = this.options_) != null && l.autoBind ? Ze.bound : Ze;
      return c.make_(e, t, n, r);
    }
    var u = (s = this.options_) != null && s.autoBind ? vt.bound : vt;
    return u.make_(e, t, n, r);
  }
  var d = ((i = this.options_) == null ? void 0 : i.deep) === !1 ? N.ref : N;
  if (typeof n.value == "function" && (o = this.options_) != null && o.autoBind) {
    var v;
    n.value = n.value.bind((v = e.proxy_) != null ? v : e.target_);
  }
  return d.make_(e, t, n, r);
}
function ga(e, t, n, r) {
  var i, o;
  if (n.get)
    return rn.extend_(e, t, n, r);
  if (n.set)
    return e.defineProperty_(t, {
      configurable: f.safeDescriptors ? e.isPlainObject_ : !0,
      set: xe(t.toString(), n.set)
    }, r);
  if (typeof n.value == "function" && (i = this.options_) != null && i.autoBind) {
    var a;
    n.value = n.value.bind((a = e.proxy_) != null ? a : e.target_);
  }
  var s = ((o = this.options_) == null ? void 0 : o.deep) === !1 ? N.ref : N;
  return s.extend_(e, t, n, r);
}
function ba(e, t) {
  h("'" + this.annotationType_ + "' cannot be used as a decorator");
}
var ma = "observable", ya = "observable.ref", wa = "observable.shallow", Aa = "observable.struct", ui = {
  deep: !0,
  name: void 0,
  defaultDecorator: void 0,
  proxy: !0
};
Object.freeze(ui);
function xt(e) {
  return e || ui;
}
var Sn = /* @__PURE__ */ nn(ma), Ea = /* @__PURE__ */ nn(ya, {
  enhancer: tn
}), Oa = /* @__PURE__ */ nn(wa, {
  enhancer: Ho
}), Sa = /* @__PURE__ */ nn(Aa, {
  enhancer: Jo
}), di = /* @__PURE__ */ Q(Sn);
function _t(e) {
  return e.deep === !0 ? Ne : e.deep === !1 ? tn : xa(e.defaultDecorator);
}
function Na(e) {
  var t;
  return e ? (t = e.defaultDecorator) != null ? t : ci(e) : void 0;
}
function xa(e) {
  var t, n;
  return e && (t = (n = e.options_) == null ? void 0 : n.enhancer) != null ? t : Ne;
}
function fi(e, t, n) {
  if (At(t))
    return Sn.decorate_20223_(e, t);
  if (Se(t)) {
    wt(e, t, Sn);
    return;
  }
  return gt(e) ? e : C(e) ? N.object(e, t, n) : Array.isArray(e) ? N.array(e, t) : Ke(e) ? N.map(e, t) : ne(e) ? N.set(e, t) : typeof e == "object" && e !== null ? e : N.box(e, t);
}
Qr(fi, di);
var _a = {
  box: function(t, n) {
    var r = xt(n);
    return new Oe(t, _t(r), r.name, !0, r.equals);
  },
  array: function(t, n) {
    var r = xt(n);
    return (f.useProxies === !1 || r.proxy === !1 ? Os : hs)(t, _t(r), r.name);
  },
  map: function(t, n) {
    var r = xt(n);
    return new Mi(t, _t(r), r.name);
  },
  set: function(t, n) {
    var r = xt(n);
    return new ji(t, _t(r), r.name);
  },
  object: function(t, n, r) {
    return ke(function() {
      return Vi(f.useProxies === !1 || r?.proxy === !1 ? Je({}, r) : us({}, r), t, n);
    });
  },
  ref: /* @__PURE__ */ Q(Ea),
  shallow: /* @__PURE__ */ Q(Oa),
  deep: di,
  struct: /* @__PURE__ */ Q(Sa)
}, N = /* @__PURE__ */ Qr(fi, _a), hi = "computed", Pa = "computed.struct", Nn = /* @__PURE__ */ Un(hi), Ca = /* @__PURE__ */ Un(Pa, {
  equals: Fe.structural
}), rn = function(t, n) {
  if (At(n))
    return Nn.decorate_20223_(t, n);
  if (Se(n))
    return wt(t, n, Nn);
  if (C(t))
    return Q(Un(hi, t));
  process.env.NODE_ENV !== "production" && (S(t) || h("First argument to `computed` should be an expression."), S(n) && h("A setter as second argument is no longer supported, use `{ set: fn }` option instead"));
  var r = C(n) ? n : {};
  return r.get = t, r.name || (r.name = t.name || ""), new B(r);
};
Object.assign(rn, Nn);
rn.struct = /* @__PURE__ */ Q(Ca);
var rr, ir, zt = 0, Da = 1, Ta = (rr = (ir = /* @__PURE__ */ Mt(function() {
}, "name")) == null ? void 0 : ir.configurable) != null ? rr : !1, or = {
  value: "action",
  configurable: !0,
  writable: !1,
  enumerable: !1
};
function xe(e, t, n, r) {
  n === void 0 && (n = !1), process.env.NODE_ENV !== "production" && (S(t) || h("`action` can only be invoked on functions"), (typeof e != "string" || !e) && h("actions should have valid names, got: '" + e + "'"));
  function i() {
    return vi(e, n, t, r || this, arguments);
  }
  return i.isMobxAction = !0, i.toString = function() {
    return t.toString();
  }, Ta && (or.value = e, Y(i, "name", or)), i;
}
function vi(e, t, n, r, i) {
  var o = Ra(e, t, r, i);
  try {
    return n.apply(r, i);
  } catch (a) {
    throw o.error_ = a, a;
  } finally {
    Va(o);
  }
}
function Ra(e, t, n, r) {
  var i = process.env.NODE_ENV !== "production" && P() && !!e, o = 0;
  if (process.env.NODE_ENV !== "production" && i) {
    o = Date.now();
    var a = r ? Array.from(r) : jt;
    V({
      type: Bn,
      name: e,
      object: n,
      arguments: a
    });
  }
  var s = f.trackingDerivation, l = !t || !s;
  j();
  var c = f.allowStateChanges;
  l && (Ie(), c = on(!0));
  var u = zn(!0), d = {
    runAsAction_: l,
    prevDerivation_: s,
    prevAllowStateChanges_: c,
    prevAllowStateReads_: u,
    notifySpy_: i,
    startTime_: o,
    actionId_: Da++,
    parentActionId_: zt
  };
  return zt = d.actionId_, d;
}
function Va(e) {
  zt !== e.actionId_ && h(30), zt = e.parentActionId_, e.error_ !== void 0 && (f.suppressReactionErrors = !0), an(e.prevAllowStateChanges_), lt(e.prevAllowStateReads_), U(), e.runAsAction_ && ae(e.prevDerivation_), process.env.NODE_ENV !== "production" && e.notifySpy_ && I({
    time: Date.now() - e.startTime_
  }), f.suppressReactionErrors = !1;
}
function Ia(e, t) {
  var n = on(e);
  try {
    return t();
  } finally {
    an(n);
  }
}
function on(e) {
  var t = f.allowStateChanges;
  return f.allowStateChanges = e, t;
}
function an(e) {
  f.allowStateChanges = e;
}
var ka = "create", Oe = /* @__PURE__ */ function(e) {
  function t(r, i, o, a, s) {
    var l;
    return o === void 0 && (o = process.env.NODE_ENV !== "production" ? "ObservableValue@" + F() : "ObservableValue"), a === void 0 && (a = !0), s === void 0 && (s = Fe.default), l = e.call(this, o) || this, l.enhancer = void 0, l.name_ = void 0, l.equals = void 0, l.hasUnreportedChange_ = !1, l.interceptors_ = void 0, l.changeListeners_ = void 0, l.value_ = void 0, l.dehancer = void 0, l.enhancer = i, l.name_ = o, l.equals = s, l.value_ = i(r, void 0, o), process.env.NODE_ENV !== "production" && a && P() && _e({
      type: ka,
      object: l,
      observableKind: "value",
      debugObjectName: l.name_,
      newValue: "" + l.value_
    }), l;
  }
  ii(t, e);
  var n = t.prototype;
  return n.dehanceValue = function(i) {
    return this.dehancer !== void 0 ? this.dehancer(i) : i;
  }, n.set = function(i) {
    var o = this.value_;
    if (i = this.prepareNewValue_(i), i !== f.UNCHANGED) {
      var a = P();
      process.env.NODE_ENV !== "production" && a && V({
        type: W,
        object: this,
        observableKind: "value",
        debugObjectName: this.name_,
        newValue: i,
        oldValue: o
      }), this.setNewValue_(i), process.env.NODE_ENV !== "production" && a && I();
    }
  }, n.prepareNewValue_ = function(i) {
    if (X(this), L(this)) {
      var o = M(this, {
        object: this,
        type: W,
        newValue: i
      });
      if (!o)
        return f.UNCHANGED;
      i = o.newValue;
    }
    return i = this.enhancer(i, this.value_, this.name_), this.equals(this.value_, i) ? f.UNCHANGED : i;
  }, n.setNewValue_ = function(i) {
    var o = this.value_;
    this.value_ = i, this.reportChanged(), G(this) && q(this, {
      type: W,
      object: this,
      newValue: i,
      oldValue: o
    });
  }, n.get = function() {
    return this.reportObserved(), this.dehanceValue(this.value_);
  }, n.intercept_ = function(i) {
    return Ot(this, i);
  }, n.observe_ = function(i, o) {
    return o && i({
      observableKind: "value",
      debugObjectName: this.name_,
      object: this,
      type: W,
      newValue: this.value_,
      oldValue: void 0
    }), St(this, i);
  }, n.raw = function() {
    return this.value_;
  }, n.toJSON = function() {
    return this.get();
  }, n.toString = function() {
    return this.name_ + "[" + this.value_ + "]";
  }, n.valueOf = function() {
    return ri(this.get());
  }, n[Symbol.toPrimitive] = function() {
    return this.valueOf();
  }, t;
}(ve), B = /* @__PURE__ */ function() {
  function e(n) {
    this.dependenciesState_ = y.NOT_TRACKING_, this.observing_ = [], this.newObserving_ = null, this.observers_ = /* @__PURE__ */ new Set(), this.runId_ = 0, this.lastAccessedBy_ = 0, this.lowestObserverState_ = y.UP_TO_DATE_, this.unboundDepsCount_ = 0, this.value_ = new Bt(null), this.name_ = void 0, this.triggeredBy_ = void 0, this.flags_ = 0, this.derivation = void 0, this.setter_ = void 0, this.isTracing_ = z.NONE, this.scope_ = void 0, this.equals_ = void 0, this.requiresReaction_ = void 0, this.keepAlive_ = void 0, this.onBOL = void 0, this.onBUOL = void 0, n.get || h(31), this.derivation = n.get, this.name_ = n.name || (process.env.NODE_ENV !== "production" ? "ComputedValue@" + F() : "ComputedValue"), n.set && (this.setter_ = xe(process.env.NODE_ENV !== "production" ? this.name_ + "-setter" : "ComputedValue-setter", n.set)), this.equals_ = n.equals || (n.compareStructural || n.struct ? Fe.structural : Fe.default), this.scope_ = n.context, this.requiresReaction_ = n.requiresReaction, this.keepAlive_ = !!n.keepAlive;
  }
  var t = e.prototype;
  return t.onBecomeStale_ = function() {
    Ba(this);
  }, t.onBO = function() {
    this.onBOL && this.onBOL.forEach(function(r) {
      return r();
    });
  }, t.onBUO = function() {
    this.onBUOL && this.onBUOL.forEach(function(r) {
      return r();
    });
  }, t.get = function() {
    if (this.isComputing && h(32, this.name_, this.derivation), f.inBatch === 0 && // !globalState.trackingDerivatpion &&
    this.observers_.size === 0 && !this.keepAlive_)
      xn(this) && (this.warnAboutUntrackedRead_(), j(), this.value_ = this.computeValue_(!1), U());
    else if (wi(this), xn(this)) {
      var r = f.trackingContext;
      this.keepAlive_ && !r && (f.trackingContext = this), this.trackAndCompute() && za(this), f.trackingContext = r;
    }
    var i = this.value_;
    if (Vt(i))
      throw i.cause;
    return i;
  }, t.set = function(r) {
    if (this.setter_) {
      this.isRunningSetter && h(33, this.name_), this.isRunningSetter = !0;
      try {
        this.setter_.call(this.scope_, r);
      } finally {
        this.isRunningSetter = !1;
      }
    } else
      h(34, this.name_);
  }, t.trackAndCompute = function() {
    var r = this.value_, i = (
      /* see #1208 */
      this.dependenciesState_ === y.NOT_TRACKING_
    ), o = this.computeValue_(!0), a = i || Vt(r) || Vt(o) || !this.equals_(r, o);
    return a && (this.value_ = o, process.env.NODE_ENV !== "production" && P() && _e({
      observableKind: "computed",
      debugObjectName: this.name_,
      object: this.scope_,
      type: "update",
      oldValue: r,
      newValue: o
    })), a;
  }, t.computeValue_ = function(r) {
    this.isComputing = !0;
    var i = on(!1), o;
    if (r)
      o = pi(this, this.derivation, this.scope_);
    else if (f.disableErrorBoundaries === !0)
      o = this.derivation.call(this.scope_);
    else
      try {
        o = this.derivation.call(this.scope_);
      } catch (a) {
        o = new Bt(a);
      }
    return an(i), this.isComputing = !1, o;
  }, t.suspend_ = function() {
    this.keepAlive_ || (_n(this), this.value_ = void 0, process.env.NODE_ENV !== "production" && this.isTracing_ !== z.NONE && console.log("[mobx.trace] Computed value '" + this.name_ + "' was suspended and it will recompute on the next access."));
  }, t.observe_ = function(r, i) {
    var o = this, a = !0, s = void 0;
    return Pi(function() {
      var l = o.get();
      if (!a || i) {
        var c = Ie();
        r({
          observableKind: "computed",
          debugObjectName: o.name_,
          type: W,
          object: o,
          newValue: l,
          oldValue: s
        }), ae(c);
      }
      a = !1, s = l;
    });
  }, t.warnAboutUntrackedRead_ = function() {
    process.env.NODE_ENV !== "production" && (this.isTracing_ !== z.NONE && console.log("[mobx.trace] Computed value '" + this.name_ + "' is being read outside a reactive context. Doing a full recompute."), (typeof this.requiresReaction_ == "boolean" ? this.requiresReaction_ : f.computedRequiresReaction) && console.warn("[mobx] Computed value '" + this.name_ + "' is being read outside a reactive context. Doing a full recompute."));
  }, t.toString = function() {
    return this.name_ + "[" + this.derivation.toString() + "]";
  }, t.valueOf = function() {
    return ri(this.get());
  }, t[Symbol.toPrimitive] = function() {
    return this.valueOf();
  }, He(e, [{
    key: "isComputing",
    get: function() {
      return T(this.flags_, e.isComputingMask_);
    },
    set: function(r) {
      this.flags_ = R(this.flags_, e.isComputingMask_, r);
    }
  }, {
    key: "isRunningSetter",
    get: function() {
      return T(this.flags_, e.isRunningSetterMask_);
    },
    set: function(r) {
      this.flags_ = R(this.flags_, e.isRunningSetterMask_, r);
    }
  }, {
    key: "isBeingObserved",
    get: function() {
      return T(this.flags_, e.isBeingObservedMask_);
    },
    set: function(r) {
      this.flags_ = R(this.flags_, e.isBeingObservedMask_, r);
    }
  }, {
    key: "isPendingUnobservation",
    get: function() {
      return T(this.flags_, e.isPendingUnobservationMask_);
    },
    set: function(r) {
      this.flags_ = R(this.flags_, e.isPendingUnobservationMask_, r);
    }
  }, {
    key: "diffValue",
    get: function() {
      return T(this.flags_, e.diffValueMask_) ? 1 : 0;
    },
    set: function(r) {
      this.flags_ = R(this.flags_, e.diffValueMask_, r === 1);
    }
  }]);
}();
B.isComputingMask_ = 1;
B.isRunningSetterMask_ = 2;
B.isBeingObservedMask_ = 4;
B.isPendingUnobservationMask_ = 8;
B.diffValueMask_ = 16;
var sn = /* @__PURE__ */ Ve("ComputedValue", B), y;
(function(e) {
  e[e.NOT_TRACKING_ = -1] = "NOT_TRACKING_", e[e.UP_TO_DATE_ = 0] = "UP_TO_DATE_", e[e.POSSIBLY_STALE_ = 1] = "POSSIBLY_STALE_", e[e.STALE_ = 2] = "STALE_";
})(y || (y = {}));
var z;
(function(e) {
  e[e.NONE = 0] = "NONE", e[e.LOG = 1] = "LOG", e[e.BREAK = 2] = "BREAK";
})(z || (z = {}));
var Bt = function(t) {
  this.cause = void 0, this.cause = t;
};
function Vt(e) {
  return e instanceof Bt;
}
function xn(e) {
  switch (e.dependenciesState_) {
    case y.UP_TO_DATE_:
      return !1;
    case y.NOT_TRACKING_:
    case y.STALE_:
      return !0;
    case y.POSSIBLY_STALE_: {
      for (var t = zn(!0), n = Ie(), r = e.observing_, i = r.length, o = 0; o < i; o++) {
        var a = r[o];
        if (sn(a)) {
          if (f.disableErrorBoundaries)
            a.get();
          else
            try {
              a.get();
            } catch {
              return ae(n), lt(t), !0;
            }
          if (e.dependenciesState_ === y.STALE_)
            return ae(n), lt(t), !0;
        }
      }
      return bi(e), ae(n), lt(t), !1;
    }
  }
}
function X(e) {
  if (process.env.NODE_ENV !== "production") {
    var t = e.observers_.size > 0;
    !f.allowStateChanges && (t || f.enforceActions === "always") && console.warn("[MobX] " + (f.enforceActions ? "Since strict-mode is enabled, changing (observed) observable values without using an action is not allowed. Tried to modify: " : "Side effects like changing state are not allowed at this point. Are you trying to modify state from, for example, a computed value or the render function of a React component? You can wrap side effects in 'runInAction' (or decorate functions with 'action') if needed. Tried to modify: ") + e.name_);
  }
}
function La(e) {
  process.env.NODE_ENV !== "production" && !f.allowStateReads && f.observableRequiresReaction && console.warn("[mobx] Observable '" + e.name_ + "' being read outside a reactive context.");
}
function pi(e, t, n) {
  var r = zn(!0);
  bi(e), e.newObserving_ = new Array(
    // Reserve constant space for initial dependencies, dynamic space otherwise.
    // See https://github.com/mobxjs/mobx/pull/3833
    e.runId_ === 0 ? 100 : e.observing_.length
  ), e.unboundDepsCount_ = 0, e.runId_ = ++f.runId;
  var i = f.trackingDerivation;
  f.trackingDerivation = e, f.inBatch++;
  var o;
  if (f.disableErrorBoundaries === !0)
    o = t.call(n);
  else
    try {
      o = t.call(n);
    } catch (a) {
      o = new Bt(a);
    }
  return f.inBatch--, f.trackingDerivation = i, ja(e), Ma(e), lt(r), o;
}
function Ma(e) {
  process.env.NODE_ENV !== "production" && e.observing_.length === 0 && (typeof e.requiresObservable_ == "boolean" ? e.requiresObservable_ : f.reactionRequiresObservable) && console.warn("[mobx] Derivation '" + e.name_ + "' is created/updated without reading any observable value.");
}
function ja(e) {
  for (var t = e.observing_, n = e.observing_ = e.newObserving_, r = y.UP_TO_DATE_, i = 0, o = e.unboundDepsCount_, a = 0; a < o; a++) {
    var s = n[a];
    s.diffValue === 0 && (s.diffValue = 1, i !== a && (n[i] = s), i++), s.dependenciesState_ > r && (r = s.dependenciesState_);
  }
  for (n.length = i, e.newObserving_ = null, o = t.length; o--; ) {
    var l = t[o];
    l.diffValue === 0 && mi(l, e), l.diffValue = 0;
  }
  for (; i--; ) {
    var c = n[i];
    c.diffValue === 1 && (c.diffValue = 0, Ua(c, e));
  }
  r !== y.UP_TO_DATE_ && (e.dependenciesState_ = r, e.onBecomeStale_());
}
function _n(e) {
  var t = e.observing_;
  e.observing_ = [];
  for (var n = t.length; n--; )
    mi(t[n], e);
  e.dependenciesState_ = y.NOT_TRACKING_;
}
function gi(e) {
  var t = Ie();
  try {
    return e();
  } finally {
    ae(t);
  }
}
function Ie() {
  var e = f.trackingDerivation;
  return f.trackingDerivation = null, e;
}
function ae(e) {
  f.trackingDerivation = e;
}
function zn(e) {
  var t = f.allowStateReads;
  return f.allowStateReads = e, t;
}
function lt(e) {
  f.allowStateReads = e;
}
function bi(e) {
  if (e.dependenciesState_ !== y.UP_TO_DATE_) {
    e.dependenciesState_ = y.UP_TO_DATE_;
    for (var t = e.observing_, n = t.length; n--; )
      t[n].lowestObserverState_ = y.UP_TO_DATE_;
  }
}
var hn = function() {
  this.version = 6, this.UNCHANGED = {}, this.trackingDerivation = null, this.trackingContext = null, this.runId = 0, this.mobxGuid = 0, this.inBatch = 0, this.pendingUnobservations = [], this.pendingReactions = [], this.isRunningReactions = !1, this.allowStateChanges = !1, this.allowStateReads = !0, this.enforceActions = !0, this.spyListeners = [], this.globalReactionErrorHandlers = [], this.computedRequiresReaction = !1, this.reactionRequiresObservable = !1, this.observableRequiresReaction = !1, this.disableErrorBoundaries = !1, this.suppressReactionErrors = !1, this.useProxies = !0, this.verifyProxies = !1, this.safeDescriptors = !0;
}, vn = !0, f = /* @__PURE__ */ function() {
  var e = /* @__PURE__ */ kn();
  return e.__mobxInstanceCount > 0 && !e.__mobxGlobals && (vn = !1), e.__mobxGlobals && e.__mobxGlobals.version !== new hn().version && (vn = !1), vn ? e.__mobxGlobals ? (e.__mobxInstanceCount += 1, e.__mobxGlobals.UNCHANGED || (e.__mobxGlobals.UNCHANGED = {}), e.__mobxGlobals) : (e.__mobxInstanceCount = 1, e.__mobxGlobals = /* @__PURE__ */ new hn()) : (setTimeout(function() {
    h(35);
  }, 1), new hn());
}();
function Ua(e, t) {
  e.observers_.add(t), e.lowestObserverState_ > t.dependenciesState_ && (e.lowestObserverState_ = t.dependenciesState_);
}
function mi(e, t) {
  e.observers_.delete(t), e.observers_.size === 0 && yi(e);
}
function yi(e) {
  e.isPendingUnobservation === !1 && (e.isPendingUnobservation = !0, f.pendingUnobservations.push(e));
}
function j() {
  f.inBatch++;
}
function U() {
  if (--f.inBatch === 0) {
    Si();
    for (var e = f.pendingUnobservations, t = 0; t < e.length; t++) {
      var n = e[t];
      n.isPendingUnobservation = !1, n.observers_.size === 0 && (n.isBeingObserved && (n.isBeingObserved = !1, n.onBUO()), n instanceof B && n.suspend_());
    }
    f.pendingUnobservations = [];
  }
}
function wi(e) {
  La(e);
  var t = f.trackingDerivation;
  return t !== null ? (t.runId_ !== e.lastAccessedBy_ && (e.lastAccessedBy_ = t.runId_, t.newObserving_[t.unboundDepsCount_++] = e, !e.isBeingObserved && f.trackingContext && (e.isBeingObserved = !0, e.onBO())), e.isBeingObserved) : (e.observers_.size === 0 && f.inBatch > 0 && yi(e), !1);
}
function Ai(e) {
  e.lowestObserverState_ !== y.STALE_ && (e.lowestObserverState_ = y.STALE_, e.observers_.forEach(function(t) {
    t.dependenciesState_ === y.UP_TO_DATE_ && (process.env.NODE_ENV !== "production" && t.isTracing_ !== z.NONE && Ei(t, e), t.onBecomeStale_()), t.dependenciesState_ = y.STALE_;
  }));
}
function za(e) {
  e.lowestObserverState_ !== y.STALE_ && (e.lowestObserverState_ = y.STALE_, e.observers_.forEach(function(t) {
    t.dependenciesState_ === y.POSSIBLY_STALE_ ? (t.dependenciesState_ = y.STALE_, process.env.NODE_ENV !== "production" && t.isTracing_ !== z.NONE && Ei(t, e)) : t.dependenciesState_ === y.UP_TO_DATE_ && (e.lowestObserverState_ = y.UP_TO_DATE_);
  }));
}
function Ba(e) {
  e.lowestObserverState_ === y.UP_TO_DATE_ && (e.lowestObserverState_ = y.POSSIBLY_STALE_, e.observers_.forEach(function(t) {
    t.dependenciesState_ === y.UP_TO_DATE_ && (t.dependenciesState_ = y.POSSIBLY_STALE_, t.onBecomeStale_());
  }));
}
function Ei(e, t) {
  if (console.log("[mobx.trace] '" + e.name_ + "' is invalidated due to a change in: '" + t.name_ + "'"), e.isTracing_ === z.BREAK) {
    var n = [];
    Oi(ns(e), n, 1), new Function(`debugger;
/*
Tracing '` + e.name_ + `'

You are entering this break point because derivation '` + e.name_ + "' is being traced and '" + t.name_ + `' is now forcing it to update.
Just follow the stacktrace you should now see in the devtools to see precisely what piece of your code is causing this update
The stackframe you are looking for is at least ~6-8 stack-frames up.

` + (e instanceof B ? e.derivation.toString().replace(/[*]\//g, "/") : "") + `

The dependencies for this derivation are:

` + n.join(`
`) + `
*/
    `)();
  }
}
function Oi(e, t, n) {
  if (t.length >= 1e3) {
    t.push("(and many more)");
    return;
  }
  t.push("" + "	".repeat(n - 1) + e.name), e.dependencies && e.dependencies.forEach(function(r) {
    return Oi(r, t, n + 1);
  });
}
var $ = /* @__PURE__ */ function() {
  function e(n, r, i, o) {
    n === void 0 && (n = process.env.NODE_ENV !== "production" ? "Reaction@" + F() : "Reaction"), this.name_ = void 0, this.onInvalidate_ = void 0, this.errorHandler_ = void 0, this.requiresObservable_ = void 0, this.observing_ = [], this.newObserving_ = [], this.dependenciesState_ = y.NOT_TRACKING_, this.runId_ = 0, this.unboundDepsCount_ = 0, this.flags_ = 0, this.isTracing_ = z.NONE, this.name_ = n, this.onInvalidate_ = r, this.errorHandler_ = i, this.requiresObservable_ = o;
  }
  var t = e.prototype;
  return t.onBecomeStale_ = function() {
    this.schedule_();
  }, t.schedule_ = function() {
    this.isScheduled || (this.isScheduled = !0, f.pendingReactions.push(this), Si());
  }, t.runReaction_ = function() {
    if (!this.isDisposed) {
      j(), this.isScheduled = !1;
      var r = f.trackingContext;
      if (f.trackingContext = this, xn(this)) {
        this.isTrackPending = !0;
        try {
          this.onInvalidate_(), process.env.NODE_ENV !== "production" && this.isTrackPending && P() && _e({
            name: this.name_,
            type: "scheduled-reaction"
          });
        } catch (i) {
          this.reportExceptionInDerivation_(i);
        }
      }
      f.trackingContext = r, U();
    }
  }, t.track = function(r) {
    if (!this.isDisposed) {
      j();
      var i = P(), o;
      process.env.NODE_ENV !== "production" && i && (o = Date.now(), V({
        name: this.name_,
        type: "reaction"
      })), this.isRunning = !0;
      var a = f.trackingContext;
      f.trackingContext = this;
      var s = pi(this, r, void 0);
      f.trackingContext = a, this.isRunning = !1, this.isTrackPending = !1, this.isDisposed && _n(this), Vt(s) && this.reportExceptionInDerivation_(s.cause), process.env.NODE_ENV !== "production" && i && I({
        time: Date.now() - o
      }), U();
    }
  }, t.reportExceptionInDerivation_ = function(r) {
    var i = this;
    if (this.errorHandler_) {
      this.errorHandler_(r, this);
      return;
    }
    if (f.disableErrorBoundaries)
      throw r;
    var o = process.env.NODE_ENV !== "production" ? "[mobx] Encountered an uncaught exception that was thrown by a reaction or observer component, in: '" + this + "'" : "[mobx] uncaught error in '" + this + "'";
    f.suppressReactionErrors ? process.env.NODE_ENV !== "production" && console.warn("[mobx] (error in reaction '" + this.name_ + "' suppressed, fix error of causing action below)") : console.error(o, r), process.env.NODE_ENV !== "production" && P() && _e({
      type: "error",
      name: this.name_,
      message: o,
      error: "" + r
    }), f.globalReactionErrorHandlers.forEach(function(a) {
      return a(r, i);
    });
  }, t.dispose = function() {
    this.isDisposed || (this.isDisposed = !0, this.isRunning || (j(), _n(this), U()));
  }, t.getDisposer_ = function(r) {
    var i = this, o = function a() {
      i.dispose(), r == null || r.removeEventListener == null || r.removeEventListener("abort", a);
    };
    return r == null || r.addEventListener == null || r.addEventListener("abort", o), o[b] = this, o;
  }, t.toString = function() {
    return "Reaction[" + this.name_ + "]";
  }, t.trace = function(r) {
    r === void 0 && (r = !1), ss(this, r);
  }, He(e, [{
    key: "isDisposed",
    get: function() {
      return T(this.flags_, e.isDisposedMask_);
    },
    set: function(r) {
      this.flags_ = R(this.flags_, e.isDisposedMask_, r);
    }
  }, {
    key: "isScheduled",
    get: function() {
      return T(this.flags_, e.isScheduledMask_);
    },
    set: function(r) {
      this.flags_ = R(this.flags_, e.isScheduledMask_, r);
    }
  }, {
    key: "isTrackPending",
    get: function() {
      return T(this.flags_, e.isTrackPendingMask_);
    },
    set: function(r) {
      this.flags_ = R(this.flags_, e.isTrackPendingMask_, r);
    }
  }, {
    key: "isRunning",
    get: function() {
      return T(this.flags_, e.isRunningMask_);
    },
    set: function(r) {
      this.flags_ = R(this.flags_, e.isRunningMask_, r);
    }
  }, {
    key: "diffValue",
    get: function() {
      return T(this.flags_, e.diffValueMask_) ? 1 : 0;
    },
    set: function(r) {
      this.flags_ = R(this.flags_, e.diffValueMask_, r === 1);
    }
  }]);
}();
$.isDisposedMask_ = 1;
$.isScheduledMask_ = 2;
$.isTrackPendingMask_ = 4;
$.isRunningMask_ = 8;
$.diffValueMask_ = 16;
function Fa(e) {
  return f.globalReactionErrorHandlers.push(e), function() {
    var t = f.globalReactionErrorHandlers.indexOf(e);
    t >= 0 && f.globalReactionErrorHandlers.splice(t, 1);
  };
}
var ar = 100, Wa = function(t) {
  return t();
};
function Si() {
  f.inBatch > 0 || f.isRunningReactions || Wa(Za);
}
function Za() {
  f.isRunningReactions = !0;
  for (var e = f.pendingReactions, t = 0; e.length > 0; ) {
    ++t === ar && (console.error(process.env.NODE_ENV !== "production" ? "Reaction doesn't converge to a stable state after " + ar + " iterations." + (" Probably there is a cycle in the reactive function: " + e[0]) : "[mobx] cycle in reaction: " + e[0]), e.splice(0));
    for (var n = e.splice(0), r = 0, i = n.length; r < i; r++)
      n[r].runReaction_();
  }
  f.isRunningReactions = !1;
}
var Ft = /* @__PURE__ */ Ve("Reaction", $);
function P() {
  return process.env.NODE_ENV !== "production" && !!f.spyListeners.length;
}
function _e(e) {
  if (process.env.NODE_ENV !== "production" && f.spyListeners.length)
    for (var t = f.spyListeners, n = 0, r = t.length; n < r; n++)
      t[n](e);
}
function V(e) {
  if (process.env.NODE_ENV !== "production") {
    var t = de({}, e, {
      spyReportStart: !0
    });
    _e(t);
  }
}
var Ga = {
  type: "report-end",
  spyReportEnd: !0
};
function I(e) {
  process.env.NODE_ENV !== "production" && _e(e ? de({}, e, {
    type: "report-end",
    spyReportEnd: !0
  }) : Ga);
}
function qa(e) {
  return process.env.NODE_ENV === "production" ? (console.warn("[mobx.spy] Is a no-op in production builds"), function() {
  }) : (f.spyListeners.push(e), Mn(function() {
    f.spyListeners = f.spyListeners.filter(function(t) {
      return t !== e;
    });
  }));
}
var Bn = "action", Ka = "action.bound", Ni = "autoAction", Ha = "autoAction.bound", xi = "<unnamed action>", Pn = /* @__PURE__ */ Et(Bn), Ja = /* @__PURE__ */ Et(Ka, {
  bound: !0
}), Cn = /* @__PURE__ */ Et(Ni, {
  autoAction: !0
}), Xa = /* @__PURE__ */ Et(Ha, {
  autoAction: !0,
  bound: !0
});
function _i(e) {
  var t = function(r, i) {
    if (S(r))
      return xe(r.name || xi, r, e);
    if (S(i))
      return xe(r, i, e);
    if (At(i))
      return (e ? Cn : Pn).decorate_20223_(r, i);
    if (Se(i))
      return wt(r, i, e ? Cn : Pn);
    if (Se(r))
      return Q(Et(e ? Ni : Bn, {
        name: r,
        autoAction: e
      }));
    process.env.NODE_ENV !== "production" && h("Invalid arguments for `action`");
  };
  return t;
}
var Ae = /* @__PURE__ */ _i(!1);
Object.assign(Ae, Pn);
var vt = /* @__PURE__ */ _i(!0);
Object.assign(vt, Cn);
Ae.bound = /* @__PURE__ */ Q(Ja);
vt.bound = /* @__PURE__ */ Q(Xa);
function Uc(e) {
  return vi(e.name || xi, !1, e, this, void 0);
}
function We(e) {
  return S(e) && e.isMobxAction === !0;
}
function Pi(e, t) {
  var n, r, i, o;
  t === void 0 && (t = Ln), process.env.NODE_ENV !== "production" && (S(e) || h("Autorun expects a function as first argument"), We(e) && h("Autorun does not accept actions since actions are untrackable"));
  var a = (n = (r = t) == null ? void 0 : r.name) != null ? n : process.env.NODE_ENV !== "production" ? e.name || "Autorun@" + F() : "Autorun", s = !t.scheduler && !t.delay, l;
  if (s)
    l = new $(a, function() {
      this.track(d);
    }, t.onError, t.requiresObservable);
  else {
    var c = Ci(t), u = !1;
    l = new $(a, function() {
      u || (u = !0, c(function() {
        u = !1, l.isDisposed || l.track(d);
      }));
    }, t.onError, t.requiresObservable);
  }
  function d() {
    e(l);
  }
  return (i = t) != null && (i = i.signal) != null && i.aborted || l.schedule_(), l.getDisposer_((o = t) == null ? void 0 : o.signal);
}
var Ya = function(t) {
  return t();
};
function Ci(e) {
  return e.scheduler ? e.scheduler : e.delay ? function(t) {
    return setTimeout(t, e.delay);
  } : Ya;
}
function Di(e, t, n) {
  var r, i, o;
  n === void 0 && (n = Ln), process.env.NODE_ENV !== "production" && ((!S(e) || !S(t)) && h("First and second argument to reaction should be functions"), C(n) || h("Third argument of reactions should be an object"));
  var a = (r = n.name) != null ? r : process.env.NODE_ENV !== "production" ? "Reaction@" + F() : "Reaction", s = Ae(a, n.onError ? Qa(n.onError, t) : t), l = !n.scheduler && !n.delay, c = Ci(n), u = !0, d = !1, v, g = n.compareStructural ? Fe.structural : n.equals || Fe.default, m = new $(a, function() {
    u || l ? E() : d || (d = !0, c(E));
  }, n.onError, n.requiresObservable);
  function E() {
    if (d = !1, !m.isDisposed) {
      var x = !1, H = v;
      m.track(function() {
        var Me = Ia(!1, function() {
          return e(m);
        });
        x = u || !g(v, Me), v = Me;
      }), (u && n.fireImmediately || !u && x) && s(v, H, m), u = !1;
    }
  }
  return (i = n) != null && (i = i.signal) != null && i.aborted || m.schedule_(), m.getDisposer_((o = n) == null ? void 0 : o.signal);
}
function Qa(e, t) {
  return function() {
    try {
      return t.apply(this, arguments);
    } catch (n) {
      e.call(this, n);
    }
  };
}
var $a = "onBO", es = "onBUO";
function ts(e, t, n) {
  return Ri($a, e, t, n);
}
function Ti(e, t, n) {
  return Ri(es, e, t, n);
}
function Ri(e, t, n, r) {
  var i = Ge(t), o = S(r) ? r : n, a = e + "L";
  return i[a] ? i[a].add(o) : i[a] = /* @__PURE__ */ new Set([o]), function() {
    var s = i[a];
    s && (s.delete(o), s.size === 0 && delete i[a]);
  };
}
function Vi(e, t, n, r) {
  process.env.NODE_ENV !== "production" && (arguments.length > 4 && h("'extendObservable' expected 2-4 arguments"), typeof e != "object" && h("'extendObservable' expects an object as first argument"), pe(e) && h("'extendObservable' should not be used on maps, use map.merge instead"), C(t) || h("'extendObservable' only accepts plain objects as second argument"), (gt(t) || gt(n)) && h("Extending an object with another observable (object) is not supported"));
  var i = jo(t);
  return ke(function() {
    var o = Je(e, r)[b];
    ht(i).forEach(function(a) {
      o.extend_(
        a,
        i[a],
        // must pass "undefined" for { key: undefined }
        n && a in n ? n[a] : !0
      );
    });
  }), e;
}
function ns(e, t) {
  return Ii(Ge(e, t));
}
function Ii(e) {
  var t = {
    name: e.name_
  };
  return e.observing_ && e.observing_.length > 0 && (t.dependencies = rs(e.observing_).map(Ii)), t;
}
function rs(e) {
  return Array.from(new Set(e));
}
var is = 0;
function ki() {
  this.message = "FLOW_CANCELLED";
}
ki.prototype = /* @__PURE__ */ Object.create(Error.prototype);
var pn = /* @__PURE__ */ si("flow"), os = /* @__PURE__ */ si("flow.bound", {
  bound: !0
}), Ze = /* @__PURE__ */ Object.assign(function(t, n) {
  if (At(n))
    return pn.decorate_20223_(t, n);
  if (Se(n))
    return wt(t, n, pn);
  process.env.NODE_ENV !== "production" && arguments.length !== 1 && h("Flow expects single argument with generator function");
  var r = t, i = r.name || "<unnamed flow>", o = function() {
    var s = this, l = arguments, c = ++is, u = Ae(i + " - runid: " + c + " - init", r).apply(s, l), d, v = void 0, g = new Promise(function(m, E) {
      var x = 0;
      d = E;
      function H(D) {
        v = void 0;
        var le;
        try {
          le = Ae(i + " - runid: " + c + " - yield " + x++, u.next).call(u, D);
        } catch (ge) {
          return E(ge);
        }
        Qe(le);
      }
      function Me(D) {
        v = void 0;
        var le;
        try {
          le = Ae(i + " - runid: " + c + " - yield " + x++, u.throw).call(u, D);
        } catch (ge) {
          return E(ge);
        }
        Qe(le);
      }
      function Qe(D) {
        if (S(D?.then)) {
          D.then(Qe, E);
          return;
        }
        return D.done ? m(D.value) : (v = Promise.resolve(D.value), v.then(H, Me));
      }
      H(void 0);
    });
    return g.cancel = Ae(i + " - runid: " + c + " - cancel", function() {
      try {
        v && sr(v);
        var m = u.return(void 0), E = Promise.resolve(m.value);
        E.then(ze, ze), sr(E), d(new ki());
      } catch (x) {
        d(x);
      }
    }), g;
  };
  return o.isMobXFlow = !0, o;
}, pn);
Ze.bound = /* @__PURE__ */ Q(os);
function sr(e) {
  S(e.cancel) && e.cancel();
}
function pt(e) {
  return e?.isMobXFlow === !0;
}
function as(e, t) {
  return e ? Xe(e) || !!e[b] || jn(e) || Ft(e) || sn(e) : !1;
}
function gt(e) {
  return process.env.NODE_ENV !== "production" && arguments.length !== 1 && h("isObservable expects only 1 argument. Use isObservableProp to inspect the observability of a property"), as(e);
}
function ss() {
  if (process.env.NODE_ENV !== "production") {
    for (var e = !1, t = arguments.length, n = new Array(t), r = 0; r < t; r++)
      n[r] = arguments[r];
    typeof n[n.length - 1] == "boolean" && (e = n.pop());
    var i = ls(n);
    if (!i)
      return h("'trace(break?)' can only be used inside a tracked computed value or a Reaction. Consider passing in the computed value or reaction explicitly");
    i.isTracing_ === z.NONE && console.log("[mobx.trace] '" + i.name_ + "' tracing enabled"), i.isTracing_ = e ? z.BREAK : z.LOG;
  }
}
function ls(e) {
  switch (e.length) {
    case 0:
      return f.trackingDerivation;
    case 1:
      return Ge(e[0]);
    case 2:
      return Ge(e[0], e[1]);
  }
}
function ie(e, t) {
  t === void 0 && (t = void 0), j();
  try {
    return e.apply(t);
  } finally {
    U();
  }
}
function be(e) {
  return e[b];
}
var cs = {
  has: function(t, n) {
    return process.env.NODE_ENV !== "production" && f.trackingDerivation && $e("detect new properties using the 'in' operator. Use 'has' from 'mobx' instead."), be(t).has_(n);
  },
  get: function(t, n) {
    return be(t).get_(n);
  },
  set: function(t, n, r) {
    var i;
    return Se(n) ? (process.env.NODE_ENV !== "production" && !be(t).values_.has(n) && $e("add a new observable property through direct assignment. Use 'set' from 'mobx' instead."), (i = be(t).set_(n, r, !0)) != null ? i : !0) : !1;
  },
  deleteProperty: function(t, n) {
    var r;
    return process.env.NODE_ENV !== "production" && $e("delete properties from an observable object. Use 'remove' from 'mobx' instead."), Se(n) ? (r = be(t).delete_(n, !0)) != null ? r : !0 : !1;
  },
  defineProperty: function(t, n, r) {
    var i;
    return process.env.NODE_ENV !== "production" && $e("define property on an observable object. Use 'defineProperty' from 'mobx' instead."), (i = be(t).defineProperty_(n, r)) != null ? i : !0;
  },
  ownKeys: function(t) {
    return process.env.NODE_ENV !== "production" && f.trackingDerivation && $e("iterate keys to detect added / removed properties. Use 'keys' from 'mobx' instead."), be(t).ownKeys_();
  },
  preventExtensions: function(t) {
    h(13);
  }
};
function us(e, t) {
  var n, r;
  return $r(), e = Je(e, t), (r = (n = e[b]).proxy_) != null ? r : n.proxy_ = new Proxy(e, cs);
}
function L(e) {
  return e.interceptors_ !== void 0 && e.interceptors_.length > 0;
}
function Ot(e, t) {
  var n = e.interceptors_ || (e.interceptors_ = []);
  return n.push(t), Mn(function() {
    var r = n.indexOf(t);
    r !== -1 && n.splice(r, 1);
  });
}
function M(e, t) {
  var n = Ie();
  try {
    for (var r = [].concat(e.interceptors_ || []), i = 0, o = r.length; i < o && (t = r[i](t), t && !t.type && h(14), !!t); i++)
      ;
    return t;
  } finally {
    ae(n);
  }
}
function G(e) {
  return e.changeListeners_ !== void 0 && e.changeListeners_.length > 0;
}
function St(e, t) {
  var n = e.changeListeners_ || (e.changeListeners_ = []);
  return n.push(t), Mn(function() {
    var r = n.indexOf(t);
    r !== -1 && n.splice(r, 1);
  });
}
function q(e, t) {
  var n = Ie(), r = e.changeListeners_;
  if (r) {
    r = r.slice();
    for (var i = 0, o = r.length; i < o; i++)
      r[i](t);
    ae(n);
  }
}
var gn = /* @__PURE__ */ Symbol("mobx-keys");
function ln(e, t, n) {
  return process.env.NODE_ENV !== "production" && (!C(e) && !C(Object.getPrototypeOf(e)) && h("'makeAutoObservable' can only be used for classes that don't have a superclass"), Xe(e) && h("makeAutoObservable can only be used on objects not already made observable")), C(e) ? Vi(e, e, t, n) : (ke(function() {
    var r = Je(e, n)[b];
    if (!e[gn]) {
      var i = Object.getPrototypeOf(e), o = new Set([].concat(ht(e), ht(i)));
      o.delete("constructor"), o.delete(b), $t(i, gn, o);
    }
    e[gn].forEach(function(a) {
      return r.make_(
        a,
        // must pass "undefined" for { key: undefined }
        t && a in t ? t[a] : !0
      );
    });
  }), e);
}
var lr = "splice", W = "update", ds = 1e4, fs = {
  get: function(t, n) {
    var r = t[b];
    return n === b ? r : n === "length" ? r.getArrayLength_() : typeof n == "string" && !isNaN(n) ? r.get_(parseInt(n)) : Z(Wt, n) ? Wt[n] : t[n];
  },
  set: function(t, n, r) {
    var i = t[b];
    return n === "length" && i.setArrayLength_(r), typeof n == "symbol" || isNaN(n) ? t[n] = r : i.set_(parseInt(n), r), !0;
  },
  preventExtensions: function() {
    h(15);
  }
}, Fn = /* @__PURE__ */ function() {
  function e(n, r, i, o) {
    n === void 0 && (n = process.env.NODE_ENV !== "production" ? "ObservableArray@" + F() : "ObservableArray"), this.owned_ = void 0, this.legacyMode_ = void 0, this.atom_ = void 0, this.values_ = [], this.interceptors_ = void 0, this.changeListeners_ = void 0, this.enhancer_ = void 0, this.dehancer = void 0, this.proxy_ = void 0, this.lastKnownLength_ = 0, this.owned_ = i, this.legacyMode_ = o, this.atom_ = new ve(n), this.enhancer_ = function(a, s) {
      return r(a, s, process.env.NODE_ENV !== "production" ? n + "[..]" : "ObservableArray[..]");
    };
  }
  var t = e.prototype;
  return t.dehanceValue_ = function(r) {
    return this.dehancer !== void 0 ? this.dehancer(r) : r;
  }, t.dehanceValues_ = function(r) {
    return this.dehancer !== void 0 && r.length > 0 ? r.map(this.dehancer) : r;
  }, t.intercept_ = function(r) {
    return Ot(this, r);
  }, t.observe_ = function(r, i) {
    return i === void 0 && (i = !1), i && r({
      observableKind: "array",
      object: this.proxy_,
      debugObjectName: this.atom_.name_,
      type: "splice",
      index: 0,
      added: this.values_.slice(),
      addedCount: this.values_.length,
      removed: [],
      removedCount: 0
    }), St(this, r);
  }, t.getArrayLength_ = function() {
    return this.atom_.reportObserved(), this.values_.length;
  }, t.setArrayLength_ = function(r) {
    (typeof r != "number" || isNaN(r) || r < 0) && h("Out of range: " + r);
    var i = this.values_.length;
    if (r !== i)
      if (r > i) {
        for (var o = new Array(r - i), a = 0; a < r - i; a++)
          o[a] = void 0;
        this.spliceWithArray_(i, 0, o);
      } else
        this.spliceWithArray_(r, i - r);
  }, t.updateArrayLength_ = function(r, i) {
    r !== this.lastKnownLength_ && h(16), this.lastKnownLength_ += i, this.legacyMode_ && i > 0 && Bi(r + i + 1);
  }, t.spliceWithArray_ = function(r, i, o) {
    var a = this;
    X(this.atom_);
    var s = this.values_.length;
    if (r === void 0 ? r = 0 : r > s ? r = s : r < 0 && (r = Math.max(0, s + r)), arguments.length === 1 ? i = s - r : i == null ? i = 0 : i = Math.max(0, Math.min(i, s - r)), o === void 0 && (o = jt), L(this)) {
      var l = M(this, {
        object: this.proxy_,
        type: lr,
        index: r,
        removedCount: i,
        added: o
      });
      if (!l)
        return jt;
      i = l.removedCount, o = l.added;
    }
    if (o = o.length === 0 ? o : o.map(function(d) {
      return a.enhancer_(d, void 0);
    }), this.legacyMode_ || process.env.NODE_ENV !== "production") {
      var c = o.length - i;
      this.updateArrayLength_(s, c);
    }
    var u = this.spliceItemsIntoValues_(r, i, o);
    return (i !== 0 || o.length !== 0) && this.notifyArraySplice_(r, o, u), this.dehanceValues_(u);
  }, t.spliceItemsIntoValues_ = function(r, i, o) {
    if (o.length < ds) {
      var a;
      return (a = this.values_).splice.apply(a, [r, i].concat(o));
    } else {
      var s = this.values_.slice(r, r + i), l = this.values_.slice(r + i);
      this.values_.length += o.length - i;
      for (var c = 0; c < o.length; c++)
        this.values_[r + c] = o[c];
      for (var u = 0; u < l.length; u++)
        this.values_[r + o.length + u] = l[u];
      return s;
    }
  }, t.notifyArrayChildUpdate_ = function(r, i, o) {
    var a = !this.owned_ && P(), s = G(this), l = s || a ? {
      observableKind: "array",
      object: this.proxy_,
      type: W,
      debugObjectName: this.atom_.name_,
      index: r,
      newValue: i,
      oldValue: o
    } : null;
    process.env.NODE_ENV !== "production" && a && V(l), this.atom_.reportChanged(), s && q(this, l), process.env.NODE_ENV !== "production" && a && I();
  }, t.notifyArraySplice_ = function(r, i, o) {
    var a = !this.owned_ && P(), s = G(this), l = s || a ? {
      observableKind: "array",
      object: this.proxy_,
      debugObjectName: this.atom_.name_,
      type: lr,
      index: r,
      removed: o,
      added: i,
      removedCount: o.length,
      addedCount: i.length
    } : null;
    process.env.NODE_ENV !== "production" && a && V(l), this.atom_.reportChanged(), s && q(this, l), process.env.NODE_ENV !== "production" && a && I();
  }, t.get_ = function(r) {
    if (this.legacyMode_ && r >= this.values_.length) {
      console.warn(process.env.NODE_ENV !== "production" ? "[mobx.array] Attempt to read an array index (" + r + ") that is out of bounds (" + this.values_.length + "). Please check length first. Out of bound indices will not be tracked by MobX" : "[mobx] Out of bounds read: " + r);
      return;
    }
    return this.atom_.reportObserved(), this.dehanceValue_(this.values_[r]);
  }, t.set_ = function(r, i) {
    var o = this.values_;
    if (this.legacyMode_ && r > o.length && h(17, r, o.length), r < o.length) {
      X(this.atom_);
      var a = o[r];
      if (L(this)) {
        var s = M(this, {
          type: W,
          object: this.proxy_,
          // since "this" is the real array we need to pass its proxy
          index: r,
          newValue: i
        });
        if (!s)
          return;
        i = s.newValue;
      }
      i = this.enhancer_(i, a);
      var l = i !== a;
      l && (o[r] = i, this.notifyArrayChildUpdate_(r, i, a));
    } else {
      for (var c = new Array(r + 1 - o.length), u = 0; u < c.length - 1; u++)
        c[u] = void 0;
      c[c.length - 1] = i, this.spliceWithArray_(o.length, 0, c);
    }
  }, e;
}();
function hs(e, t, n, r) {
  return n === void 0 && (n = process.env.NODE_ENV !== "production" ? "ObservableArray@" + F() : "ObservableArray"), r === void 0 && (r = !1), $r(), ke(function() {
    var i = new Fn(n, t, r, !1);
    ti(i.values_, b, i);
    var o = new Proxy(i.values_, fs);
    return i.proxy_ = o, e && e.length && i.spliceWithArray_(0, 0, e), o;
  });
}
var Wt = {
  clear: function() {
    return this.splice(0);
  },
  replace: function(t) {
    var n = this[b];
    return n.spliceWithArray_(0, n.values_.length, t);
  },
  // Used by JSON.stringify
  toJSON: function() {
    return this.slice();
  },
  /*
   * functions that do alter the internal structure of the array, (based on lib.es6.d.ts)
   * since these functions alter the inner structure of the array, the have side effects.
   * Because the have side effects, they should not be used in computed function,
   * and for that reason the do not call dependencyState.notifyObserved
   */
  splice: function(t, n) {
    for (var r = arguments.length, i = new Array(r > 2 ? r - 2 : 0), o = 2; o < r; o++)
      i[o - 2] = arguments[o];
    var a = this[b];
    switch (arguments.length) {
      case 0:
        return [];
      case 1:
        return a.spliceWithArray_(t);
      case 2:
        return a.spliceWithArray_(t, n);
    }
    return a.spliceWithArray_(t, n, i);
  },
  spliceWithArray: function(t, n, r) {
    return this[b].spliceWithArray_(t, n, r);
  },
  push: function() {
    for (var t = this[b], n = arguments.length, r = new Array(n), i = 0; i < n; i++)
      r[i] = arguments[i];
    return t.spliceWithArray_(t.values_.length, 0, r), t.values_.length;
  },
  pop: function() {
    return this.splice(Math.max(this[b].values_.length - 1, 0), 1)[0];
  },
  shift: function() {
    return this.splice(0, 1)[0];
  },
  unshift: function() {
    for (var t = this[b], n = arguments.length, r = new Array(n), i = 0; i < n; i++)
      r[i] = arguments[i];
    return t.spliceWithArray_(0, 0, r), t.values_.length;
  },
  reverse: function() {
    return f.trackingDerivation && h(37, "reverse"), this.replace(this.slice().reverse()), this;
  },
  sort: function() {
    f.trackingDerivation && h(37, "sort");
    var t = this.slice();
    return t.sort.apply(t, arguments), this.replace(t), this;
  },
  remove: function(t) {
    var n = this[b], r = n.dehanceValues_(n.values_).indexOf(t);
    return r > -1 ? (this.splice(r, 1), !0) : !1;
  }
};
w("at", k);
w("concat", k);
w("flat", k);
w("includes", k);
w("indexOf", k);
w("join", k);
w("lastIndexOf", k);
w("slice", k);
w("toString", k);
w("toLocaleString", k);
w("toSorted", k);
w("toSpliced", k);
w("with", k);
w("every", K);
w("filter", K);
w("find", K);
w("findIndex", K);
w("findLast", K);
w("findLastIndex", K);
w("flatMap", K);
w("forEach", K);
w("map", K);
w("some", K);
w("toReversed", K);
w("reduce", Li);
w("reduceRight", Li);
function w(e, t) {
  typeof Array.prototype[e] == "function" && (Wt[e] = t(e));
}
function k(e) {
  return function() {
    var t = this[b];
    t.atom_.reportObserved();
    var n = t.dehanceValues_(t.values_);
    return n[e].apply(n, arguments);
  };
}
function K(e) {
  return function(t, n) {
    var r = this, i = this[b];
    i.atom_.reportObserved();
    var o = i.dehanceValues_(i.values_);
    return o[e](function(a, s) {
      return t.call(n, a, s, r);
    });
  };
}
function Li(e) {
  return function() {
    var t = this, n = this[b];
    n.atom_.reportObserved();
    var r = n.dehanceValues_(n.values_), i = arguments[0];
    return arguments[0] = function(o, a, s) {
      return i(o, a, s, t);
    }, r[e].apply(r, arguments);
  };
}
var vs = /* @__PURE__ */ Ve("ObservableArrayAdministration", Fn);
function cn(e) {
  return Qt(e) && vs(e[b]);
}
var ps = {}, ce = "add", Zt = "delete", Mi = /* @__PURE__ */ function() {
  function e(n, r, i) {
    var o = this;
    r === void 0 && (r = Ne), i === void 0 && (i = process.env.NODE_ENV !== "production" ? "ObservableMap@" + F() : "ObservableMap"), this.enhancer_ = void 0, this.name_ = void 0, this[b] = ps, this.data_ = void 0, this.hasMap_ = void 0, this.keysAtom_ = void 0, this.interceptors_ = void 0, this.changeListeners_ = void 0, this.dehancer = void 0, this.enhancer_ = r, this.name_ = i, S(Map) || h(18), ke(function() {
      o.keysAtom_ = oi(process.env.NODE_ENV !== "production" ? o.name_ + ".keys()" : "ObservableMap.keys()"), o.data_ = /* @__PURE__ */ new Map(), o.hasMap_ = /* @__PURE__ */ new Map(), n && o.merge(n);
    });
  }
  var t = e.prototype;
  return t.has_ = function(r) {
    return this.data_.has(r);
  }, t.has = function(r) {
    var i = this;
    if (!f.trackingDerivation)
      return this.has_(r);
    var o = this.hasMap_.get(r);
    if (!o) {
      var a = o = new Oe(this.has_(r), tn, process.env.NODE_ENV !== "production" ? this.name_ + "." + En(r) + "?" : "ObservableMap.key?", !1);
      this.hasMap_.set(r, a), Ti(a, function() {
        return i.hasMap_.delete(r);
      });
    }
    return o.get();
  }, t.set = function(r, i) {
    var o = this.has_(r);
    if (L(this)) {
      var a = M(this, {
        type: o ? W : ce,
        object: this,
        newValue: i,
        name: r
      });
      if (!a)
        return this;
      i = a.newValue;
    }
    return o ? this.updateValue_(r, i) : this.addValue_(r, i), this;
  }, t.delete = function(r) {
    var i = this;
    if (X(this.keysAtom_), L(this)) {
      var o = M(this, {
        type: Zt,
        object: this,
        name: r
      });
      if (!o)
        return !1;
    }
    if (this.has_(r)) {
      var a = P(), s = G(this), l = s || a ? {
        observableKind: "map",
        debugObjectName: this.name_,
        type: Zt,
        object: this,
        oldValue: this.data_.get(r).value_,
        name: r
      } : null;
      return process.env.NODE_ENV !== "production" && a && V(l), ie(function() {
        var c;
        i.keysAtom_.reportChanged(), (c = i.hasMap_.get(r)) == null || c.setNewValue_(!1);
        var u = i.data_.get(r);
        u.setNewValue_(void 0), i.data_.delete(r);
      }), s && q(this, l), process.env.NODE_ENV !== "production" && a && I(), !0;
    }
    return !1;
  }, t.updateValue_ = function(r, i) {
    var o = this.data_.get(r);
    if (i = o.prepareNewValue_(i), i !== f.UNCHANGED) {
      var a = P(), s = G(this), l = s || a ? {
        observableKind: "map",
        debugObjectName: this.name_,
        type: W,
        object: this,
        oldValue: o.value_,
        name: r,
        newValue: i
      } : null;
      process.env.NODE_ENV !== "production" && a && V(l), o.setNewValue_(i), s && q(this, l), process.env.NODE_ENV !== "production" && a && I();
    }
  }, t.addValue_ = function(r, i) {
    var o = this;
    X(this.keysAtom_), ie(function() {
      var c, u = new Oe(i, o.enhancer_, process.env.NODE_ENV !== "production" ? o.name_ + "." + En(r) : "ObservableMap.key", !1);
      o.data_.set(r, u), i = u.value_, (c = o.hasMap_.get(r)) == null || c.setNewValue_(!0), o.keysAtom_.reportChanged();
    });
    var a = P(), s = G(this), l = s || a ? {
      observableKind: "map",
      debugObjectName: this.name_,
      type: ce,
      object: this,
      name: r,
      newValue: i
    } : null;
    process.env.NODE_ENV !== "production" && a && V(l), s && q(this, l), process.env.NODE_ENV !== "production" && a && I();
  }, t.get = function(r) {
    return this.has(r) ? this.dehanceValue_(this.data_.get(r).get()) : this.dehanceValue_(void 0);
  }, t.dehanceValue_ = function(r) {
    return this.dehancer !== void 0 ? this.dehancer(r) : r;
  }, t.keys = function() {
    return this.keysAtom_.reportObserved(), this.data_.keys();
  }, t.values = function() {
    var r = this, i = this.keys();
    return cr({
      next: function() {
        var a = i.next(), s = a.done, l = a.value;
        return {
          done: s,
          value: s ? void 0 : r.get(l)
        };
      }
    });
  }, t.entries = function() {
    var r = this, i = this.keys();
    return cr({
      next: function() {
        var a = i.next(), s = a.done, l = a.value;
        return {
          done: s,
          value: s ? void 0 : [l, r.get(l)]
        };
      }
    });
  }, t[Symbol.iterator] = function() {
    return this.entries();
  }, t.forEach = function(r, i) {
    for (var o = Be(this), a; !(a = o()).done; ) {
      var s = a.value, l = s[0], c = s[1];
      r.call(i, c, l, this);
    }
  }, t.merge = function(r) {
    var i = this;
    return pe(r) && (r = new Map(r)), ie(function() {
      C(r) ? Mo(r).forEach(function(o) {
        return i.set(o, r[o]);
      }) : Array.isArray(r) ? r.forEach(function(o) {
        var a = o[0], s = o[1];
        return i.set(a, s);
      }) : Ke(r) ? (Lo(r) || h(19, r), r.forEach(function(o, a) {
        return i.set(a, o);
      })) : r != null && h(20, r);
    }), this;
  }, t.clear = function() {
    var r = this;
    ie(function() {
      gi(function() {
        for (var i = Be(r.keys()), o; !(o = i()).done; ) {
          var a = o.value;
          r.delete(a);
        }
      });
    });
  }, t.replace = function(r) {
    var i = this;
    return ie(function() {
      for (var o = gs(r), a = /* @__PURE__ */ new Map(), s = !1, l = Be(i.data_.keys()), c; !(c = l()).done; ) {
        var u = c.value;
        if (!o.has(u)) {
          var d = i.delete(u);
          if (d)
            s = !0;
          else {
            var v = i.data_.get(u);
            a.set(u, v);
          }
        }
      }
      for (var g = Be(o.entries()), m; !(m = g()).done; ) {
        var E = m.value, x = E[0], H = E[1], Me = i.data_.has(x);
        if (i.set(x, H), i.data_.has(x)) {
          var Qe = i.data_.get(x);
          a.set(x, Qe), Me || (s = !0);
        }
      }
      if (!s)
        if (i.data_.size !== a.size)
          i.keysAtom_.reportChanged();
        else
          for (var D = i.data_.keys(), le = a.keys(), ge = D.next(), tr = le.next(); !ge.done; ) {
            if (ge.value !== tr.value) {
              i.keysAtom_.reportChanged();
              break;
            }
            ge = D.next(), tr = le.next();
          }
      i.data_ = a;
    }), this;
  }, t.toString = function() {
    return "[object ObservableMap]";
  }, t.toJSON = function() {
    return Array.from(this);
  }, t.observe_ = function(r, i) {
    return process.env.NODE_ENV !== "production" && i === !0 && h("`observe` doesn't support fireImmediately=true in combination with maps."), St(this, r);
  }, t.intercept_ = function(r) {
    return Ot(this, r);
  }, He(e, [{
    key: "size",
    get: function() {
      return this.keysAtom_.reportObserved(), this.data_.size;
    }
  }, {
    key: Symbol.toStringTag,
    get: function() {
      return "Map";
    }
  }]);
}(), pe = /* @__PURE__ */ Ve("ObservableMap", Mi);
function cr(e) {
  return e[Symbol.toStringTag] = "MapIterator", Gn(e);
}
function gs(e) {
  if (Ke(e) || pe(e))
    return e;
  if (Array.isArray(e))
    return new Map(e);
  if (C(e)) {
    var t = /* @__PURE__ */ new Map();
    for (var n in e)
      t.set(n, e[n]);
    return t;
  } else
    return h(21, e);
}
var bs = {}, ji = /* @__PURE__ */ function() {
  function e(n, r, i) {
    var o = this;
    r === void 0 && (r = Ne), i === void 0 && (i = process.env.NODE_ENV !== "production" ? "ObservableSet@" + F() : "ObservableSet"), this.name_ = void 0, this[b] = bs, this.data_ = /* @__PURE__ */ new Set(), this.atom_ = void 0, this.changeListeners_ = void 0, this.interceptors_ = void 0, this.dehancer = void 0, this.enhancer_ = void 0, this.name_ = i, S(Set) || h(22), this.enhancer_ = function(a, s) {
      return r(a, s, i);
    }, ke(function() {
      o.atom_ = oi(o.name_), n && o.replace(n);
    });
  }
  var t = e.prototype;
  return t.dehanceValue_ = function(r) {
    return this.dehancer !== void 0 ? this.dehancer(r) : r;
  }, t.clear = function() {
    var r = this;
    ie(function() {
      gi(function() {
        for (var i = Be(r.data_.values()), o; !(o = i()).done; ) {
          var a = o.value;
          r.delete(a);
        }
      });
    });
  }, t.forEach = function(r, i) {
    for (var o = Be(this), a; !(a = o()).done; ) {
      var s = a.value;
      r.call(i, s, s, this);
    }
  }, t.add = function(r) {
    var i = this;
    if (X(this.atom_), L(this)) {
      var o = M(this, {
        type: ce,
        object: this,
        newValue: r
      });
      if (!o)
        return this;
    }
    if (!this.has(r)) {
      ie(function() {
        i.data_.add(i.enhancer_(r, void 0)), i.atom_.reportChanged();
      });
      var a = process.env.NODE_ENV !== "production" && P(), s = G(this), l = s || a ? {
        observableKind: "set",
        debugObjectName: this.name_,
        type: ce,
        object: this,
        newValue: r
      } : null;
      a && process.env.NODE_ENV !== "production" && V(l), s && q(this, l), a && process.env.NODE_ENV !== "production" && I();
    }
    return this;
  }, t.delete = function(r) {
    var i = this;
    if (L(this)) {
      var o = M(this, {
        type: Zt,
        object: this,
        oldValue: r
      });
      if (!o)
        return !1;
    }
    if (this.has(r)) {
      var a = process.env.NODE_ENV !== "production" && P(), s = G(this), l = s || a ? {
        observableKind: "set",
        debugObjectName: this.name_,
        type: Zt,
        object: this,
        oldValue: r
      } : null;
      return a && process.env.NODE_ENV !== "production" && V(l), ie(function() {
        i.atom_.reportChanged(), i.data_.delete(r);
      }), s && q(this, l), a && process.env.NODE_ENV !== "production" && I(), !0;
    }
    return !1;
  }, t.has = function(r) {
    return this.atom_.reportObserved(), this.data_.has(this.dehanceValue_(r));
  }, t.entries = function() {
    var r = 0, i = Array.from(this.keys()), o = Array.from(this.values());
    return ur({
      next: function() {
        var s = r;
        return r += 1, s < o.length ? {
          value: [i[s], o[s]],
          done: !1
        } : {
          value: void 0,
          done: !0
        };
      }
    });
  }, t.keys = function() {
    return this.values();
  }, t.values = function() {
    this.atom_.reportObserved();
    var r = this, i = 0, o = Array.from(this.data_.values());
    return ur({
      next: function() {
        return i < o.length ? {
          value: r.dehanceValue_(o[i++]),
          done: !1
        } : {
          value: void 0,
          done: !0
        };
      }
    });
  }, t.intersection = function(r) {
    if (ne(r) && !J(r))
      return r.intersection(this);
    var i = new Set(this);
    return i.intersection(r);
  }, t.union = function(r) {
    if (ne(r) && !J(r))
      return r.union(this);
    var i = new Set(this);
    return i.union(r);
  }, t.difference = function(r) {
    return new Set(this).difference(r);
  }, t.symmetricDifference = function(r) {
    if (ne(r) && !J(r))
      return r.symmetricDifference(this);
    var i = new Set(this);
    return i.symmetricDifference(r);
  }, t.isSubsetOf = function(r) {
    return new Set(this).isSubsetOf(r);
  }, t.isSupersetOf = function(r) {
    return new Set(this).isSupersetOf(r);
  }, t.isDisjointFrom = function(r) {
    if (ne(r) && !J(r))
      return r.isDisjointFrom(this);
    var i = new Set(this);
    return i.isDisjointFrom(r);
  }, t.replace = function(r) {
    var i = this;
    return J(r) && (r = new Set(r)), ie(function() {
      Array.isArray(r) ? (i.clear(), r.forEach(function(o) {
        return i.add(o);
      })) : ne(r) ? (i.clear(), r.forEach(function(o) {
        return i.add(o);
      })) : r != null && h("Cannot initialize set from " + r);
    }), this;
  }, t.observe_ = function(r, i) {
    return process.env.NODE_ENV !== "production" && i === !0 && h("`observe` doesn't support fireImmediately=true in combination with sets."), St(this, r);
  }, t.intercept_ = function(r) {
    return Ot(this, r);
  }, t.toJSON = function() {
    return Array.from(this);
  }, t.toString = function() {
    return "[object ObservableSet]";
  }, t[Symbol.iterator] = function() {
    return this.values();
  }, He(e, [{
    key: "size",
    get: function() {
      return this.atom_.reportObserved(), this.data_.size;
    }
  }, {
    key: Symbol.toStringTag,
    get: function() {
      return "Set";
    }
  }]);
}(), J = /* @__PURE__ */ Ve("ObservableSet", ji);
function ur(e) {
  return e[Symbol.toStringTag] = "SetIterator", Gn(e);
}
var dr = /* @__PURE__ */ Object.create(null), fr = "remove", Dn = /* @__PURE__ */ function() {
  function e(n, r, i, o) {
    r === void 0 && (r = /* @__PURE__ */ new Map()), o === void 0 && (o = va), this.target_ = void 0, this.values_ = void 0, this.name_ = void 0, this.defaultAnnotation_ = void 0, this.keysAtom_ = void 0, this.changeListeners_ = void 0, this.interceptors_ = void 0, this.proxy_ = void 0, this.isPlainObject_ = void 0, this.appliedAnnotations_ = void 0, this.pendingKeys_ = void 0, this.target_ = n, this.values_ = r, this.name_ = i, this.defaultAnnotation_ = o, this.keysAtom_ = new ve(process.env.NODE_ENV !== "production" ? this.name_ + ".keys" : "ObservableObject.keys"), this.isPlainObject_ = C(this.target_), process.env.NODE_ENV !== "production" && !Wi(this.defaultAnnotation_) && h("defaultAnnotation must be valid annotation"), process.env.NODE_ENV !== "production" && (this.appliedAnnotations_ = {});
  }
  var t = e.prototype;
  return t.getObservablePropValue_ = function(r) {
    return this.values_.get(r).get();
  }, t.setObservablePropValue_ = function(r, i) {
    var o = this.values_.get(r);
    if (o instanceof B)
      return o.set(i), !0;
    if (L(this)) {
      var a = M(this, {
        type: W,
        object: this.proxy_ || this.target_,
        name: r,
        newValue: i
      });
      if (!a)
        return null;
      i = a.newValue;
    }
    if (i = o.prepareNewValue_(i), i !== f.UNCHANGED) {
      var s = G(this), l = process.env.NODE_ENV !== "production" && P(), c = s || l ? {
        type: W,
        observableKind: "object",
        debugObjectName: this.name_,
        object: this.proxy_ || this.target_,
        oldValue: o.value_,
        name: r,
        newValue: i
      } : null;
      process.env.NODE_ENV !== "production" && l && V(c), o.setNewValue_(i), s && q(this, c), process.env.NODE_ENV !== "production" && l && I();
    }
    return !0;
  }, t.get_ = function(r) {
    return f.trackingDerivation && !Z(this.target_, r) && this.has_(r), this.target_[r];
  }, t.set_ = function(r, i, o) {
    return o === void 0 && (o = !1), Z(this.target_, r) ? this.values_.has(r) ? this.setObservablePropValue_(r, i) : o ? Reflect.set(this.target_, r, i) : (this.target_[r] = i, !0) : this.extend_(r, {
      value: i,
      enumerable: !0,
      writable: !0,
      configurable: !0
    }, this.defaultAnnotation_, o);
  }, t.has_ = function(r) {
    if (!f.trackingDerivation)
      return r in this.target_;
    this.pendingKeys_ || (this.pendingKeys_ = /* @__PURE__ */ new Map());
    var i = this.pendingKeys_.get(r);
    return i || (i = new Oe(r in this.target_, tn, process.env.NODE_ENV !== "production" ? this.name_ + "." + En(r) + "?" : "ObservableObject.key?", !1), this.pendingKeys_.set(r, i)), i.get();
  }, t.make_ = function(r, i) {
    if (i === !0 && (i = this.defaultAnnotation_), i !== !1) {
      if (pr(this, i, r), !(r in this.target_)) {
        var o;
        if ((o = this.target_[re]) != null && o[r])
          return;
        h(1, i.annotationType_, this.name_ + "." + r.toString());
      }
      for (var a = this.target_; a && a !== Yt; ) {
        var s = Mt(a, r);
        if (s) {
          var l = i.make_(this, r, s, a);
          if (l === 0)
            return;
          if (l === 1)
            break;
        }
        a = Object.getPrototypeOf(a);
      }
      vr(this, i, r);
    }
  }, t.extend_ = function(r, i, o, a) {
    if (a === void 0 && (a = !1), o === !0 && (o = this.defaultAnnotation_), o === !1)
      return this.defineProperty_(r, i, a);
    pr(this, o, r);
    var s = o.extend_(this, r, i, a);
    return s && vr(this, o, r), s;
  }, t.defineProperty_ = function(r, i, o) {
    o === void 0 && (o = !1), X(this.keysAtom_);
    try {
      j();
      var a = this.delete_(r);
      if (!a)
        return a;
      if (L(this)) {
        var s = M(this, {
          object: this.proxy_ || this.target_,
          name: r,
          type: ce,
          newValue: i.value
        });
        if (!s)
          return null;
        var l = s.newValue;
        i.value !== l && (i = de({}, i, {
          value: l
        }));
      }
      if (o) {
        if (!Reflect.defineProperty(this.target_, r, i))
          return !1;
      } else
        Y(this.target_, r, i);
      this.notifyPropertyAddition_(r, i.value);
    } finally {
      U();
    }
    return !0;
  }, t.defineObservableProperty_ = function(r, i, o, a) {
    a === void 0 && (a = !1), X(this.keysAtom_);
    try {
      j();
      var s = this.delete_(r);
      if (!s)
        return s;
      if (L(this)) {
        var l = M(this, {
          object: this.proxy_ || this.target_,
          name: r,
          type: ce,
          newValue: i
        });
        if (!l)
          return null;
        i = l.newValue;
      }
      var c = hr(r), u = {
        configurable: f.safeDescriptors ? this.isPlainObject_ : !0,
        enumerable: !0,
        get: c.get,
        set: c.set
      };
      if (a) {
        if (!Reflect.defineProperty(this.target_, r, u))
          return !1;
      } else
        Y(this.target_, r, u);
      var d = new Oe(i, o, process.env.NODE_ENV !== "production" ? this.name_ + "." + r.toString() : "ObservableObject.key", !1);
      this.values_.set(r, d), this.notifyPropertyAddition_(r, d.value_);
    } finally {
      U();
    }
    return !0;
  }, t.defineComputedProperty_ = function(r, i, o) {
    o === void 0 && (o = !1), X(this.keysAtom_);
    try {
      j();
      var a = this.delete_(r);
      if (!a)
        return a;
      if (L(this)) {
        var s = M(this, {
          object: this.proxy_ || this.target_,
          name: r,
          type: ce,
          newValue: void 0
        });
        if (!s)
          return null;
      }
      i.name || (i.name = process.env.NODE_ENV !== "production" ? this.name_ + "." + r.toString() : "ObservableObject.key"), i.context = this.proxy_ || this.target_;
      var l = hr(r), c = {
        configurable: f.safeDescriptors ? this.isPlainObject_ : !0,
        enumerable: !1,
        get: l.get,
        set: l.set
      };
      if (o) {
        if (!Reflect.defineProperty(this.target_, r, c))
          return !1;
      } else
        Y(this.target_, r, c);
      this.values_.set(r, new B(i)), this.notifyPropertyAddition_(r, void 0);
    } finally {
      U();
    }
    return !0;
  }, t.delete_ = function(r, i) {
    if (i === void 0 && (i = !1), X(this.keysAtom_), !Z(this.target_, r))
      return !0;
    if (L(this)) {
      var o = M(this, {
        object: this.proxy_ || this.target_,
        name: r,
        type: fr
      });
      if (!o)
        return null;
    }
    try {
      var a;
      j();
      var s = G(this), l = process.env.NODE_ENV !== "production" && P(), c = this.values_.get(r), u = void 0;
      if (!c && (s || l)) {
        var d;
        u = (d = Mt(this.target_, r)) == null ? void 0 : d.value;
      }
      if (i) {
        if (!Reflect.deleteProperty(this.target_, r))
          return !1;
      } else
        delete this.target_[r];
      if (process.env.NODE_ENV !== "production" && delete this.appliedAnnotations_[r], c && (this.values_.delete(r), c instanceof Oe && (u = c.value_), Ai(c)), this.keysAtom_.reportChanged(), (a = this.pendingKeys_) == null || (a = a.get(r)) == null || a.set(r in this.target_), s || l) {
        var v = {
          type: fr,
          observableKind: "object",
          object: this.proxy_ || this.target_,
          debugObjectName: this.name_,
          oldValue: u,
          name: r
        };
        process.env.NODE_ENV !== "production" && l && V(v), s && q(this, v), process.env.NODE_ENV !== "production" && l && I();
      }
    } finally {
      U();
    }
    return !0;
  }, t.observe_ = function(r, i) {
    return process.env.NODE_ENV !== "production" && i === !0 && h("`observe` doesn't support the fire immediately property for observable objects."), St(this, r);
  }, t.intercept_ = function(r) {
    return Ot(this, r);
  }, t.notifyPropertyAddition_ = function(r, i) {
    var o, a = G(this), s = process.env.NODE_ENV !== "production" && P();
    if (a || s) {
      var l = a || s ? {
        type: ce,
        observableKind: "object",
        debugObjectName: this.name_,
        object: this.proxy_ || this.target_,
        name: r,
        newValue: i
      } : null;
      process.env.NODE_ENV !== "production" && s && V(l), a && q(this, l), process.env.NODE_ENV !== "production" && s && I();
    }
    (o = this.pendingKeys_) == null || (o = o.get(r)) == null || o.set(!0), this.keysAtom_.reportChanged();
  }, t.ownKeys_ = function() {
    return this.keysAtom_.reportObserved(), ht(this.target_);
  }, t.keys_ = function() {
    return this.keysAtom_.reportObserved(), Object.keys(this.target_);
  }, e;
}();
function Je(e, t) {
  var n;
  if (process.env.NODE_ENV !== "production" && t && Xe(e) && h("Options can't be provided for already observable objects."), Z(e, b))
    return process.env.NODE_ENV !== "production" && !(Fi(e) instanceof Dn) && h("Cannot convert '" + Gt(e) + `' into observable object:
The target is already observable of different type.
Extending builtins is not supported.`), e;
  process.env.NODE_ENV !== "production" && !Object.isExtensible(e) && h("Cannot make the designated object observable; it is not extensible");
  var r = (n = t?.name) != null ? n : process.env.NODE_ENV !== "production" ? (C(e) ? "ObservableObject" : e.constructor.name) + "@" + F() : "ObservableObject", i = new Dn(e, /* @__PURE__ */ new Map(), String(r), Na(t));
  return $t(e, b, i), e;
}
var ms = /* @__PURE__ */ Ve("ObservableObjectAdministration", Dn);
function hr(e) {
  return dr[e] || (dr[e] = {
    get: function() {
      return this[b].getObservablePropValue_(e);
    },
    set: function(n) {
      return this[b].setObservablePropValue_(e, n);
    }
  });
}
function Xe(e) {
  return Qt(e) ? ms(e[b]) : !1;
}
function vr(e, t, n) {
  var r;
  process.env.NODE_ENV !== "production" && (e.appliedAnnotations_[n] = t), (r = e.target_[re]) == null || delete r[n];
}
function pr(e, t, n) {
  if (process.env.NODE_ENV !== "production" && !Wi(t) && h("Cannot annotate '" + e.name_ + "." + n.toString() + "': Invalid annotation."), process.env.NODE_ENV !== "production" && !Ut(t) && Z(e.appliedAnnotations_, n)) {
    var r = e.name_ + "." + n.toString(), i = e.appliedAnnotations_[n].annotationType_, o = t.annotationType_;
    h("Cannot apply '" + o + "' to '" + r + "':" + (`
The field is already annotated with '` + i + "'.") + `
Re-annotating fields is not allowed.
Use 'override' annotation for methods overridden by subclass.`);
  }
}
var ys = /* @__PURE__ */ zi(0), ws = /* @__PURE__ */ function() {
  var e = !1, t = {};
  return Object.defineProperty(t, "0", {
    set: function() {
      e = !0;
    }
  }), Object.create(t)[0] = 1, e === !1;
}(), bn = 0, Ui = function() {
};
function As(e, t) {
  Object.setPrototypeOf ? Object.setPrototypeOf(e.prototype, t) : e.prototype.__proto__ !== void 0 ? e.prototype.__proto__ = t : e.prototype = t;
}
As(Ui, Array.prototype);
var Wn = /* @__PURE__ */ function(e) {
  function t(r, i, o, a) {
    var s;
    return o === void 0 && (o = process.env.NODE_ENV !== "production" ? "ObservableArray@" + F() : "ObservableArray"), a === void 0 && (a = !1), s = e.call(this) || this, ke(function() {
      var l = new Fn(o, i, a, !0);
      l.proxy_ = s, ti(s, b, l), r && r.length && s.spliceWithArray(0, 0, r), ws && Object.defineProperty(s, "0", ys);
    }), s;
  }
  ii(t, e);
  var n = t.prototype;
  return n.concat = function() {
    this[b].atom_.reportObserved();
    for (var i = arguments.length, o = new Array(i), a = 0; a < i; a++)
      o[a] = arguments[a];
    return Array.prototype.concat.apply(
      this.slice(),
      //@ts-ignore
      o.map(function(s) {
        return cn(s) ? s.slice() : s;
      })
    );
  }, n[Symbol.iterator] = function() {
    var r = this, i = 0;
    return Gn({
      next: function() {
        return i < r.length ? {
          value: r[i++],
          done: !1
        } : {
          done: !0,
          value: void 0
        };
      }
    });
  }, He(t, [{
    key: "length",
    get: function() {
      return this[b].getArrayLength_();
    },
    set: function(i) {
      this[b].setArrayLength_(i);
    }
  }, {
    key: Symbol.toStringTag,
    get: function() {
      return "Array";
    }
  }]);
}(Ui);
Object.entries(Wt).forEach(function(e) {
  var t = e[0], n = e[1];
  t !== "concat" && $t(Wn.prototype, t, n);
});
function zi(e) {
  return {
    enumerable: !1,
    configurable: !0,
    get: function() {
      return this[b].get_(e);
    },
    set: function(n) {
      this[b].set_(e, n);
    }
  };
}
function Es(e) {
  Y(Wn.prototype, "" + e, zi(e));
}
function Bi(e) {
  if (e > bn) {
    for (var t = bn; t < e + 100; t++)
      Es(t);
    bn = e;
  }
}
Bi(1e3);
function Os(e, t, n) {
  return new Wn(e, t, n);
}
function Ge(e, t) {
  if (typeof e == "object" && e !== null) {
    if (cn(e))
      return t !== void 0 && h(23), e[b].atom_;
    if (J(e))
      return e.atom_;
    if (pe(e)) {
      if (t === void 0)
        return e.keysAtom_;
      var n = e.data_.get(t) || e.hasMap_.get(t);
      return n || h(25, t, Gt(e)), n;
    }
    if (Xe(e)) {
      if (!t)
        return h(26);
      var r = e[b].values_.get(t);
      return r || h(27, t, Gt(e)), r;
    }
    if (jn(e) || sn(e) || Ft(e))
      return e;
  } else if (S(e) && Ft(e[b]))
    return e[b];
  h(28);
}
function Fi(e, t) {
  if (e || h(29), jn(e) || sn(e) || Ft(e) || pe(e) || J(e))
    return e;
  if (e[b])
    return e[b];
  h(24, e);
}
function Gt(e, t) {
  var n;
  if (t !== void 0)
    n = Ge(e, t);
  else {
    if (We(e))
      return e.name;
    Xe(e) || pe(e) || J(e) ? n = Fi(e) : n = Ge(e);
  }
  return n.name_;
}
function ke(e) {
  var t = Ie(), n = on(!0);
  j();
  try {
    return e();
  } finally {
    U(), an(n), ae(t);
  }
}
var gr = Yt.toString;
function Zn(e, t, n) {
  return n === void 0 && (n = -1), Tn(e, t, n);
}
function Tn(e, t, n, r, i) {
  if (e === t)
    return e !== 0 || 1 / e === 1 / t;
  if (e == null || t == null)
    return !1;
  if (e !== e)
    return t !== t;
  var o = typeof e;
  if (o !== "function" && o !== "object" && typeof t != "object")
    return !1;
  var a = gr.call(e);
  if (a !== gr.call(t))
    return !1;
  switch (a) {
    // Strings, numbers, regular expressions, dates, and booleans are compared by value.
    case "[object RegExp]":
    // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
    case "[object String]":
      return "" + e == "" + t;
    case "[object Number]":
      return +e != +e ? +t != +t : +e == 0 ? 1 / +e === 1 / t : +e == +t;
    case "[object Date]":
    case "[object Boolean]":
      return +e == +t;
    case "[object Symbol]":
      return typeof Symbol < "u" && Symbol.valueOf.call(e) === Symbol.valueOf.call(t);
    case "[object Map]":
    case "[object Set]":
      n >= 0 && n++;
      break;
  }
  e = br(e), t = br(t);
  var s = a === "[object Array]";
  if (!s) {
    if (typeof e != "object" || typeof t != "object")
      return !1;
    var l = e.constructor, c = t.constructor;
    if (l !== c && !(S(l) && l instanceof l && S(c) && c instanceof c) && "constructor" in e && "constructor" in t)
      return !1;
  }
  if (n === 0)
    return !1;
  n < 0 && (n = -1), r = r || [], i = i || [];
  for (var u = r.length; u--; )
    if (r[u] === e)
      return i[u] === t;
  if (r.push(e), i.push(t), s) {
    if (u = e.length, u !== t.length)
      return !1;
    for (; u--; )
      if (!Tn(e[u], t[u], n - 1, r, i))
        return !1;
  } else {
    var d = Object.keys(e), v;
    if (u = d.length, Object.keys(t).length !== u)
      return !1;
    for (; u--; )
      if (v = d[u], !(Z(t, v) && Tn(e[v], t[v], n - 1, r, i)))
        return !1;
  }
  return r.pop(), i.pop(), !0;
}
function br(e) {
  return cn(e) ? e.slice() : Ke(e) || pe(e) || ne(e) || J(e) ? Array.from(e.entries()) : e;
}
var mr, Ss = ((mr = kn().Iterator) == null ? void 0 : mr.prototype) || {};
function Gn(e) {
  return e[Symbol.iterator] = Ns, Object.assign(Object.create(Ss), e);
}
function Ns() {
  return this;
}
function Wi(e) {
  return (
    // Can be function
    e instanceof Object && typeof e.annotationType_ == "string" && S(e.make_) && S(e.extend_)
  );
}
["Symbol", "Map", "Set"].forEach(function(e) {
  var t = kn();
  typeof t[e] > "u" && h("MobX requires global '" + e + "' to be available or polyfilled");
});
typeof __MOBX_DEVTOOLS_GLOBAL_HOOK__ == "object" && __MOBX_DEVTOOLS_GLOBAL_HOOK__.injectMobx({
  spy: qa,
  extras: {
    getDebugName: Gt
  },
  $mobx: b
});
const yr = "copilot-conf";
class ue {
  static get sessionConfiguration() {
    const t = sessionStorage.getItem(yr);
    return t ? JSON.parse(t) : {};
  }
  static saveCopilotActivation(t) {
    const n = this.sessionConfiguration;
    n.active = t, this.persist(n);
  }
  static getCopilotActivation() {
    return this.sessionConfiguration.active;
  }
  static saveSpotlightActivation(t) {
    const n = this.sessionConfiguration;
    n.spotlightActive = t, this.persist(n);
  }
  static getSpotlightActivation() {
    return this.sessionConfiguration.spotlightActive;
  }
  static saveSpotlightPosition(t, n, r, i) {
    const o = this.sessionConfiguration;
    o.spotlightPosition = { left: t, top: n, right: r, bottom: i }, this.persist(o);
  }
  static getSpotlightPosition() {
    return this.sessionConfiguration.spotlightPosition;
  }
  static saveDrawerSize(t, n) {
    const r = this.sessionConfiguration;
    r.drawerSizes = r.drawerSizes ?? {}, r.drawerSizes[t] = n, this.persist(r);
  }
  static getDrawerSize(t) {
    const n = this.sessionConfiguration;
    if (n.drawerSizes)
      return n.drawerSizes[t];
  }
  static savePanelConfigurations(t) {
    const n = this.sessionConfiguration;
    n.sectionPanelState = t, this.persist(n);
  }
  static getPanelConfigurations() {
    return this.sessionConfiguration.sectionPanelState;
  }
  static persist(t) {
    sessionStorage.setItem(yr, JSON.stringify(t));
  }
  static savePrompts(t) {
    const n = this.sessionConfiguration;
    n.prompts = t, this.persist(n);
  }
  static getPrompts() {
    return this.sessionConfiguration.prompts || [];
  }
  static saveCurrentSelection(t) {
    const n = this.sessionConfiguration;
    n.selection = n.selection ?? {}, n.selection && (n.selection.current = t, n.selection.location = window.location.pathname, this.persist(n));
  }
  static savePendingSelection(t) {
    const n = this.sessionConfiguration;
    n.selection = n.selection ?? {}, n.selection && (n.selection.pending = t, n.selection.location = window.location.pathname, this.persist(n));
  }
  static getCurrentSelection() {
    const t = this.sessionConfiguration.selection;
    if (t?.location === window.location.pathname)
      return t.current;
  }
  static getPendingSelection() {
    const t = this.sessionConfiguration.selection;
    if (t?.location === window.location.pathname)
      return t.pending;
  }
}
var Le = /* @__PURE__ */ ((e) => (e.INFORMATION = "information", e.WARNING = "warning", e.ERROR = "error", e))(Le || {});
const xs = Symbol.for("react.portal"), _s = Symbol.for("react.fragment"), Ps = Symbol.for("react.strict_mode"), Cs = Symbol.for("react.profiler"), Ds = Symbol.for("react.provider"), Ts = Symbol.for("react.context"), Zi = Symbol.for("react.forward_ref"), Rs = Symbol.for("react.suspense"), Vs = Symbol.for("react.suspense_list"), Is = Symbol.for("react.memo"), ks = Symbol.for("react.lazy");
function Ls(e, t, n) {
  const r = e.displayName;
  if (r)
    return r;
  const i = t.displayName || t.name || "";
  return i !== "" ? `${n}(${i})` : n;
}
function wr(e) {
  return e.displayName || "Context";
}
function qt(e) {
  if (e === null)
    return null;
  if (typeof e == "function")
    return e.displayName || e.name || null;
  if (typeof e == "string")
    return e;
  switch (e) {
    case _s:
      return "Fragment";
    case xs:
      return "Portal";
    case Cs:
      return "Profiler";
    case Ps:
      return "StrictMode";
    case Rs:
      return "Suspense";
    case Vs:
      return "SuspenseList";
  }
  if (typeof e == "object")
    switch (e.$$typeof) {
      case Ts:
        return `${wr(e)}.Consumer`;
      case Ds:
        return `${wr(e._context)}.Provider`;
      case Zi:
        return Ls(e, e.render, "ForwardRef");
      case Is:
        const t = e.displayName || null;
        return t !== null ? t : qt(e.type) || "Memo";
      case ks: {
        const n = e, r = n._payload, i = n._init;
        try {
          return qt(i(r));
        } catch {
          return null;
        }
      }
    }
  return null;
}
let Pt;
function zc() {
  const e = /* @__PURE__ */ new Set();
  return Array.from(document.body.querySelectorAll("*")).flatMap(Us).filter(Ms).filter((n) => !n.fileName.endsWith("frontend/generated/flow/Flow.tsx")).forEach((n) => e.add(n.fileName)), Array.from(e);
}
function Ms(e) {
  return !!e && e.fileName;
}
function Kt(e) {
  if (!e)
    return;
  if (e._debugSource)
    return e._debugSource;
  const t = e._debugInfo?.source;
  if (t?.fileName && t?.lineNumber)
    return t;
}
function js(e) {
  if (e && e.type?.__debugSourceDefine)
    return e.type.__debugSourceDefine;
}
function Us(e) {
  return Kt(Ht(e));
}
function zs() {
  return `__reactFiber$${Gi()}`;
}
function Bs() {
  return `__reactContainer$${Gi()}`;
}
function Gi() {
  if (!(!Pt && (Pt = Array.from(document.querySelectorAll("*")).flatMap((e) => Object.keys(e)).filter((e) => e.startsWith("__reactFiber$")).map((e) => e.replace("__reactFiber$", "")).find((e) => e), !Pt)))
    return Pt;
}
function at(e) {
  const t = e.type;
  return t?.$$typeof === Zi && !t.displayName && e.child ? at(e.child) : qt(e.type) ?? qt(e.elementType) ?? "???";
}
function Fs() {
  const e = Array.from(document.querySelectorAll("body > *")).flatMap((n) => n[Bs()]).find((n) => n), t = Pe(e);
  return Pe(t?.child);
}
function Ws(e) {
  const t = [];
  let n = Pe(e.child);
  for (; n; )
    t.push(n), n = Pe(n.sibling);
  return t;
}
function Zs(e) {
  return e.hasOwnProperty("entanglements") && e.hasOwnProperty("containerInfo");
}
function Gs(e) {
  return e.hasOwnProperty("stateNode") && e.hasOwnProperty("pendingProps");
}
function Pe(e) {
  const t = e?.stateNode;
  if (t?.current && (Zs(t) || Gs(t)))
    return t?.current;
  if (!e)
    return;
  if (!e.alternate)
    return e;
  const n = e.alternate, r = e?.actualStartTime, i = n?.actualStartTime;
  return i !== r && i > r ? n : e;
}
function Ht(e) {
  const t = zs(), n = Pe(e[t]);
  if (Kt(n))
    return n;
  let r = n?.return || void 0;
  for (; r && !Kt(r); )
    r = r.return || void 0;
  return r;
}
function Jt(e) {
  if (e.stateNode?.isConnected === !0)
    return e.stateNode;
  if (e.child)
    return Jt(e.child);
}
function Ar(e) {
  const t = Jt(e);
  return t && Pe(Ht(t)) === e;
}
function qs(e) {
  return typeof e.type != "function" || qi(e) ? !1 : !!(Kt(e) || js(e));
}
function qi(e) {
  if (!e)
    return !1;
  const t = e;
  return typeof e.type == "function" && t.tag === 1;
}
const qn = async (e, t, n) => window.Vaadin.copilot.comm(e, t, n), Ce = "copilot-", Ks = "24.6.3", Bc = "attention-required", Fc = "https://plugins.jetbrains.com/plugin/23758-vaadin", Wc = "https://marketplace.visualstudio.com/items?itemName=vaadin.vaadin-vscode";
function Zc(e) {
  return e === void 0 ? !1 : e.nodeId >= 0;
}
function Hs(e) {
  if (e.javaClass)
    return e.javaClass.substring(e.javaClass.lastIndexOf(".") + 1);
}
function Er(e) {
  const t = window.Vaadin;
  if (t && t.Flow) {
    const { clients: n } = t.Flow, r = Object.keys(n);
    for (const i of r) {
      const o = n[i];
      if (o.getNodeId) {
        const a = o.getNodeId(e);
        if (a >= 0) {
          const s = o.getNodeInfo(a);
          return { nodeId: a, uiId: o.getUIId(), element: e, javaClass: s.javaClass, styles: s.styles };
        }
      }
    }
  }
}
function Gc() {
  const e = window.Vaadin;
  let t;
  if (e && e.Flow) {
    const { clients: n } = e.Flow, r = Object.keys(n);
    for (const i of r) {
      const o = n[i];
      o.getUIId && (t = o.getUIId());
    }
  }
  return t;
}
function qc(e) {
  return {
    uiId: e.uiId,
    nodeId: e.nodeId
  };
}
function Js(e) {
  return e ? e.type?.type === "FlowContainer" : !1;
}
function Xs(e) {
  return e.localName.startsWith("flow-container");
}
function Ki(e, t) {
  const n = e();
  n ? t(n) : setTimeout(() => Ki(e, t), 50);
}
async function Hi(e) {
  const t = e();
  if (t)
    return t;
  let n;
  const r = new Promise((o) => {
    n = o;
  }), i = setInterval(() => {
    const o = e();
    o && (clearInterval(i), n(o));
  }, 10);
  return r;
}
function Ys(e) {
  return N.box(e, { deep: !1 });
}
function Qs(e) {
  return e && typeof e.lastAccessedBy_ == "number";
}
function Kc(e) {
  if (e) {
    if (typeof e == "string")
      return e;
    if (!Qs(e))
      throw new Error(`Expected message to be a string or an observable value but was ${JSON.stringify(e)}`);
    return e.get();
  }
}
function Kn(e) {
  Promise.resolve().then(() => Ul).then(({ showNotification: t }) => {
    t(e);
  });
}
function $s() {
  Kn({
    type: Le.INFORMATION,
    message: "The previous operation is still in progress. Please wait for it to finish."
  });
}
class el {
  constructor() {
    this.spotlightActive = !1, this.welcomeActive = !1, this.loginCheckActive = !1, this.userInfo = void 0, this.active = !1, this.activatedFrom = null, this.activatedAtLeastOnce = !1, this.operationInProgress = void 0, this.operationWaitsHmrUpdate = void 0, this.operationWaitsHmrUpdateTimeout = void 0, this.idePluginState = void 0, this.notifications = [], this.infoTooltip = null, this.sectionPanelDragging = !1, this.spotlightDragging = !1, this.sectionPanelResizing = !1, this.drawerResizing = !1, this.jdkInfo = void 0, this.featureFlags = [], ln(this, {
      notifications: N.shallow
    }), this.spotlightActive = ue.getSpotlightActivation() ?? !1;
  }
  setActive(t, n) {
    this.active = t, t && (this.activatedAtLeastOnce = !0), this.activatedFrom = n ?? null;
  }
  setSpotlightActive(t) {
    this.spotlightActive = t;
  }
  setWelcomeActive(t) {
    this.welcomeActive = t;
  }
  setLoginCheckActive(t) {
    this.loginCheckActive = t;
  }
  setUserInfo(t) {
    this.userInfo = t;
  }
  startOperation(t) {
    if (this.operationInProgress)
      throw new Error(`An ${t} operation is already in progress`);
    if (this.operationWaitsHmrUpdate) {
      $s();
      return;
    }
    this.operationInProgress = t;
  }
  stopOperation(t) {
    if (this.operationInProgress) {
      if (this.operationInProgress !== t)
        return;
    } else return;
    this.operationInProgress = void 0;
  }
  setOperationWaitsHmrUpdate(t, n) {
    this.operationWaitsHmrUpdate = t, this.operationWaitsHmrUpdateTimeout = n;
  }
  clearOperationWaitsHmrUpdate() {
    this.operationWaitsHmrUpdate = void 0, this.operationWaitsHmrUpdateTimeout = void 0;
  }
  setIdePluginState(t) {
    this.idePluginState = t;
  }
  setJdkInfo(t) {
    this.jdkInfo = t;
  }
  toggleActive(t) {
    this.setActive(!this.active, this.active ? null : t ?? null);
  }
  reset() {
    this.active = !1, this.activatedAtLeastOnce = !1;
  }
  setNotifications(t) {
    this.notifications = t;
  }
  removeNotification(t) {
    t.animatingOut = !0, setTimeout(() => {
      this.reallyRemoveNotification(t);
    }, 180);
  }
  reallyRemoveNotification(t) {
    const n = this.notifications.indexOf(t);
    n > -1 && this.notifications.splice(n, 1);
  }
  setTooltip(t, n) {
    this.infoTooltip = {
      text: t,
      loader: n
    };
  }
  clearTooltip() {
    this.infoTooltip = null;
  }
  setSectionPanelDragging(t) {
    this.sectionPanelDragging = t;
  }
  setSpotlightDragging(t) {
    this.spotlightDragging = t;
  }
  setSectionPanelResizing(t) {
    this.sectionPanelResizing = t;
  }
  setDrawerResizing(t) {
    this.drawerResizing = t;
  }
  setFeatureFlags(t) {
    this.featureFlags = t;
  }
}
const Hc = (e, t, n) => t >= e.left && t <= e.right && n >= e.top && n <= e.bottom, tl = (e) => {
  const t = [];
  let n = rl(e);
  for (; n; )
    t.push(n), n = n.parentElement;
  return t;
}, nl = (e, t) => {
  let n = e;
  for (; !(n instanceof HTMLElement && n.localName === `${Ce}main`); ) {
    if (!n.isConnected)
      return null;
    if (n.parentNode ? n = n.parentNode : n.host && (n = n.host), n instanceof HTMLElement && n.localName === t)
      return n;
  }
  return null;
};
function rl(e) {
  return e.parentElement ?? e.parentNode?.host;
}
function qe(e) {
  return !e || !(e instanceof HTMLElement) ? !1 : [...tl(e), e].map((t) => t.localName).some((t) => t.startsWith(Ce));
}
function Or(e) {
  return e instanceof Element;
}
function Sr(e) {
  return e.startsWith("vaadin-") ? e.substring(7).split("-").map((r) => r.charAt(0).toUpperCase() + r.slice(1)).join(" ") : e;
}
function Nr(e) {
  if (!e)
    return;
  if (e.id)
    return `#${e.id}`;
  if (!e.children)
    return;
  const t = Array.from(e.children).find((r) => r.localName === "label");
  if (t)
    return t.outerText.trim();
  const n = Array.from(e.childNodes).find(
    (r) => r.nodeType === Node.TEXT_NODE && r.textContent && r.textContent.trim().length > 0
  );
  if (n && n.textContent)
    return n.textContent.trim();
}
var Ji = /* @__PURE__ */ ((e) => (e["vaadin-combo-box"] = "vaadin-combo-box", e["vaadin-date-picker"] = "vaadin-date-picker", e["vaadin-dialog"] = "vaadin-dialog", e["vaadin-multi-select-combo-box"] = "vaadin-multi-select-combo-box", e["vaadin-select"] = "vaadin-select", e["vaadin-time-picker"] = "vaadin-time-picker", e["vaadin-popover"] = "vaadin-popover", e))(Ji || {});
const et = {
  "vaadin-combo-box": {
    hideOnActivation: !0,
    open: (e) => Ct(e),
    close: (e) => Dt(e)
  },
  "vaadin-select": {
    hideOnActivation: !0,
    open: (e) => {
      const t = e;
      Yi(t, t._overlayElement), t.opened = !0;
    },
    close: (e) => {
      const t = e;
      Qi(t, t._overlayElement), t.opened = !1;
    }
  },
  "vaadin-multi-select-combo-box": {
    hideOnActivation: !0,
    open: (e) => Ct(e.$.comboBox),
    close: (e) => {
      Dt(e.$.comboBox), e.removeAttribute("focused");
    }
  },
  "vaadin-date-picker": {
    hideOnActivation: !0,
    open: (e) => Ct(e),
    close: (e) => Dt(e)
  },
  "vaadin-time-picker": {
    hideOnActivation: !0,
    open: (e) => Ct(e.$.comboBox),
    close: (e) => {
      Dt(e.$.comboBox), e.removeAttribute("focused");
    }
  },
  "vaadin-dialog": {
    hideOnActivation: !1
  },
  "vaadin-popover": {
    hideOnActivation: !1
  }
}, Xi = (e) => {
  e.preventDefault(), e.stopImmediatePropagation();
}, Ct = (e) => {
  e.addEventListener("focusout", Xi, { capture: !0 }), Yi(e), e.opened = !0;
}, Dt = (e) => {
  Qi(e), e.removeAttribute("focused"), e.removeEventListener("focusout", Xi, { capture: !0 }), e.opened = !1;
}, Yi = (e, t) => {
  const n = t ?? e.$.overlay;
  n.__oldModeless = n.modeless, n.modeless = !0;
}, Qi = (e, t) => {
  const n = t ?? e.$.overlay;
  n.modeless = n.__oldModeless !== void 0 ? n.__oldModeless : n.modeless, delete n.__oldModeless;
};
class il {
  constructor() {
    this.openedOverlayOwners = /* @__PURE__ */ new Set(), this.overlayCloseEventListener = (t) => {
      qe(t.target?.owner) || (window.Vaadin.copilot._uiState.active || qe(t.detail.sourceEvent.target)) && (t.preventDefault(), t.stopImmediatePropagation());
    };
  }
  /**
   * Modifies pointer-events property to auto if dialog overlay is present on body element. <br/>
   * Overriding closeOnOutsideClick method in order to keep overlay present while copilot is active
   * @private
   */
  onCopilotActivation() {
    const t = Array.from(document.body.children).find(
      (r) => r.localName.startsWith("vaadin") && r.localName.endsWith("-overlay")
    );
    if (!t)
      return;
    const n = this.getOwner(t);
    if (n) {
      const r = et[n.localName];
      if (!r)
        return;
      r.hideOnActivation && r.close ? r.close(n) : document.body.style.getPropertyValue("pointer-events") === "none" && document.body.style.removeProperty("pointer-events");
    }
  }
  /**
   * Restores pointer-events state on deactivation. <br/>
   * Closes opened overlays while using copilot.
   * @private
   */
  onCopilotDeactivation() {
    this.openedOverlayOwners.forEach((n) => {
      const r = et[n.localName];
      r && r.close && r.close(n);
    }), document.body.querySelector("vaadin-dialog-overlay") && document.body.style.setProperty("pointer-events", "none");
  }
  getOwner(t) {
    const n = t;
    return n.owner ?? n.__dataHost;
  }
  addOverlayOutsideClickEvent() {
    document.documentElement.addEventListener("vaadin-overlay-outside-click", this.overlayCloseEventListener, {
      capture: !0
    }), document.documentElement.addEventListener("vaadin-overlay-escape-press", this.overlayCloseEventListener, {
      capture: !0
    });
  }
  removeOverlayOutsideClickEvent() {
    document.documentElement.removeEventListener("vaadin-overlay-outside-click", this.overlayCloseEventListener), document.documentElement.removeEventListener("vaadin-overlay-escape-press", this.overlayCloseEventListener);
  }
  toggle(t) {
    const n = et[t.localName];
    this.isOverlayActive(t) ? (n.close(t), this.openedOverlayOwners.delete(t)) : (n.open(t), this.openedOverlayOwners.add(t));
  }
  isOverlayActive(t) {
    const n = et[t.localName];
    return n.active ? n.active(t) : t.hasAttribute("opened");
  }
  overlayStatus(t) {
    if (!t)
      return { visible: !1 };
    const n = t.localName;
    let r = Object.keys(Ji).includes(n);
    if (!r)
      return { visible: !1 };
    const i = et[t.localName];
    i.hasOverlay && (r = i.hasOverlay(t));
    const o = this.isOverlayActive(t);
    return { visible: r, active: o };
  }
}
async function $i() {
  return Hi(() => {
    const e = window.Vaadin.devTools, t = e?.frontendConnection && e?.frontendConnection.status === "active";
    return e !== void 0 && t && e?.frontendConnection;
  });
}
function fe(e, t) {
  $i().then((n) => n.send(e, t));
}
class ol {
  constructor() {
    this.promise = new Promise((t) => {
      this.resolveInit = t;
    });
  }
  done(t) {
    this.resolveInit(t);
  }
}
class al {
  constructor() {
    this.dismissedNotifications = [], this.termsSummaryDismissed = !1, this.activationButtonPosition = null, this.paletteState = null, this.activationShortcut = !0, this.activationAnimation = !0, ln(this), this.initializer = new ol(), this.initializer.promise.then(() => {
      Di(
        () => JSON.stringify(this),
        () => {
          fe("copilot-set-machine-configuration", { conf: JSON.stringify(xr(this)) });
        }
      );
    }), window.Vaadin.copilot.eventbus.on("copilot-machine-configuration", (t) => {
      const n = t.detail.conf;
      Object.assign(this, xr(n)), this.initializer.done(!0), t.preventDefault();
    }), this.loadData();
  }
  loadData() {
    fe("copilot-get-machine-configuration", {});
  }
  addDismissedNotification(t) {
    this.dismissedNotifications.push(t);
  }
  getDismissedNotifications() {
    return this.dismissedNotifications;
  }
  setTermsSummaryDismissed(t) {
    this.termsSummaryDismissed = t;
  }
  isTermsSummaryDismissed() {
    return this.termsSummaryDismissed;
  }
  getActivationButtonPosition() {
    return this.activationButtonPosition;
  }
  setActivationButtonPosition(t) {
    this.activationButtonPosition = t;
  }
  getPaletteState() {
    return this.paletteState;
  }
  setPaletteState(t) {
    this.paletteState = t;
  }
  isActivationShortcut() {
    return this.activationShortcut;
  }
  setActivationShortcut(t) {
    this.activationShortcut = t;
  }
  isActivationAnimation() {
    return this.activationAnimation;
  }
  setActivationAnimation(t) {
    this.activationAnimation = t;
  }
}
function xr(e) {
  const t = { ...e };
  return delete t.initializer, t;
}
class sl {
  constructor() {
    this._previewActivated = !1, this._remainingTimeInMillis = -1, this._active = !1, this._configurationLoaded = !1, ln(this);
  }
  setConfiguration(t) {
    this._previewActivated = t.previewActivated, t.previewActivated ? this._remainingTimeInMillis = t.remainingTimeInMillis : this._remainingTimeInMillis = -1, this._active = t.active, this._configurationLoaded = !0;
  }
  get previewActivated() {
    return this._previewActivated;
  }
  get remainingTimeInMillis() {
    return this._remainingTimeInMillis;
  }
  get active() {
    return this._active;
  }
  get configurationLoaded() {
    return this._configurationLoaded;
  }
  get expired() {
    return this.previewActivated && !this.active;
  }
  reset() {
    this._previewActivated = !1, this._active = !1, this._configurationLoaded = !1, this._remainingTimeInMillis = -1;
  }
  loadPreviewConfiguration() {
    qn(`${Ce}get-preview`, {}, (t) => {
      const n = t.data;
      this.setConfiguration(n);
    }).catch((t) => {
      Promise.resolve().then(() => ql).then((n) => {
        n.handleCopilotError("Load preview configuration failed", t);
      });
    });
  }
}
class ll {
  constructor() {
    this._panels = [], this._attentionRequiredPanelTag = null, this._floatingPanelsZIndexOrder = [], this.renderedPanels = /* @__PURE__ */ new Set(), this.customTags = /* @__PURE__ */ new Map(), ln(this), this.restorePositions();
  }
  shouldRender(t) {
    return this.renderedPanels.has(t);
  }
  restorePositions() {
    const t = ue.getPanelConfigurations();
    t && (this._panels = this._panels.map((n) => {
      const r = t.find((i) => i.tag === n.tag);
      return r && (n = Object.assign(n, { ...r })), n;
    }));
  }
  /**
   * Brings a given floating panel to the front.
   *
   * @param panelTag the tag name of the panel
   */
  bringToFront(t) {
    this._floatingPanelsZIndexOrder = this._floatingPanelsZIndexOrder.filter((n) => n !== t), this.getPanelByTag(t)?.floating && this._floatingPanelsZIndexOrder.push(t);
  }
  /**
   * Returns the focused z-index of floating panel as following order
   * <ul>
   *     <li>Returns 50 for last(focused) element </li>
   *     <li>Returns the index of element in list(starting from 0) </li>
   *     <li>Returns 0 if panel is not in the list</li>
   * </ul>
   * @param panelTag
   */
  getFloatingPanelZIndex(t) {
    const n = this._floatingPanelsZIndexOrder.findIndex((r) => r === t);
    return n === this._floatingPanelsZIndexOrder.length - 1 ? 50 : n === -1 ? 0 : n;
  }
  get floatingPanelsZIndexOrder() {
    return this._floatingPanelsZIndexOrder;
  }
  get attentionRequiredPanelTag() {
    return this._attentionRequiredPanelTag;
  }
  set attentionRequiredPanelTag(t) {
    this._attentionRequiredPanelTag = t;
  }
  getAttentionRequiredPanelConfiguration() {
    return this._panels.find((t) => t.tag === this._attentionRequiredPanelTag);
  }
  clearAttention() {
    this._attentionRequiredPanelTag = null;
  }
  get panels() {
    return this._panels;
  }
  addPanel(t) {
    if (this.getPanelByTag(t.tag))
      return;
    this._panels.push(t), this.restorePositions();
    const n = this.getPanelByTag(t.tag);
    if (n)
      (n.eager || n.expanded) && this.renderedPanels.add(t.tag);
    else throw new Error(`Panel configuration not found for tag ${t.tag}`);
  }
  getPanelByTag(t) {
    return this._panels.find((n) => n.tag === t);
  }
  updatePanel(t, n) {
    const r = [...this._panels], i = r.find((o) => o.tag === t);
    if (i) {
      for (const o in n)
        i[o] = n[o];
      i.expanded && this.renderedPanels.add(i.tag), n.floating === !1 && (this._floatingPanelsZIndexOrder = this._floatingPanelsZIndexOrder.filter((o) => o !== t)), this._panels = r, ue.savePanelConfigurations(this._panels);
    }
  }
  updateOrders(t) {
    const n = [...this._panels];
    n.forEach((r) => {
      const i = t.find((o) => o.tag === r.tag);
      i && (r.panelOrder = i.order);
    }), this._panels = n, ue.savePanelConfigurations(n);
  }
  removePanel(t) {
    const n = this._panels.findIndex((r) => r.tag === t);
    n < 0 || (this._panels.splice(n, 1), ue.savePanelConfigurations(this._panels));
  }
  setCustomPanelHeader(t, n) {
    this.customTags.set(t.tag, n);
  }
  getPanelHeader(t) {
    return this.customTags.get(t.tag) ?? t.header;
  }
  clearCustomPanelHeader(t) {
    this.customTags.delete(t.tag);
  }
}
window.Vaadin ??= {};
window.Vaadin.copilot ??= {};
window.Vaadin.copilot.plugins = [];
window.Vaadin.copilot._uiState = new el();
window.Vaadin.copilot.eventbus = new Do();
window.Vaadin.copilot.overlayManager = new il();
window.Vaadin.copilot._machineState = new al();
window.Vaadin.copilot._previewState = new sl();
window.Vaadin.copilot._sectionPanelUiState = new ll();
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const cl = (e) => (t, n) => {
  n !== void 0 ? n.addInitializer(() => {
    customElements.define(e, t);
  }) : customElements.define(e, t);
};
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const It = globalThis, Hn = It.ShadowRoot && (It.ShadyCSS === void 0 || It.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, Jn = Symbol(), _r = /* @__PURE__ */ new WeakMap();
let eo = class {
  constructor(t, n, r) {
    if (this._$cssResult$ = !0, r !== Jn) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = n;
  }
  get styleSheet() {
    let t = this.o;
    const n = this.t;
    if (Hn && t === void 0) {
      const r = n !== void 0 && n.length === 1;
      r && (t = _r.get(n)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), r && _r.set(n, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const te = (e) => new eo(typeof e == "string" ? e : e + "", void 0, Jn), ul = (e, ...t) => {
  const n = e.length === 1 ? e[0] : t.reduce((r, i, o) => r + ((a) => {
    if (a._$cssResult$ === !0) return a.cssText;
    if (typeof a == "number") return a;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + a + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(i) + e[o + 1], e[0]);
  return new eo(n, e, Jn);
}, dl = (e, t) => {
  if (Hn) e.adoptedStyleSheets = t.map((n) => n instanceof CSSStyleSheet ? n : n.styleSheet);
  else for (const n of t) {
    const r = document.createElement("style"), i = It.litNonce;
    i !== void 0 && r.setAttribute("nonce", i), r.textContent = n.cssText, e.appendChild(r);
  }
}, Pr = Hn ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((t) => {
  let n = "";
  for (const r of t.cssRules) n += r.cssText;
  return te(n);
})(e) : e;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: fl, defineProperty: hl, getOwnPropertyDescriptor: vl, getOwnPropertyNames: pl, getOwnPropertySymbols: gl, getPrototypeOf: bl } = Object, un = globalThis, Cr = un.trustedTypes, ml = Cr ? Cr.emptyScript : "", yl = un.reactiveElementPolyfillSupport, ct = (e, t) => e, Rn = { toAttribute(e, t) {
  switch (t) {
    case Boolean:
      e = e ? ml : null;
      break;
    case Object:
    case Array:
      e = e == null ? e : JSON.stringify(e);
  }
  return e;
}, fromAttribute(e, t) {
  let n = e;
  switch (t) {
    case Boolean:
      n = e !== null;
      break;
    case Number:
      n = e === null ? null : Number(e);
      break;
    case Object:
    case Array:
      try {
        n = JSON.parse(e);
      } catch {
        n = null;
      }
  }
  return n;
} }, to = (e, t) => !fl(e, t), Dr = { attribute: !0, type: String, converter: Rn, reflect: !1, hasChanged: to };
Symbol.metadata ??= Symbol("metadata"), un.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
let Ue = class extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ??= []).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, n = Dr) {
    if (n.state && (n.attribute = !1), this._$Ei(), this.elementProperties.set(t, n), !n.noAccessor) {
      const r = Symbol(), i = this.getPropertyDescriptor(t, r, n);
      i !== void 0 && hl(this.prototype, t, i);
    }
  }
  static getPropertyDescriptor(t, n, r) {
    const { get: i, set: o } = vl(this.prototype, t) ?? { get() {
      return this[n];
    }, set(a) {
      this[n] = a;
    } };
    return { get() {
      return i?.call(this);
    }, set(a) {
      const s = i?.call(this);
      o.call(this, a), this.requestUpdate(t, s, r);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? Dr;
  }
  static _$Ei() {
    if (this.hasOwnProperty(ct("elementProperties"))) return;
    const t = bl(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(ct("finalized"))) return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(ct("properties"))) {
      const n = this.properties, r = [...pl(n), ...gl(n)];
      for (const i of r) this.createProperty(i, n[i]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const n = litPropertyMetadata.get(t);
      if (n !== void 0) for (const [r, i] of n) this.elementProperties.set(r, i);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [n, r] of this.elementProperties) {
      const i = this._$Eu(n, r);
      i !== void 0 && this._$Eh.set(i, n);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const n = [];
    if (Array.isArray(t)) {
      const r = new Set(t.flat(1 / 0).reverse());
      for (const i of r) n.unshift(Pr(i));
    } else t !== void 0 && n.push(Pr(t));
    return n;
  }
  static _$Eu(t, n) {
    const r = n.attribute;
    return r === !1 ? void 0 : typeof r == "string" ? r : typeof t == "string" ? t.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    this._$ES = new Promise((t) => this.enableUpdating = t), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((t) => t(this));
  }
  addController(t) {
    (this._$EO ??= /* @__PURE__ */ new Set()).add(t), this.renderRoot !== void 0 && this.isConnected && t.hostConnected?.();
  }
  removeController(t) {
    this._$EO?.delete(t);
  }
  _$E_() {
    const t = /* @__PURE__ */ new Map(), n = this.constructor.elementProperties;
    for (const r of n.keys()) this.hasOwnProperty(r) && (t.set(r, this[r]), delete this[r]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return dl(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((t) => t.hostConnected?.());
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    this._$EO?.forEach((t) => t.hostDisconnected?.());
  }
  attributeChangedCallback(t, n, r) {
    this._$AK(t, r);
  }
  _$EC(t, n) {
    const r = this.constructor.elementProperties.get(t), i = this.constructor._$Eu(t, r);
    if (i !== void 0 && r.reflect === !0) {
      const o = (r.converter?.toAttribute !== void 0 ? r.converter : Rn).toAttribute(n, r.type);
      this._$Em = t, o == null ? this.removeAttribute(i) : this.setAttribute(i, o), this._$Em = null;
    }
  }
  _$AK(t, n) {
    const r = this.constructor, i = r._$Eh.get(t);
    if (i !== void 0 && this._$Em !== i) {
      const o = r.getPropertyOptions(i), a = typeof o.converter == "function" ? { fromAttribute: o.converter } : o.converter?.fromAttribute !== void 0 ? o.converter : Rn;
      this._$Em = i, this[i] = a.fromAttribute(n, o.type), this._$Em = null;
    }
  }
  requestUpdate(t, n, r) {
    if (t !== void 0) {
      if (r ??= this.constructor.getPropertyOptions(t), !(r.hasChanged ?? to)(this[t], n)) return;
      this.P(t, n, r);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$ET());
  }
  P(t, n, r) {
    this._$AL.has(t) || this._$AL.set(t, n), r.reflect === !0 && this._$Em !== t && (this._$Ej ??= /* @__PURE__ */ new Set()).add(t);
  }
  async _$ET() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (n) {
      Promise.reject(n);
    }
    const t = this.scheduleUpdate();
    return t != null && await t, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    if (!this.isUpdatePending) return;
    if (!this.hasUpdated) {
      if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
        for (const [i, o] of this._$Ep) this[i] = o;
        this._$Ep = void 0;
      }
      const r = this.constructor.elementProperties;
      if (r.size > 0) for (const [i, o] of r) o.wrapped !== !0 || this._$AL.has(i) || this[i] === void 0 || this.P(i, this[i], o);
    }
    let t = !1;
    const n = this._$AL;
    try {
      t = this.shouldUpdate(n), t ? (this.willUpdate(n), this._$EO?.forEach((r) => r.hostUpdate?.()), this.update(n)) : this._$EU();
    } catch (r) {
      throw t = !1, this._$EU(), r;
    }
    t && this._$AE(n);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    this._$EO?.forEach((n) => n.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
  }
  _$EU() {
    this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
  }
  get updateComplete() {
    return this.getUpdateComplete();
  }
  getUpdateComplete() {
    return this._$ES;
  }
  shouldUpdate(t) {
    return !0;
  }
  update(t) {
    this._$Ej &&= this._$Ej.forEach((n) => this._$EC(n, this[n])), this._$EU();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
};
Ue.elementStyles = [], Ue.shadowRootOptions = { mode: "open" }, Ue[ct("elementProperties")] = /* @__PURE__ */ new Map(), Ue[ct("finalized")] = /* @__PURE__ */ new Map(), yl?.({ ReactiveElement: Ue }), (un.reactiveElementVersions ??= []).push("2.0.4");
const je = Symbol("LitMobxRenderReaction"), Tr = Symbol("LitMobxRequestUpdate");
function wl(e, t) {
  var n, r;
  return r = class extends e {
    constructor() {
      super(...arguments), this[n] = () => {
        this.requestUpdate();
      };
    }
    connectedCallback() {
      super.connectedCallback();
      const o = this.constructor.name || this.nodeName;
      this[je] = new t(`${o}.update()`, this[Tr]), this.hasUpdated && this.requestUpdate();
    }
    disconnectedCallback() {
      super.disconnectedCallback(), this[je] && (this[je].dispose(), this[je] = void 0);
    }
    update(o) {
      this[je] ? this[je].track(super.update.bind(this, o)) : super.update(o);
    }
  }, n = Tr, r;
}
function Al(e) {
  return wl(e, $);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Xn = globalThis, Xt = Xn.trustedTypes, Rr = Xt ? Xt.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, Yn = "$lit$", oe = `lit$${Math.random().toFixed(9).slice(2)}$`, Qn = "?" + oe, El = `<${Qn}>`, De = document, bt = () => De.createComment(""), mt = (e) => e === null || typeof e != "object" && typeof e != "function", $n = Array.isArray, no = (e) => $n(e) || typeof e?.[Symbol.iterator] == "function", mn = `[ 	
\f\r]`, tt = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, Vr = /-->/g, Ir = />/g, me = RegExp(`>|${mn}(?:([^\\s"'>=/]+)(${mn}*=${mn}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), kr = /'/g, Lr = /"/g, ro = /^(?:script|style|textarea|title)$/i, io = (e) => (t, ...n) => ({ _$litType$: e, strings: t, values: n }), ut = io(1), Qc = io(2), he = Symbol.for("lit-noChange"), O = Symbol.for("lit-nothing"), Mr = /* @__PURE__ */ new WeakMap(), Ee = De.createTreeWalker(De, 129);
function oo(e, t) {
  if (!$n(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
  return Rr !== void 0 ? Rr.createHTML(t) : t;
}
const ao = (e, t) => {
  const n = e.length - 1, r = [];
  let i, o = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", a = tt;
  for (let s = 0; s < n; s++) {
    const l = e[s];
    let c, u, d = -1, v = 0;
    for (; v < l.length && (a.lastIndex = v, u = a.exec(l), u !== null); ) v = a.lastIndex, a === tt ? u[1] === "!--" ? a = Vr : u[1] !== void 0 ? a = Ir : u[2] !== void 0 ? (ro.test(u[2]) && (i = RegExp("</" + u[2], "g")), a = me) : u[3] !== void 0 && (a = me) : a === me ? u[0] === ">" ? (a = i ?? tt, d = -1) : u[1] === void 0 ? d = -2 : (d = a.lastIndex - u[2].length, c = u[1], a = u[3] === void 0 ? me : u[3] === '"' ? Lr : kr) : a === Lr || a === kr ? a = me : a === Vr || a === Ir ? a = tt : (a = me, i = void 0);
    const g = a === me && e[s + 1].startsWith("/>") ? " " : "";
    o += a === tt ? l + El : d >= 0 ? (r.push(c), l.slice(0, d) + Yn + l.slice(d) + oe + g) : l + oe + (d === -2 ? s : g);
  }
  return [oo(e, o + (e[n] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), r];
};
class yt {
  constructor({ strings: t, _$litType$: n }, r) {
    let i;
    this.parts = [];
    let o = 0, a = 0;
    const s = t.length - 1, l = this.parts, [c, u] = ao(t, n);
    if (this.el = yt.createElement(c, r), Ee.currentNode = this.el.content, n === 2 || n === 3) {
      const d = this.el.content.firstChild;
      d.replaceWith(...d.childNodes);
    }
    for (; (i = Ee.nextNode()) !== null && l.length < s; ) {
      if (i.nodeType === 1) {
        if (i.hasAttributes()) for (const d of i.getAttributeNames()) if (d.endsWith(Yn)) {
          const v = u[a++], g = i.getAttribute(d).split(oe), m = /([.?@])?(.*)/.exec(v);
          l.push({ type: 1, index: o, name: m[2], strings: g, ctor: m[1] === "." ? lo : m[1] === "?" ? co : m[1] === "@" ? uo : Nt }), i.removeAttribute(d);
        } else d.startsWith(oe) && (l.push({ type: 6, index: o }), i.removeAttribute(d));
        if (ro.test(i.tagName)) {
          const d = i.textContent.split(oe), v = d.length - 1;
          if (v > 0) {
            i.textContent = Xt ? Xt.emptyScript : "";
            for (let g = 0; g < v; g++) i.append(d[g], bt()), Ee.nextNode(), l.push({ type: 2, index: ++o });
            i.append(d[v], bt());
          }
        }
      } else if (i.nodeType === 8) if (i.data === Qn) l.push({ type: 2, index: o });
      else {
        let d = -1;
        for (; (d = i.data.indexOf(oe, d + 1)) !== -1; ) l.push({ type: 7, index: o }), d += oe.length - 1;
      }
      o++;
    }
  }
  static createElement(t, n) {
    const r = De.createElement("template");
    return r.innerHTML = t, r;
  }
}
function Te(e, t, n = e, r) {
  if (t === he) return t;
  let i = r !== void 0 ? n._$Co?.[r] : n._$Cl;
  const o = mt(t) ? void 0 : t._$litDirective$;
  return i?.constructor !== o && (i?._$AO?.(!1), o === void 0 ? i = void 0 : (i = new o(e), i._$AT(e, n, r)), r !== void 0 ? (n._$Co ??= [])[r] = i : n._$Cl = i), i !== void 0 && (t = Te(e, i._$AS(e, t.values), i, r)), t;
}
let so = class {
  constructor(t, n) {
    this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = n;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t) {
    const { el: { content: n }, parts: r } = this._$AD, i = (t?.creationScope ?? De).importNode(n, !0);
    Ee.currentNode = i;
    let o = Ee.nextNode(), a = 0, s = 0, l = r[0];
    for (; l !== void 0; ) {
      if (a === l.index) {
        let c;
        l.type === 2 ? c = new Ye(o, o.nextSibling, this, t) : l.type === 1 ? c = new l.ctor(o, l.name, l.strings, this, t) : l.type === 6 && (c = new fo(o, this, t)), this._$AV.push(c), l = r[++s];
      }
      a !== l?.index && (o = Ee.nextNode(), a++);
    }
    return Ee.currentNode = De, i;
  }
  p(t) {
    let n = 0;
    for (const r of this._$AV) r !== void 0 && (r.strings !== void 0 ? (r._$AI(t, r, n), n += r.strings.length - 2) : r._$AI(t[n])), n++;
  }
};
class Ye {
  get _$AU() {
    return this._$AM?._$AU ?? this._$Cv;
  }
  constructor(t, n, r, i) {
    this.type = 2, this._$AH = O, this._$AN = void 0, this._$AA = t, this._$AB = n, this._$AM = r, this.options = i, this._$Cv = i?.isConnected ?? !0;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const n = this._$AM;
    return n !== void 0 && t?.nodeType === 11 && (t = n.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, n = this) {
    t = Te(this, t, n), mt(t) ? t === O || t == null || t === "" ? (this._$AH !== O && this._$AR(), this._$AH = O) : t !== this._$AH && t !== he && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : no(t) ? this.k(t) : this._(t);
  }
  O(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.O(t));
  }
  _(t) {
    this._$AH !== O && mt(this._$AH) ? this._$AA.nextSibling.data = t : this.T(De.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    const { values: n, _$litType$: r } = t, i = typeof r == "number" ? this._$AC(t) : (r.el === void 0 && (r.el = yt.createElement(oo(r.h, r.h[0]), this.options)), r);
    if (this._$AH?._$AD === i) this._$AH.p(n);
    else {
      const o = new so(i, this), a = o.u(this.options);
      o.p(n), this.T(a), this._$AH = o;
    }
  }
  _$AC(t) {
    let n = Mr.get(t.strings);
    return n === void 0 && Mr.set(t.strings, n = new yt(t)), n;
  }
  k(t) {
    $n(this._$AH) || (this._$AH = [], this._$AR());
    const n = this._$AH;
    let r, i = 0;
    for (const o of t) i === n.length ? n.push(r = new Ye(this.O(bt()), this.O(bt()), this, this.options)) : r = n[i], r._$AI(o), i++;
    i < n.length && (this._$AR(r && r._$AB.nextSibling, i), n.length = i);
  }
  _$AR(t = this._$AA.nextSibling, n) {
    for (this._$AP?.(!1, !0, n); t && t !== this._$AB; ) {
      const r = t.nextSibling;
      t.remove(), t = r;
    }
  }
  setConnected(t) {
    this._$AM === void 0 && (this._$Cv = t, this._$AP?.(t));
  }
}
class Nt {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, n, r, i, o) {
    this.type = 1, this._$AH = O, this._$AN = void 0, this.element = t, this.name = n, this._$AM = i, this.options = o, r.length > 2 || r[0] !== "" || r[1] !== "" ? (this._$AH = Array(r.length - 1).fill(new String()), this.strings = r) : this._$AH = O;
  }
  _$AI(t, n = this, r, i) {
    const o = this.strings;
    let a = !1;
    if (o === void 0) t = Te(this, t, n, 0), a = !mt(t) || t !== this._$AH && t !== he, a && (this._$AH = t);
    else {
      const s = t;
      let l, c;
      for (t = o[0], l = 0; l < o.length - 1; l++) c = Te(this, s[r + l], n, l), c === he && (c = this._$AH[l]), a ||= !mt(c) || c !== this._$AH[l], c === O ? t = O : t !== O && (t += (c ?? "") + o[l + 1]), this._$AH[l] = c;
    }
    a && !i && this.j(t);
  }
  j(t) {
    t === O ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class lo extends Nt {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === O ? void 0 : t;
  }
}
class co extends Nt {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== O);
  }
}
class uo extends Nt {
  constructor(t, n, r, i, o) {
    super(t, n, r, i, o), this.type = 5;
  }
  _$AI(t, n = this) {
    if ((t = Te(this, t, n, 0) ?? O) === he) return;
    const r = this._$AH, i = t === O && r !== O || t.capture !== r.capture || t.once !== r.once || t.passive !== r.passive, o = t !== O && (r === O || i);
    i && this.element.removeEventListener(this.name, this, r), o && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class fo {
  constructor(t, n, r) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = n, this.options = r;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    Te(this, t);
  }
}
const Ol = { M: Yn, P: oe, A: Qn, C: 1, L: ao, R: so, D: no, V: Te, I: Ye, H: Nt, N: co, U: uo, B: lo, F: fo }, Sl = Xn.litHtmlPolyfillSupport;
Sl?.(yt, Ye), (Xn.litHtmlVersions ??= []).push("3.2.1");
const Nl = (e, t, n) => {
  const r = n?.renderBefore ?? t;
  let i = r._$litPart$;
  if (i === void 0) {
    const o = n?.renderBefore ?? null;
    r._$litPart$ = i = new Ye(t.insertBefore(bt(), o), o, void 0, n ?? {});
  }
  return i._$AI(e), i;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
let dt = class extends Ue {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    const t = super.createRenderRoot();
    return this.renderOptions.renderBefore ??= t.firstChild, t;
  }
  update(t) {
    const n = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Nl(n, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    super.connectedCallback(), this._$Do?.setConnected(!0);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this._$Do?.setConnected(!1);
  }
  render() {
    return he;
  }
};
dt._$litElement$ = !0, dt.finalized = !0, globalThis.litElementHydrateSupport?.({ LitElement: dt });
const xl = globalThis.litElementPolyfillSupport;
xl?.({ LitElement: dt });
(globalThis.litElementVersions ??= []).push("4.1.1");
class _l extends Al(dt) {
}
class Pl extends _l {
  constructor() {
    super(...arguments), this.disposers = [];
  }
  /**
   * Creates a MobX reaction using the given parameters and disposes it when this element is detached.
   *
   * This should be called from `connectedCallback` to ensure that the reaction is active also if the element is attached again later.
   */
  reaction(t, n, r) {
    this.disposers.push(Di(t, n, r));
  }
  /**
   * Creates a MobX autorun using the given parameters and disposes it when this element is detached.
   *
   * This should be called from `connectedCallback` to ensure that the reaction is active also if the element is attached again later.
   */
  autorun(t, n) {
    this.disposers.push(Pi(t, n));
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this.disposers.forEach((t) => {
      t();
    }), this.disposers = [];
  }
}
const se = window.Vaadin.copilot._sectionPanelUiState;
if (!se)
  throw new Error("Tried to access copilot section panel ui state before it was initialized.");
let we = [];
const jr = [];
function Ur(e) {
  e.init({
    addPanel: (t) => {
      se.addPanel(t);
    },
    send(t, n) {
      fe(t, n);
    }
  });
}
function Cl() {
  we.push(import("./copilot-log-plugin-BkdK3k_H.js")), we.push(import("./copilot-info-plugin-B2ElBRVn.js")), we.push(import("./copilot-features-plugin-BnYYbFyB.js")), we.push(import("./copilot-feedback-plugin-BiGMm7x_.js")), we.push(import("./copilot-shortcuts-plugin-BgCNJzQE.js"));
}
function Dl() {
  {
    const e = `https://cdn.vaadin.com/copilot/${Ks}/copilot-plugins.js`;
    import(
      /* @vite-ignore */
      e
    ).catch((t) => {
      console.warn(`Unable to load plugins from ${e}. Some Copilot features are unavailable.`, t);
    });
  }
}
function Tl() {
  Promise.all(we).then(() => {
    const e = window.Vaadin;
    if (e.copilot.plugins) {
      const t = e.copilot.plugins;
      e.copilot.plugins.push = (n) => Ur(n), Array.from(t).forEach((n) => {
        jr.includes(n) || (Ur(n), jr.push(n));
      });
    }
  }), we = [];
}
function tu(e) {
  return Object.assign({
    expanded: !0,
    expandable: !1,
    panelOrder: 0,
    floating: !1,
    width: 500,
    height: 500,
    floatingPosition: {
      top: 50,
      left: 350
    }
  }, e);
}
class Rl {
  constructor() {
    this.active = !1, this.activate = () => {
      this.active = !0, this.blurActiveApplicationElement();
    }, this.deactivate = () => {
      this.active = !1;
    }, this.focusInEventListener = (t) => {
      this.active && (t.preventDefault(), t.stopPropagation(), qe(t.target) || requestAnimationFrame(() => {
        t.target.blur && t.target.blur(), document.body.querySelector("copilot-main")?.focus();
      }));
    };
  }
  hostConnectedCallback() {
    const t = this.getApplicationRootElement();
    t && t instanceof HTMLElement && t.addEventListener("focusin", this.focusInEventListener);
  }
  hostDisconnectedCallback() {
    const t = this.getApplicationRootElement();
    t && t instanceof HTMLElement && t.removeEventListener("focusin", this.focusInEventListener);
  }
  getApplicationRootElement() {
    return document.body.firstElementChild;
  }
  blurActiveApplicationElement() {
    document.activeElement && document.activeElement.blur && document.activeElement.blur();
  }
}
const Tt = new Rl(), A = window.Vaadin.copilot.eventbus;
if (!A)
  throw new Error("Tried to access copilot eventbus before it was initialized.");
const nt = window.Vaadin.copilot.overlayManager, nu = {
  AddClickListener: "Add Click Listener",
  AI: "AI",
  Delete: "Delete",
  DragAndDrop: "Drag and Drop",
  Duplicate: "Duplicate",
  SetLabel: "Set label",
  SetText: "Set text",
  SetHelper: "Set helper text",
  SetTitle: "Set title text",
  WrapWithTag: "Wrapping with tag",
  Alignment: "Alignment",
  Padding: "Padding",
  ModifyComponentSource: "Modify component source",
  Gap: "Gap",
  RedoUndo: "Redo/Undo",
  Sizing: "Sizing",
  ConnectToService: "ConnectToService",
  SetStaticData: "SetStaticData"
}, p = window.Vaadin.copilot._uiState;
if (!p)
  throw new Error("Tried to access copilot ui state before it was initialized.");
const Vl = () => {
  fe("copilot-browser-info", {
    userAgent: navigator.userAgent,
    locale: navigator.language,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
  });
}, dn = (e, t) => {
  fe("copilot-track-event", { event: e, properties: t });
}, ru = (e, t) => {
  dn(e, { ...t, view: "react" });
}, iu = (e, t) => {
  dn(e, { ...t, view: "flow" });
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const ho = { ATTRIBUTE: 1, CHILD: 2, PROPERTY: 3, BOOLEAN_ATTRIBUTE: 4, EVENT: 5, ELEMENT: 6 }, vo = (e) => (...t) => ({ _$litDirective$: e, values: t });
class po {
  constructor(t) {
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AT(t, n, r) {
    this._$Ct = t, this._$AM = n, this._$Ci = r;
  }
  _$AS(t, n) {
    return this.update(t, n);
  }
  update(t, n) {
    return this.render(...n);
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
class Vn extends po {
  constructor(t) {
    if (super(t), this.it = O, t.type !== ho.CHILD) throw Error(this.constructor.directiveName + "() can only be used in child bindings");
  }
  render(t) {
    if (t === O || t == null) return this._t = void 0, this.it = t;
    if (t === he) return t;
    if (typeof t != "string") throw Error(this.constructor.directiveName + "() called with a non-string value");
    if (t === this.it) return this._t;
    this.it = t;
    const n = [t];
    return n.raw = n, this._t = { _$litType$: this.constructor.resultType, strings: n, values: [] };
  }
}
Vn.directiveName = "unsafeHTML", Vn.resultType = 1;
const Il = vo(Vn), fn = window.Vaadin.copilot._machineState;
if (!fn)
  throw new Error("Trying to use stored machine state before it was initialized");
const kl = 5e3;
let zr = 1;
function go(e) {
  p.notifications.includes(e) && (e.dontShowAgain && e.dismissId && Ll(e.dismissId), p.removeNotification(e), A.emit("notification-dismissed", e));
}
function bo(e) {
  return fn.getDismissedNotifications().includes(e);
}
function Ll(e) {
  bo(e) || fn.addDismissedNotification(e);
}
function Ml(e) {
  return !(e.dismissId && (bo(e.dismissId) || p.notifications.find((t) => t.dismissId === e.dismissId)));
}
function er(e) {
  Ml(e) && jl(e);
}
function jl(e) {
  const t = zr;
  zr += 1;
  const n = { ...e, id: t, dontShowAgain: !1, animatingOut: !1 };
  p.setNotifications([...p.notifications, n]), (e.delay || !e.link && !e.dismissId) && setTimeout(() => {
    go(n);
  }, e.delay ?? kl), A.emit("notification-shown", e);
}
const Ul = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  dismissNotification: go,
  showNotification: er
}, Symbol.toStringTag, { value: "Module" })), zl = (e) => {
  Re("Unspecified error", e), A.emit("vite-after-update", {});
}, Bl = (e, t) => e.error ? (Fl({
  error: e.error,
  message: e.errorMessage,
  stackTrace: e.errorStacktrace,
  requestData: t
}), !0) : !1, mo = (e, t, n, r) => {
  Kn({
    type: Le.ERROR,
    message: e,
    details: Ys(
      ut`<vaadin-details summary="Details" style="color: var(--dev-tools-text-color)"
        ><div>
          <code class="codeblock" style="white-space: normal;color: var(--color)"
            ><copilot-copy></copilot-copy>${Il(t)}</code
          >
          <vaadin-button hidden>Report this issue</vaadin-button>
        </div></vaadin-details
      >`
    ),
    delay: 3e4
  }), p.userInfo?.copilotProjectCannotLeaveLocalhost !== !0 && A.emit("system-info-with-callback", {
    callback: (i) => A.send("copilot-error", {
      message: e,
      details: String(n).replace("	", `
`) + (r ? `
 
Request: 
${JSON.stringify(r)}
` : ""),
      versions: i
    }),
    notify: !1
  }), p.clearOperationWaitsHmrUpdate();
}, Fl = (e) => {
  mo(e.error, e.message, e.stackTrace, e.requestData);
};
function Wl(e, t) {
  mo(e, t.message, t.stack || "");
}
function Re(e, t) {
  Kn({
    type: Le.ERROR,
    message: "Copilot internal error",
    details: e + (t ? `
${t}` : "")
  }), A.emit("system-info-with-callback", {
    callback: (n) => A.send("copilot-error", {
      message: `Copilot internal error: ${e}`,
      details: t?.stack ?? t ?? "",
      versions: n
    }),
    notify: !1
  });
}
function Br(e) {
  return e?.stack?.includes("cdn.vaadin.com/copilot") || e?.stack?.includes("/copilot/copilot/") || e?.stack?.includes("/copilot/copilot-private/");
}
function yo() {
  const e = window.onerror;
  window.onerror = (n, r, i, o, a) => {
    if (Br(a)) {
      Re(n.toString(), a);
      return;
    }
    e && e(n, r, i, o, a);
  }, Fa((n) => {
    Br(n) && Re("", n);
  });
  const t = window.Vaadin.ConsoleErrors;
  Array.isArray(t) && In.push(...t), wo((n) => In.push(n));
}
const In = [];
function wo(e) {
  const t = window.Vaadin.ConsoleErrors;
  window.Vaadin.ConsoleErrors = {
    push: (n) => {
      n[0].type !== void 0 && n[0].message !== void 0 ? e({
        type: n[0].type,
        message: n[0].message,
        internal: !!n[0].internal,
        details: n[0].details,
        link: n[0].link
      }) : e({ type: Le.ERROR, message: n.map((r) => Zl(r)).join(" "), internal: !1 }), t.push(n);
    }
  };
}
function Zl(e) {
  return e.message ? e.message.toString() : e.toString();
}
function Gl(e) {
  er({
    type: Le.ERROR,
    message: `Unable to ${e}`,
    details: "Could not find sources for React components, probably because the project is not a React (or Flow) project"
  });
}
const ql = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  catchErrors: wo,
  consoleErrorsQueue: In,
  handleBrowserOperationError: Wl,
  handleCopilotError: Re,
  handleErrorDuringOperation: zl,
  handleServerOperationErrorIfNeeded: Bl,
  installErrorHandlers: yo,
  showNotReactFlowProject: Gl
}, Symbol.toStringTag, { value: "Module" })), Ao = window.Vaadin.copilot._previewState;
if (!Ao)
  throw new Error("Tried to access copilot preview state before it was initialized.");
const Eo = () => {
  Kl().then((e) => p.setUserInfo(e)).catch((e) => Re("Failed to load userInfo", e));
}, Kl = async () => qn(`${Ce}get-user-info`, {}, (e) => (delete e.data.reqId, e.data)), Hl = async () => Hi(() => p.userInfo), ou = async () => (await Hl()).vaadiner;
A.on("copilot-prokey-received", (e) => {
  Eo(), e.preventDefault();
});
function Jl() {
  const e = window.navigator.userAgent;
  return e.indexOf("Windows") !== -1 ? "Windows" : e.indexOf("Mac") !== -1 ? "Mac" : e.indexOf("Linux") !== -1 ? "Linux" : null;
}
function Xl() {
  return Jl() === "Mac";
}
function Yl() {
  return Xl() ? "⌘" : "Ctrl";
}
function Ql(e) {
  return e.composed && e.composedPath().map((t) => t.localName).some((t) => t === "copilot-spotlight");
}
function $l(e) {
  return e.composed && e.composedPath().map((t) => t.localName).some((t) => t === "copilot-drawer-panel" || t === "copilot-section-panel-wrapper");
}
let yn = !1, rt = 0;
const Fr = (e) => {
  if (fn.isActivationShortcut())
    if (e.key === "Shift" && !e.ctrlKey && !e.altKey && !e.metaKey)
      yn = !0;
    else if (yn && e.shiftKey && (e.key === "Control" || e.key === "Meta")) {
      if (rt++, rt === 2) {
        p.toggleActive("shortcut"), rt = 0;
        return;
      }
      setTimeout(() => {
        rt = 0;
      }, 500);
    } else
      yn = !1, rt = 0;
  p.active && ec(e);
}, ec = (e) => {
  const t = Ql(e);
  if (e.shiftKey && e.code === "Space")
    p.setSpotlightActive(!p.spotlightActive), e.stopPropagation(), e.preventDefault();
  else if (e.key === "Escape") {
    if (e.stopPropagation(), p.loginCheckActive) {
      p.setLoginCheckActive(!1);
      return;
    }
    A.emit("close-drawers", {}), p.setSpotlightActive(!1);
  } else !$l(e) && !t && tc(e) ? (A.emit("delete-selected", {}), e.preventDefault(), e.stopPropagation()) : (e.ctrlKey || e.metaKey) && e.key === "d" && !t ? (A.emit("duplicate-selected", {}), e.preventDefault(), e.stopPropagation()) : (e.ctrlKey || e.metaKey) && e.key === "b" && !t ? (A.emit("show-selected-in-ide", { attach: e.shiftKey }), e.preventDefault(), e.stopPropagation()) : (e.ctrlKey || e.metaKey) && e.key === "z" ? p.idePluginState?.supportedActions?.find((n) => n === "undo") && (A.emit("undoRedo", { undo: !e.shiftKey }), e.preventDefault(), e.stopPropagation()) : qe(e.target) && A.emit("keyboard-event", { event: e });
}, tc = (e) => (e.key === "Backspace" || e.key === "Delete") && !e.shiftKey && !e.ctrlKey && !e.altKey && !e.metaKey, ee = Yl(), au = {
  toggleCopilot: `<kbd>⇧</kbd> + <kbd>${ee}</kbd> <kbd>${ee}</kbd>`,
  toggleCommandWindow: "<kbd>⇧</kbd> + <kbd>Space</kbd>",
  undo: `<kbd>${ee}</kbd> + <kbd>Z</kbd>`,
  redo: `<kbd>${ee}</kbd> + <kbd>⇧</kbd> + <kbd>Z</kbd>`,
  duplicate: `<kbd>${ee}</kbd> + <kbd>D</kbd>`,
  goToSource: `<kbd>${ee}</kbd> + <kbd>B</kbd>`,
  goToAttachSource: `<kbd>${ee}</kbd>  + <kbd>⇧</kbd>  + <kbd>B</kbd>`,
  selectParent: "<kbd>←</kbd>",
  selectPreviousSibling: "<kbd>↑</kbd>",
  selectNextSibling: "<kbd>↓</kbd>",
  delete: "<kbd>DEL</kbd>",
  copy: `<kbd>${ee}</kbd> + <kbd>C</kbd>`,
  paste: `<kbd>${ee}</kbd> + <kbd>V</kbd>`
};
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Oo = Symbol.for(""), nc = (e) => {
  if (e?.r === Oo) return e?._$litStatic$;
}, So = (e) => ({ _$litStatic$: e, r: Oo }), Wr = /* @__PURE__ */ new Map(), rc = (e) => (t, ...n) => {
  const r = n.length;
  let i, o;
  const a = [], s = [];
  let l, c = 0, u = !1;
  for (; c < r; ) {
    for (l = t[c]; c < r && (o = n[c], (i = nc(o)) !== void 0); ) l += i + t[++c], u = !0;
    c !== r && s.push(o), a.push(l), c++;
  }
  if (c === r && a.push(t[r]), u) {
    const d = a.join("$$lit$$");
    (t = Wr.get(d)) === void 0 && (a.raw = a, Wr.set(d, t = a)), n = s;
  }
  return e(t, ...n);
}, ft = rc(ut);
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { I: ic } = Ol, Zr = () => document.createComment(""), it = (e, t, n) => {
  const r = e._$AA.parentNode, i = t === void 0 ? e._$AB : t._$AA;
  if (n === void 0) {
    const o = r.insertBefore(Zr(), i), a = r.insertBefore(Zr(), i);
    n = new ic(o, a, e, e.options);
  } else {
    const o = n._$AB.nextSibling, a = n._$AM, s = a !== e;
    if (s) {
      let l;
      n._$AQ?.(e), n._$AM = e, n._$AP !== void 0 && (l = e._$AU) !== a._$AU && n._$AP(l);
    }
    if (o !== i || s) {
      let l = n._$AA;
      for (; l !== o; ) {
        const c = l.nextSibling;
        r.insertBefore(l, i), l = c;
      }
    }
  }
  return n;
}, ye = (e, t, n = e) => (e._$AI(t, n), e), oc = {}, ac = (e, t = oc) => e._$AH = t, sc = (e) => e._$AH, wn = (e) => {
  e._$AP?.(!1, !0);
  let t = e._$AA;
  const n = e._$AB.nextSibling;
  for (; t !== n; ) {
    const r = t.nextSibling;
    t.remove(), t = r;
  }
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Gr = (e, t, n) => {
  const r = /* @__PURE__ */ new Map();
  for (let i = t; i <= n; i++) r.set(e[i], i);
  return r;
}, No = vo(class extends po {
  constructor(e) {
    if (super(e), e.type !== ho.CHILD) throw Error("repeat() can only be used in text expressions");
  }
  dt(e, t, n) {
    let r;
    n === void 0 ? n = t : t !== void 0 && (r = t);
    const i = [], o = [];
    let a = 0;
    for (const s of e) i[a] = r ? r(s, a) : a, o[a] = n(s, a), a++;
    return { values: o, keys: i };
  }
  render(e, t, n) {
    return this.dt(e, t, n).values;
  }
  update(e, [t, n, r]) {
    const i = sc(e), { values: o, keys: a } = this.dt(t, n, r);
    if (!Array.isArray(i)) return this.ut = a, o;
    const s = this.ut ??= [], l = [];
    let c, u, d = 0, v = i.length - 1, g = 0, m = o.length - 1;
    for (; d <= v && g <= m; ) if (i[d] === null) d++;
    else if (i[v] === null) v--;
    else if (s[d] === a[g]) l[g] = ye(i[d], o[g]), d++, g++;
    else if (s[v] === a[m]) l[m] = ye(i[v], o[m]), v--, m--;
    else if (s[d] === a[m]) l[m] = ye(i[d], o[m]), it(e, l[m + 1], i[d]), d++, m--;
    else if (s[v] === a[g]) l[g] = ye(i[v], o[g]), it(e, i[d], i[v]), v--, g++;
    else if (c === void 0 && (c = Gr(a, g, m), u = Gr(s, d, v)), c.has(s[d])) if (c.has(s[v])) {
      const E = u.get(a[g]), x = E !== void 0 ? i[E] : null;
      if (x === null) {
        const H = it(e, i[d]);
        ye(H, o[g]), l[g] = H;
      } else l[g] = ye(x, o[g]), it(e, i[d], x), i[E] = null;
      g++;
    } else wn(i[v]), v--;
    else wn(i[d]), d++;
    for (; g <= m; ) {
      const E = it(e, l[m + 1]);
      ye(E, o[g]), l[g++] = E;
    }
    for (; d <= v; ) {
      const E = i[d++];
      E !== null && wn(E);
    }
    return this.ut = a, ac(e, l), he;
  }
}), kt = /* @__PURE__ */ new Map(), lc = (e) => {
  const n = se.panels.filter((r) => !r.floating && r.panel === e).sort((r, i) => r.panelOrder - i.panelOrder);
  return ft`
    ${No(
    n,
    (r) => r.tag,
    (r) => {
      const i = So(r.tag);
      return ft` <copilot-section-panel-wrapper panelTag="${i}">
          ${se.shouldRender(r.tag) ? ft`<${i} slot="content"></${i}>` : O}
        </copilot-section-panel-wrapper>`;
    }
  )}
  `;
}, cc = () => {
  const e = se.panels;
  return ft`
    ${No(
    e.filter((t) => t.floating),
    (t) => t.tag,
    (t) => {
      const n = So(t.tag);
      return ft`
                        <copilot-section-panel-wrapper panelTag="${n}">
                            <${n} slot="content"></${n}>
                        </copilot-section-panel-wrapper>`;
    }
  )}
  `;
}, su = (e) => {
  const t = e.panelTag, n = e.querySelector('[slot="content"]');
  n && kt.set(t, n);
}, lu = (e) => {
  if (kt.has(e.panelTag)) {
    const t = kt.get(e.panelTag);
    e.querySelector('[slot="content"]').replaceWith(t);
  }
  kt.delete(e.panelTag);
}, _ = [];
for (let e = 0; e < 256; ++e)
  _.push((e + 256).toString(16).slice(1));
function uc(e, t = 0) {
  return (_[e[t + 0]] + _[e[t + 1]] + _[e[t + 2]] + _[e[t + 3]] + "-" + _[e[t + 4]] + _[e[t + 5]] + "-" + _[e[t + 6]] + _[e[t + 7]] + "-" + _[e[t + 8]] + _[e[t + 9]] + "-" + _[e[t + 10]] + _[e[t + 11]] + _[e[t + 12]] + _[e[t + 13]] + _[e[t + 14]] + _[e[t + 15]]).toLowerCase();
}
let An;
const dc = new Uint8Array(16);
function fc() {
  if (!An) {
    if (typeof crypto > "u" || !crypto.getRandomValues)
      throw new Error("crypto.getRandomValues() not supported. See https://github.com/uuidjs/uuid#getrandomvalues-not-supported");
    An = crypto.getRandomValues.bind(crypto);
  }
  return An(dc);
}
const hc = typeof crypto < "u" && crypto.randomUUID && crypto.randomUUID.bind(crypto), qr = { randomUUID: hc };
function xo(e, t, n) {
  if (qr.randomUUID && !t && !e)
    return qr.randomUUID();
  e = e || {};
  const r = e.random ?? e.rng?.() ?? fc();
  if (r.length < 16)
    throw new Error("Random bytes length must be >= 16");
  return r[6] = r[6] & 15 | 64, r[8] = r[8] & 63 | 128, uc(r);
}
const Lt = [], st = [], cu = async (e, t, n) => {
  let r, i;
  t.reqId = xo();
  const o = new Promise((a, s) => {
    r = a, i = s;
  });
  return Lt.push({
    handleMessage(a) {
      if (a?.data?.reqId !== t.reqId)
        return !1;
      try {
        r(n(a));
      } catch (s) {
        i(s);
      }
      return !0;
    }
  }), fe(e, t), o;
};
function vc(e) {
  for (const t of Lt)
    if (t.handleMessage(e))
      return Lt.splice(Lt.indexOf(t), 1), !0;
  if (A.emitUnsafe({ type: e.command, data: e.data }))
    return !0;
  for (const t of Po())
    if (_o(t, e))
      return !0;
  return st.push(e), !1;
}
function _o(e, t) {
  return e.handleMessage?.call(e, t);
}
function pc() {
  if (st.length)
    for (const e of Po())
      for (let t = 0; t < st.length; t++)
        _o(e, st[t]) && (st.splice(t, 1), t--);
}
function Po() {
  const e = document.querySelector("copilot-main");
  return e ? e.renderRoot.querySelectorAll("copilot-section-panel-wrapper *") : [];
}
const gc = "@keyframes bounce{0%{transform:scale(.8)}50%{transform:scale(1.5)}to{transform:scale(1)}}@keyframes around-we-go-again{0%{background-position:0 0,0 0,calc(var(--glow-size) * -.5) calc(var(--glow-size) * -.5),calc(100% + calc(var(--glow-size) * .5)) calc(100% + calc(var(--glow-size) * .5))}25%{background-position:0 0,0 0,calc(100% + calc(var(--glow-size) * .5)) calc(var(--glow-size) * -.5),calc(var(--glow-size) * -.5) calc(100% + calc(var(--glow-size) * .5))}50%{background-position:0 0,0 0,calc(100% + calc(var(--glow-size) * .5)) calc(100% + calc(var(--glow-size) * .5)),calc(var(--glow-size) * -.5) calc(var(--glow-size) * -.5)}75%{background-position:0 0,0 0,calc(var(--glow-size) * -.5) calc(100% + calc(var(--glow-size) * .5)),calc(100% + calc(var(--glow-size) * .5)) calc(var(--glow-size) * -.5)}to{background-position:0 0,0 0,calc(var(--glow-size) * -.5) calc(var(--glow-size) * -.5),calc(100% + calc(var(--glow-size) * .5)) calc(100% + calc(var(--glow-size) * .5))}}@keyframes swirl{0%{rotate:0deg;filter:hue-rotate(20deg)}50%{filter:hue-rotate(-30deg)}to{rotate:360deg;filter:hue-rotate(20deg)}}@keyframes button-focus-in{0%{box-shadow:0 0 0 0 var(--focus-color)}to{box-shadow:0 0 0 var(--focus-size) var(--focus-color)}}@keyframes button-focus-out{0%{box-shadow:0 0 0 var(--focus-size) var(--focus-color)}}@keyframes link-focus-in{0%{box-shadow:0 0 0 0 var(--blue-color)}to{box-shadow:0 0 0 var(--focus-size) var(--blue-color)}}@keyframes link-focus-out{0%{box-shadow:0 0 0 var(--focus-size) var(--blue-color)}}", bc = ":host{--gray-h: 220;--gray-s: 30%;--gray-l: 30%;--gray-hsl: var(--gray-h) var(--gray-s) var(--gray-l);--gray: hsl(var(--gray-hsl));--gray-50: hsl(var(--gray-hsl) / .05);--gray-100: hsl(var(--gray-hsl) / .1);--gray-150: hsl(var(--gray-hsl) / .16);--gray-200: hsl(var(--gray-hsl) / .24);--gray-250: hsl(var(--gray-hsl) / .34);--gray-300: hsl(var(--gray-hsl) / .46);--gray-350: hsl(var(--gray-hsl) / .6);--gray-400: hsl(var(--gray-hsl) / .7);--gray-450: hsl(var(--gray-hsl) / .8);--gray-500: hsl(var(--gray-hsl) / .9);--gray-550: hsl(var(--gray-hsl));--gray-600: hsl(var(--gray-h) var(--gray-s) calc(var(--gray-l) - 2%));--gray-650: hsl(var(--gray-h) var(--gray-s) calc(var(--gray-l) - 4%));--gray-700: hsl(var(--gray-h) var(--gray-s) calc(var(--gray-l) - 8%));--gray-750: hsl(var(--gray-h) var(--gray-s) calc(var(--gray-l) - 12%));--gray-800: hsl(var(--gray-h) var(--gray-s) calc(var(--gray-l) - 20%));--gray-850: hsl(var(--gray-h) var(--gray-s) calc(var(--gray-l) - 23%));--gray-900: hsl(var(--gray-h) var(--gray-s) calc(var(--gray-l) - 30%));--blue-h: 220;--blue-s: 90%;--blue-l: 53%;--blue-hsl: var(--blue-h) var(--blue-s) var(--blue-l);--blue: hsl(var(--blue-hsl));--blue-50: hsl(var(--blue-hsl) / .05);--blue-100: hsl(var(--blue-hsl) / .1);--blue-150: hsl(var(--blue-hsl) / .2);--blue-200: hsl(var(--blue-hsl) / .3);--blue-250: hsl(var(--blue-hsl) / .4);--blue-300: hsl(var(--blue-hsl) / .5);--blue-350: hsl(var(--blue-hsl) / .6);--blue-400: hsl(var(--blue-hsl) / .7);--blue-450: hsl(var(--blue-hsl) / .8);--blue-500: hsl(var(--blue-hsl) / .9);--blue-550: hsl(var(--blue-hsl));--blue-600: hsl(var(--blue-h) var(--blue-s) calc(var(--blue-l) - 4%));--blue-650: hsl(var(--blue-h) var(--blue-s) calc(var(--blue-l) - 8%));--blue-700: hsl(var(--blue-h) var(--blue-s) calc(var(--blue-l) - 12%));--blue-750: hsl(var(--blue-h) var(--blue-s) calc(var(--blue-l) - 15%));--blue-800: hsl(var(--blue-h) var(--blue-s) calc(var(--blue-l) - 18%));--blue-850: hsl(var(--blue-h) var(--blue-s) calc(var(--blue-l) - 24%));--blue-900: hsl(var(--blue-h) var(--blue-s) calc(var(--blue-l) - 27%));--purple-h: 246;--purple-s: 90%;--purple-l: 60%;--purple-hsl: var(--purple-h) var(--purple-s) var(--purple-l);--purple: hsl(var(--purple-hsl));--purple-50: hsl(var(--purple-hsl) / .05);--purple-100: hsl(var(--purple-hsl) / .1);--purple-150: hsl(var(--purple-hsl) / .2);--purple-200: hsl(var(--purple-hsl) / .3);--purple-250: hsl(var(--purple-hsl) / .4);--purple-300: hsl(var(--purple-hsl) / .5);--purple-350: hsl(var(--purple-hsl) / .6);--purple-400: hsl(var(--purple-hsl) / .7);--purple-450: hsl(var(--purple-hsl) / .8);--purple-500: hsl(var(--purple-hsl) / .9);--purple-550: hsl(var(--purple-hsl));--purple-600: hsl(var(--purple-h) calc(var(--purple-s) - 4%) calc(var(--purple-l) - 2%));--purple-650: hsl(var(--purple-h) calc(var(--purple-s) - 8%) calc(var(--purple-l) - 4%));--purple-700: hsl(var(--purple-h) calc(var(--purple-s) - 15%) calc(var(--purple-l) - 7%));--purple-750: hsl(var(--purple-h) calc(var(--purple-s) - 23%) calc(var(--purple-l) - 11%));--purple-800: hsl(var(--purple-h) calc(var(--purple-s) - 24%) calc(var(--purple-l) - 15%));--purple-850: hsl(var(--purple-h) calc(var(--purple-s) - 24%) calc(var(--purple-l) - 19%));--purple-900: hsl(var(--purple-h) calc(var(--purple-s) - 27%) calc(var(--purple-l) - 23%));--green-h: 150;--green-s: 80%;--green-l: 42%;--green-hsl: var(--green-h) var(--green-s) var(--green-l);--green: hsl(var(--green-hsl));--green-50: hsl(var(--green-hsl) / .05);--green-100: hsl(var(--green-hsl) / .1);--green-150: hsl(var(--green-hsl) / .2);--green-200: hsl(var(--green-hsl) / .3);--green-250: hsl(var(--green-hsl) / .4);--green-300: hsl(var(--green-hsl) / .5);--green-350: hsl(var(--green-hsl) / .6);--green-400: hsl(var(--green-hsl) / .7);--green-450: hsl(var(--green-hsl) / .8);--green-500: hsl(var(--green-hsl) / .9);--green-550: hsl(var(--green-hsl));--green-600: hsl(var(--green-h) var(--green-s) calc(var(--green-l) - 2%));--green-650: hsl(var(--green-h) var(--green-s) calc(var(--green-l) - 4%));--green-700: hsl(var(--green-h) var(--green-s) calc(var(--green-l) - 8%));--green-750: hsl(var(--green-h) var(--green-s) calc(var(--green-l) - 12%));--green-800: hsl(var(--green-h) var(--green-s) calc(var(--green-l) - 15%));--green-850: hsl(var(--green-h) var(--green-s) calc(var(--green-l) - 19%));--green-900: hsl(var(--green-h) var(--green-s) calc(var(--green-l) - 23%));--yellow-h: 38;--yellow-s: 98%;--yellow-l: 64%;--yellow-hsl: var(--yellow-h) var(--yellow-s) var(--yellow-l);--yellow: hsl(var(--yellow-hsl));--yellow-50: hsl(var(--yellow-hsl) / .07);--yellow-100: hsl(var(--yellow-hsl) / .12);--yellow-150: hsl(var(--yellow-hsl) / .2);--yellow-200: hsl(var(--yellow-hsl) / .3);--yellow-250: hsl(var(--yellow-hsl) / .4);--yellow-300: hsl(var(--yellow-hsl) / .5);--yellow-350: hsl(var(--yellow-hsl) / .6);--yellow-400: hsl(var(--yellow-hsl) / .7);--yellow-450: hsl(var(--yellow-hsl) / .8);--yellow-500: hsl(var(--yellow-hsl) / .9);--yellow-550: hsl(var(--yellow-hsl));--yellow-600: hsl(var(--yellow-h) var(--yellow-s) calc(var(--yellow-l) - 5%));--yellow-650: hsl(var(--yellow-h) var(--yellow-s) calc(var(--yellow-l) - 10%));--yellow-700: hsl(var(--yellow-h) var(--yellow-s) calc(var(--yellow-l) - 15%));--yellow-750: hsl(var(--yellow-h) var(--yellow-s) calc(var(--yellow-l) - 20%));--yellow-800: hsl(var(--yellow-h) var(--yellow-s) calc(var(--yellow-l) - 25%));--yellow-850: hsl(var(--yellow-h) var(--yellow-s) calc(var(--yellow-l) - 30%));--yellow-900: hsl(var(--yellow-h) var(--yellow-s) calc(var(--yellow-l) - 35%));--red-h: 355;--red-s: 75%;--red-l: 55%;--red-hsl: var(--red-h) var(--red-s) var(--red-l);--red: hsl(var(--red-hsl));--red-50: hsl(var(--red-hsl) / .05);--red-100: hsl(var(--red-hsl) / .1);--red-150: hsl(var(--red-hsl) / .2);--red-200: hsl(var(--red-hsl) / .3);--red-250: hsl(var(--red-hsl) / .4);--red-300: hsl(var(--red-hsl) / .5);--red-350: hsl(var(--red-hsl) / .6);--red-400: hsl(var(--red-hsl) / .7);--red-450: hsl(var(--red-hsl) / .8);--red-500: hsl(var(--red-hsl) / .9);--red-550: hsl(var(--red-hsl));--red-600: hsl(var(--red-h) calc(var(--red-s) - 5%) calc(var(--red-l) - 2%));--red-650: hsl(var(--red-h) calc(var(--red-s) - 10%) calc(var(--red-l) - 4%));--red-700: hsl(var(--red-h) calc(var(--red-s) - 15%) calc(var(--red-l) - 8%));--red-750: hsl(var(--red-h) calc(var(--red-s) - 20%) calc(var(--red-l) - 12%));--red-800: hsl(var(--red-h) calc(var(--red-s) - 25%) calc(var(--red-l) - 15%));--red-850: hsl(var(--red-h) calc(var(--red-s) - 30%) calc(var(--red-l) - 19%));--red-900: hsl(var(--red-h) calc(var(--red-s) - 35%) calc(var(--red-l) - 23%));--codeblock-bg: #f4f4f4;--vaadin-logo-blue: #00b4f0;--background-color: rgba(255, 255, 255, .87);--primary-color: #0368DE;--input-border-color: rgba(0, 0, 0, .42);--divider-color: rgba(0, 0, 0, .1);--body-text-color: rgba(0, 0, 0, .87);--secondary-text-color: rgba(0, 0, 0, .6);--primary-contrast-text-color: white;--active-color: rgba(3, 104, 222, .1);--focus-color: #0377FF;--hover-color: rgba(0, 0, 0, .05);--success-color: #066845;--error-color: #CE0010;--warning-color: #8A6C1E;--contrast-color-5: rgba(0, 0, 0, .05);--contrast-color-10: rgba(0, 0, 0, .1);--contrast-color-20: rgba(0, 0, 0, .2);--contrast-color-30: rgba(0, 0, 0, .3);--contrast-color-40: rgba(0, 0, 0, .4);--contrast-color-50: rgba(0, 0, 0, .5);--contrast-color-60: rgba(0, 0, 0, .6);--contrast-color-70: rgba(0, 0, 0, .7);--contrast-color-80: rgba(0, 0, 0, .8);--contrast-color-90: rgba(0, 0, 0, .9);--contrast-color-100: black;--blue-color: #0368DE;--violet-color: #7B2BFF}:host(.dark){--gray-s: 15%;--gray-l: 70%;--gray-600: hsl(var(--gray-h) calc(var(--gray-s) - 2%) calc(var(--gray-l) + 6%));--gray-650: hsl(var(--gray-h) calc(var(--gray-s) - 5%) calc(var(--gray-l) + 14%));--gray-700: hsl(var(--gray-h) calc(var(--gray-s) - 2%) calc(var(--gray-l) + 26%));--gray-750: hsl(var(--gray-h) calc(var(--gray-s) - 2%) calc(var(--gray-l) + 36%));--gray-800: hsl(var(--gray-h) calc(var(--gray-s) - 2%) calc(var(--gray-l) + 48%));--gray-850: hsl(var(--gray-h) calc(var(--gray-s) - 2%) calc(var(--gray-l) + 62%));--gray-900: hsl(var(--gray-h) calc(var(--gray-s) - 2%) calc(var(--gray-l) + 70%));--blue-s: 90%;--blue-l: 58%;--blue-600: hsl(var(--blue-h) var(--blue-s) calc(var(--blue-l) + 6%));--blue-650: hsl(var(--blue-h) var(--blue-s) calc(var(--blue-l) + 12%));--blue-700: hsl(var(--blue-h) var(--blue-s) calc(var(--blue-l) + 17%));--blue-750: hsl(var(--blue-h) var(--blue-s) calc(var(--blue-l) + 22%));--blue-800: hsl(var(--blue-h) var(--blue-s) calc(var(--blue-l) + 28%));--blue-850: hsl(var(--blue-h) var(--blue-s) calc(var(--blue-l) + 35%));--blue-900: hsl(var(--blue-h) var(--blue-s) calc(var(--blue-l) + 43%));--purple-600: hsl(var(--purple-h) var(--purple-s) calc(var(--purple-l) + 4%));--purple-650: hsl(var(--purple-h) var(--purple-s) calc(var(--purple-l) + 9%));--purple-700: hsl(var(--purple-h) var(--purple-s) calc(var(--purple-l) + 12%));--purple-750: hsl(var(--purple-h) var(--purple-s) calc(var(--purple-l) + 18%));--purple-800: hsl(var(--purple-h) var(--purple-s) calc(var(--purple-l) + 24%));--purple-850: hsl(var(--purple-h) var(--purple-s) calc(var(--purple-l) + 29%));--purple-900: hsl(var(--purple-h) var(--purple-s) calc(var(--purple-l) + 33%));--green-600: hsl(calc(var(--green-h) - 1) calc(var(--green-s) - 5%) calc(var(--green-l) + 5%));--green-650: hsl(calc(var(--green-h) - 2) calc(var(--green-s) - 10%) calc(var(--green-l) + 12%));--green-700: hsl(calc(var(--green-h) - 4) calc(var(--green-s) - 15%) calc(var(--green-l) + 20%));--green-750: hsl(calc(var(--green-h) - 6) calc(var(--green-s) - 20%) calc(var(--green-l) + 29%));--green-800: hsl(calc(var(--green-h) - 8) calc(var(--green-s) - 25%) calc(var(--green-l) + 37%));--green-850: hsl(calc(var(--green-h) - 10) calc(var(--green-s) - 30%) calc(var(--green-l) + 42%));--green-900: hsl(calc(var(--green-h) - 12) calc(var(--green-s) - 35%) calc(var(--green-l) + 48%));--yellow-600: hsl(calc(var(--yellow-h) + 1) var(--yellow-s) calc(var(--yellow-l) + 4%));--yellow-650: hsl(calc(var(--yellow-h) + 2) var(--yellow-s) calc(var(--yellow-l) + 7%));--yellow-700: hsl(calc(var(--yellow-h) + 4) var(--yellow-s) calc(var(--yellow-l) + 11%));--yellow-750: hsl(calc(var(--yellow-h) + 6) var(--yellow-s) calc(var(--yellow-l) + 16%));--yellow-800: hsl(calc(var(--yellow-h) + 8) var(--yellow-s) calc(var(--yellow-l) + 20%));--yellow-850: hsl(calc(var(--yellow-h) + 10) var(--yellow-s) calc(var(--yellow-l) + 24%));--yellow-900: hsl(calc(var(--yellow-h) + 12) var(--yellow-s) calc(var(--yellow-l) + 29%));--red-600: hsl(calc(var(--red-h) - 1) calc(var(--red-s) - 5%) calc(var(--red-l) + 3%));--red-650: hsl(calc(var(--red-h) - 2) calc(var(--red-s) - 10%) calc(var(--red-l) + 7%));--red-700: hsl(calc(var(--red-h) - 4) calc(var(--red-s) - 15%) calc(var(--red-l) + 14%));--red-750: hsl(calc(var(--red-h) - 6) calc(var(--red-s) - 20%) calc(var(--red-l) + 19%));--red-800: hsl(calc(var(--red-h) - 8) calc(var(--red-s) - 25%) calc(var(--red-l) + 24%));--red-850: hsl(calc(var(--red-h) - 10) calc(var(--red-s) - 30%) calc(var(--red-l) + 30%));--red-900: hsl(calc(var(--red-h) - 12) calc(var(--red-s) - 35%) calc(var(--red-l) + 36%));--codeblock-bg: var(--gray-100);--background-color: rgba(0, 0, 0, .87);--primary-color: white;--input-border-color: rgba(255, 255, 255, .42);--divider-color: rgba(255, 255, 255, .2);--body-text-color: white;--secondary-text-color: rgba(255, 255, 255, .7);--primary-contrast-text-color: rgba(0, 0, 0, .87);--active-color: rgba(255, 255, 255, .2);--focus-color: rgba(255, 255, 255, .34);--hover-color: rgba(255, 255, 255, .1);--success-color: #39C693;--error-color: #FF707A;--warning-color: #FEC941;--contrast-color-5: rgba(255, 255, 255, .05);--contrast-color-10: rgba(255, 255, 255, .1);--contrast-color-20: rgba(255, 255, 255, .2);--contrast-color-30: rgba(255, 255, 255, .3);--contrast-color-40: rgba(255, 255, 255, .4);--contrast-color-50: rgba(255, 255, 255, .5);--contrast-color-60: rgba(255, 255, 255, .6);--contrast-color-70: rgba(255, 255, 255, .7);--contrast-color-80: rgba(255, 255, 255, .8);--contrast-color-90: rgba(255, 255, 255, .9);--contrast-color-100: white;--blue-color: #95C6FF;--violet-color: #CBB4FF}", mc = '@font-face{font-family:Manrope;font-style:normal;font-weight:400;src:url(data:font/woff2;base64,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) format("woff2")}:host{--font-family: "Manrope", sans-serif;--monospace-font-family: Inconsolata, Monaco, Consolas, Courier New, Courier, monospace;--font-size-0: .6875rem;--font-size-1: .75rem;--font-size-2: .875rem;--font-size-3: 1rem;--font-size-4: 1.125rem;--font-size-5: 1.25rem;--font-size-6: 1.375rem;--font-size-7: 1.5rem;--line-height-1: 1.125rem;--line-height-2: 1.25rem;--line-height-3: 1.5rem;--line-height-4: 1.75rem;--line-height-5: 2rem;--line-height-6: 2.25rem;--line-height-7: 2.5rem;--font-weight-normal: 440;--font-weight-medium: 540;--font-weight-semibold: 640;--font-weight-bold: 740;--font: normal 400 var(--font-size-3) / var(--line-height-3) var(--font-family);--font-medium: normal var(--font-weight-medium) var(--font-size-3) / var(--line-height-3) var(--font-family);--font-semibold: normal var(--font-weight-semibold) var(--font-size-3) / var(--line-height-3) var(--font-family);--font-bold: normal var(--font-weight-bold) var(--font-size-3) / var(--line-height-3) var(--font-family);--font-small: normal 400 var(--font-size-2) / var(--line-height-2) var(--font-family);--font-small-medium: normal var(--font-weight-medium) var(--font-size-2) / var(--line-height-2) var(--font-family);--font-small-semibold: normal var(--font-weight-semibold) var(--font-size-2) / var(--line-height-2) var(--font-family);--font-small-bold: normal var(--font-weight-bold) var(--font-size-2) / var(--line-height-2) var(--font-family);--font-xsmall: normal 400 var(--font-size-1) / var(--line-height-1) var(--font-family);--font-xsmall-medium: normal var(--font-weight-medium) var(--font-size-1) / var(--line-height-1) var(--font-family);--font-xsmall-semibold: normal var(--font-weight-semibold) var(--font-size-1) / var(--line-height-1) var(--font-family);--font-xsmall-bold: normal var(--font-weight-bold) var(--font-size-1) / var(--line-height-1) var(--font-family);--font-button: normal var(--font-weight-medium) var(--font-size-1) / var(--line-height-1) var(--font-family);--font-tooltip: normal var(--font-weight-medium) var(--font-size-1) / var(--line-height-2) var(--font-family);--z-index-component-selector: 100;--z-index-floating-panel: 101;--z-index-drawer: 150;--z-index-opened-drawer: 151;--z-index-spotlight: 200;--z-index-popover: 300;--z-index-activation-button: 1000;--duration-1: .1s;--duration-2: .2s;--duration-3: .3s;--duration-4: .4s;--button-background: var(--gray-100);--button-background-hover: var(--gray-150);--size-m: 1.75rem;--icon-size-s: .75rem;--icon-size-m: 1.125rem;--space-25: 2px;--space-50: 4px;--space-75: 6px;--space-100: 8px;--space-150: 12px;--space-200: 16px;--space-300: 24px;--space-400: 32px;--space-500: 40px;--space-600: 48px;--space-700: 56px;--space-800: 64px;--space-900: 72px;--radius-1: .1875rem;--radius-2: .375rem;--radius-3: .75rem;--focus-size: 2px}:host{--lumo-font-family: var(--font-family);--lumo-font-size-xs: var(--font-size-1);--lumo-font-size-s: var(--font-size-2);--lumo-font-size-m: var(--font-size-3);--lumo-font-size-l: var(--font-size-4);--lumo-font-size-xl: var(--font-size-5);--lumo-font-size-xxl: var(--font-size-6);--lumo-font-size-xxxl: var(--font-size-7);--lumo-line-height-s: var(--line-height-2);--lumo-line-height-m: var(--line-height-3);--lumo-line-height-l: var(--line-height-4);--lumo-border-radius-s: var(--radius-1);--lumo-border-radius-m: var(--radius-2);--lumo-border-radius-l: var(--radius-3);--lumo-base-color: var(--surface-0);--lumo-body-text-color: var(--color-high-contrast);--lumo-header-text-color: var(--color-high-contrast);--lumo-secondary-text-color: var(--color);--lumo-tertiary-text-color: var(--color);--lumo-error-text-color: var(--color-danger);--lumo-primary-text-color: var(--color-high-contrast);--lumo-primary-color: var(--color-high-contrast);--lumo-primary-color-50pct: var(--color-accent);--lumo-primary-contrast-color: var(--lumo-secondary-text-color);--lumo-space-xs: var(--space-50);--lumo-space-s: var(--space-100);--lumo-space-m: var(--space-200);--lumo-space-l: var(--space-300);--lumo-space-xl: var(--space-500);--lumo-icon-size-xs: var(--font-size-1);--lumo-icon-size-s: var(--font-size-2);--lumo-icon-size-m: var(--font-size-3);--lumo-icon-size-l: var(--font-size-4);--lumo-icon-size-xl: var(--font-size-5);--vaadin-focus-ring-color: var(--focus-color);--vaadin-focus-ring-width: var(--focus-size)}:host{color-scheme:light;--surface-0: hsl(var(--gray-h) var(--gray-s) 90% / .8);--surface-1: hsl(var(--gray-h) var(--gray-s) 95% / .8);--surface-2: hsl(var(--gray-h) var(--gray-s) 100% / .8);--surface-background: linear-gradient( hsl(var(--gray-h) var(--gray-s) 95% / .7), hsl(var(--gray-h) var(--gray-s) 95% / .65) );--surface-glow: radial-gradient(circle at 30% 0%, hsl(var(--gray-h) var(--gray-s) 98% / .7), transparent 50%);--surface-border-glow: radial-gradient(at 50% 50%, hsl(var(--purple-h) 90% 90% / .8) 0, transparent 50%);--surface: var(--surface-glow) no-repeat border-box, var(--surface-background) no-repeat padding-box, hsl(var(--gray-h) var(--gray-s) 98% / .2);--surface-with-border-glow: var(--surface-glow) no-repeat border-box, linear-gradient(var(--background-color), var(--background-color)) no-repeat padding-box, var(--surface-border-glow) no-repeat border-box 0 0 / var(--glow-size, 600px) var(--glow-size, 600px);--surface-border-color: hsl(var(--gray-h) var(--gray-s) 100% / .7);--surface-backdrop-filter: blur(10px);--surface-box-shadow-1: 0 0 0 .5px hsl(var(--gray-h) var(--gray-s) 5% / .15), 0 6px 12px -1px hsl(var(--shadow-hsl) / .3);--surface-box-shadow-2: 0 0 0 .5px hsl(var(--gray-h) var(--gray-s) 5% / .15), 0 24px 40px -4px hsl(var(--shadow-hsl) / .4);--background-button: linear-gradient( hsl(var(--gray-h) var(--gray-s) 98% / .4), hsl(var(--gray-h) var(--gray-s) 90% / .2) );--background-button-active: hsl(var(--gray-h) var(--gray-s) 80% / .2);--color: var(--gray-500);--color-high-contrast: var(--gray-900);--color-accent: var(--purple-700);--color-danger: var(--red-700);--border-color: var(--gray-150);--border-color-high-contrast: var(--gray-300);--border-color-button: var(--gray-350);--border-color-popover: hsl(var(--gray-hsl) / .08);--border-color-dialog: hsl(var(--gray-hsl) / .08);--accent-color: var(--purple-600);--selection-color: hsl(var(--blue-hsl));--shadow-hsl: var(--gray-h) var(--gray-s) 20%;--lumo-contrast-5pct: var(--gray-100);--lumo-contrast-10pct: var(--gray-200);--lumo-contrast-60pct: var(--gray-400);--lumo-contrast-80pct: var(--gray-600);--lumo-contrast-90pct: var(--gray-800);--card-bg: rgba(255, 255, 255, .5);--card-hover-bg: rgba(255, 255, 255, .65);--card-open-bg: rgba(255, 255, 255, .8);--card-border: 1px solid rgba(0, 50, 100, .15);--card-open-shadow: 0px 1px 4px -1px rgba(28, 52, 84, .26);--card-section-border: var(--card-border);--card-field-bg: var(--lumo-contrast-5pct);--indicator-border: white}:host(.dark){color-scheme:dark;--surface-0: hsl(var(--gray-h) var(--gray-s) 10% / .85);--surface-1: hsl(var(--gray-h) var(--gray-s) 14% / .85);--surface-2: hsl(var(--gray-h) var(--gray-s) 18% / .85);--surface-background: linear-gradient( hsl(var(--gray-h) var(--gray-s) 8% / .65), hsl(var(--gray-h) var(--gray-s) 8% / .7) );--surface-glow: radial-gradient( circle at 30% 0%, hsl(var(--gray-h) calc(var(--gray-s) * 2) 90% / .12), transparent 50% );--surface: var(--surface-glow) no-repeat border-box, var(--surface-background) no-repeat padding-box, hsl(var(--gray-h) var(--gray-s) 20% / .4);--surface-border-glow: hsl(var(--gray-h) var(--gray-s) 20% / .4) radial-gradient(at 50% 50%, hsl(250 40% 80% / .4) 0, transparent 50%);--surface-border-color: hsl(var(--gray-h) var(--gray-s) 50% / .2);--surface-box-shadow-1: 0 0 0 .5px hsl(var(--purple-h) 40% 5% / .4), 0 6px 12px -1px hsl(var(--shadow-hsl) / .4);--surface-box-shadow-2: 0 0 0 .5px hsl(var(--purple-h) 40% 5% / .4), 0 24px 40px -4px hsl(var(--shadow-hsl) / .5);--color: var(--gray-650);--background-button: linear-gradient( hsl(var(--gray-h) calc(var(--gray-s) * 2) 80% / .1), hsl(var(--gray-h) calc(var(--gray-s) * 2) 80% / 0) );--background-button-active: hsl(var(--gray-h) var(--gray-s) 10% / .1);--border-color-popover: hsl(var(--gray-h) var(--gray-s) 90% / .1);--border-color-dialog: hsl(var(--gray-h) var(--gray-s) 90% / .1);--shadow-hsl: 0 0% 0%;--lumo-disabled-text-color: var(--lumo-contrast-60pct);--card-bg: rgba(255, 255, 255, .05);--card-hover-bg: rgba(255, 255, 255, .065);--card-open-bg: rgba(255, 255, 255, .1);--card-border: 1px solid rgba(255, 255, 255, .11);--card-open-shadow: 0px 1px 4px -1px rgba(0, 0, 0, .26);--card-section-border: var(--card-border);--card-field-bg: var(--lumo-contrast-10pct);--indicator-border: var(--lumo-base-color)}', yc = "button{align-items:center;-webkit-appearance:none;appearance:none;background:transparent;background-origin:border-box;border:1px solid transparent;border-radius:var(--radius-2);color:var(--body-text-color);display:inline-flex;flex-shrink:0;font:var(--font-button);height:var(--size-m);justify-content:center;outline-offset:calc(var(--focus-size) / -1);padding:0 var(--space-100)}button:focus{animation-delay:0s,.15s;animation-duration:.15s,.45s;animation-name:button-focus-in,button-focus-out;animation-timing-function:cubic-bezier(.2,0,0,1),cubic-bezier(.2,0,0,1);outline:var(--focus-size) solid var(--focus-color)}button.icon{padding:0;width:var(--size-m)}button.icon span{display:contents}button .prefix{align-items:center;display:flex;height:var(--size-m);justify-content:center;width:var(--size-m)}button:active:not([disabled]){background:var(--active-color)}button[disabled]{opacity:.5}button[hidden]{display:none}", wc = ":is(vaadin-context-menu-overlay,vaadin-select-overlay,vaadin-menu-bar-overlay){z-index:var(--z-index-popover)}:is(vaadin-context-menu-overlay,vaadin-select-overlay,vaadin-menu-bar-overlay):first-of-type{padding-top:0}:is(vaadin-context-menu-overlay,vaadin-menu-bar-overlay,vaadin-select-overlay,vaadin-combo-box-overlay,vaadin-tooltip-overlay)::part(overlay){background:var(--background-color);-webkit-backdrop-filter:var(--surface-backdrop-filter);backdrop-filter:var(--surface-backdrop-filter);border:1px solid var(--contrast-color-5);border-radius:var(--radius-1);box-shadow:var(--surface-box-shadow-1);margin-top:0}:is(vaadin-context-menu-overlay,vaadin-select-overlay,vaadin-menu-bar-overlay)::part(content){padding:var(--space-50)}:is(vaadin-context-menu-item,vaadin-menu-bar-item,vaadin-select-item,vaadin-combo-box-item,.custom-menu-item){align-items:center;border-radius:var(--radius-1);color:var(--body-text-color);cursor:default;display:flex;font:var(--font-xsmall);min-height:0;padding:calc((var(--size-m) - var(--line-height-1)) / 2) var(--space-100);--_lumo-item-selected-icon-display: none}:is(vaadin-context-menu-item,vaadin-menu-bar-item,vaadin-select-item,vaadin-combo-box-item,.custom-menu-item)[disabled],:is(vaadin-context-menu-item,vaadin-menu-bar-item,vaadin-select-item,vaadin-combo-box-item,.custom-menu-item)[disabled] .hint,:is(vaadin-context-menu-item,vaadin-menu-bar-item,vaadin-select-item,vaadin-combo-box-item,.custom-menu-item)[disabled] vaadin-icon{color:var(--lumo-disabled-text-color)}:is(vaadin-context-menu-item,vaadin-menu-bar-item)[expanded]{background:var(--gray-200)}:is(vaadin-context-menu-item,vaadin-menu-bar-item,vaadin-select-item,vaadin-combo-box-item,.custom-menu-item):not([disabled]):hover{background:var(--hover-color)}:is(vaadin-context-menu-item,vaadin-menu-bar-item,vaadin-select-item,vaadin-combo-box-item,.custom-menu-item)[focus-ring]{outline:2px solid var(--selection-color);outline-offset:-2px}:is(vaadin-context-menu-item,vaadin-menu-bar-item,vaadin-select-item,vaadin-combo-box-item,.custom-menu-item):is([aria-haspopup=true]):after{margin-inline-end:calc(var(--space-200) * -1);margin-right:unset}:is(vaadin-context-menu-item,vaadin-menu-bar-item,vaadin-select-item,vaadin-combo-box-item,.custom-menu-item).danger{color:var(--error-color);--color: currentColor}:is(vaadin-context-menu-item,vaadin-menu-bar-item,vaadin-select-item,vaadin-combo-box-item,.custom-menu-item)::part(content){display:flex;align-items:center;gap:var(--space-100)}:is(vaadin-context-menu-item,vaadin-menu-bar-item,vaadin-select-item,vaadin-combo-box-item,.custom-menu-item) vaadin-icon{width:1em;height:1em;padding:0;color:var(--color)}:is(vaadin-context-menu-overlay,vaadin-select-overlay,vaadin-menu-bar-overlay) hr{margin:var(--space-50)}:is(vaadin-context-menu-item,vaadin-select-item,vaadin-menu-bar-item,.custom-menu-item) .label{padding-inline-end:var(--space-300)}:is(vaadin-context-menu-item,vaadin-select-item,vaadin-menu-bar-item,.custom-menu-item) .hint{margin-inline-start:auto;color:var(--color)}:is(vaadin-context-menu-item,vaadin-menu-bar-item,vaadin-select-item,.custom-menu-item) kbd{align-items:center;display:inline-flex;border-radius:var(--radius-1);font:var(--font-xsmall);outline:1px solid var(--divider-color);outline-offset:-1px;padding:0 var(--space-50)}:is(copilot-activation-button-development-workflow),:is(copilot-activation-button-user-info){justify-content:space-between}:is(:is(copilot-activation-button-development-workflow),:is(copilot-activation-button-user-info)) div.warning{--small-text-color: var(--yellow-700)}:is(:is(copilot-activation-button-development-workflow),:is(copilot-activation-button-user-info)) div.error{--small-text-color: var(--red)}:is(:is(copilot-activation-button-development-workflow),:is(copilot-activation-button-user-info)) div.user{font:var(--font-medium);font-size:inherit}:is(:is(copilot-activation-button-development-workflow),:is(copilot-activation-button-user-info)) div.portrait{width:32px;height:32px;border-radius:50%;background-size:cover}:is(:is(copilot-activation-button-development-workflow),:is(copilot-activation-button-user-info)) div.icon{width:8px;height:8px;margin:0 .1em;background-color:var(--small-text-color)}:is(:is(copilot-activation-button-development-workflow),:is(copilot-activation-button-user-info)) div.icon.warning{border-radius:4px}:is(:is(copilot-activation-button-development-workflow),:is(copilot-activation-button-user-info)) div.status{font-size:var(--font-size-0);color:var(--small-text-color)}:is(copilot-alignment-overlay)::part(content){padding:0}:is(.padding-values-overlay){--lumo-base-color: var(--selection-color);--color-high-contrast: white}:is(.padding-values-overlay) vaadin-combo-box-item:hover{color:#272c35d9}", Ac = "code.codeblock{background:var(--contrast-color-5);border-radius:var(--radius-2);display:block;font-family:var(--monospace-font-family);font-size:var(--font-size-1);line-height:var(--line-height-1);overflow:hidden;padding:calc((var(--size-m) - var(--line-height-1)) / 2) var(--size-m) calc((var(--size-m) - var(--line-height-1)) / 2) var(--space-100);position:relative;text-overflow:ellipsis;white-space:pre;min-height:var(--line-height-1)}copilot-copy{position:absolute;right:0;top:0}", Ec = "vaadin-dialog-overlay::part(overlay){background:#fff}vaadin-dialog-overlay::part(content){background:var(--surface);font:var(--font-xsmall);padding:var(--space-300)}vaadin-dialog-overlay::part(header){background:var(--surface);font:var(--font-xsmall-semibold);border-bottom:1px solid var(--border-color);padding:var(--space-100) var(--space-150)}vaadin-dialog-overlay::part(footer){background:var(--surface);padding:var(--space-150)}vaadin-dialog-overlay::part(header-content){display:flex;line-height:normal;justify-content:space-between;width:100%;align-items:center}vaadin-dialog-overlay [slot=header-content] h2{margin:0;padding:0;font:var(--font-small-medium)}vaadin-dialog-overlay [slot=header-content] .close{line-height:0}vaadin-dialog-overlay{--vaadin-button-font-size: var(--font-size-1);--vaadin-button-height: var(--line-height-4)}vaadin-dialog-overlay vaadin-button[theme~=primary]{background-color:hsl(var(--blue-hsl))}vaadin-dialog-overlay a svg{height:12px;width:12px}.dialog-footer vaadin-button{--vaadin-button-primary-background: var(--button-background);--vaadin-button-border-radius: var(--radius-1);--vaadin-button-primary-text-color: var(--color-high-contrast);--vaadin-button-height: var(--line-height-5);font:var(--font-small-medium)}.dialog-footer vaadin-button span[slot=suffix]{display:flex}.dialog-footer vaadin-button span[slot=suffix] svg{height:14px;width:14px}", Oc = ":host{--vaadin-input-field-label-font-size: var(--font-size-1);--vaadin-select-label-font-size: var(--font-size-1);--vaadin-input-field-helper-font-size: var(--font-size-0);--vaadin-button-font-size: var(--font-size-2);--vaadin-checkbox-label-font-size: var(--font-size-1);--vaadin-input-field-value-font-size: var(--font-xsmall);--vaadin-input-field-background: transparent;--vaadin-input-field-border-color: var(--input-border-color);--vaadin-input-field-border-radius: var(--radius-1);--vaadin-input-field-border-width: 1px;--vaadin-input-field-height: var(--size-m)}";
var uu = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : typeof global < "u" ? global : typeof self < "u" ? self : {};
function Sc(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
function du(e) {
  if (e.__esModule) return e;
  var t = e.default;
  if (typeof t == "function") {
    var n = function r() {
      return this instanceof r ? Reflect.construct(t, arguments, this.constructor) : t.apply(this, arguments);
    };
    n.prototype = t.prototype;
  } else n = {};
  return Object.defineProperty(n, "__esModule", { value: !0 }), Object.keys(e).forEach(function(r) {
    var i = Object.getOwnPropertyDescriptor(e, r);
    Object.defineProperty(n, r, i.get ? i : {
      enumerable: !0,
      get: function() {
        return e[r];
      }
    });
  }), n;
}
var Rt = { exports: {} }, Kr;
function Nc() {
  if (Kr) return Rt.exports;
  Kr = 1;
  function e(t, n = 100, r = {}) {
    if (typeof t != "function")
      throw new TypeError(`Expected the first parameter to be a function, got \`${typeof t}\`.`);
    if (n < 0)
      throw new RangeError("`wait` must not be negative.");
    const { immediate: i } = typeof r == "boolean" ? { immediate: r } : r;
    let o, a, s, l, c;
    function u() {
      const g = o, m = a;
      return o = void 0, a = void 0, c = t.apply(g, m), c;
    }
    function d() {
      const g = Date.now() - l;
      g < n && g >= 0 ? s = setTimeout(d, n - g) : (s = void 0, i || (c = u()));
    }
    const v = function(...g) {
      if (o && this !== o && Object.getPrototypeOf(this) === Object.getPrototypeOf(o))
        throw new Error("Debounced method called with different contexts of the same prototype.");
      o = this, a = g, l = Date.now();
      const m = i && !s;
      return s || (s = setTimeout(d, n)), m && (c = u()), c;
    };
    return Object.defineProperty(v, "isPending", {
      get() {
        return s !== void 0;
      }
    }), v.clear = () => {
      s && (clearTimeout(s), s = void 0);
    }, v.flush = () => {
      s && v.trigger();
    }, v.trigger = () => {
      c = u(), v.clear();
    }, v;
  }
  return Rt.exports.debounce = e, Rt.exports = e, Rt.exports;
}
var xc = /* @__PURE__ */ Nc();
const _c = /* @__PURE__ */ Sc(xc);
class Pc {
  constructor() {
    this.documentActive = !0, this.addListeners = () => {
      window.addEventListener("pageshow", this.handleWindowVisibilityChange), window.addEventListener("pagehide", this.handleWindowVisibilityChange), window.addEventListener("focus", this.handleWindowFocusChange), window.addEventListener("blur", this.handleWindowFocusChange), document.addEventListener("visibilitychange", this.handleDocumentVisibilityChange);
    }, this.removeListeners = () => {
      window.removeEventListener("pageshow", this.handleWindowVisibilityChange), window.removeEventListener("pagehide", this.handleWindowVisibilityChange), window.removeEventListener("focus", this.handleWindowFocusChange), window.removeEventListener("blur", this.handleWindowFocusChange), document.removeEventListener("visibilitychange", this.handleDocumentVisibilityChange);
    }, this.handleWindowVisibilityChange = (t) => {
      t.type === "pageshow" ? this.dispatch(!0) : this.dispatch(!1);
    }, this.handleWindowFocusChange = (t) => {
      t.type === "focus" ? this.dispatch(!0) : this.dispatch(!1);
    }, this.handleDocumentVisibilityChange = () => {
      this.dispatch(!document.hidden);
    }, this.dispatch = (t) => {
      if (t !== this.documentActive) {
        const n = window.Vaadin.copilot.eventbus;
        this.documentActive = t, n.emit("document-activation-change", { active: this.documentActive });
      }
    };
  }
  copilotActivated() {
    this.addListeners();
  }
  copilotDeactivated() {
    this.removeListeners();
  }
}
const Hr = new Pc(), Cc = "copilot-development-setup-user-guide";
function fu() {
  dn("use-dev-workflow-guide"), se.updatePanel(Cc, { floating: !0 });
}
function Co() {
  const e = p.jdkInfo;
  return e ? e.jrebel ? "success" : e.hotswapAgentFound ? !e.hotswapVersionOk || !e.runningWithExtendClassDef || !e.runningWitHotswap || !e.runningInJavaDebugMode ? "error" : "success" : "warning" : null;
}
function hu() {
  const e = p.jdkInfo;
  return !e || Co() !== "success" ? "none" : e.jrebel ? "jrebel" : e.runningWitHotswap ? "hotswap" : "none";
}
function Dc() {
  return p.idePluginState?.ide === "eclipse" ? "unsupported" : p.idePluginState !== void 0 && !p.idePluginState.active ? "warning" : "success";
}
function vu() {
  if (!p.jdkInfo)
    return { status: "success" };
  const e = Co(), t = Dc();
  return e === "warning" ? t === "warning" ? { status: "warning", message: "IDE Plugin, Hotswap" } : { status: "warning", message: "Hotswap is not enabled" } : t === "warning" ? { status: "warning", message: "IDE Plugin is not active" } : e === "error" ? { status: "error", message: "Hotswap is partially enabled" } : { status: "success" };
}
function Tc() {
  fe(`${Ce}get-dev-setup-info`, {}), window.Vaadin.copilot.eventbus.on("copilot-get-dev-setup-info-response", (e) => {
    if (e.detail.content) {
      const t = JSON.parse(e.detail.content);
      p.setIdePluginState(t.ideInfo), p.setJdkInfo(t.jdkInfo);
    }
  });
}
const ot = /* @__PURE__ */ new WeakMap();
class Rc {
  constructor() {
    this.root = null, this.nodeUuidNodeMapFlat = /* @__PURE__ */ new Map(), this._hasFlowComponent = !1, this.flowNodesInSource = {};
  }
  async init() {
    const t = Fs();
    t && (await this.addToTree(t), await this.addOverlayContentToTreeIfExists("vaadin-popover-overlay"), await this.addOverlayContentToTreeIfExists("vaadin-dialog-overlay"));
  }
  getChildren(t) {
    return this.nodeUuidNodeMapFlat.get(t)?.children ?? [];
  }
  get allNodesFlat() {
    return Array.from(this.nodeUuidNodeMapFlat.values());
  }
  getNodeOfElement(t) {
    if (t)
      return this.allNodesFlat.find((n) => n.element === t);
  }
  async handleRouteContainers(t, n) {
    const r = Or(t);
    if (!r && Js(t)) {
      const i = Jt(t);
      if (i && i.nextElementSibling)
        return await this.addToTree(i.nextElementSibling, n), !0;
    }
    if (r && t.localName === "react-router-outlet") {
      for (const i of Array.from(t.children)) {
        const o = Ht(i);
        o && await this.addToTree(o, n);
      }
      return !0;
    }
    return !1;
  }
  includeReactNode(t) {
    return at(t) === "PreconfiguredAuthProvider" || at(t) === "RouterProvider" ? !1 : Ar(t) || qs(t);
  }
  async includeFlowNode(t) {
    return Xs(t) ? !1 : this.isInitializedInProjectSources(t);
  }
  async isInitializedInProjectSources(t) {
    const n = Er(t);
    if (!n)
      return !1;
    const { nodeId: r, uiId: i } = n;
    if (!this.flowNodesInSource[i]) {
      const o = await qn(
        "copilot-get-component-source-info",
        { uiId: i },
        (a) => a.data.nodeIdsInProject
      );
      this.flowNodesInSource[i] = new Set(o);
    }
    return this.flowNodesInSource[i].has(r);
  }
  async addToTree(t, n) {
    if (await this.handleRouteContainers(t, n))
      return;
    const r = Or(t);
    let i;
    if (!r)
      this.includeReactNode(t) && (i = this.generateNodeFromFiber(t, n));
    else if (await this.includeFlowNode(t)) {
      const s = this.generateNodeFromFlow(t, n);
      if (!s)
        return;
      this._hasFlowComponent = !0, i = s;
    }
    if (n)
      i && (i.parent = n, n.children || (n.children = []), n.children.push(i));
    else {
      if (!i) {
        if (!(t instanceof Element) && qi(t)) {
          er({
            type: Le.WARNING,
            message: "Copilot is partly usable",
            details: `${at(t)} should be a function component to make Copilot work properly`,
            dismissId: "react_route_component_is_class"
          });
          return;
        }
        Re("Tree root node is undefined");
        return;
      }
      this.root = i;
    }
    i && this.nodeUuidNodeMapFlat.set(i.uuid, i);
    const o = i ?? n, a = r ? Array.from(t.children) : Ws(t);
    for (const s of a)
      await this.addToTree(s, o);
  }
  generateNodeFromFiber(t, n) {
    const r = Ar(t) ? Jt(t) : void 0, i = n?.children.length ?? 0;
    return {
      node: t,
      parent: n,
      element: r,
      depth: n && n.depth + 1 || 0,
      children: [],
      siblingIndex: i,
      isFlowComponent: !1,
      isReactComponent: !0,
      get uuid() {
        if (ot.has(t))
          return ot.get(t);
        if (t.alternate && ot.has(t.alternate))
          return ot.get(t.alternate);
        const a = xo();
        return ot.set(t, a), a;
      },
      get name() {
        return Sr(at(t));
      },
      get identifier() {
        return Nr(r);
      },
      get nameAndIdentifier() {
        return Xr(this.name, this.identifier);
      },
      get previousSibling() {
        if (i !== 0)
          return n?.children[i - 1];
      },
      get nextSibling() {
        if (!(n === void 0 || i === n.children.length - 1))
          return n.children[i + 1];
      },
      get path() {
        return Jr(this);
      }
    };
  }
  generateNodeFromFlow(t, n) {
    const r = Er(t);
    if (!r)
      return;
    const i = n?.children.length ?? 0;
    return {
      node: r,
      parent: n,
      element: t,
      depth: n && n.depth + 1 || 0,
      children: [],
      siblingIndex: i,
      get uuid() {
        return `${r.uiId}#${r.nodeId}`;
      },
      isFlowComponent: !0,
      isReactComponent: !1,
      get name() {
        return Hs(r) ?? Sr(r.element.localName);
      },
      get identifier() {
        return Nr(t);
      },
      get nameAndIdentifier() {
        return Xr(this.name, this.identifier);
      },
      get previousSibling() {
        if (i !== 0)
          return n?.children[i - 1];
      },
      get nextSibling() {
        if (!(n === void 0 || i === n.children.length - 1))
          return n.children[i + 1];
      },
      get path() {
        return Jr(this);
      }
    };
  }
  async addOverlayContentToTreeIfExists(t) {
    const n = document.body.querySelector(t);
    if (!n)
      return;
    const r = n.owner;
    if (r) {
      if (!this.getNodeOfElement(r)) {
        const i = Pe(Ht(r));
        await this.addToTree(i ?? r, this.root);
      }
      for (const i of Array.from(n.children))
        await this.addToTree(i, this.getNodeOfElement(r));
    }
  }
  hasFlowComponents() {
    return this._hasFlowComponent;
  }
  findNodeByUuid(t) {
    if (t)
      return this.nodeUuidNodeMapFlat.get(t);
  }
  getElementByNodeUuid(t) {
    return this.findNodeByUuid(t)?.element;
  }
  findByTreePath(t) {
    if (t)
      return this.allNodesFlat.find((n) => n.path === t);
  }
}
function Jr(e) {
  if (!e.parent)
    return e.name;
  let t = 0;
  for (let n = 0; n < e.siblingIndex + 1; n++)
    e.parent.children[n].name === e.name && t++;
  return `${e.parent.path} > ${e.name}[${t}]`;
}
function Xr(e, t) {
  return t ? `${e} "${t}"` : e;
}
const Vc = async () => {
  const e = new Rc();
  await e.init(), window.Vaadin.copilot.tree.currentTree = e;
};
var Ic = Object.defineProperty, kc = Object.getOwnPropertyDescriptor, Lc = (e, t, n, r) => {
  for (var i = r > 1 ? void 0 : r ? kc(t, n) : t, o = e.length - 1, a; o >= 0; o--)
    (a = e[o]) && (i = (r ? a(t, n, i) : a(i)) || i);
  return r && i && Ic(t, n, i), i;
};
let Yr = class extends Pl {
  constructor() {
    super(...arguments), this.removers = [], this.initialized = !1, this.active = !1, this.toggleOperationInProgressAttr = () => {
      this.toggleAttribute("operation-in-progress", p.operationWaitsHmrUpdate !== void 0);
    }, this.operationInProgressCursorUpdateDebounceFunc = _c(this.toggleOperationInProgressAttr, 500), this.overlayOutsideClickListener = (e) => {
      qe(e.target?.owner) || (p.active || qe(e.detail.sourceEvent.target)) && e.preventDefault();
    };
  }
  static get styles() {
    return [
      te(gc),
      te(yc),
      te(Ac),
      te(bc),
      te(Oc),
      te(Ec),
      te(wc),
      te(mc),
      ul`
        :host {
          color: var(--body-text-color);
          contain: strict;
          cursor: var(--cursor, default);
          font: var(--font-xsmall);
          inset: 0;
          pointer-events: all;
          position: fixed;
          z-index: 9999;
        }

        :host([operation-in-progress]) {
          --cursor: wait;
          --lumo-clickable-cursor: wait;
        }

        :host(:not([active])) {
          visibility: hidden !important;
          pointer-events: none;
        }

        /* Hide floating panels when not active */

        :host(:not([active])) > copilot-section-panel-wrapper {
          display: none !important;
        }
        :host(:not([active])) > copilot-section-panel-wrapper[individual] {
          display: block !important;
          visibility: visible;
          pointer-events: all;
        }

        /* Keep activation button and menu visible */

        copilot-activation-button,
        .activation-button-menu {
          visibility: visible;
          display: flex !important;
        }

        copilot-activation-button {
          pointer-events: auto;
        }

        a {
          border-radius: var(--radius-2);
          color: var(--blue-color);
          outline-offset: calc(var(--focus-size) / -1);
        }

        a:focus {
          animation-delay: 0s, 0.15s;
          animation-duration: 0.15s, 0.45s;
          animation-name: link-focus-in, link-focus-out;
          animation-timing-function: cubic-bezier(0.2, 0, 0, 1), cubic-bezier(0.2, 0, 0, 1);
          outline: var(--focus-size) solid var(--blue-color);
        }

        :host([user-select-none]) {
          -webkit-touch-callout: none;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
        }

        /* Needed to prevent a JS error because of monkey patched '_attachOverlay'. It is some scope issue, */
        /* where 'this._placeholder.parentNode' is undefined - the scope if 'this' gets messed up at some point. */
        /* We also don't want animations on the overlays to make the feel faster, so this is fine. */

        :is(
            vaadin-context-menu-overlay,
            vaadin-menu-bar-overlay,
            vaadin-select-overlay,
            vaadin-combo-box-overlay,
            vaadin-tooltip-overlay
          ):is([opening], [closing]),
        :is(
            vaadin-context-menu-overlay,
            vaadin-menu-bar-overlay,
            vaadin-select-overlay,
            vaadin-combo-box-overlay,
            vaadin-tooltip-overlay
          )::part(overlay) {
          animation: none !important;
        }

        :host(:not([active])) copilot-drawer-panel::before {
          animation: none;
        }

        /* Workaround for https://github.com/vaadin/web-components/issues/5400 */

        :host([active]) .activation-button-menu .activate,
        :host(:not([active])) .activation-button-menu .deactivate,
        :host(:not([active])) .activation-button-menu .toggle-spotlight {
          display: none;
        }
      `
    ];
  }
  connectedCallback() {
    super.connectedCallback(), this.init().catch((e) => Re("Unable to initialize copilot", e));
  }
  async init() {
    if (this.initialized)
      return;
    await window.Vaadin.copilot._machineState.initializer.promise, document.body.style.setProperty("--dev-tools-button-display", "none"), await import("./copilot-global-vars-later-DEVveKrQ.js"), await import("./copilot-init-step2-BaRpmPgr.js"), Vl(), Cl(), this.tabIndex = 0, Tt.hostConnectedCallback(), window.addEventListener("keydown", Fr), A.onSend(this.handleSendEvent), this.removers.push(A.on("close-drawers", this.closeDrawers.bind(this))), this.removers.push(
      A.on("open-attention-required-drawer", this.openDrawerIfPanelRequiresAttention.bind(this))
    ), this.removers.push(
      A.on("set-pointer-events", (t) => {
        this.style.pointerEvents = t.detail.enable ? "" : "none";
      })
    ), this.addEventListener("mousemove", this.mouseMoveListener), this.addEventListener("dragover", this.mouseMoveListener), nt.addOverlayOutsideClickEvent();
    const e = window.matchMedia("(prefers-color-scheme: dark)");
    this.classList.toggle("dark", e.matches), e.addEventListener("change", (t) => {
      this.classList.toggle("dark", e.matches);
    }), this.reaction(
      () => p.spotlightActive,
      () => {
        ue.saveSpotlightActivation(p.spotlightActive), Array.from(this.shadowRoot.querySelectorAll("copilot-section-panel-wrapper")).filter((t) => t.panelInfo?.floating === !0).forEach((t) => {
          p.spotlightActive ? t.style.setProperty("display", "none") : t.style.removeProperty("display");
        });
      }
    ), this.reaction(
      () => p.active,
      () => {
        this.toggleAttribute("active", p.active), p.active ? this.activate() : this.deactivate(), ue.saveCopilotActivation(p.active);
      }
    ), this.reaction(
      () => p.activatedAtLeastOnce,
      () => {
        Eo(), Dl();
      }
    ), this.reaction(
      () => p.sectionPanelDragging,
      () => {
        p.sectionPanelDragging && Array.from(this.shadowRoot.children).filter((n) => n.localName.endsWith("-overlay")).forEach((n) => {
          n.close && n.close();
        });
      }
    ), this.reaction(
      () => p.operationWaitsHmrUpdate,
      () => {
        p.operationWaitsHmrUpdate ? this.operationInProgressCursorUpdateDebounceFunc() : (this.operationInProgressCursorUpdateDebounceFunc.clear(), this.toggleOperationInProgressAttr());
      }
    ), this.reaction(
      () => se.panels,
      () => {
        se.panels.find((t) => t.individual) && this.requestUpdate();
      }
    ), ue.getCopilotActivation() && $i().then(() => {
      p.setActive(!0, "restore");
    }), this.removers.push(
      A.on("user-select", (t) => {
        const { allowSelection: n } = t.detail;
        this.toggleAttribute("user-select-none", !n);
      })
    ), this.removers.push(
      A.on("featureFlags", (t) => {
        const n = t.detail.features;
        p.setFeatureFlags(n);
      })
    ), yo(), this.initialized = !0, Tc();
  }
  /**
   * Called when Copilot is activated. Good place to start attach listeners etc.
   */
  async activate() {
    dn("activate"), Tt.activate(), Hr.copilotActivated(), Tl(), this.openDrawerIfPanelRequiresAttention(), document.documentElement.addEventListener("mouseleave", this.mouseLeaveListener), nt.onCopilotActivation(), await Vc(), Ao.loadPreviewConfiguration(), this.active = !0;
  }
  /**
   * Called when Copilot is deactivated. Good place to remove listeners etc.
   */
  deactivate() {
    this.closeDrawers(), Tt.deactivate(), Hr.copilotDeactivated(), document.documentElement.removeEventListener("mouseleave", this.mouseLeaveListener), nt.onCopilotDeactivation(), this.active = !1;
  }
  disconnectedCallback() {
    super.disconnectedCallback(), Tt.hostDisconnectedCallback(), window.removeEventListener("keydown", Fr), A.offSend(this.handleSendEvent), this.removers.forEach((e) => e()), this.removeEventListener("mousemove", this.mouseMoveListener), this.removeEventListener("dragover", this.mouseMoveListener), nt.removeOverlayOutsideClickEvent(), document.documentElement.removeEventListener("vaadin-overlay-outside-click", this.overlayOutsideClickListener);
  }
  handleSendEvent(e) {
    const t = e.detail.command, n = e.detail.data;
    fe(t, n);
  }
  /**
   * Opens the attention required drawer if there is any.
   */
  openDrawerIfPanelRequiresAttention() {
    const e = se.getAttentionRequiredPanelConfiguration();
    if (!e)
      return;
    const t = e.panel;
    if (!t || e.floating)
      return;
    const n = this.shadowRoot.querySelector(`copilot-drawer-panel[position="${t}"]`);
    n.opened = !0;
  }
  render() {
    return ut`
      <copilot-activation-button
        @activation-btn-clicked="${() => {
      p.toggleActive("button"), p.setLoginCheckActive(!1);
    }}"
        @spotlight-activation-changed="${(e) => {
      p.setSpotlightActive(e.detail);
    }}"
        .spotlightOn="${p.spotlightActive}">
      </copilot-activation-button>
      <copilot-component-selector></copilot-component-selector>
      <copilot-label-editor-container></copilot-label-editor-container>
      <copilot-info-tooltip></copilot-info-tooltip>
      ${this.renderDrawer("left")} ${this.renderDrawer("right")} ${this.renderDrawer("bottom")} ${cc()}
      ${this.renderSpotlight()}
      <copilot-login-check ?active=${p.loginCheckActive && p.active}></copilot-login-check>
      <copilot-notifications-container></copilot-notifications-container>
    `;
  }
  renderSpotlight() {
    return p.userInfo === void 0 || p.userInfo.copilotProjectCannotLeaveLocalhost ? O : ut`
      <copilot-spotlight ?active=${p.spotlightActive && p.active}></copilot-spotlight>
    `;
  }
  renderDrawer(e) {
    return ut` <copilot-drawer-panel no-transition position=${e}>
      ${lc(e)}
    </copilot-drawer-panel>`;
  }
  /**
   * Closes the open drawers if any opened unless an overlay is opened from drawer.
   */
  closeDrawers() {
    const e = this.shadowRoot.querySelectorAll(`${Ce}drawer-panel`);
    if (!Array.from(e).some((o) => o.opened))
      return;
    const n = Array.from(this.shadowRoot.children).find(
      (o) => o.localName.endsWith("overlay")
    ), r = n && nt.getOwner(n);
    if (!r) {
      e.forEach((o) => {
        o.opened = !1;
      });
      return;
    }
    const i = nl(r, "copilot-drawer-panel");
    if (!i) {
      e.forEach((o) => {
        o.opened = !1;
      });
      return;
    }
    Array.from(e).filter((o) => o.position !== i.position).forEach((o) => {
      o.opened = !1;
    });
  }
  updated(e) {
    super.updated(e), this.attachActivationButtonToBody(), pc();
  }
  attachActivationButtonToBody() {
    const e = document.body.querySelectorAll("copilot-activation-button");
    e.length > 1 && e[0].remove();
  }
  mouseMoveListener(e) {
    e.composedPath().find((t) => t.localName === `${Ce}drawer-panel`) || this.closeDrawers();
  }
  mouseLeaveListener() {
    A.emit("close-drawers", {});
  }
};
Yr = Lc([
  cl("copilot-main")
], Yr);
const Mc = window.Vaadin, jc = {
  init(e) {
    Ki(
      () => window.Vaadin.devTools,
      (t) => {
        const n = t.handleFrontendMessage;
        t.handleFrontendMessage = (r) => {
          vc(r) || n.call(t, r);
        };
      }
    );
  }
};
Mc.devToolsPlugins.push(jc);
export {
  er as $,
  Bc as A,
  Co as B,
  Rc as C,
  Uc as D,
  O as E,
  hu as F,
  Cc as G,
  fu as H,
  Fc as I,
  vu as J,
  Ao as K,
  au as L,
  Pl as M,
  _c as N,
  nu as O,
  Ce as P,
  su as Q,
  yc as R,
  lu as S,
  Il as T,
  zc as U,
  Wc as V,
  Gc as W,
  dn as X,
  Ac as Y,
  Kc as Z,
  go as _,
  Sc as a,
  Le as a0,
  Vc as a1,
  wo as a2,
  In as a3,
  Qs as a4,
  ln as a5,
  ou as a6,
  Dc as a7,
  Rn as a8,
  to as a9,
  Qc as aa,
  A as b,
  uu as c,
  Kt as d,
  js as e,
  qc as f,
  du as g,
  ru as h,
  Zc as i,
  p as j,
  qn as k,
  Re as l,
  cu as m,
  cl as n,
  ue as o,
  se as p,
  Hc as q,
  te as r,
  fe as s,
  iu as t,
  gc as u,
  ul as v,
  fn as w,
  ut as x,
  dt as y,
  tu as z
};
