// The line under the name doesn't settle on one answer: click it for another.
(function () {
  const line = document.getElementById("what");
  const source = document.getElementById("what-lines");
  if (!line || !source) return;

  const lines = [...source.content.querySelectorAll("span")].map((s) => s.innerHTML);
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let i = 0;
  let busy = false;

  function next() {
    if (busy) return;
    i = (i + 1) % lines.length;
    if (still) { line.innerHTML = lines[i]; return; }
    busy = true;
    line.classList.add("leaving");
    setTimeout(() => {
      line.innerHTML = lines[i];
      line.classList.remove("leaving");
      busy = false;
    }, 180);
  }

  line.addEventListener("click", next);
  line.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); next(); }
  });
})();

// The cut-out swings for a few seconds when clicked.
(function () {
  const me = document.querySelector(".me img");
  if (!me || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  me.addEventListener("click", () => {
    me.classList.remove("swinging");
    void me.offsetWidth; // restart the swing if it's already going
    me.classList.add("swinging");
  });
  me.addEventListener("animationend", () => me.classList.remove("swinging"));
})();

// Experience: on touch screens there's no hover, so a tap opens an entry
// (and closes the one that was open). Mouse and keyboard are handled in CSS.
(function () {
  if (matchMedia("(hover: hover)").matches) return;
  const items = [...document.querySelectorAll(".roles li")];
  items.forEach((li) => {
    const head = li.querySelector(".head");
    if (!head) return;
    head.addEventListener("click", () => {
      const open = !li.classList.contains("open");
      items.forEach((x) => { x.classList.remove("open"); x.querySelector(".head")?.setAttribute("aria-expanded", "false"); });
      if (open) { li.classList.add("open"); head.setAttribute("aria-expanded", "true"); }
      head.blur();
    });
  });
})();
