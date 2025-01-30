import { a as P, a6 as H, B as C, X as N, F as U, j as g, x as d, a7 as I, E as j, J as B, H as J, $ as L, a0 as O, M as q, b as F, n as T } from "./copilot-LjW1xyrg.js";
import { r as A } from "./state-DL4nAz7t.js";
import { B as M } from "./base-panel-NEB2zJkd.js";
import { i as y } from "./icons-BbnAo408.js";
const V = "copilot-info-panel{--dev-tools-red-color: red;--dev-tools-grey-color: gray;--dev-tools-green-color: green;position:relative}copilot-info-panel div.info-tray{display:flex;flex-direction:column;gap:10px}copilot-info-panel vaadin-button{margin-inline:var(--lumo-space-l)}copilot-info-panel dl{display:grid;grid-template-columns:auto auto;gap:0;margin:var(--space-100) var(--space-50);font:var(--font-xsmall)}copilot-info-panel dl>dt,copilot-info-panel dl>dd{padding:3px 10px;margin:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}copilot-info-panel dd.live-reload-status>span{overflow:hidden;text-overflow:ellipsis;display:block;color:var(--status-color)}copilot-info-panel dd span.hidden{display:none}copilot-info-panel dd span.true{color:var(--dev-tools-green-color);font-size:large}copilot-info-panel dd span.false{color:var(--dev-tools-red-color);font-size:large}copilot-info-panel code{white-space:nowrap;-webkit-user-select:all;user-select:all}copilot-info-panel .checks{display:inline-grid;grid-template-columns:auto 1fr;gap:var(--space-50)}copilot-info-panel span.hint{font-size:var(--font-size-0);background:var(--gray-50);padding:var(--space-75);border-radius:var(--radius-2)}";
var k, E;
function W() {
  return E || (E = 1, k = function() {
    var e = document.getSelection();
    if (!e.rangeCount)
      return function() {
      };
    for (var t = document.activeElement, n = [], i = 0; i < e.rangeCount; i++)
      n.push(e.getRangeAt(i));
    switch (t.tagName.toUpperCase()) {
      // .toUpperCase handles XHTML
      case "INPUT":
      case "TEXTAREA":
        t.blur();
        break;
      default:
        t = null;
        break;
    }
    return e.removeAllRanges(), function() {
      e.type === "Caret" && e.removeAllRanges(), e.rangeCount || n.forEach(function(l) {
        e.addRange(l);
      }), t && t.focus();
    };
  }), k;
}
var D, $;
function _() {
  if ($) return D;
  $ = 1;
  var e = W(), t = {
    "text/plain": "Text",
    "text/html": "Url",
    default: "Text"
  }, n = "Copy to clipboard: #{key}, Enter";
  function i(a) {
    var o = (/mac os x/i.test(navigator.userAgent) ? "⌘" : "Ctrl") + "+C";
    return a.replace(/#{\s*key\s*}/g, o);
  }
  function l(a, o) {
    var s, u, f, v, p, r, h = !1;
    o || (o = {}), s = o.debug || !1;
    try {
      f = e(), v = document.createRange(), p = document.getSelection(), r = document.createElement("span"), r.textContent = a, r.ariaHidden = "true", r.style.all = "unset", r.style.position = "fixed", r.style.top = 0, r.style.clip = "rect(0, 0, 0, 0)", r.style.whiteSpace = "pre", r.style.webkitUserSelect = "text", r.style.MozUserSelect = "text", r.style.msUserSelect = "text", r.style.userSelect = "text", r.addEventListener("copy", function(c) {
        if (c.stopPropagation(), o.format)
          if (c.preventDefault(), typeof c.clipboardData > "u") {
            s && console.warn("unable to use e.clipboardData"), s && console.warn("trying IE specific stuff"), window.clipboardData.clearData();
            var x = t[o.format] || t.default;
            window.clipboardData.setData(x, a);
          } else
            c.clipboardData.clearData(), c.clipboardData.setData(o.format, a);
        o.onCopy && (c.preventDefault(), o.onCopy(c.clipboardData));
      }), document.body.appendChild(r), v.selectNodeContents(r), p.addRange(v);
      var R = document.execCommand("copy");
      if (!R)
        throw new Error("copy command was unsuccessful");
      h = !0;
    } catch (c) {
      s && console.error("unable to copy using execCommand: ", c), s && console.warn("trying IE specific stuff");
      try {
        window.clipboardData.setData(o.format || "text", a), o.onCopy && o.onCopy(window.clipboardData), h = !0;
      } catch (x) {
        s && console.error("unable to copy using clipboardData: ", x), s && console.error("falling back to prompt"), u = i("message" in o ? o.message : n), window.prompt(u, a);
      }
    } finally {
      p && (typeof p.removeRange == "function" ? p.removeRange(v) : p.removeAllRanges()), r && document.body.removeChild(r), f();
    }
    return h;
  }
  return D = l, D;
}
var z = _();
const X = /* @__PURE__ */ P(z);
var G = Object.defineProperty, K = Object.getOwnPropertyDescriptor, w = (e, t, n, i) => {
  for (var l = i > 1 ? void 0 : i ? K(t, n) : t, a = e.length - 1, o; a >= 0; a--)
    (o = e[a]) && (l = (i ? o(t, n, l) : o(l)) || l);
  return i && l && G(t, n, l), l;
};
let b = class extends M {
  constructor() {
    super(...arguments), this.serverInfo = [], this.clientInfo = [{ name: "Browser", version: navigator.userAgent }], this.handleServerInfoEvent = (e) => {
      const t = JSON.parse(e.data.info);
      this.serverInfo = t.versions, H().then((n) => {
        n && (this.clientInfo.unshift({ name: "Vaadin Employee", version: "true", more: void 0 }), this.requestUpdate("clientInfo"));
      }), C() === "success" && N("hotswap-active", { value: U() });
    };
  }
  connectedCallback() {
    super.connectedCallback(), this.onCommand("copilot-info", this.handleServerInfoEvent), this.onEventBus("system-info-with-callback", (e) => {
      e.detail.callback(this.getInfoForClipboard(e.detail.notify));
    }), this.reaction(
      () => g.idePluginState,
      () => {
        this.requestUpdate("serverInfo");
      }
    );
  }
  getIndex(e) {
    return this.serverInfo.findIndex((t) => t.name === e);
  }
  render() {
    return d`<style>
        ${V}
      </style>
      <div class="info-tray">
        <dl>
          ${[...this.serverInfo, ...this.clientInfo].map(
      (e) => d`
              <dt>${e.name}</dt>
              <dd title="${e.version}" style="${e.name === "Java Hotswap" ? "white-space: normal" : ""}">
                ${this.renderValue(e.version)} ${e.more}
              </dd>
            `
    )}
          ${this.renderDevWorkflowSection()}
        </dl>
        ${this.renderDevelopmentWorkflowButton()}
      </div>`;
  }
  renderDevWorkflowSection() {
    const e = C(), t = this.getIdePluginLabelText(g.idePluginState), n = this.getHotswapAgentLabelText(e);
    return d`
      <dt>Java Hotswap</dt>
      <dd>${m(e === "success")} ${n}</dd>
      ${I() !== "unsupported" ? d`<dt>IDE Plugin</dt>
            <dd>${m(I() === "success")} ${t}</dd>` : j}
    `;
  }
  renderDevelopmentWorkflowButton() {
    const e = B();
    let t = "", n = null;
    return e.status === "success" ? (t = "More details...", n = y.successColorful) : e.status === "warning" ? (t = "Improve Development Workflow...", n = y.warningColorful) : e.status === "error" && (t = "Fix Development Workflow...", n = d`<span style="color: var(--red)">${y.error}</span>`), d`
      <vaadin-button
        id="development-workflow-guide"
        @click="${() => {
      J();
    }}">
        <span slot="prefix"> ${n}</span>
        ${t}</vaadin-button
      >
    `;
  }
  getHotswapAgentLabelText(e) {
    return e === "success" ? "Java Hotswap is enabled" : e === "error" ? "Hotswap is partially enabled" : "Hotswap is not enabled";
  }
  getIdePluginLabelText(e) {
    if (I() !== "success")
      return "Not installed";
    if (e?.version) {
      let t = null;
      return e?.ide && (e?.ide === "intellij" ? t = "IntelliJ" : e?.ide === "vscode" ? t = "VS Code" : e?.ide === "eclipse" && (t = "Eclipse")), t ? `${e?.version} ${t}` : e?.version;
    }
    return "Not installed";
  }
  renderValue(e) {
    return e === "false" ? m(!1) : e === "true" ? m(!0) : e;
  }
  getInfoForClipboard(e) {
    const t = this.renderRoot.querySelectorAll(".info-tray dt"), l = Array.from(t).map((a) => ({
      key: a.textContent.trim(),
      value: a.nextElementSibling.textContent.trim()
    })).filter((a) => a.key !== "Live reload").filter((a) => !a.key.startsWith("Vaadin Emplo")).map((a) => {
      const { key: o } = a;
      let { value: s } = a;
      if (o === "IDE Plugin")
        s = this.getIdePluginLabelText(g.idePluginState) ?? "false";
      else if (o === "Java Hotswap") {
        const u = g.jdkInfo?.jrebel, f = C();
        u && f === "success" ? s = "JRebel is in use" : s = this.getHotswapAgentLabelText(f);
      }
      return `${o}: ${s}`;
    }).join(`
`);
    return e && L({
      type: O.INFORMATION,
      message: "Environment information copied to clipboard",
      dismissId: "versionInfoCopied"
    }), l.trim();
  }
};
w([
  A()
], b.prototype, "serverInfo", 2);
w([
  A()
], b.prototype, "clientInfo", 2);
b = w([
  T("copilot-info-panel")
], b);
let S = class extends q {
  createRenderRoot() {
    return this;
  }
  connectedCallback() {
    super.connectedCallback(), this.style.display = "flex";
  }
  render() {
    return d`<button title="Copy to clipboard" aria-label="Copy to clipboard" theme="icon tertiary">
      <span
        @click=${() => {
      F.emit("system-info-with-callback", {
        callback: X,
        notify: !0
      });
    }}
        >${y.copy}</span
      >
    </button>`;
  }
};
S = w([
  T("copilot-info-actions")
], S);
const Q = {
  header: "Info",
  expanded: !1,
  panelOrder: 15,
  panel: "right",
  floating: !1,
  tag: "copilot-info-panel",
  actionsTag: "copilot-info-actions",
  eager: !0
  // Render even when collapsed as error handling depends on this
}, Y = {
  init(e) {
    e.addPanel(Q);
  }
};
window.Vaadin.copilot.plugins.push(Y);
function m(e) {
  return e ? d`<span class="true">☑</span>` : d`<span class="false">☒</span>`;
}
export {
  S as Actions,
  b as CopilotInfoPanel
};
