class Background {
    constructor(ctx) {
        this.ctx = ctx;
        this.image = new Image();
        this.image.src = "./assets/background.png";

        this.x = 0;          // scroll position
        this.speed = 2;      // scroll speed
    }

    update() {
        this.x -= this.speed;
        if (this.x <= -window.innerWidth) this.x = 0;
    }

    draw() {
        const w = window.innerWidth;
        const h = window.innerHeight;

        // Draw scrolling background twice for seamless effect
        if (this.image.complete) {
            this.ctx.drawImage(this.image, this.x, 0, w, h);
            this.ctx.drawImage(this.image, this.x + w, 0, w, h);
        }
    }
}

export default Background;