class Ui {
    constructor(ctx, canvas) {
        this.ctx = ctx;
        this.canvas = canvas;

        // HP sprite
        this.mango = new Image();
        this.mango.src = "./assets/mango.png";

        // Sound button sprites
        this.sound = {
            play: new Image(),
            mute: new Image(),
            isMuted: false
        };
        this.sound.play.src = "./assets/ui/play.png";
        this.sound.mute.src = "./assets/ui/mute.png";

        this.startTime = Date.now();

        // Click listener for sound toggle
        this.canvas.addEventListener("click", (e) => {
            const x = e.clientX;
            const y = e.clientY;
            
            const btnX = this.canvas.width - 100;
            const btnY = 20;
            const btnW = 100;
            const btnH = 100;

            if (x >= btnX && x <= btnX + btnW &&
                y >= btnY && y <= btnY + btnH) {
                this.sound.isMuted = !this.sound.isMuted;
            }
        });
    }

    update(game) {this.game = game;}

    draw() { 
        this.drawLife();
        this.drawTime();
        this.drawSoundButton();
    }

    drawLife() {
        const hp = this.game.playerHP || 0;
        for (let i = 0; i < hp; i++) {
            this.ctx.drawImage(this.mango, 20 + i * 50, 40, 60, 60);
        }
    }

    // Helper
    getTimeString() {
        const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
        const m = String(Math.floor(elapsed / 60)).padStart(2, "0");
        const s = String(elapsed % 60).padStart(2, "0");
        return `${m}:${s}`;
    }

    drawTime() {
        const timeStr = this.getTimeString(); // capture the string
        this.ctx.fillStyle = "yellow";
        this.ctx.font = "bold 40px 'Luckiest Guy'";
        this.ctx.textAlign = "center";
        this.ctx.fillText(`Time: ${timeStr}`, this.canvas.width / 2, 80);
    }

    drawSoundButton() {
        const sprite = this.sound.isMuted ? this.sound.mute : this.sound.play;
        this.ctx.drawImage(sprite, this.canvas.width - 100, 20, 100, 100);
    }
}

export default Ui;