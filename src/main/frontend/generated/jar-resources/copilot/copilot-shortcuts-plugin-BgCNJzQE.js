import { n as f, b as d, x as c, E as g, T as b, L as e, z as m } from "./copilot-LjW1xyrg.js";
import { B as $ } from "./base-panel-NEB2zJkd.js";
import { i as o } from "./icons-BbnAo408.js";
const v = 'copilot-shortcuts-panel{display:flex;flex-direction:column;padding:var(--space-150)}copilot-shortcuts-panel h3{font:var(--font-xsmall-semibold);margin-bottom:var(--space-100);margin-top:0}copilot-shortcuts-panel h3:not(:first-of-type){margin-top:var(--space-200)}copilot-shortcuts-panel ul{display:flex;flex-direction:column;list-style:none;margin:0;padding:0}copilot-shortcuts-panel ul li{display:flex;align-items:center;gap:var(--space-50);position:relative}copilot-shortcuts-panel ul li:not(:last-of-type):before{border-bottom:1px dashed var(--border-color);content:"";inset:auto 0 0 calc(var(--size-m) + var(--space-50));position:absolute}copilot-shortcuts-panel ul li span:has(svg){align-items:center;display:flex;height:var(--size-m);justify-content:center;width:var(--size-m)}copilot-shortcuts-panel .kbds{margin-inline-start:auto}copilot-shortcuts-panel kbd{align-items:center;border:1px solid var(--border-color);border-radius:var(--radius-2);box-sizing:border-box;display:inline-flex;font-family:var(--font-family);font-size:var(--font-size-1);line-height:var(--line-height-1);padding:0 var(--space-50)}', h = window.Vaadin.copilot.tree;
if (!h)
  throw new Error("Tried to access copilot tree before it was initialized.");
var y = Object.defineProperty, w = Object.getOwnPropertyDescriptor, x = (t, n, l, i) => {
  for (var a = i > 1 ? void 0 : i ? w(n, l) : n, p = t.length - 1, r; p >= 0; p--)
    (r = t[p]) && (a = (i ? r(n, l, a) : r(a)) || a);
  return i && a && y(n, l, a), a;
};
let u = class extends $ {
  constructor() {
    super(), this.onTreeUpdated = () => {
      this.requestUpdate();
    };
  }
  connectedCallback() {
    super.connectedCallback(), d.on("copilot-tree-created", this.onTreeUpdated);
  }
  disconnectedCallback() {
    super.disconnectedCallback(), d.off("copilot-tree-created", this.onTreeUpdated);
  }
  render() {
    const t = h.hasFlowComponents();
    return c`<style>
        ${v}
      </style>
      <h3>Global</h3>
      <ul>
        <li>
          <span>${o.vaadinLogo}</span>
          <span>Copilot</span>
          ${s(e.toggleCopilot)}
        </li>
        <li>
          <span>${o.terminal}</span>
          <span>Command window</span>
          ${s(e.toggleCommandWindow)}
        </li>
        <li>
          <span>${o.undo}</span>
          <span>Undo</span>
          ${s(e.undo)}
        </li>
        <li>
          <span>${o.redo}</span>
          <span>Redo</span>
          ${s(e.redo)}
        </li>
      </ul>
      <h3>Selected component</h3>
      <ul>
        <li>
          <span>${o.fileCodeAlt}</span>
          <span>Go to source</span>
          ${s(e.goToSource)}
        </li>
        ${t ? c`<li>
              <span>${o.code}</span>
              <span>Go to attach source</span>
              ${s(e.goToAttachSource)}
            </li>` : g}
        <li>
          <span>${o.copy}</span>
          <span>Copy</span>
          ${s(e.copy)}
        </li>
        <li>
          <span>${o.clipboard}</span>
          <span>Paste</span>
          ${s(e.paste)}
        </li>
        <li>
          <span>${o.copyAlt}</span>
          <span>Duplicate</span>
          ${s(e.duplicate)}
        </li>
        <li>
          <span>${o.userUp}</span>
          <span>Select parent</span>
          ${s(e.selectParent)}
        </li>
        <li>
          <span>${o.userLeft}</span>
          <span>Select previous sibling</span>
          ${s(e.selectPreviousSibling)}
        </li>
        <li>
          <span>${o.userRight}</span>
          <span>Select first child / next sibling</span>
          ${s(e.selectNextSibling)}
        </li>
        <li>
          <span>${o.trash}</span>
          <span>Delete</span>
          ${s(e.delete)}
        </li>
      </ul>`;
  }
};
u = x([
  f("copilot-shortcuts-panel")
], u);
function s(t) {
  return c`<span class="kbds">${b(t)}</span>`;
}
const C = m({
  header: "Keyboard Shortcuts",
  tag: "copilot-shortcuts-panel",
  width: 400,
  height: 550,
  floatingPosition: {
    top: 50,
    left: 50
  }
}), P = {
  init(t) {
    t.addPanel(C);
  }
};
window.Vaadin.copilot.plugins.push(P);
