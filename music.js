// Background music: "chocolate milk" by yawn., off until the visitor turns it on.
// The speaker icon in the navbar drops down Spotify's little player and starts
// the song from the top; clicking it again stops the song. (Spotify plays the
// whole song for visitors signed in to Spotify, a short preview for everyone else.)
(function () {
  const TRACK = "spotify:track:5IBHUdEapfgKRPzxR2Amns";

  const speaker = document.querySelector(".sound");
  const card = document.getElementById("player");
  if (!speaker || !card) return;
  let player = null, queued = false, started = 0;

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
      // playing or pausing from inside Spotify's player shows or hides it too
      // (but not in the first moment after the speaker starts the song)
      c.addListener("playback_update", (e) => {
        const on = !e.data.isPaused;
        if (!on && Date.now() - started < 1500) return;
        playing(on); open(on);
      });
      if (queued) fromTheTop();
    });
  };
  const s = document.createElement("script");
  s.src = "https://open.spotify.com/embed/iframe-api/v1";
  s.async = true;
  document.head.appendChild(s);

  function fromTheTop() { player.seek(0); player.resume(); }
  function stop() { if (player) player.pause(); playing(false); open(false); queued = false; }

  // navbar speaker: on = open the player and play from the start; off = stop and close
  speaker.addEventListener("click", () => {
    if (card.classList.contains("open")) return stop();
    open(true); playing(true); started = Date.now();
    if (player) fromTheTop(); else queued = true;
  });
})();
