import savatteArgs from "./items/savatte.js";
import Projectile from "./projectile.js";
import SpriteLoader from "./spriteloader.js";

class Player {
    constructor(ctx) {
        this.ctx = ctx;

        this.x = 100;
        this.y = 250;
        this.width  = 200;
        this.height = 200;
        this.dead = false;

        this.spdY = 0;
        this.gravity = 0.5;
        this.flapPower = -8;

        // Animation logic
        this.animations = {
            fly: new SpriteLoader("./assets/parakeet_fly.png", 5, 5),
            shoot: new SpriteLoader("./assets/parakeet_attack.png", 5, 5),
            hurt: new SpriteLoader("./assets/parakeet_damage.png", 5, 5)
        };

        this.currentAnimation = "fly"; 
        this.frameRate = 4;
        this.frameCounter = 0;

        this.framesSinceHurt = 0;
    }

    // Update player
    update(game) {
        this.spdY += this.gravity;
        this.y += this.spdY;

        // Set boundaries
        this.y = Math.min(
            Math.max(this.height / 2, this.y),
            (game.height) - this.height / 2
        );

        // Visuals logic
        if (game.savatteCollected) {
            this.currentAnimation = "shoot";
        }

        if (this.currentAnimation == "hurt") {
            this.framesSinceHurt++;

            if (this.framesSinceHurt == 24) {
                this.framesSinceHurt = 0;
                this.currentAnimation = "fly"; // Loses savatte
            }
        }

        // Jump
        if (game.keys["Space"]) {
            this.spdY = this.flapPower;
        }

        // Avoy savatte
        if (game.keys["KeyF"] && game.savatteCollected) {
            game.keys["KeyF"] = false;
            game.savatteCollected = false;

            this.shoot(game);
            this.currentAnimation = "fly"; // Reset animation
        }
    }

    // Draw player
    draw() {
        this.frameCounter++;
        if (this.frameCounter >= this.frameRate) {
            this.frameCounter = 0;
            this.currentFrame = this.animations[this.currentAnimation].next();
        }

        if (!this.currentFrame) return;

        this.ctx.drawImage(
            this.animations[this.currentAnimation].image,
            this.currentFrame.sx,
            this.currentFrame.sy,
            this.currentFrame.sw,
            this.currentFrame.sh,
            this.x - this.width / 2,
            this.y - this.height / 2,
            this.width,
            this.height
        );
    }

    // Shoots a savatte dodo after obtaining the collectable first
    shoot(game) {

        // Filling in missing values
        savatteArgs.ctx = this.ctx;
        savatteArgs.x = this.x;
        savatteArgs.y = this.y;
        savatteArgs.target = game.enemy;

        // Animation for the savatte
        savatteArgs.spriteLoader = new SpriteLoader(savatteArgs.spriteSrc, 3, 3);
        const savatte = new Projectile(savatteArgs);

        // bullet.addEventListener("hit", e => {
        //     game.dispatchEvent(new CustomEvent("enemyHit", { detail: e.detail }));
        // });

        game.objects.push(savatte);
    }

    // Invoked by Game when player gets hit
    takeDamage() {
        this.currentAnimation = "hurt";
    }
}

export default Player;