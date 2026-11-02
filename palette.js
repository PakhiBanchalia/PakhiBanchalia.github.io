// Palette switcher for designing. It only exists on a local server, so the
// live site never shows it; there the page uses whatever data-palette the
// <html> tag carries (or the :root default).
(function () {
  const local = ["localhost", "127.0.0.1", "[::1]"].includes(location.hostname);
  if (!local) return;

  const PALETTES = [
    ["off-white", "#faf9f6"], ["sage", "#e6ebe0"], ["deep-sage", "#d6dfcd"],
    ["baby-blue", "#e5eef6"], ["powder-blue", "#d6e5f1"], ["butter", "#f7f1dc"],
    ["blush", "#f6e8e5"], ["lavender", "#ebe8f4"], ["peach", "#f9e9de"],
    ["mint", "#e3f2eb"], ["oat", "#efebe3"],
    // mint paper with blush's raspberry accent: the swatch shows both
    ["mint-rose", "linear-gradient(135deg, #e3f2eb 50%, #b03c5c 50%)"],
  ];
  // one saved choice per page, so home and archive can differ
  const KEY = "pakhi-palette:" + location.pathname.replace(/index\.html$/, "");
  const root = document.documentElement;

  function read() {
    const fromUrl = new URLSearchParams(location.search).get("palette");
    if (fromUrl) return fromUrl;
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function set(name) {
    root.dataset.palette = name;
    try { localStorage.setItem(KEY, name); } catch (e) { /* private mode: just don't remember */ }
    bar.querySelectorAll("button").forEach((b) => b.setAttribute("aria-pressed", b.dataset.name === name));
    label.textContent = name.replace("-", " ");
  }

  const saved = read();
  if (saved && PALETTES.some(([n]) => n === saved)) root.dataset.palette = saved;

  const bar = document.createElement("div");
  bar.setAttribute("aria-label", "Palette switcher (local only)");
  bar.style.cssText =
    "position:fixed;right:16px;bottom:16px;z-index:9999;display:flex;flex-wrap:wrap;justify-content:flex-end;" +
    "align-items:center;gap:6px;max-width:calc(100vw - 32px);" +
    "padding:7px 10px;border-radius:16px;background:rgba(255,255,255,.82);backdrop-filter:blur(8px);" +
    "box-shadow:0 2px 14px rgba(0,0,0,.1);font:12px 'Geist Mono',ui-monospace,monospace;color:#444";
  const label = document.createElement("span");
  label.style.cssText = "min-width:78px;text-align:right;margin-right:4px";
  bar.appendChild(label);

  PALETTES.forEach(([name, hex]) => {
    const b = document.createElement("button");
    b.dataset.name = name;
    b.title = name.replace("-", " ");
    b.style.cssText =
      `width:18px;height:18px;border-radius:50%;padding:0;cursor:pointer;background:${hex};` +
      "border:1px solid rgba(0,0,0,.18);outline-offset:2px";
    b.addEventListener("click", () => set(name));
    b.addEventListener("focus", () => (b.style.outline = "2px solid #444"));
    b.addEventListener("blur", () => (b.style.outline = "none"));
    bar.appendChild(b);
  });

  // Keys 1–9, 0 and - cycle through palettes without reaching for the mouse.
  addEventListener("keydown", (e) => {
    const typing = e.target instanceof Element && e.target.closest("input, textarea, [contenteditable]");
    if (typing || e.metaKey || e.ctrlKey || e.altKey) return;
    const i = "1234567890-".indexOf(e.key);
    if (i > -1 && PALETTES[i]) set(PALETTES[i][0]);
  });

  const mount = () => { document.body.appendChild(bar); set(root.dataset.palette || "off-white"); };
  document.body ? mount() : addEventListener("DOMContentLoaded", mount);
})();
