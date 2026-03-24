import Enemy from "./enemy.js";
import mangoArgs from "./items/mango.js";
import bulletArgs from "./items/bullet.js";
import savatteArgs from "./items/savatte.js";
import savattePickupArgs from "./items/savattePickup.js";
import Player from "./player.js";
import Spawner from "./spawner.js";
import SpriteLoader from "./spriteloader.js";
import Background from "./background.js";
import Ui from "./ui.js";

class Game extends EventTarget {
    constructor(ctx, width, height, ui) {
        super();

        this.ctx = ctx;
        this.width = width;
        this.height = height;
        this.ui = ui;

        // UI elements for screen menu, gameover and victory
        this.uiElement = {
            title: new Image(),
            tutorial: new Image(),
            start: new Image(),
            restart: new Image(),
            again: new Image(),
            gameover: new Image(),
            victory: new Image()
        };
        this.uiElement.title.src = "./assets/ui/title.png";
        this.uiElement.tutorial.src = "./assets/ui/tutorial.png";
        this.uiElement.start.src = "./assets/ui/start.png";
        this.uiElement.restart.src = "./assets/ui/restart.png";
        this.uiElement.again.src = "./assets/ui/again.png";
        this.uiElement.gameover.src = "./assets/ui/gameover.png";
        this.uiElement.victory.src = "./assets/ui/victory.png";

        this.background = new Background(this.ctx); // Backdrop
        this.victoryTime = null; // store score
        
        this.state = "menu";

        // Creating player and enemy
        this.player = new Player(this.ctx);
        this.playerHP = 5;

        this.enemy = new Enemy(
            this.ctx, 
            this.width * 0.85, 
            this.height / 2, 
            500, 
            500, 
            this.player
        );
        this.enemyHP = 5;

        // Creates a spawner for weapons
        savattePickupArgs.ctx = ctx;
        savattePickupArgs.target = this.player;
        savattePickupArgs.spriteLoader = new SpriteLoader(savattePickupArgs.spriteSrc, 1, 1);
        this.savatteSpawner = new Spawner(ctx, 120, savattePickupArgs);

        // Creating a spawner for health pickups
        mangoArgs.ctx = ctx;
        mangoArgs.target = this.player;
        mangoArgs.spriteLoader = new SpriteLoader(mangoArgs.spriteSrc, 1, 1);
        this.mangoSpawner = new Spawner(ctx, 300, mangoArgs);
        
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
            this.enemy.takeDamage();

            console.log("Poacher hit!", e.detail, "\nHP left:", this.enemyHP);

            // Enemy dies
            if (this.enemyHP <= 0) {
                setTimeout(() => {
                    this.state = "victory";
                    this.enemy.dead = true;
                    this.victoryTime = this.ui.getTimeString();
                }, 1000);
            }
        })
        
        // Player gets hit
        this.addEventListener(bulletArgs.event, (e) => {
            this.playerHP--;
            this.savatteCollected = false;
            this.player.takeDamage();

            console.log("Player hit!", e.detail, "\nHP left:", this.playerHP);

            // Player dies
            if (this.playerHP <= 0) {
                setTimeout(() => {
                    this.state = "gameover";
                    this.player.dead = true;
                }, 1000);
            }
        });

        // Player heals
        this.addEventListener(mangoArgs.event, (e) => {

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

        // Handle Enter key for state transitions
        if (this.state === "menu" && this.keys["Enter"]) {
            this.keys["Enter"] = false;
            this.state = "playing";
        } 
        else if ((this.state === "gameover" || this.state === "victory") && this.keys["Enter"]) {
            location.reload(); // Restart game
        }

        // ------------
        //   Gameloop
        // ------------
        if (this.state === "playing") {
            // Update systems
            this.savatteSpawner.update(this);
            this.mangoSpawner.update(this);
    
            // Update and draw every object in the game
            this.objects.forEach(obj => {
                obj.update(this);
                obj.draw();
            });
    
            // Removes used sprites (i.e. collectables)
            this.objects = this.objects.filter(o => !o.dead);
        }
    }

    start() {
        this.nextFrame();
    }

    // Helpers
    drawCenter(img, w, h, yPercent) {
        this.ctx.drawImage(
            img,
            this.width / 2 - w / 2,
            this.height * yPercent,
            w,
            h
        );
    }

    drawBlurBg() {
        const ctx = this.ctx;

        ctx.filter = "blur(6px)";
        ctx.drawImage(this.background.image, 0, 0, this.width, this.height);
        ctx.filter = "none";
    }

    // Shows menu
    drawMenu() {
        this.drawBlurBg();

        this.drawCenter(this.uiElement.title, 1000, 800, 0.01);
        this.drawCenter(this.uiElement.start, 500, 400, 0.4);
        this.drawCenter(this.uiElement.tutorial, 350, 350, 0.6);
    }

    // Shows game over
    drawGameOver() {
        this.drawBlurBg();

        this.drawCenter(this.uiElement.gameover, 1000, 800, 0.01);
        this.drawCenter(this.uiElement.restart, 500, 400, 0.4);
    }

    // Show victory screen
    drawVictory() {
        this.drawBlurBg();

        this.drawCenter(this.uiElement.victory, 1000, 800, 0.01);
        this.drawCenter(this.uiElement.again, 500, 400, 0.4);

        this.ctx.fillStyle = "yellow";
        this.ctx.font = "bold 50px 'Luckiest Guy'";
        this.ctx.textAlign = "center";

        this.ctx.fillText(
            "Time: " + this.victoryTime,
            this.width / 2,
            this.height * 0.7
        );
    }
}

export default Game;