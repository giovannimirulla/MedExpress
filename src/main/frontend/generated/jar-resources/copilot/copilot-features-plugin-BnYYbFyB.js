import { x as r, j as d, X as c, $ as g, a0 as f, n as u } from "./copilot-LjW1xyrg.js";
import { B as h } from "./base-panel-NEB2zJkd.js";
import { i as v } from "./icons-BbnAo408.js";
const m = "copilot-features-panel{padding:var(--space-100);font:var(--font-xsmall);display:grid;grid-template-columns:auto 1fr;gap:var(--space-50);height:auto}copilot-features-panel a{display:flex;align-items:center;gap:var(--space-50);white-space:nowrap}copilot-features-panel a svg{height:12px;width:12px;min-height:12px;min-width:12px}";
var b = Object.defineProperty, $ = Object.getOwnPropertyDescriptor, w = (t, e, a, s) => {
  for (var o = s > 1 ? void 0 : s ? $(e, a) : e, l = t.length - 1, n; l >= 0; l--)
    (n = t[l]) && (o = (s ? n(e, a, o) : n(o)) || o);
  return s && o && b(e, a, o), o;
};
const i = window.Vaadin.devTools;
let p = class extends h {
  render() {
    return r` <style>
        ${m}
      </style>
      ${d.featureFlags.map(
      (t) => r`
          <copilot-toggle-button
            .title="${t.title}"
            ?checked=${t.enabled}
            @on-change=${(e) => this.toggleFeatureFlag(e, t)}>
          </copilot-toggle-button>
          <a class="ahreflike" href="${t.moreInfoLink}" title="Learn more" target="_blank"
            >learn more ${v.share}</a
          >
        `
    )}`;
  }
  toggleFeatureFlag(t, e) {
    const a = t.target.checked;
    c("use-feature", { source: "toggle", enabled: a, id: e.id }), i.frontendConnection ? (i.frontendConnection.send("setFeature", { featureId: e.id, enabled: a }), g({
      type: f.INFORMATION,
      message: `“${e.title}” ${a ? "enabled" : "disabled"}`,
      details: e.requiresServerRestart ? "This feature requires a server restart" : void 0,
      dismissId: `feature${e.id}${a ? "Enabled" : "Disabled"}`
    })) : i.log("error", `Unable to toggle feature ${e.title}: No server connection available`);
  }
};
p = w([
  u("copilot-features-panel")
], p);
const x = {
  header: "Features",
  expanded: !1,
  panelOrder: 35,
  panel: "right",
  floating: !1,
  tag: "copilot-features-panel",
  helpUrl: "https://vaadin.com/docs/latest/flow/configuration/feature-flags"
}, F = {
  init(t) {
    t.addPanel(x);
  }
};
window.Vaadin.copilot.plugins.push(F);
export {
  p as CopilotFeaturesPanel
};
