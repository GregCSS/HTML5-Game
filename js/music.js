class Music {
    constructor() {
        this.music = new Audio("./assets/music.mp3");
        this.music.loop = true;
        this.music.volume = 0.5;
        this.music.muted = true // default muted

        // Keep track of music state
        this.isMuted = true;
        this.started = false;
    }

    // Play
    play() {
        if (!this.started) {
            this.music.play();
            this.started = true;
        }
    }

    // Press to mute
    pressMute() {
        this.isMuted = !this.isMuted;
        this.music.muted = this.isMuted;

        // Start playback only when 'm' is first pressed
        if (!this.started) {this.play();}
    }
}

export default Music;