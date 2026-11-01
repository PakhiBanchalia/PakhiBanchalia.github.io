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
