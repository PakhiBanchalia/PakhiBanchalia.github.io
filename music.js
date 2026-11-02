// Background music: "chocolate milk", off until the visitor turns it on.
// The speaker icon turns it on and off. It plays through a Spotify embed kept off-screen. If the browser won't let it
// start from our button, the little Spotify player slides in so they can press play.
(function () {
  const btn = document.querySelector(".sound");
  const player = document.getElementById("player");
  if (!btn || !player) return;
  const URI = "spotify:track:5IBHUdEapfgKRPzxR2Amns";
  let controller = null, playing = false, wanted = false;

  function show(on) {
    playing = on;
    btn.setAttribute("aria-pressed", String(on));
    btn.setAttribute("aria-label", (on ? "Pause" : "Play") + " music: chocolate milk");
  }

  window.onSpotifyIframeApiReady = (api) => {
    api.createController(document.getElementById("spotify"), { uri: URI, width: 300, height: 80 }, (c) => {
      controller = c;
      c.addListener("playback_update", (e) => {
        const on = !e.data.isPaused;
        show(on);
        if (on) player.classList.remove("open");
      });
      if (wanted) start();
    });
  };
  const s = document.createElement("script");
  s.src = "https://open.spotify.com/embed/iframe-api/v1";
  s.async = true;
  document.head.appendChild(s);

  function start() {
    // always from the top of the song, not where it was last paused
    controller.seek(0);
    controller.play();
    // blocked? let them press play in the real player
    setTimeout(() => { if (wanted && !playing) player.classList.add("open"); }, 1200);
  }

  btn.addEventListener("click", () => {
    wanted = !playing;
    if (!controller) { show(wanted); return; }
    if (wanted) start();
    else { controller.pause(); player.classList.remove("open"); show(false); }
  });
})();
