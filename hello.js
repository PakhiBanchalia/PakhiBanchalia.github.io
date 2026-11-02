// Experience: on touch screens there's no hover, so a tap opens an entry
// (and closes the one that was open). Mouse and keyboard are handled in CSS.
(function () {
  if (matchMedia("(hover: hover)").matches) return;
  const items = [...document.querySelectorAll(".roles li")];
  items.forEach((li) => {
    li.addEventListener("click", (e) => {
      if (e.target.closest("a")) return;   // links still just go where they go
      const open = !li.classList.contains("open");
      items.forEach((x) => x.classList.remove("open"));
      if (open) li.classList.add("open");
    });
  });
})();
