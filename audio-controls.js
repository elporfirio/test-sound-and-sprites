export default class AudioControls {
  constructor(onPlayReady, onAfterInitialPlay) {
    this.playButton = document.getElementById("play");
    this.fairyAudio = document.getElementById("fairy");
    this.fairyLowAudio = document.getElementById("fairy-low");

    this.pauseAudio = this._pauseAudio.bind(this);
    this.resumeAudio = this._resumeAudio.bind(this);
    this.playInitialAudio = this._playInitialAudio.bind(this);
    this.toggleAudio = this._toggleAudio.bind(this);
    this.onAfterInitialPlay = onAfterInitialPlay;
    this.onPlayReady = onPlayReady;
    this.init();
  }

  init() {
    const self = this;
    const readyFairyAudio = new Promise(function(resolve) {
      self.fairyAudio.addEventListener("canplay", resolve, false);
    });

    const readyFairyLowAudio = new Promise(function(resolve) {
      self.fairyLowAudio.addEventListener("canplay", resolve, false);
    });

    Promise.all([readyFairyAudio, readyFairyLowAudio]).then(function() {
      self.playButton.addEventListener("click", self.playInitialAudio);
      if (typeof self.onPlayReady === "function") {
        self.onPlayReady();
      }
    });
  }

  _pauseAudio() {
    this.fairyAudio.pause();
    this.fairyLowAudio.pause();
    this.playButton.removeEventListener("click", this.pauseAudio);
    this.playButton.addEventListener("click", this.resumeAudio);
    this.playButton.innerText = "PLAY MUSIC";
  }

  _resumeAudio() {
    this.fairyAudio.play();
    this.fairyLowAudio.play();
    this.playButton.removeEventListener("click", this.resumeAudio);
    this.playButton.addEventListener("click", this.pauseAudio);
    this.playButton.innerText = "STOP MUSIC";
  }

  _playInitialAudio() {
    this.fairyAudio.play();
    this.fairyLowAudio.play();
    this.fairyLowAudio.volume = 0;
    this.playButton.removeEventListener("click", this.playInitialAudio);

    this.playButton.innerText = "STOP MUSIC";
    this.playButton.addEventListener("click", this.pauseAudio);

    if (typeof this.onAfterInitialPlay === "function") {
      this.onAfterInitialPlay();
    }
  }

  _toggleAudio(active) {
    if (active) {
      this.fairyAudio.volume = 0;
      this.fairyLowAudio.volume = 1;
    } else {
      this.fairyAudio.volume = 1;
      this.fairyLowAudio.volume = 0;
    }
  }
}
