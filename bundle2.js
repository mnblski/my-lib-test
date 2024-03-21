/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
let Zt = class extends Event {
  constructor(t, e, i) {
    super("context-request", { bubbles: !0, composed: !0 }), this.context = t, this.callback = e, this.subscribe = i ?? !1;
  }
};
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
let Ht = class {
  constructor(t, e, i, o) {
    if (this.subscribe = !1, this.provided = !1, this.value = void 0, this.t = (n, r) => {
      this.unsubscribe && (this.unsubscribe !== r && (this.provided = !1, this.unsubscribe()), this.subscribe || this.unsubscribe()), this.value = n, this.host.requestUpdate(), this.provided && !this.subscribe || (this.provided = !0, this.callback && this.callback(n, r)), this.unsubscribe = r;
    }, this.host = t, e.context !== void 0) {
      const n = e;
      this.context = n.context, this.callback = n.callback, this.subscribe = n.subscribe ?? !1;
    } else
      this.context = e, this.callback = i, this.subscribe = o ?? !1;
    this.host.addController(this);
  }
  hostConnected() {
    this.dispatchRequest();
  }
  hostDisconnected() {
    this.unsubscribe && (this.unsubscribe(), this.unsubscribe = void 0);
  }
  dispatchRequest() {
    this.host.dispatchEvent(new Zt(this.context, this.t, this.subscribe));
  }
};
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
let le = class {
  get value() {
    return this.o;
  }
  set value(t) {
    this.setValue(t);
  }
  setValue(t, e = !1) {
    const i = e || !Object.is(t, this.o);
    this.o = t, i && this.updateObservers();
  }
  constructor(t) {
    this.subscriptions = /* @__PURE__ */ new Map(), this.updateObservers = () => {
      for (const [e, { disposer: i }] of this.subscriptions)
        e(this.o, i);
    }, t !== void 0 && (this.value = t);
  }
  addCallback(t, e, i) {
    if (!i)
      return void t(this.value);
    this.subscriptions.has(t) || this.subscriptions.set(t, { disposer: () => {
      this.subscriptions.delete(t);
    }, consumerHost: e });
    const { disposer: o } = this.subscriptions.get(t);
    t(this.value, o);
  }
  clearCallbacks() {
    this.subscriptions.clear();
  }
};
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
let ce = class extends Event {
  constructor(t) {
    super("context-provider", { bubbles: !0, composed: !0 }), this.context = t;
  }
}, Mt = class extends le {
  constructor(t, e, i) {
    var o, n;
    super(e.context !== void 0 ? e.initialValue : i), this.onContextRequest = (r) => {
      const g = r.composedPath()[0];
      r.context === this.context && g !== this.host && (r.stopPropagation(), this.addCallback(r.callback, g, r.subscribe));
    }, this.onProviderRequest = (r) => {
      const g = r.composedPath()[0];
      if (r.context !== this.context || g === this.host)
        return;
      const u = /* @__PURE__ */ new Set();
      for (const [v, { consumerHost: m }] of this.subscriptions)
        u.has(v) || (u.add(v), m.dispatchEvent(new Zt(this.context, v, !0)));
      r.stopPropagation();
    }, this.host = t, e.context !== void 0 ? this.context = e.context : this.context = e, this.attachListeners(), (n = (o = this.host).addController) == null || n.call(o, this);
  }
  attachListeners() {
    this.host.addEventListener("context-request", this.onContextRequest), this.host.addEventListener("context-provider", this.onProviderRequest);
  }
  hostConnected() {
    this.host.dispatchEvent(new ce(this.context));
  }
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function he({ context: s }) {
  return (t, e) => {
    const i = /* @__PURE__ */ new WeakMap();
    if (typeof e == "object")
      return e.addInitializer(function() {
        i.set(this, new Mt(this, { context: s }));
      }), { get() {
        return t.get.call(this);
      }, set(o) {
        var n;
        return (n = i.get(this)) == null || n.setValue(o), t.set.call(this, o);
      }, init(o) {
        var n;
        return (n = i.get(this)) == null || n.setValue(o), o;
      } };
    {
      t.constructor.addInitializer((r) => {
        i.set(r, new Mt(r, { context: s }));
      });
      const o = Object.getOwnPropertyDescriptor(t, e);
      let n;
      if (o === void 0) {
        const r = /* @__PURE__ */ new WeakMap();
        n = { get: function() {
          return r.get(this);
        }, set: function(g) {
          i.get(this).setValue(g), r.set(this, g);
        }, configurable: !0, enumerable: !0 };
      } else {
        const r = o.set;
        n = { ...o, set: function(g) {
          i.get(this).setValue(g), r == null || r.call(this, g);
        } };
      }
      return void Object.defineProperty(t, e, n);
    }
  };
}
/**
 * @license
 * Copyright 2022 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function yt({ context: s, subscribe: t }) {
  return (e, i) => {
    typeof i == "object" ? i.addInitializer(function() {
      new Ht(this, { context: s, callback: (o) => {
        this[i.name] = o;
      }, subscribe: t });
    }) : e.constructor.addInitializer((o) => {
      new Ht(o, { context: s, callback: (n) => {
        o[i] = n;
      }, subscribe: t });
    });
  };
}
/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const it = globalThis, _t = it.ShadowRoot && (it.ShadyCSS === void 0 || it.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, $t = Symbol(), kt = /* @__PURE__ */ new WeakMap();
let Ft = class {
  constructor(t, e, i) {
    if (this._$cssResult$ = !0, i !== $t)
      throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
    this.cssText = t, this.t = e;
  }
  get styleSheet() {
    let t = this.o;
    const e = this.t;
    if (_t && t === void 0) {
      const i = e !== void 0 && e.length === 1;
      i && (t = kt.get(e)), t === void 0 && ((this.o = t = new CSSStyleSheet()).replaceSync(this.cssText), i && kt.set(e, t));
    }
    return t;
  }
  toString() {
    return this.cssText;
  }
};
const de = (s) => new Ft(typeof s == "string" ? s : s + "", void 0, $t), D = (s, ...t) => {
  const e = s.length === 1 ? s[0] : t.reduce((i, o, n) => i + ((r) => {
    if (r._$cssResult$ === !0)
      return r.cssText;
    if (typeof r == "number")
      return r;
    throw Error("Value passed to 'css' function must be a 'css' function result: " + r + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
  })(o) + s[n + 1], s[0]);
  return new Ft(e, s, $t);
}, pe = (s, t) => {
  if (_t)
    s.adoptedStyleSheets = t.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
  else
    for (const e of t) {
      const i = document.createElement("style"), o = it.litNonce;
      o !== void 0 && i.setAttribute("nonce", o), i.textContent = e.cssText, s.appendChild(i);
    }
}, Ut = _t ? (s) => s : (s) => s instanceof CSSStyleSheet ? ((t) => {
  let e = "";
  for (const i of t.cssRules)
    e += i.cssText;
  return de(e);
})(s) : s;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const { is: ue, defineProperty: ge, getOwnPropertyDescriptor: ve, getOwnPropertyNames: fe, getOwnPropertySymbols: me, getPrototypeOf: be } = Object, T = globalThis, zt = T.trustedTypes, ye = zt ? zt.emptyScript : "", ut = T.reactiveElementPolyfillSupport, Z = (s, t) => s, ot = { toAttribute(s, t) {
  switch (t) {
    case Boolean:
      s = s ? ye : null;
      break;
    case Object:
    case Array:
      s = s == null ? s : JSON.stringify(s);
  }
  return s;
}, fromAttribute(s, t) {
  let e = s;
  switch (t) {
    case Boolean:
      e = s !== null;
      break;
    case Number:
      e = s === null ? null : Number(s);
      break;
    case Object:
    case Array:
      try {
        e = JSON.parse(s);
      } catch {
        e = null;
      }
  }
  return e;
} }, wt = (s, t) => !ue(s, t), Dt = { attribute: !0, type: String, converter: ot, reflect: !1, hasChanged: wt };
Symbol.metadata ?? (Symbol.metadata = Symbol("metadata")), T.litPropertyMetadata ?? (T.litPropertyMetadata = /* @__PURE__ */ new WeakMap());
class j extends HTMLElement {
  static addInitializer(t) {
    this._$Ei(), (this.l ?? (this.l = [])).push(t);
  }
  static get observedAttributes() {
    return this.finalize(), this._$Eh && [...this._$Eh.keys()];
  }
  static createProperty(t, e = Dt) {
    if (e.state && (e.attribute = !1), this._$Ei(), this.elementProperties.set(t, e), !e.noAccessor) {
      const i = Symbol(), o = this.getPropertyDescriptor(t, i, e);
      o !== void 0 && ge(this.prototype, t, o);
    }
  }
  static getPropertyDescriptor(t, e, i) {
    const { get: o, set: n } = ve(this.prototype, t) ?? { get() {
      return this[e];
    }, set(r) {
      this[e] = r;
    } };
    return { get() {
      return o == null ? void 0 : o.call(this);
    }, set(r) {
      const g = o == null ? void 0 : o.call(this);
      n.call(this, r), this.requestUpdate(t, g, i);
    }, configurable: !0, enumerable: !0 };
  }
  static getPropertyOptions(t) {
    return this.elementProperties.get(t) ?? Dt;
  }
  static _$Ei() {
    if (this.hasOwnProperty(Z("elementProperties")))
      return;
    const t = be(this);
    t.finalize(), t.l !== void 0 && (this.l = [...t.l]), this.elementProperties = new Map(t.elementProperties);
  }
  static finalize() {
    if (this.hasOwnProperty(Z("finalized")))
      return;
    if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(Z("properties"))) {
      const e = this.properties, i = [...fe(e), ...me(e)];
      for (const o of i)
        this.createProperty(o, e[o]);
    }
    const t = this[Symbol.metadata];
    if (t !== null) {
      const e = litPropertyMetadata.get(t);
      if (e !== void 0)
        for (const [i, o] of e)
          this.elementProperties.set(i, o);
    }
    this._$Eh = /* @__PURE__ */ new Map();
    for (const [e, i] of this.elementProperties) {
      const o = this._$Eu(e, i);
      o !== void 0 && this._$Eh.set(o, e);
    }
    this.elementStyles = this.finalizeStyles(this.styles);
  }
  static finalizeStyles(t) {
    const e = [];
    if (Array.isArray(t)) {
      const i = new Set(t.flat(1 / 0).reverse());
      for (const o of i)
        e.unshift(Ut(o));
    } else
      t !== void 0 && e.push(Ut(t));
    return e;
  }
  static _$Eu(t, e) {
    const i = e.attribute;
    return i === !1 ? void 0 : typeof i == "string" ? i : typeof t == "string" ? t.toLowerCase() : void 0;
  }
  constructor() {
    super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
  }
  _$Ev() {
    var t;
    this._$ES = new Promise((e) => this.enableUpdating = e), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), (t = this.constructor.l) == null || t.forEach((e) => e(this));
  }
  addController(t) {
    var e;
    (this._$EO ?? (this._$EO = /* @__PURE__ */ new Set())).add(t), this.renderRoot !== void 0 && this.isConnected && ((e = t.hostConnected) == null || e.call(t));
  }
  removeController(t) {
    var e;
    (e = this._$EO) == null || e.delete(t);
  }
  _$E_() {
    const t = /* @__PURE__ */ new Map(), e = this.constructor.elementProperties;
    for (const i of e.keys())
      this.hasOwnProperty(i) && (t.set(i, this[i]), delete this[i]);
    t.size > 0 && (this._$Ep = t);
  }
  createRenderRoot() {
    const t = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
    return pe(t, this.constructor.elementStyles), t;
  }
  connectedCallback() {
    var t;
    this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this.enableUpdating(!0), (t = this._$EO) == null || t.forEach((e) => {
      var i;
      return (i = e.hostConnected) == null ? void 0 : i.call(e);
    });
  }
  enableUpdating(t) {
  }
  disconnectedCallback() {
    var t;
    (t = this._$EO) == null || t.forEach((e) => {
      var i;
      return (i = e.hostDisconnected) == null ? void 0 : i.call(e);
    });
  }
  attributeChangedCallback(t, e, i) {
    this._$AK(t, i);
  }
  _$EC(t, e) {
    var n;
    const i = this.constructor.elementProperties.get(t), o = this.constructor._$Eu(t, i);
    if (o !== void 0 && i.reflect === !0) {
      const r = (((n = i.converter) == null ? void 0 : n.toAttribute) !== void 0 ? i.converter : ot).toAttribute(e, i.type);
      this._$Em = t, r == null ? this.removeAttribute(o) : this.setAttribute(o, r), this._$Em = null;
    }
  }
  _$AK(t, e) {
    var n;
    const i = this.constructor, o = i._$Eh.get(t);
    if (o !== void 0 && this._$Em !== o) {
      const r = i.getPropertyOptions(o), g = typeof r.converter == "function" ? { fromAttribute: r.converter } : ((n = r.converter) == null ? void 0 : n.fromAttribute) !== void 0 ? r.converter : ot;
      this._$Em = o, this[o] = g.fromAttribute(e, r.type), this._$Em = null;
    }
  }
  requestUpdate(t, e, i) {
    if (t !== void 0) {
      if (i ?? (i = this.constructor.getPropertyOptions(t)), !(i.hasChanged ?? wt)(this[t], e))
        return;
      this.P(t, e, i);
    }
    this.isUpdatePending === !1 && (this._$ES = this._$ET());
  }
  P(t, e, i) {
    this._$AL.has(t) || this._$AL.set(t, e), i.reflect === !0 && this._$Em !== t && (this._$Ej ?? (this._$Ej = /* @__PURE__ */ new Set())).add(t);
  }
  async _$ET() {
    this.isUpdatePending = !0;
    try {
      await this._$ES;
    } catch (e) {
      Promise.reject(e);
    }
    const t = this.scheduleUpdate();
    return t != null && await t, !this.isUpdatePending;
  }
  scheduleUpdate() {
    return this.performUpdate();
  }
  performUpdate() {
    var i;
    if (!this.isUpdatePending)
      return;
    if (!this.hasUpdated) {
      if (this.renderRoot ?? (this.renderRoot = this.createRenderRoot()), this._$Ep) {
        for (const [n, r] of this._$Ep)
          this[n] = r;
        this._$Ep = void 0;
      }
      const o = this.constructor.elementProperties;
      if (o.size > 0)
        for (const [n, r] of o)
          r.wrapped !== !0 || this._$AL.has(n) || this[n] === void 0 || this.P(n, this[n], r);
    }
    let t = !1;
    const e = this._$AL;
    try {
      t = this.shouldUpdate(e), t ? (this.willUpdate(e), (i = this._$EO) == null || i.forEach((o) => {
        var n;
        return (n = o.hostUpdate) == null ? void 0 : n.call(o);
      }), this.update(e)) : this._$EU();
    } catch (o) {
      throw t = !1, this._$EU(), o;
    }
    t && this._$AE(e);
  }
  willUpdate(t) {
  }
  _$AE(t) {
    var e;
    (e = this._$EO) == null || e.forEach((i) => {
      var o;
      return (o = i.hostUpdated) == null ? void 0 : o.call(i);
    }), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(t)), this.updated(t);
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
    this._$Ej && (this._$Ej = this._$Ej.forEach((e) => this._$EC(e, this[e]))), this._$EU();
  }
  updated(t) {
  }
  firstUpdated(t) {
  }
}
j.elementStyles = [], j.shadowRootOptions = { mode: "open" }, j[Z("elementProperties")] = /* @__PURE__ */ new Map(), j[Z("finalized")] = /* @__PURE__ */ new Map(), ut == null || ut({ ReactiveElement: j }), (T.reactiveElementVersions ?? (T.reactiveElementVersions = [])).push("2.0.4");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const F = globalThis, nt = F.trustedTypes, Nt = nt ? nt.createPolicy("lit-html", { createHTML: (s) => s }) : void 0, Xt = "$lit$", R = `lit$${(Math.random() + "").slice(9)}$`, Kt = "?" + R, _e = `<${Kt}>`, k = document, K = () => k.createComment(""), J = (s) => s === null || typeof s != "object" && typeof s != "function", Jt = Array.isArray, $e = (s) => Jt(s) || typeof (s == null ? void 0 : s[Symbol.iterator]) == "function", gt = `[ 	
\f\r]`, q = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, jt = /-->/g, Vt = />/g, L = RegExp(`>|${gt}(?:([^\\s"'>=/]+)(${gt}*=${gt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`, "g"), It = /'/g, Bt = /"/g, Gt = /^(?:script|style|textarea|title)$/i, we = (s) => (t, ...e) => ({ _$litType$: s, strings: t, values: e }), A = we(1), U = Symbol.for("lit-noChange"), _ = Symbol.for("lit-nothing"), Wt = /* @__PURE__ */ new WeakMap(), H = k.createTreeWalker(k, 129);
function Qt(s, t) {
  if (!Array.isArray(s) || !s.hasOwnProperty("raw"))
    throw Error("invalid template strings array");
  return Nt !== void 0 ? Nt.createHTML(t) : t;
}
const xe = (s, t) => {
  const e = s.length - 1, i = [];
  let o, n = t === 2 ? "<svg>" : "", r = q;
  for (let g = 0; g < e; g++) {
    const u = s[g];
    let v, m, f = -1, x = 0;
    for (; x < u.length && (r.lastIndex = x, m = r.exec(u), m !== null); )
      x = r.lastIndex, r === q ? m[1] === "!--" ? r = jt : m[1] !== void 0 ? r = Vt : m[2] !== void 0 ? (Gt.test(m[2]) && (o = RegExp("</" + m[2], "g")), r = L) : m[3] !== void 0 && (r = L) : r === L ? m[0] === ">" ? (r = o ?? q, f = -1) : m[1] === void 0 ? f = -2 : (f = r.lastIndex - m[2].length, v = m[1], r = m[3] === void 0 ? L : m[3] === '"' ? Bt : It) : r === Bt || r === It ? r = L : r === jt || r === Vt ? r = q : (r = L, o = void 0);
    const d = r === L && s[g + 1].startsWith("/>") ? " " : "";
    n += r === q ? u + _e : f >= 0 ? (i.push(v), u.slice(0, f) + Xt + u.slice(f) + R + d) : u + R + (f === -2 ? g : d);
  }
  return [Qt(s, n + (s[e] || "<?>") + (t === 2 ? "</svg>" : "")), i];
};
class G {
  constructor({ strings: t, _$litType$: e }, i) {
    let o;
    this.parts = [];
    let n = 0, r = 0;
    const g = t.length - 1, u = this.parts, [v, m] = xe(t, e);
    if (this.el = G.createElement(v, i), H.currentNode = this.el.content, e === 2) {
      const f = this.el.content.firstChild;
      f.replaceWith(...f.childNodes);
    }
    for (; (o = H.nextNode()) !== null && u.length < g; ) {
      if (o.nodeType === 1) {
        if (o.hasAttributes())
          for (const f of o.getAttributeNames())
            if (f.endsWith(Xt)) {
              const x = m[r++], d = o.getAttribute(f).split(R), p = /([.?@])?(.*)/.exec(x);
              u.push({ type: 1, index: n, name: p[2], strings: d, ctor: p[1] === "." ? Ee : p[1] === "?" ? Ce : p[1] === "@" ? Pe : at }), o.removeAttribute(f);
            } else
              f.startsWith(R) && (u.push({ type: 6, index: n }), o.removeAttribute(f));
        if (Gt.test(o.tagName)) {
          const f = o.textContent.split(R), x = f.length - 1;
          if (x > 0) {
            o.textContent = nt ? nt.emptyScript : "";
            for (let d = 0; d < x; d++)
              o.append(f[d], K()), H.nextNode(), u.push({ type: 2, index: ++n });
            o.append(f[x], K());
          }
        }
      } else if (o.nodeType === 8)
        if (o.data === Kt)
          u.push({ type: 2, index: n });
        else {
          let f = -1;
          for (; (f = o.data.indexOf(R, f + 1)) !== -1; )
            u.push({ type: 7, index: n }), f += R.length - 1;
        }
      n++;
    }
  }
  static createElement(t, e) {
    const i = k.createElement("template");
    return i.innerHTML = t, i;
  }
}
function B(s, t, e = s, i) {
  var r, g;
  if (t === U)
    return t;
  let o = i !== void 0 ? (r = e._$Co) == null ? void 0 : r[i] : e._$Cl;
  const n = J(t) ? void 0 : t._$litDirective$;
  return (o == null ? void 0 : o.constructor) !== n && ((g = o == null ? void 0 : o._$AO) == null || g.call(o, !1), n === void 0 ? o = void 0 : (o = new n(s), o._$AT(s, e, i)), i !== void 0 ? (e._$Co ?? (e._$Co = []))[i] = o : e._$Cl = o), o !== void 0 && (t = B(s, o._$AS(s, t.values), o, i)), t;
}
class Ae {
  constructor(t, e) {
    this._$AV = [], this._$AN = void 0, this._$AD = t, this._$AM = e;
  }
  get parentNode() {
    return this._$AM.parentNode;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  u(t) {
    const { el: { content: e }, parts: i } = this._$AD, o = ((t == null ? void 0 : t.creationScope) ?? k).importNode(e, !0);
    H.currentNode = o;
    let n = H.nextNode(), r = 0, g = 0, u = i[0];
    for (; u !== void 0; ) {
      if (r === u.index) {
        let v;
        u.type === 2 ? v = new st(n, n.nextSibling, this, t) : u.type === 1 ? v = new u.ctor(n, u.name, u.strings, this, t) : u.type === 6 && (v = new Se(n, this, t)), this._$AV.push(v), u = i[++g];
      }
      r !== (u == null ? void 0 : u.index) && (n = H.nextNode(), r++);
    }
    return H.currentNode = k, o;
  }
  p(t) {
    let e = 0;
    for (const i of this._$AV)
      i !== void 0 && (i.strings !== void 0 ? (i._$AI(t, i, e), e += i.strings.length - 2) : i._$AI(t[e])), e++;
  }
}
class st {
  get _$AU() {
    var t;
    return ((t = this._$AM) == null ? void 0 : t._$AU) ?? this._$Cv;
  }
  constructor(t, e, i, o) {
    this.type = 2, this._$AH = _, this._$AN = void 0, this._$AA = t, this._$AB = e, this._$AM = i, this.options = o, this._$Cv = (o == null ? void 0 : o.isConnected) ?? !0;
  }
  get parentNode() {
    let t = this._$AA.parentNode;
    const e = this._$AM;
    return e !== void 0 && (t == null ? void 0 : t.nodeType) === 11 && (t = e.parentNode), t;
  }
  get startNode() {
    return this._$AA;
  }
  get endNode() {
    return this._$AB;
  }
  _$AI(t, e = this) {
    t = B(this, t, e), J(t) ? t === _ || t == null || t === "" ? (this._$AH !== _ && this._$AR(), this._$AH = _) : t !== this._$AH && t !== U && this._(t) : t._$litType$ !== void 0 ? this.$(t) : t.nodeType !== void 0 ? this.T(t) : $e(t) ? this.k(t) : this._(t);
  }
  S(t) {
    return this._$AA.parentNode.insertBefore(t, this._$AB);
  }
  T(t) {
    this._$AH !== t && (this._$AR(), this._$AH = this.S(t));
  }
  _(t) {
    this._$AH !== _ && J(this._$AH) ? this._$AA.nextSibling.data = t : this.T(k.createTextNode(t)), this._$AH = t;
  }
  $(t) {
    var n;
    const { values: e, _$litType$: i } = t, o = typeof i == "number" ? this._$AC(t) : (i.el === void 0 && (i.el = G.createElement(Qt(i.h, i.h[0]), this.options)), i);
    if (((n = this._$AH) == null ? void 0 : n._$AD) === o)
      this._$AH.p(e);
    else {
      const r = new Ae(o, this), g = r.u(this.options);
      r.p(e), this.T(g), this._$AH = r;
    }
  }
  _$AC(t) {
    let e = Wt.get(t.strings);
    return e === void 0 && Wt.set(t.strings, e = new G(t)), e;
  }
  k(t) {
    Jt(this._$AH) || (this._$AH = [], this._$AR());
    const e = this._$AH;
    let i, o = 0;
    for (const n of t)
      o === e.length ? e.push(i = new st(this.S(K()), this.S(K()), this, this.options)) : i = e[o], i._$AI(n), o++;
    o < e.length && (this._$AR(i && i._$AB.nextSibling, o), e.length = o);
  }
  _$AR(t = this._$AA.nextSibling, e) {
    var i;
    for ((i = this._$AP) == null ? void 0 : i.call(this, !1, !0, e); t && t !== this._$AB; ) {
      const o = t.nextSibling;
      t.remove(), t = o;
    }
  }
  setConnected(t) {
    var e;
    this._$AM === void 0 && (this._$Cv = t, (e = this._$AP) == null || e.call(this, t));
  }
}
class at {
  get tagName() {
    return this.element.tagName;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  constructor(t, e, i, o, n) {
    this.type = 1, this._$AH = _, this._$AN = void 0, this.element = t, this.name = e, this._$AM = o, this.options = n, i.length > 2 || i[0] !== "" || i[1] !== "" ? (this._$AH = Array(i.length - 1).fill(new String()), this.strings = i) : this._$AH = _;
  }
  _$AI(t, e = this, i, o) {
    const n = this.strings;
    let r = !1;
    if (n === void 0)
      t = B(this, t, e, 0), r = !J(t) || t !== this._$AH && t !== U, r && (this._$AH = t);
    else {
      const g = t;
      let u, v;
      for (t = n[0], u = 0; u < n.length - 1; u++)
        v = B(this, g[i + u], e, u), v === U && (v = this._$AH[u]), r || (r = !J(v) || v !== this._$AH[u]), v === _ ? t = _ : t !== _ && (t += (v ?? "") + n[u + 1]), this._$AH[u] = v;
    }
    r && !o && this.j(t);
  }
  j(t) {
    t === _ ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, t ?? "");
  }
}
class Ee extends at {
  constructor() {
    super(...arguments), this.type = 3;
  }
  j(t) {
    this.element[this.name] = t === _ ? void 0 : t;
  }
}
class Ce extends at {
  constructor() {
    super(...arguments), this.type = 4;
  }
  j(t) {
    this.element.toggleAttribute(this.name, !!t && t !== _);
  }
}
class Pe extends at {
  constructor(t, e, i, o, n) {
    super(t, e, i, o, n), this.type = 5;
  }
  _$AI(t, e = this) {
    if ((t = B(this, t, e, 0) ?? _) === U)
      return;
    const i = this._$AH, o = t === _ && i !== _ || t.capture !== i.capture || t.once !== i.once || t.passive !== i.passive, n = t !== _ && (i === _ || o);
    o && this.element.removeEventListener(this.name, this, i), n && this.element.addEventListener(this.name, this, t), this._$AH = t;
  }
  handleEvent(t) {
    var e;
    typeof this._$AH == "function" ? this._$AH.call(((e = this.options) == null ? void 0 : e.host) ?? this.element, t) : this._$AH.handleEvent(t);
  }
}
class Se {
  constructor(t, e, i) {
    this.element = t, this.type = 6, this._$AN = void 0, this._$AM = e, this.options = i;
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AI(t) {
    B(this, t);
  }
}
const vt = F.litHtmlPolyfillSupport;
vt == null || vt(G, st), (F.litHtmlVersions ?? (F.litHtmlVersions = [])).push("3.1.2");
const Re = (s, t, e) => {
  const i = (e == null ? void 0 : e.renderBefore) ?? t;
  let o = i._$litPart$;
  if (o === void 0) {
    const n = (e == null ? void 0 : e.renderBefore) ?? null;
    i._$litPart$ = o = new st(t.insertBefore(K(), n), n, void 0, e ?? {});
  }
  return o._$AI(s), o;
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
let E = class extends j {
  constructor() {
    super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
  }
  createRenderRoot() {
    var e;
    const t = super.createRenderRoot();
    return (e = this.renderOptions).renderBefore ?? (e.renderBefore = t.firstChild), t;
  }
  update(t) {
    const e = this.render();
    this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(t), this._$Do = Re(e, this.renderRoot, this.renderOptions);
  }
  connectedCallback() {
    var t;
    super.connectedCallback(), (t = this._$Do) == null || t.setConnected(!0);
  }
  disconnectedCallback() {
    var t;
    super.disconnectedCallback(), (t = this._$Do) == null || t.setConnected(!1);
  }
  render() {
    return U;
  }
};
var qt;
E._$litElement$ = !0, E.finalized = !0, (qt = globalThis.litElementHydrateSupport) == null || qt.call(globalThis, { LitElement: E });
const ft = globalThis.litElementPolyfillSupport;
ft == null || ft({ LitElement: E });
(globalThis.litElementVersions ?? (globalThis.litElementVersions = [])).push("4.0.4");
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const N = (s) => (t, e) => {
  e !== void 0 ? e.addInitializer(() => {
    customElements.define(s, t);
  }) : customElements.define(s, t);
};
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Te = { attribute: !0, type: String, converter: ot, reflect: !1, hasChanged: wt }, Oe = (s = Te, t, e) => {
  const { kind: i, metadata: o } = e;
  let n = globalThis.litPropertyMetadata.get(o);
  if (n === void 0 && globalThis.litPropertyMetadata.set(o, n = /* @__PURE__ */ new Map()), n.set(e.name, s), i === "accessor") {
    const { name: r } = e;
    return { set(g) {
      const u = t.get.call(this);
      t.set.call(this, g), this.requestUpdate(r, u, s);
    }, init(g) {
      return g !== void 0 && this.P(r, void 0, s), g;
    } };
  }
  if (i === "setter") {
    const { name: r } = e;
    return function(g) {
      const u = this[r];
      t.call(this, g), this.requestUpdate(r, u, s);
    };
  }
  throw Error("Unsupported decorator location: " + i);
};
function C(s) {
  return (t, e) => typeof e == "object" ? Oe(s, t, e) : ((i, o, n) => {
    const r = o.hasOwnProperty(n);
    return o.constructor.createProperty(n, r ? { ...i, wrapped: !0 } : i), r ? Object.getOwnPropertyDescriptor(o, n) : void 0;
  })(s, t, e);
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function lt(s) {
  return C({ ...s, state: !0, attribute: !1 });
}
const ct = "signapsePlayerContext";
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const Le = (s) => s.strings === void 0;
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const te = { ATTRIBUTE: 1, CHILD: 2, PROPERTY: 3, BOOLEAN_ATTRIBUTE: 4, EVENT: 5, ELEMENT: 6 }, ee = (s) => (...t) => ({ _$litDirective$: s, values: t });
class se {
  constructor(t) {
  }
  get _$AU() {
    return this._$AM._$AU;
  }
  _$AT(t, e, i) {
    this._$Ct = t, this._$AM = e, this._$Ci = i;
  }
  _$AS(t, e) {
    return this.update(t, e);
  }
  update(t, e) {
    return this.render(...e);
  }
}
/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const X = (s, t) => {
  var i;
  const e = s._$AN;
  if (e === void 0)
    return !1;
  for (const o of e)
    (i = o._$AO) == null || i.call(o, t, !1), X(o, t);
  return !0;
}, rt = (s) => {
  let t, e;
  do {
    if ((t = s._$AM) === void 0)
      break;
    e = t._$AN, e.delete(s), s = t;
  } while ((e == null ? void 0 : e.size) === 0);
}, ie = (s) => {
  for (let t; t = s._$AM; s = t) {
    let e = t._$AN;
    if (e === void 0)
      t._$AN = e = /* @__PURE__ */ new Set();
    else if (e.has(s))
      break;
    e.add(s), ke(t);
  }
};
function He(s) {
  this._$AN !== void 0 ? (rt(this), this._$AM = s, ie(this)) : this._$AM = s;
}
function Me(s, t = !1, e = 0) {
  const i = this._$AH, o = this._$AN;
  if (o !== void 0 && o.size !== 0)
    if (t)
      if (Array.isArray(i))
        for (let n = e; n < i.length; n++)
          X(i[n], !1), rt(i[n]);
      else
        i != null && (X(i, !1), rt(i));
    else
      X(this, s);
}
const ke = (s) => {
  s.type == te.CHILD && (s._$AP ?? (s._$AP = Me), s._$AQ ?? (s._$AQ = He));
};
class Ue extends se {
  constructor() {
    super(...arguments), this._$AN = void 0;
  }
  _$AT(t, e, i) {
    super._$AT(t, e, i), ie(this), this.isConnected = t._$AU;
  }
  _$AO(t, e = !0) {
    var i, o;
    t !== this.isConnected && (this.isConnected = t, t ? (i = this.reconnected) == null || i.call(this) : (o = this.disconnected) == null || o.call(this)), e && (X(this, t), rt(this));
  }
  setValue(t) {
    if (Le(this._$Ct))
      this._$Ct._$AI(t, this);
    else {
      const e = [...this._$Ct._$AH];
      e[this._$Ci] = t, this._$Ct._$AI(e, this, 0);
    }
  }
  disconnected() {
  }
  reconnected() {
  }
}
/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const M = () => new ze();
class ze {
}
const mt = /* @__PURE__ */ new WeakMap(), V = ee(class extends Ue {
  render(s) {
    return _;
  }
  update(s, [t]) {
    var i;
    const e = t !== this.Y;
    return e && this.Y !== void 0 && this.rt(void 0), (e || this.lt !== this.ct) && (this.Y = t, this.ht = (i = s.options) == null ? void 0 : i.host, this.rt(this.ct = s.element)), _;
  }
  rt(s) {
    if (typeof this.Y == "function") {
      const t = this.ht ?? globalThis;
      let e = mt.get(t);
      e === void 0 && (e = /* @__PURE__ */ new WeakMap(), mt.set(t, e)), e.get(this.Y) !== void 0 && this.Y.call(this.ht, void 0), e.set(this.Y, s), s !== void 0 && this.Y.call(this.ht, s);
    } else
      this.Y.value = s;
  }
  get lt() {
    var s, t;
    return typeof this.Y == "function" ? (s = mt.get(this.ht ?? globalThis)) == null ? void 0 : s.get(this.Y) : (t = this.Y) == null ? void 0 : t.value;
  }
  disconnected() {
    this.lt === this.ct && this.rt(void 0);
  }
  reconnected() {
    this.rt(this.ct);
  }
});
var De = Object.defineProperty, Ne = Object.getOwnPropertyDescriptor, ht = (s, t, e, i) => {
  for (var o = i > 1 ? void 0 : i ? Ne(t, e) : t, n = s.length - 1, r; n >= 0; n--)
    (r = s[n]) && (o = (i ? r(t, e, o) : r(o)) || o);
  return i && o && De(t, e, o), o;
};
let W = class extends E {
  constructor() {
    super(...arguments), this.onClick = () => {
    }, this.variant = "primary", this.size = "base", this.label = "", this.title = "", this.disabled = !1;
  }
  render() {
    return A`
      <button
        class="control-button"
        ?disabled=${this.disabled}
        title=${this.title}
        @click=${() => this.onClick()}
      >
        <slot name="svg"></slot>
        <slot name="label"></slot>
      </button>
    `;
  }
};
W.styles = D`
    ::slotted(*) {
      color: red;
      fill: red;
    }
    :host([disabled]) ::slotted(*) {
      opacity: 0.5;
    }

    :host {
      background: black;
    }

    button {
      background: none;
      height: 32px;
      width: 32px;
    }

    /* button {
      display: flex;
      background: none;
      justify-content: center;
      align-items: center;
      padding: 3px;
      text-align: center;
      border: none;
      position: relative;
      margin-bottom: 0;
      white-space: nowrap;
      vertical-align: middle;
      cursor: pointer;
      border-radius: 50%;
      font-size: 90%;
      outline-width: 3px;
      width: 32px;
      height: 32px;
      transition: 120ms opacity ease;
    }

    button:hover {
      background: var(--sa-hover-color);
    } */

    svg {
      height: 20px;
      fill: red;
      /* fill: var(--sa-button-text-color); */
    }
  `;
ht([
  C()
], W.prototype, "onClick", 2);
ht([
  C()
], W.prototype, "variant", 2);
ht([
  C({ type: Boolean })
], W.prototype, "disabled", 2);
W = ht([
  N("control-button")
], W);
var je = Object.defineProperty, Ve = Object.getOwnPropertyDescriptor, Ie = (s, t, e, i) => {
  for (var o = i > 1 ? void 0 : i ? Ve(t, e) : t, n = s.length - 1, r; n >= 0; n--)
    (r = s[n]) && (o = (i ? r(t, e, o) : r(o)) || o);
  return i && o && je(t, e, o), o;
};
let bt = class extends E {
  // scale up the plugin
  _dispatchScaleUp() {
    const s = new CustomEvent("scaleup", { composed: !0 });
    this.dispatchEvent(s);
  }
  // scale down the plugin
  _dispatchScaleDown() {
    const s = new CustomEvent("scaledown", { composed: !0 });
    this.dispatchEvent(s);
  }
  // this opens the play
  _dispatchPlayerInactive() {
    const s = new CustomEvent("signapse-update-context", {
      composed: !0,
      detail: {
        changes: {
          active: !1
        }
      }
    });
    this.dispatchEvent(s);
  }
  // if width < 300 update logo and button size
  // if width > 500 update logo and button size
  render() {
    return A`
      <div class="player-controls">
        <!-- <control-button
          @click=${() => this._dispatchScaleDown()}
          title="Reduce Plugin Size"
        >
          <svg
            slot="svg"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 448 512"
          >
            <path
              d="M432 256c0 17.7-14.3 32-32 32L48 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l352 0c17.7 0 32 14.3 32 32z"
            ></path>
          </svg>
        </control-button> -->
        <button
          class="control-button"
          title="Reduce Plugin Size"
          @click=${() => this._dispatchScaleDown()}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
            <path
              d="M432 256c0 17.7-14.3 32-32 32L48 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l352 0c17.7 0 32 14.3 32 32z"
            ></path>
          </svg>
        </button>
        <button
          class="control-button"
          title="Increase Plugin Size"
          @click=${() => this._dispatchScaleUp()}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
            <path
              d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"
            ></path>
          </svg>
        </button>
        <button
          class="control-button"
          title="Close Plugin"
          @click=${() => this._dispatchPlayerInactive()}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
            <path
              d="M310.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L160 210.7 54.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L114.7 256 9.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 301.3 265.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L205.3 256 310.6 150.6z"
            ></path>
          </svg>
        </button>
      </div>
    `;
  }
};
bt.styles = D`
    .player-controls {
      flex: 1;
      display: flex;
      gap: 4px;
      max-width: 110px;
      justify-content: space-between;
      /* padding: 4px 0; */
    }

    .player-controls .control-button {
      display: flex;
      background: none;
      justify-content: center;
      align-items: center;
      padding: 3px;
      text-align: center;
      border: none;
      position: relative;
      margin-bottom: 0;
      white-space: nowrap;
      vertical-align: middle;
      cursor: pointer;
      border-radius: 50%;
      font-size: 90%;
      outline-width: 3px;
      width: 32px;
      height: 32px;
      transition: 120ms opacity ease;
    }

    .player-controls .control-button:hover {
      background: var(--sa-hover-color);
    }

    .control-button svg {
      height: 20px;
      fill: var(--sa-button-text-color);
    }
  `;
bt = Ie([
  N("player-controls")
], bt);
function Be() {
  return A`
    <div class="player-header">
      <div class="logo">
        <img
          src="https://stag-cdn-website-translation.s3.eu-west-2.amazonaws.com/assets/web-translation-logo2.png"
          alt="Signapse-Logo"
        />
      </div>
      <player-controls></player-controls>
    </div>
  `;
}
function We(s) {
  let t = 0, e = 0;
  s.onmousedown = i;
  function i(g) {
    g.preventDefault(), t = g.clientX, e = g.clientY, document.onmouseup = n, document.onmousemove = r(o);
  }
  function o(g) {
    g.preventDefault();
    const u = t - g.clientX, v = e - g.clientY;
    t = g.clientX, e = g.clientY;
    const m = window.innerWidth || document.documentElement.clientWidth, f = window.innerHeight || document.documentElement.clientHeight, x = m - s.offsetWidth, d = f - s.offsetHeight;
    let p = Math.max(
      0,
      m - (s.offsetLeft + s.offsetWidth) + u
    );
    p = Math.min(p, x);
    let a = Math.max(0, s.offsetTop - v);
    a = Math.min(a, d), s.style.right = p + "px", s.style.top = a + "px";
  }
  function n() {
    document.onmouseup = null, document.onmousemove = null;
  }
  function r(g, u = 10) {
    let v = null;
    return function(...m) {
      const f = this;
      v || (g.apply(f, m), v = window.setTimeout(() => {
        v = null;
      }, u));
    };
  }
}
function Ye(s) {
  s.onmousedown = null;
}
/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
function qe(s, t, e) {
  return s ? t(s) : e == null ? void 0 : e(s);
}
const Yt = {
  BSL: {
    welcome: "BSL_Welcome",
    no_video: "No_Video_Message"
  },
  ASL: {
    welcome: "ASL_Welcome",
    no_video: "ASL_No_Video"
  }
};
var Ze = Object.defineProperty, Fe = Object.getOwnPropertyDescriptor, xt = (s, t, e, i) => {
  for (var o = i > 1 ? void 0 : i ? Fe(t, e) : t, n = s.length - 1, r; n >= 0; n--)
    (r = s[n]) && (o = (i ? r(t, e, o) : r(o)) || o);
  return i && o && Ze(t, e, o), o;
};
let Q = class extends E {
  constructor() {
    super(...arguments), this.value = {}, this.videoElementRef = M(), this.isPlaying = !0;
  }
  firstUpdated(s) {
    const t = this.videoElementRef.value;
    t.addEventListener("pause", this._onVideoEnd.bind(this)), t.addEventListener("play", this._onVideoStart.bind(this)), t.addEventListener("error", this._onVideoError.bind(this));
  }
  // updateContext(value: string, payload: any): void {
  //   const event = new CustomEvent("signapse-update-context", {
  //     composed: true,
  //     detail: {
  //       changes: {
  //         [value]: payload,
  //       },
  //     },
  //   });
  //   this.dispatchEvent(event);
  // }
  // this opens the play
  _dispatchErrorVideo() {
    const s = this.value.appConfig.lang, t = new CustomEvent("signapse-update-context", {
      composed: !0,
      detail: {
        changes: {
          videoHash: Yt[s].no_video
        }
      }
    });
    this.dispatchEvent(t);
  }
  _onVideoError() {
    console.log("Error loading video, use no video translation placeholder"), this._dispatchErrorVideo();
  }
  _playVideo(s) {
    const t = this.videoElementRef.value;
    typeof s == "number" && (t.currentTime = s), t.play();
  }
  _onVideoEnd() {
    this.isPlaying = !1;
  }
  _onVideoStart() {
    this.isPlaying = !0;
  }
  _pauseVideo() {
    this.videoElementRef.value.pause();
  }
  _buildVideoSource() {
    const s = "https://stag-sign-backend-signapisinterpretationwebtransl-oqu1fskqom6a.s3.eu-west-2.amazonaws.com/", t = ".mp4", e = this.value.appConfig.lang;
    let i = "";
    return this.value.videoHash ? i = this.value.videoHash : i = Yt[e].welcome, `${s}${i}${t}`;
  }
  render() {
    return A`
      <div class="video-container-root">
        <div
          class="video-control-overlay"
          tabindex="-1"
          title=${this.isPlaying ? "Pause Translation Video by clicking" : "Play Translation Video by clicking"}
          @click=${this.isPlaying ? this._pauseVideo : this._playVideo}
        >
          ${qe(
      this.isPlaying,
      () => A`
              <button @click=${() => {
      }} title="Translation - Pause">
                <svg
                  data-icon="stop"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style="display: inline;"
                >
                  <path
                    d="M10.65 19.11V4.89C10.65 3.54 10.08 3 8.64 3H5.01C3.57 3 3 3.54 3 4.89V19.11C3 20.46 3.57 21 5.01 21H8.64C10.08 21 10.65 20.46 10.65 19.11Z"
                    fill="#292D32"
                  ></path>
                  <path
                    d="M21.0016 19.11V4.89C21.0016 3.54 20.4316 3 18.9916 3H15.3616C13.9316 3 13.3516 3.54 13.3516 4.89V19.11C13.3516 20.46 13.9216 21 15.3616 21H18.9916C20.4316 21 21.0016 20.46 21.0016 19.11Z"
                    fill="#292D32"
                  ></path>
                </svg>
              </button>
            `,
      () => A`
              <button @click=${() => {
      }} title="Translation - Play">
                <svg
                  style="display: inline;"
                  data-icon="start"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M8.286 3.407A1.5 1.5 0 0 0 6 4.684v14.632a1.5 1.5 0 0 0 2.286 1.277l11.888-7.316a1.5 1.5 0 0 0 0-2.555L8.286 3.407z"
                    fill="#ffffff"
                  ></path>
                </svg>
              </button>
            `
    )}
        </div>
        <div class="video-container">
          <video
            ${V(this.videoElementRef)}
            playsinline=""
            muted
            width="100%"
            src=${this._buildVideoSource()}
            autoplay
          ></video>
        </div>
      </div>
    `;
  }
};
Q.styles = D`
    .video-container-root {
      position: relative;
      display: flex;
      padding: 4px;
      aspect-ratio: 1;
      z-index: 0;
    }

    .video-container-root:hover .video-control-overlay,
    .video-control-overlay:focus-within {
      opacity: 1;
    }

    .video-container {
      background-color: var(--sa-foreground-color);
      border-radius: 12px;
      overflow: hidden;
    }

    .video-control-overlay {
      position: absolute;
      inset: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      opacity: 0;
      transition: 0.5s opacity ease-in-out;
      z-index: 1;
    }

    .video-control-overlay button {
      background: none;
      color: inherit;
      border: none;
      padding: 0;
      font: inherit;
      cursor: pointer;
    }

    .video-control-overlay button svg {
      font-size: 3em;
      width: 1em;
      vertical-align: middle;
    }

    .video-control-overlay button svg path {
      fill: var(--sa-action-color);
    }
  `;
xt([
  yt({ context: ct, subscribe: !0 }),
  C({ attribute: !1 })
], Q.prototype, "value", 2);
xt([
  lt()
], Q.prototype, "isPlaying", 2);
Q = xt([
  N("video-container")
], Q);
/**
 * @license
 * Copyright 2018 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */
const oe = ee(class extends se {
  constructor(s) {
    var t;
    if (super(s), s.type !== te.ATTRIBUTE || s.name !== "class" || ((t = s.strings) == null ? void 0 : t.length) > 2)
      throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.");
  }
  render(s) {
    return " " + Object.keys(s).filter((t) => s[t]).join(" ") + " ";
  }
  update(s, [t]) {
    var i, o;
    if (this.st === void 0) {
      this.st = /* @__PURE__ */ new Set(), s.strings !== void 0 && (this.nt = new Set(s.strings.join(" ").split(/\s/).filter((n) => n !== "")));
      for (const n in t)
        t[n] && !((i = this.nt) != null && i.has(n)) && this.st.add(n);
      return this.render(t);
    }
    const e = s.element.classList;
    for (const n of this.st)
      n in t || (e.remove(n), this.st.delete(n));
    for (const n in t) {
      const r = !!t[n];
      r === this.st.has(n) || (o = this.nt) != null && o.has(n) || (r ? (e.add(n), this.st.add(n)) : (e.remove(n), this.st.delete(n)));
    }
    return U;
  }
});
var Xe = Object.defineProperty, Ke = Object.getOwnPropertyDescriptor, At = (s, t, e, i) => {
  for (var o = i > 1 ? void 0 : i ? Ke(t, e) : t, n = s.length - 1, r; n >= 0; n--)
    (r = s[n]) && (o = (i ? r(t, e, o) : r(o)) || o);
  return i && o && Xe(t, e, o), o;
};
let tt = class extends E {
  constructor() {
    super(...arguments), this.value = {}, this._maxWidth = 600, this._minWidth = 250, this._snapSize = 50, this.playerActiveRef = M(), this.playerRootRef = M();
  }
  _onPluginScaleUp() {
    const s = this.playerRootRef.value, t = s.getBoundingClientRect(), e = window.innerWidth || document.documentElement.clientWidth, i = window.innerHeight || document.documentElement.clientHeight, n = t.width + this._snapSize;
    if (n > this._maxWidth)
      return;
    const g = t.height + this._snapSize;
    if (n + this._snapSize > e || g + this._snapSize > i)
      return;
    const u = e / 2, v = i / 2;
    if (s.style.width = `${n}px`, t.left + t.width / 2 < u) {
      const a = e - t.right - this._snapSize;
      s.style.right = a + "px";
    }
    if (s.style.height = `${g}px`, t.top + t.height / 2 > v) {
      const p = t.top - this._snapSize;
      s.style.top = p + "px";
    }
  }
  _onPluginScaleDown() {
    const s = this.playerRootRef.value, t = s.getBoundingClientRect(), i = t.width - this._snapSize;
    if (i < this._minWidth)
      return;
    const n = t.height - this._snapSize;
    s.style.width = `${i}px`, s.style.height = `${n}px`;
  }
  _onWindowResize() {
    const s = this.playerRootRef.value, t = s.getBoundingClientRect();
    t.left < 0 && (s.style.right = window.innerWidth - t.width + "px");
  }
  connectedCallback() {
    super.connectedCallback(), this.addEventListener("scaleup", this._onPluginScaleUp.bind(this)), this.addEventListener("scaledown", this._onPluginScaleDown.bind(this)), window.addEventListener("resize", this._onWindowResize.bind(this));
  }
  disconnectedCallback() {
    Ye(this.playerRootRef.value), this.removeEventListener("scaleup", this._onPluginScaleUp.bind(this)), this.removeEventListener("scaledown", this._onPluginScaleDown.bind(this)), window.removeEventListener("resize", this._onWindowResize.bind(this));
  }
  firstUpdated(s) {
    We(this.playerRootRef.value);
  }
  render() {
    var t, e, i, o, n;
    const s = {
      bottomRight: !((t = this.value) != null && t.appConfig) || ((e = this.value.appConfig) == null ? void 0 : e.position) === "bottom-right",
      bottomLeft: ((i = this.value.appConfig) == null ? void 0 : i.position) === "bottom-left",
      topRight: ((o = this.value.appConfig) == null ? void 0 : o.position) === "top-right",
      centerRight: ((n = this.value.appConfig) == null ? void 0 : n.position) === "center-right"
    };
    return A`
      <div
        class="signapse-player-active-root ${oe(s)}"
        ${V(this.playerRootRef)}
      >
        ${Be()}
        <video-container></video-container>
      </div>
    `;
  }
};
tt.styles = D`
    .signapse-player-active-root {
      position: fixed;
      height: fit-content;
      width: 300px;
      background: var(--sa-background-color);
      /* border: 3px solid var(--sa-border-color); */
      border-radius: 18px;
      cursor: pointer;
    }

    .bottomRight {
      top: calc(100% - 334px - 24px);
      right: 24px;
    }

    .bottomLeft {
      top: calc(100% - 334px - 24px);
      right: calc(100% - 300px - 24px);
    }

    .topRight {
      top: 24px;
      right: 24px;
    }

    .centerRight {
      top: calc(50% - 167px);
      right: 24px;
    }

    .video {
      position: relative;
      z-index: 0;
      display: flex;
      aspect-ratio: 1;
      box-sizing: border-box;
    }

    .player-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 1rem;
      padding: 2px 6px 0;
    }

    .player-header .logo {
      display: flex;
    }

    .player-header .logo img {
      max-width: 90px;
    }
  `;
At([
  yt({ context: ct, subscribe: !0 }),
  C({ attribute: !1 })
], tt.prototype, "value", 2);
At([
  lt()
], tt.prototype, "_maxWidth", 2);
tt = At([
  N("signapse-player-active")
], tt);
var Je = Object.defineProperty, Ge = Object.getOwnPropertyDescriptor, Et = (s, t, e, i) => {
  for (var o = i > 1 ? void 0 : i ? Ge(t, e) : t, n = s.length - 1, r; n >= 0; n--)
    (r = s[n]) && (o = (i ? r(t, e, o) : r(o)) || o);
  return i && o && Je(t, e, o), o;
};
let et = class extends E {
  constructor() {
    var s, t;
    super(...arguments), this.value = {}, this.language = ((t = (s = this.value.appConfig) == null ? void 0 : s.lang) == null ? void 0 : t.toUpperCase()) || "BSL";
  }
  connectedCallback() {
    super.connectedCallback();
  }
  // this opens the player
  _dispatchPlayerActive() {
    const s = new CustomEvent("signapse-update-context", {
      composed: !0,
      detail: {
        changes: {
          active: !0
        }
      }
    });
    this.dispatchEvent(s);
  }
  render() {
    var t, e, i, o, n;
    const s = {
      bottomRight: !((t = this.value) != null && t.appConfig) || ((e = this.value.appConfig) == null ? void 0 : e.position) === "bottom-right",
      bottomLeft: ((i = this.value.appConfig) == null ? void 0 : i.position) === "bottom-left",
      topRight: ((o = this.value.appConfig) == null ? void 0 : o.position) === "top-right",
      centerRight: ((n = this.value.appConfig) == null ? void 0 : n.position) === "center-right"
    };
    return A`
      <div class="signapse-player-inactive-root ${oe(s)}">
        <button @click=${this._dispatchPlayerActive}>
          <p>SA</p>
          <!-- <img
            src=${`https://stag-cdn-website-translation.s3.eu-west-2.amazonaws.com/assets/${this.language}-logo.png`}
            alt=${`${this.language} Logo`}
            width="60px"
            height="60px"
          /> -->
        </button>
      </div>
    `;
  }
};
et.styles = D`
    .signapse-player-inactive-root {
      position: fixed;
      width: fit-content;
      height: fit-content;
      cursor: pointer;
    }

    .bottomRight {
      top: calc(100% - 60px - 24px);
      right: 24px;
    }

    .bottomLeft {
      top: calc(100% - 60px - 24px);
      right: calc(100% - 60px - 24px);
    }

    .topRight {
      top: 24px;
      right: 24px;
    }

    .centerRight {
      top: calc(50% - 30px);
      right: 24px;
    }

    button {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      margin: 0;
      cursor: pointer;
      border: none;
      filter: drop-shadow(0 0 1em var(--sa-background-color));

      width: 60px;
      height: 60px;
      background-color: var(--sa-background-color);
      border-radius: 50%;

      -webkit-transition: -moz-transform 0.3s ease-out;
      -moz-transition: -webkit-transform 0.3s ease-out;
      -o-transition: -o-transform 0.3s ease-out;
      transition: transform 0.3s ease-out;
    }

    button:hover {
      -moz-transform: scale(1.1);
      -webkit-transform: scale(1.1);
      -o-transform: scale(1.1);
      transform: scale(1.1);
    }
  `;
Et([
  yt({ context: ct, subscribe: !0 }),
  C({ attribute: !1 })
], et.prototype, "value", 2);
Et([
  lt()
], et.prototype, "language", 2);
et = Et([
  N("signapse-player-inactive")
], et);
function Qe() {
  function s(t, e = 0) {
    const i = t.style.zIndex != "" ? parseInt(t.style.zIndex, 10) : 0;
    i > e && (e = i);
    const o = t.shadowRoot ? t.shadowRoot.children : t.children;
    for (let n = 0; n < o.length; n++) {
      const r = o[n];
      e = s(r, e);
    }
    return e;
  }
  return s(document.body) + 1;
}
const dt = {
  backgroundColor: "#858fbf",
  foregroundColor: "#8c97c4",
  buttonTextColor: "#062743",
  borderColor: "#062743",
  actionColor: "#f1f2f8",
  hoverColor: "#434B6D"
};
var ts = Object.defineProperty, es = Object.getOwnPropertyDescriptor, Ct = (s, t, e, i) => {
  for (var o = i > 1 ? void 0 : i ? es(t, e) : t, n = s.length - 1, r; n >= 0; n--)
    (r = s[n]) && (o = (i ? r(t, e, o) : r(o)) || o);
  return i && o && ts(t, e, o), o;
};
const ss = {
  appConfig: {
    activationMode: "auto",
    lang: "ASL",
    position: "bottom-right",
    theme: dt
  },
  videoHash: null,
  active: !0
};
let Y = class extends E {
  constructor() {
    super(...arguments), this.value = ss, this.theme = dt, this.playerRootRef = M();
  }
  connectedCallback() {
    super.connectedCallback(), this.addEventListener("signapse-update-context", (s) => {
      console.log("signapse-update-context", s);
      const { changes: t } = s.detail, e = { ...this.value, ...t };
      this.value = e;
    }), window.addEventListener(
      "signapse_translate",
      this._onSignapseTranslate.bind(this)
    );
  }
  // thsi will set the z-index of the player to the highest z-index
  // so its not covered by any other elements or overlays
  _setHighZIndex() {
    const s = Qe(), t = s > 1e6 ? s : 1e6;
    this.playerRootRef.value.style.zIndex = `${t + 1}`;
  }
  firstUpdated(s) {
    this._setHighZIndex();
  }
  // TODO - ADD TYPES
  _onSignapseTranslate(s) {
    var i;
    const t = ((i = s.detail.videoHash) == null ? void 0 : i.trim()) || null, e = {
      ...this.value,
      videoHash: t,
      active: !0
    };
    this.value = e;
  }
  render() {
    const s = A`
      <style>
        :host {
          --sa-background-color: ${this.theme.backgroundColor};
          --sa-foreground-color: ${this.theme.foregroundColor};
          --sa-button-text-color: ${this.theme.buttonTextColor};
          --sa-border-color: ${this.theme.borderColor};
          --sa-action-color: ${this.theme.actionColor};
          --sa-hover-color: ${this.theme.hoverColor};
        }
      </style>
    `;
    return A`
      ${s}
      <div id="signapse_player_root" ${V(this.playerRootRef)}>
        <signapse-player-active
          ?hidden=${!this.value.active}
        ></signapse-player-active>
        <signapse-player-inactive
          ?hidden=${this.value.active}
        ></signapse-player-inactive>
      </div>
    `;
  }
};
Y.styles = D`
    #signapse_player_root {
      position: absolute;
      bottom: 0;
      right: 0;
    }
  `;
Ct([
  he({ context: ct }),
  C({ attribute: !1 })
], Y.prototype, "value", 2);
Ct([
  C({ type: Object, attribute: "theme" })
], Y.prototype, "theme", 2);
Y = Ct([
  N("signapse-player")
], Y);
class is {
  static sanitizeTextForMD5(t) {
    return t.replace(/[^\w\s\']|_/g, "").replace(/\s+/g, " ").replace(/\s/g, "").replace(/["']/g, "").replace(/[^\x00-\x7F]/g, "").toLowerCase();
  }
  static md5(t) {
    let e = this.sanitizeTextForMD5(t), i = "0123456789abcdef";
    function o(y) {
      let b, $ = "";
      for (b = 0; b <= 3; b++)
        $ += i.charAt(y >> b * 8 + 4 & 15) + i.charAt(y >> b * 8 & 15);
      return $;
    }
    function n(y, b) {
      let $ = (y & 65535) + (b & 65535);
      return (y >> 16) + (b >> 16) + ($ >> 16) << 16 | $ & 65535;
    }
    function r(y, b) {
      return y << b | y >>> 32 - b;
    }
    function g(y, b, $, w, P, S) {
      return n(r(n(n(b, y), n(w, S)), P), $);
    }
    function u(y, b, $, w, P, S, O) {
      return g(b & $ | ~b & w, y, b, P, S, O);
    }
    function v(y, b, $, w, P, S, O) {
      return g(b & w | $ & ~w, y, b, P, S, O);
    }
    function m(y, b, $, w, P, S, O) {
      return g(b ^ $ ^ w, y, b, P, S, O);
    }
    function f(y, b, $, w, P, S, O) {
      return g($ ^ (b | ~w), y, b, P, S, O);
    }
    function x(y) {
      let b, $ = (y.length + 8 >> 6) + 1, w = new Array($ * 16);
      for (b = 0; b < $ * 16; b++)
        w[b] = 0;
      for (b = 0; b < y.length; b++)
        w[b >> 2] |= y.charCodeAt(b) << b % 4 * 8;
      return w[b >> 2] |= 128 << b % 4 * 8, w[$ * 16 - 2] = y.length * 8, w;
    }
    let d, p = x(e), a = 1732584193, l = -271733879, c = -1732584194, h = 271733878, Rt, Tt, Ot, Lt;
    for (d = 0; d < p.length; d += 16)
      Rt = a, Tt = l, Ot = c, Lt = h, a = u(a, l, c, h, p[d + 0], 7, -680876936), h = u(h, a, l, c, p[d + 1], 12, -389564586), c = u(c, h, a, l, p[d + 2], 17, 606105819), l = u(l, c, h, a, p[d + 3], 22, -1044525330), a = u(a, l, c, h, p[d + 4], 7, -176418897), h = u(h, a, l, c, p[d + 5], 12, 1200080426), c = u(c, h, a, l, p[d + 6], 17, -1473231341), l = u(l, c, h, a, p[d + 7], 22, -45705983), a = u(a, l, c, h, p[d + 8], 7, 1770035416), h = u(h, a, l, c, p[d + 9], 12, -1958414417), c = u(c, h, a, l, p[d + 10], 17, -42063), l = u(l, c, h, a, p[d + 11], 22, -1990404162), a = u(a, l, c, h, p[d + 12], 7, 1804603682), h = u(h, a, l, c, p[d + 13], 12, -40341101), c = u(c, h, a, l, p[d + 14], 17, -1502002290), l = u(l, c, h, a, p[d + 15], 22, 1236535329), a = v(a, l, c, h, p[d + 1], 5, -165796510), h = v(h, a, l, c, p[d + 6], 9, -1069501632), c = v(c, h, a, l, p[d + 11], 14, 643717713), l = v(l, c, h, a, p[d + 0], 20, -373897302), a = v(a, l, c, h, p[d + 5], 5, -701558691), h = v(h, a, l, c, p[d + 10], 9, 38016083), c = v(c, h, a, l, p[d + 15], 14, -660478335), l = v(l, c, h, a, p[d + 4], 20, -405537848), a = v(a, l, c, h, p[d + 9], 5, 568446438), h = v(h, a, l, c, p[d + 14], 9, -1019803690), c = v(c, h, a, l, p[d + 3], 14, -187363961), l = v(l, c, h, a, p[d + 8], 20, 1163531501), a = v(a, l, c, h, p[d + 13], 5, -1444681467), h = v(h, a, l, c, p[d + 2], 9, -51403784), c = v(c, h, a, l, p[d + 7], 14, 1735328473), l = v(l, c, h, a, p[d + 12], 20, -1926607734), a = m(a, l, c, h, p[d + 5], 4, -378558), h = m(h, a, l, c, p[d + 8], 11, -2022574463), c = m(c, h, a, l, p[d + 11], 16, 1839030562), l = m(l, c, h, a, p[d + 14], 23, -35309556), a = m(a, l, c, h, p[d + 1], 4, -1530992060), h = m(h, a, l, c, p[d + 4], 11, 1272893353), c = m(c, h, a, l, p[d + 7], 16, -155497632), l = m(l, c, h, a, p[d + 10], 23, -1094730640), a = m(a, l, c, h, p[d + 13], 4, 681279174), h = m(h, a, l, c, p[d + 0], 11, -358537222), c = m(c, h, a, l, p[d + 3], 16, -722521979), l = m(l, c, h, a, p[d + 6], 23, 76029189), a = m(a, l, c, h, p[d + 9], 4, -640364487), h = m(h, a, l, c, p[d + 12], 11, -421815835), c = m(c, h, a, l, p[d + 15], 16, 530742520), l = m(l, c, h, a, p[d + 2], 23, -995338651), a = f(a, l, c, h, p[d + 0], 6, -198630844), h = f(h, a, l, c, p[d + 7], 10, 1126891415), c = f(c, h, a, l, p[d + 14], 15, -1416354905), l = f(l, c, h, a, p[d + 5], 21, -57434055), a = f(a, l, c, h, p[d + 12], 6, 1700485571), h = f(h, a, l, c, p[d + 3], 10, -1894986606), c = f(c, h, a, l, p[d + 10], 15, -1051523), l = f(l, c, h, a, p[d + 1], 21, -2054922799), a = f(a, l, c, h, p[d + 8], 6, 1873313359), h = f(h, a, l, c, p[d + 15], 10, -30611744), c = f(c, h, a, l, p[d + 6], 15, -1560198380), l = f(l, c, h, a, p[d + 13], 21, 1309151649), a = f(a, l, c, h, p[d + 4], 6, -145523070), h = f(h, a, l, c, p[d + 11], 10, -1120210379), c = f(c, h, a, l, p[d + 2], 15, 718787259), l = f(l, c, h, a, p[d + 9], 21, -343485551), a = n(a, Rt), l = n(l, Tt), c = n(c, Ot), h = n(h, Lt);
    return o(a) + o(l) + o(c) + o(h);
  }
}
var os = Object.defineProperty, ns = Object.getOwnPropertyDescriptor, pt = (s, t, e, i) => {
  for (var o = i > 1 ? void 0 : i ? ns(t, e) : t, n = s.length - 1, r; n >= 0; n--)
    (r = s[n]) && (o = (i ? r(t, e, o) : r(o)) || o);
  return i && o && os(t, e, o), o;
};
let z = class extends E {
  constructor() {
    super(...arguments), this.lang = "BSL", this.theme = dt, this.activeElement = null, this.playingElement = null, this.playerTriggerRootRef = M(), this.contentActiveOverlayRef = M(), this.contentPlayingOverlayRef = M();
  }
  // PLUGIN BOOT LOGIC HERE
  connectedCallback() {
    super.connectedCallback(), document.addEventListener("mouseover", this._onMouseOver.bind(this)), window.addEventListener("resize", this._updateOverlayPosition.bind(this));
  }
  disconnectedCallback() {
    document.removeEventListener("mouseover", this._onMouseOver.bind(this)), window.removeEventListener(
      "resize",
      this._updateOverlayPosition.bind(this)
    );
  }
  // TODO -> write proper logic for this
  _isTargetTranslatableElement(s) {
    const t = [
      "p",
      "span",
      "a",
      "h1",
      "h2",
      "h3",
      "h4",
      "h5",
      "h6"
    ];
    return s instanceof HTMLElement && t.includes(s.tagName.toLowerCase());
  }
  _removeContentActiveOverlay() {
    const t = this.playerTriggerRootRef.value.querySelector(
      ".content-active"
    );
    t && (t.style.display = "none", t.style.width = "", t.style.height = "", t.style.right = "", t.style.top = "");
  }
  _onMouseOver({ target: s }) {
    const t = s, e = this.contentActiveOverlayRef.value;
    if (!this._isTargetTranslatableElement(t)) {
      t.isSameNode(this) || (this.activeElement = null, this._removeContentActiveOverlay());
      return;
    }
    this.activeElement = t, this._cloneElementPosition(e, t);
  }
  // private _onMouseOut({ target }: MouseEvent) {
  //   // console.log("on mouse out", target);
  // }
  _cloneElementPosition(s, t) {
    const e = t.getBoundingClientRect();
    s.style.display = "block", s.style.left = e.right - e.width + "px", s.style.top = e.top + "px", s.style.width = e.width + "px", s.style.height = e.height + "px";
  }
  _updateOverlayPosition() {
    if (this.playingElement) {
      const s = this.contentPlayingOverlayRef.value;
      this._cloneElementPosition(s, this.playingElement);
    }
  }
  _addPlayingHighlight(s) {
    const t = this.contentPlayingOverlayRef.value;
    this._cloneElementPosition(t, s);
  }
  _formatElementContentForTranslation(s) {
    const t = s.textContent || "";
    return is.md5(this.lang + t);
  }
  _onTranslateClick() {
    if (this.activeElement) {
      this._addPlayingHighlight(this.activeElement), this.playingElement = this.activeElement;
      const s = this._formatElementContentForTranslation(
        this.activeElement
      ), t = new CustomEvent("signapse_translate", {
        bubbles: !0,
        composed: !0,
        detail: { videoHash: s }
      });
      this.dispatchEvent(t);
    }
  }
  render() {
    const s = A`
      <style>
        :host {
          --sa-background-color: ${this.theme.backgroundColor};
          --sa-foreground-color: ${this.theme.foregroundColor};
          --sa-button-text-color: ${this.theme.buttonTextColor};
          --sa-border-color: ${this.theme.borderColor};
          --sa-action-color: ${this.theme.actionColor};
          --sa-hover-color: ${this.theme.hoverColor};
        }
      </style>
    `;
    return A`
      ${s}
      <div
        class="signapse-player-trigger-root"
        ${V(this.playerTriggerRootRef)}
      >
        <div class="content-active" ${V(this.contentActiveOverlayRef)}>
          <div class="highlight-overlay"></div>
          <div
            tabindex="0"
            class="translate-button"
            @click=${this._onTranslateClick}
            title="Play sign language translation"
            aria-label="Play sign language translation"
          >
            <svg
              height="512px"
              id="Layer_1"
              style="enable-background:new 0 0 512 512;"
              version="1.1"
              viewBox="0 0 512 512"
              width="512px"
              xml:space="preserve"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
            >
              <g>
                <path
                  d="M144,124.9L353.8,256L144,387.1V124.9 M128,96v320l256-160L128,96L128,96z"
                  fill="white"
                ></path>
              </g>
            </svg>
          </div>
        </div>
        <div class="content-playing" ${V(this.contentPlayingOverlayRef)}>
          <div class="highlight-overlay"></div>
        </div>
      </div>
    `;
  }
};
z.styles = D`
    .content-active,
    .content-playing {
      display: none;
      position: absolute;
      height: 100%;
    }

    .content-active {
      z-index: 1;
      /* pointer-events: none; */
    }

    .content-playing {
      pointer-events: none;
      z-index: 0;
    }

    .highlight-overlay {
      content: "";
      position: absolute;
      top: -3px;
      left: -3px;
      right: -3px;
      bottom: -3px;
    }

    .content-active .highlight-overlay {
      border: 3px dotted var(--sa-background-color);
      border-radius: 8px 0 0 8px;
    }

    .content-playing .highlight-overlay {
      border: 3px dotted var(--sa-background-color);
      border-radius: 8px;
    }

    .content-active .translate-button {
      position: absolute;
      right: -33px;
      top: -3px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: var(--sa-background-color);
      width: 30px;
      height: calc(100% + 6px);
      border-radius: 0 8px 8px 0;
      z-index: 1;
    }

    .content-active .translate-button:hover {
      background-color: var(--sa-hover-color);
      cursor: pointer;
    }

    svg path {
      fill: var(--sa-action-color);
    }
  `;
pt([
  C({ type: String })
], z.prototype, "lang", 2);
pt([
  C({ type: Object, attribute: "theme" })
], z.prototype, "theme", 2);
pt([
  lt()
], z.prototype, "activeElement", 2);
z = pt([
  N("signapse-player-trigger")
], z);
function ne(s) {
  return `signapse_config_${s}`;
}
function rs(s) {
  const t = sessionStorage.getItem(ne(s));
  return t ? JSON.parse(t) : null;
}
function re(s, t) {
  sessionStorage.setItem(ne(s), JSON.stringify(t));
}
const as = {
  activationMode: "manual",
  lang: "BSL",
  position: "bottom-right",
  domain: "localhost:5173",
  theme: dt,
  allowed_urls: [
    {
      url: "http://localhost:5173/",
      is_tracked: !0
    },
    {
      url: "http://localhost:5173/test/",
      is_tracked: !1
    }
  ]
};
let I;
function ls(s) {
  return new Promise((t) => {
    console.log("app id", s), setTimeout(() => {
      t(as);
    }, 500);
  });
}
function Pt(s) {
  const t = new Y(), e = new z();
  t.value.appConfig = s, t.theme = s.theme, e.theme = s.theme, e.lang = s.lang, document.body.appendChild(t), document.body.appendChild(e);
}
function cs(s) {
  return new Promise((t, e) => {
    const i = rs(s);
    if (i)
      return t(i);
    ls(s).then((o) => (re(s, o), t(o))).catch((o) => (console.log("Error fetching config", o), e(o)));
  });
}
function hs() {
  console.log(I), St(I).then(() => {
    Pt(I);
  }).catch((s) => {
    console.error("Error loading plugin", s);
  });
}
function ds() {
  window.signapseLoadPlugin || (window.signapseLoadPlugin = hs), window.signapseInvalidatePlugin || (window.signapseInvalidatePlugin = ae);
}
function St(s) {
  return console.log("shouldLoadPlugin", s), new Promise((t) => t(!0));
}
function ae() {
  var s, t, e, i;
  console.log("invalidatePlugin"), (t = (s = document.getElementsByTagName("signapse-player")) == null ? void 0 : s[0]) == null || t.remove(), (i = (e = document.getElementsByTagName("signapse-player-trigger")) == null ? void 0 : e[0]) == null || i.remove();
}
function ps() {
  const s = document.querySelector("signapse-player");
  console.log("player", s), St(I).then(() => {
    s || Pt(I);
  }).catch(() => {
    s && ae();
  });
}
window.addEventListener("popstate", ps);
function us() {
  const s = window.signapse.appId;
  cs(s).then((t) => {
    I = t, re(s, t), St(t).then(() => {
      t.activationMode === "custom" ? ds() : Pt(t);
    }).catch((e) => {
      console.error("Error loading plugin", e);
    });
  });
}
document.addEventListener("DOMContentLoaded", us);
