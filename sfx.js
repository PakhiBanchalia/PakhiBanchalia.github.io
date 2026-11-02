// Little interface sounds, made in code with Web Audio: no sound files.
// Quiet on purpose. Browsers only allow sound once the visitor has clicked or
// tapped something, so hover sounds start working after their first click.
(function () {
  let ctx = null;
  const VOL = 0.18;
  function ac() {
    if (!ctx) { try { ctx = new AudioContext(); } catch (e) { return null; } }
    if (ctx.state !== "running") ctx.resume();
    return ctx;
  }
  // one note: wave type, start and end pitch, length, loudness
  function tone(type, f0, f1, dur, vol = 1, delay = 0) {
    const c = ac(); if (!c) return;
    const t = c.currentTime + delay;
    const o = c.createOscillator(), g = c.createGain();
    o.type = type;
    o.frequency.setValueAtTime(f0, t);
    o.frequency.exponentialRampToValueAtTime(f1, t + dur);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(VOL * vol, t + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(c.destination);
    o.start(t); o.stop(t + dur + 0.02);
  }
  window.sfx = {
    // soft bubble pop: a quick downward blip
    pop() { tone("sine", 720, 260, 0.09, 1); },
    // tiny two-note chime: something worked
    chime() { tone("triangle", 1318.5, 1318.5, 0.35, 0.6); tone("triangle", 1975.5, 1975.5, 0.45, 0.5, 0.07); },
    // "ting ting": two little bell notes, for the name in the corner
    ting() { tone("sine", 2093, 2093, 0.22, 0.45); tone("sine", 2637, 2637, 0.3, 0.4, 0.11); },
    // whisper-quiet tick as a Work entry opens
    tick() { tone("sine", 1500, 1150, 0.05, 0.35); },
    // link to another site: a little upward "off you go"
    away() { tone("sine", 520, 880, 0.07, 0.6); tone("sine", 880, 1180, 0.08, 0.4, 0.06); },
    // link within the site: a soft, low tap
    within() { tone("triangle", 330, 200, 0.09, 0.8); },
  };

  // Every link click makes a sound: one for leaving the site, one for moving
  // around inside it. A link that loads another page of the site waits a beat
  // so the sound isn't cut off.
  document.addEventListener("click", (e) => {
    const a = e.target.closest("a[href]");
    if (!a || e.defaultPrevented || e.button !== 0) return;
    // the archive isn't built yet: stay here and say so
    if (a.hasAttribute("data-soon")) {
      e.preventDefault();
      window.sfx.tick();
      a.classList.add("said");
      clearTimeout(a._soon); a._soon = setTimeout(() => a.classList.remove("said"), 1600);
      return;
    }
    const url = new URL(a.href, location.href);
    const external = url.origin !== location.origin || url.protocol === "mailto:";
    if (external) { window.sfx.away(); return; }
    window.sfx.within();
    const samePage = url.pathname === location.pathname && url.hash;
    const newTab = a.target === "_blank" || e.metaKey || e.ctrlKey || e.shiftKey;
    if (!samePage && !newTab) {
      e.preventDefault();
      setTimeout(() => { location.href = a.href; }, 120);
    }
  });

  // My name in the corner: "ting ting" as it starts to rock.
  if (matchMedia("(hover: hover)").matches) {
    document.querySelector(".top .name")?.addEventListener("mouseenter", () => window.sfx.ting());
  }

  // Work: a tick when an entry opens on hover (same short pause as the CSS,
  // so skimming past entries stays silent).
  if (matchMedia("(hover: hover)").matches) {
    document.querySelectorAll(".roles li").forEach((li) => {
      let t;
      li.addEventListener("mouseenter", () => { t = setTimeout(() => window.sfx.tick(), 120); });
      li.addEventListener("mouseleave", () => clearTimeout(t));
    });
  }
})();
