import savatteArgs from "./items/savatte.js";
import Projectile from "./projectile.js";
import SpriteLoader from "./spriteloader.js";

class Player {
    constructor(ctx) {
        this.ctx = ctx;

        this.x = 200;
        this.y = 200;
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

        // Set upper boundaries
        this.y = Math.min(
            Math.max(this.height / 2, this.y),
            game.height - this.height / 2
        );

        // Visuals logic
        if (game.savatteCollected) {
            this.currentAnimation = "shoot";
        }

        if (this.currentAnimation == "hurt") {
            this.framesSinceHurt++;

            if (this.framesSinceHurt == 50) {
                this.framesSinceHurt = 0;
                this.animations["hurt"].reset();
                this.currentAnimation = "fly"; // Loses savatte
            }
        }

        // Flap
        if (game.keys["Space"]) {
            this.spdY = this.flapPower;
        }

        // Avoy savatte
        if (game.keys["Enter"] && game.savatteCollected) {
            game.keys["Enter"] = false;
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

        game.objects.push(savatte);
    }

    // Invoked by Game when player gets hit
    takeDamage() {
        this.currentAnimation = "hurt";
    }
}

export default Player;