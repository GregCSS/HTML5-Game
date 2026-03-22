import Enemy from "./enemy.js";
import acornArgs from "./items/acorn.js";
import bulletArgs from "./items/bullet.js";
import savatteArgs from "./items/savatte.js";
import savattePickupArgs from "./items/savattePickup.js";
import Player from "./player.js";
import Spawner from "./spawner.js";
import SpriteLoader from "./spriteloader.js";

class Game extends EventTarget {
    constructor(ctx, width, height) {
        super();

        this.ctx = ctx;
        this.width = width;
        this.height = height;        

        // Creating player and enemy
        this.player = new Player(this.ctx);
        this.playerHP = 5;

        this.enemy = new Enemy(this.ctx, this.width - 100, this.height / 2, 200, 200, this.player);
        this.enemyHP = 5;

        // Creates a spawner for weapons
        savattePickupArgs.ctx = ctx;
        savattePickupArgs.target = this.player;
        savattePickupArgs.spriteLoader = new SpriteLoader(savattePickupArgs.spriteSrc, 1, 1);
        this.savatteSpawner = new Spawner(ctx, 120, savattePickupArgs);

        // Creating a spawner for health pickups
        acornArgs.ctx = ctx;
        acornArgs.target = this.player;
        acornArgs.spriteLoader = new SpriteLoader(acornArgs.spriteSrc, 1, 1);
        this.acornSpawner = new Spawner(ctx, 300, acornArgs);
        
        // Game logic
        this.frameTimer = -1;
        this.objects = [this.player, this.enemy]; // Player and collectibles

        this.score = 0;
        this.savatteCollected = false;

        // Handle player input
        this.keys = {};
        window.addEventListener("keydown", e => this.keys[e.code] = true);
        window.addEventListener("keyup", e => this.keys[e.code] = false);

        // Adding handlers

        // Pick up savatte
        this.addEventListener(savattePickupArgs.event, (e) => {

            // Doesn't collect savatte if already has one
            const src = e.detail.src;
            if (this.savatteCollected) {
                src.dead = false;
                return;
            };
            
            this.savatteCollected = true;
            console.log("Collected Savatte!");
        });
        
        // Hitting the poacher
        this.addEventListener(savatteArgs.event, (e) => {
            this.enemyHP--;

            console.log("Poacher hit!", e.detail, "\nHP left:", this.enemyHP);
        })
        
        // Player gets hit
        this.addEventListener(bulletArgs.event, (e) => {
            this.playerHP--;
            this.savatteCollected = false;
            this.player.takeDamage();

            console.log("Player hit!", e.detail, "\nHP left:", this.playerHP);
        });

        // Player heals
        this.addEventListener(acornArgs.event, (e) => {

            // Doesn't pickup if health is full
            const src = e.detail.src;
            if (this.playerHP >= 5) {
                src.dead = false;
                return;
            };
            
            this.playerHP++;
            console.log("Player heals!", e.detail, "\nHP left:", this.playerHP);
        });
    }

    // Runs every animation frame
    nextFrame = () => {
        this.frameTimer += 1;
        this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

        // Update systems
        this.savatteSpawner.update(this);
        this.acornSpawner.update(this);

        // Update and draw every object in the game
        this.objects.forEach(obj => {
            obj.update(this);
            obj.draw();
        });

        // Removes used sprites (i.e. collectables)
        if (this.objects[0].dead) {
            // Show game over
        }

        this.objects = this.objects.filter(o => !o.dead);
        requestAnimationFrame(this.nextFrame);
    }

    // Starts the game
    start() {
        this.nextFrame();
    }
}

export default Game;