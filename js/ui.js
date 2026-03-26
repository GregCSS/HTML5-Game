class Ui {
    constructor(ctx, game) {
        this.ctx = ctx;
        this.game = game;

        // Health sprite
        this.mango = this.loadImage("./assets/mango.png");

        // Sound sprites
        this.soundUi = {
            play: this.loadImage("./assets/ui/play.png"),
            mute: this.loadImage("./assets/ui/mute.png")
        };

        // Get menu, gameover, victory sprites
        this.uiElements = {
            title: this.loadImage("./assets/ui/title.png"),
            tutorial: this.loadImage("./assets/ui/tutorial.png"),
            start: this.loadImage("./assets/ui/start.png"),
            restart: this.loadImage("./assets/ui/restart.png"),
            again: this.loadImage("./assets/ui/again.png"),
            gameover: this.loadImage("./assets/ui/gameover.png"),
            victory: this.loadImage("./assets/ui/victory.png")
        };

        this.startTime = Date.now();
    }

    // Helper
    loadImage(src) {
        const img = new Image();
        img.src = src;
        return img;
    }

    update(game) {this.game = game;}

    // -----------------
    // DRAW FUNCTIONS
    // -----------------

    // Main
    draw() {
        this.drawLife();
        this.drawTime();
        this.drawSound();
    }

    // Draw health
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

    // Draw time score
    drawTime() {
        const timeStr = this.getTimeString();
        this.ctx.fillStyle = "yellow";
        this.ctx.font = "bold 40px 'Luckiest Guy'";
        this.ctx.textAlign = "center";
        this.ctx.fillText(`Time: ${timeStr}`, this.ctx.canvas.width / 2, 80);
    }

    // Draw sound
    drawSound() {
        if (!this.game) return;

        const sprite = this.game.music.isMuted
            ? this.soundUi.mute
            : this.soundUi.play;

        this.ctx.drawImage(sprite, this.ctx.canvas.width - 100, 20, 100, 100);
    }

    // Draw blurred backdrop
    drawBlurBg() {
        const ctx = this.ctx;
        ctx.filter = "blur(6px)";
        ctx.drawImage(this.game.background.image, 0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.filter = "none";
    }

    // Draw menu
    drawMenu() {
        this.drawBlurBg();
        this.drawCenter(this.uiElements.title, 1000, 800, 0.01);
        this.drawCenter(this.uiElements.start, 500, 400, 0.4);
        this.drawCenter(this.uiElements.tutorial, 350, 350, 0.6);
        this.drawSound();
    }

    // Draw game over
    drawGameOver() {
        this.drawBlurBg();
        this.drawCenter(this.uiElements.gameover, 1000, 800, 0.01);
        this.drawCenter(this.uiElements.restart, 500, 400, 0.4);
        this.drawSound();
    }

    // Draw victory with time score
    drawVictory(victoryTime) {
        this.drawBlurBg();
        this.drawCenter(this.uiElements.victory, 1000, 800, 0.01);
        this.drawCenter(this.uiElements.again, 500, 400, 0.4);

        this.ctx.fillStyle = "yellow";
        this.ctx.font = "bold 50px 'Luckiest Guy'";
        this.ctx.textAlign = "center";
        this.ctx.fillText(`Time: ${victoryTime}`, this.ctx.canvas.width / 2, this.ctx.canvas.height * 0.7);

        this.drawSound();
    }

    // Helper to center
    drawCenter(img, w, h, yPercent) {
        this.ctx.drawImage(
            img,
            this.ctx.canvas.width / 2 - w / 2,
            this.ctx.canvas.height * yPercent,
            w,
            h
        );
    }
}

export default Ui;