// Background music: "chocolate milk" by yawn., off until the visitor turns it on.
// The speaker icon in the navbar opens a slim player strip and starts the song
// from the top; clicking it again stops the song. YouTube's player does the
// playing, hidden behind the album cover.
(function () {
  const VOLUME = 35;                 // 0–100: how loud the song plays
  const VIDEO = "rz4atfBfcw8";

  const speaker = document.querySelector(".sound");
  const card = document.getElementById("player");
  if (!speaker || !card) return;
  let player = null, ready = false, queued = false;

  function playing(on) {
    speaker.setAttribute("aria-pressed", String(on));
    speaker.setAttribute("aria-label", (on ? "Pause" : "Play") + " music: chocolate milk");
    card.classList.toggle("is-playing", on);
  }
  function open(on) {
    card.classList.toggle("open", on);
    card.setAttribute("aria-hidden", String(!on));
  }

  window.onYouTubeIframeAPIReady = () => {
    player = new YT.Player("yt", {
      width: 200, height: 200, videoId: VIDEO,
      playerVars: { controls: 0, playsinline: 1, rel: 0, disablekb: 1 },
      events: {
        onReady: () => { ready = true; player.setVolume(VOLUME); if (queued) fromTheTop(); },
        onStateChange: (e) => {
          if (e.data === YT.PlayerState.PLAYING) playing(true);
          if (e.data === YT.PlayerState.PAUSED || e.data === YT.PlayerState.ENDED) playing(false);
        },
      },
    });
  };
  const s = document.createElement("script");
  s.src = "https://www.youtube.com/iframe_api";
  s.async = true;
  document.head.appendChild(s);

  function fromTheTop() { player.setVolume(VOLUME); player.seekTo(0, true); player.playVideo(); }
  function stop() { if (ready) player.pauseVideo(); playing(false); open(false); queued = false; }

  // navbar speaker: on = open the strip and play from the start; off = stop and close
  speaker.addEventListener("click", () => {
    if (card.classList.contains("open")) return stop();
    open(true); playing(true);
    if (ready) fromTheTop(); else queued = true;
  });
})();
