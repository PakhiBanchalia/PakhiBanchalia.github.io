// Navbar: slips away while scrolling down, comes back on any scroll up, and
// turns to foggy glass once the page has moved. On phones the menu button
// opens the full-screen menu.
(function () {
  const top = document.querySelector(".top");
  const burger = document.querySelector(".burger");
  const menu = document.getElementById("menu");
  if (!top) return;
  const isOpen = () => !!menu?.classList.contains("open");

  let last = scrollY;
  addEventListener("scroll", () => {
    const y = scrollY;
    top.classList.toggle("scrolled", y > 4);
    if (Math.abs(y - last) < 6) return;              // ignore tiny jitters
    top.classList.toggle("hide", y > last && y > top.offsetHeight && !isOpen());
    last = y;
  }, { passive: true });

  if (!burger || !menu) return;
  function setOpen(on) {
    menu.classList.toggle("open", on);
    menu.setAttribute("aria-hidden", String(!on));
    top.classList.toggle("menu-open", on);
    burger.setAttribute("aria-expanded", String(on));
    burger.setAttribute("aria-label", on ? "Close menu" : "Open menu");
    document.documentElement.style.overflow = on ? "hidden" : "";   // page stays put underneath
    if (on) top.classList.remove("hide");
  }
  burger.addEventListener("click", () => { setOpen(!isOpen()); window.sfx?.tick(); });
  // picking a place closes the menu and goes there ("coming soon" stays open to say so)
  menu.addEventListener("click", (e) => {
    const a = e.target.closest("a");
    if (a && !a.hasAttribute("data-soon")) setOpen(false);
  });
  // my name goes back to the landing screen, so it closes the menu too
  document.querySelector(".top .name")?.addEventListener("click", () => { if (isOpen()) setOpen(false); });
  addEventListener("keydown", (e) => { if (e.key === "Escape" && isOpen()) { setOpen(false); burger.focus(); } });
  // turning a phone sideways (or widening the window) past the phone layout closes it
  matchMedia("(min-width: 561px)").addEventListener("change", (e) => { if (e.matches) setOpen(false); });
})();
