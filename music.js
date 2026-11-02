// Background music: "chocolate milk" by yawn., off until the visitor turns it on.
// The speaker icon in the navbar drops down Spotify's little player and starts
// the song from the top; clicking it again stops the song. (Spotify plays the
// whole song for visitors signed in to Spotify, a short preview for everyone else.)
(function () {
  const TRACK = "spotify:track:5IBHUdEapfgKRPzxR2Amns";

  const speaker = document.querySelector(".sound");
  const card = document.getElementById("player");
  if (!speaker || !card) return;
  let player = null, ready = false, queued = false, waiting = false;

  function playing(on) {
    speaker.setAttribute("aria-pressed", String(on));
    speaker.setAttribute("aria-label", (on ? "Stop" : "Play") + " music: chocolate milk");
  }
  function open(on) {
    card.classList.toggle("open", on);
    card.setAttribute("aria-hidden", String(!on));
  }

  window.onSpotifyIframeApiReady = (api) => {
    api.createController(document.getElementById("sp"), { uri: TRACK, width: "100%", height: 80 }, (c) => {
      player = c;
      c.addListener("ready", () => { ready = true; if (queued) fromTheTop(); });
      // playing or pausing from inside Spotify's player shows or hides it too
      // (but while the speaker's song is still starting up, ignore "paused")
      // (updates also arrive every second while playing: only react to a change)
      c.addListener("playback_update", (e) => {
        const on = !e.data.isPaused;
        if (on) waiting = false;
        else if (waiting) return;
        if (on === isPlaying()) return;
        playing(on); open(on);
      });
    });
  };
  const s = document.createElement("script");
  s.src = "https://open.spotify.com/embed/iframe-api/v1";
  s.async = true;
  document.head.appendChild(s);

  function fromTheTop() { queued = false; player.seek(0); player.resume(); }
  function stop() { if (ready) player.pause(); playing(false); open(false); queued = waiting = false; }

  const isPlaying = () => speaker.getAttribute("aria-pressed") === "true";

  // navbar speaker: on = open the player and play from the start; off = stop and close
  speaker.addEventListener("click", () => {
    if (isPlaying()) return stop();
    open(true); playing(true); waiting = true;
    if (ready) fromTheTop(); else queued = true;
  });

  // Touch screens have no "mouse left" moment, so the player tucks away (the
  // song keeps playing) when the page scrolls or something else is tapped.
  if (!matchMedia("(hover: hover)").matches) {
    let from = 0;
    const tuck = () => { if (card.classList.contains("open")) open(false); };
    addEventListener("scroll", () => { if (Math.abs(scrollY - from) > 30) tuck(); }, { passive: true });
    document.addEventListener("pointerdown", (e) => {
      if (!e.target.closest(".music")) tuck();
    });
    speaker.addEventListener("click", () => { from = scrollY; });
  }
})();
