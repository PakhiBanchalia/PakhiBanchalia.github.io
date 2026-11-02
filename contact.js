// Copy the email address: the icon swaps to a tick and says "copied" for a moment.
(function () {
  // The clipboard API needs permission some browsers don't give; fall back to
  // the old select-and-copy trick.
  async function copy(text) {
    try { await navigator.clipboard.writeText(text); return true; } catch (e) { /* fall through */ }
    const t = document.createElement("textarea");
    t.value = text; t.setAttribute("readonly", ""); t.style.cssText = "position:fixed;opacity:0";
    document.body.appendChild(t); t.select();
    let ok = false;
    try { ok = document.execCommand("copy"); } catch (e) { /* nothing more to try */ }
    t.remove();
    return ok;
  }

  document.querySelectorAll(".copy[data-copy]").forEach((btn) => {
    const label = btn.querySelector(".copied");
    let timer;
    btn.addEventListener("click", async () => {
      if (!(await copy(btn.dataset.copy))) return;
      btn.classList.add("done");
      window.sfx?.chime();
      if (label) label.textContent = "copied";
      clearTimeout(timer);
      timer = setTimeout(() => { btn.classList.remove("done"); if (label) label.textContent = ""; }, 1600);
    });
  });
})();
