import Enemy from "./enemy.js";
import mangoArgs from "./items/mango.js";
import bulletArgs from "./items/bullet.js";
import savatteArgs from "./items/savatte.js";
import savattePickupArgs from "./items/savattePickup.js";
import Player from "./player.js";
import Spawner from "./spawner.js";
import SpriteLoader from "./spriteloader.js";
import Background from "./background.js";
import Music from "./music.js";
import Ui from "./ui.js";

class Game extends EventTarget {
    constructor(ctx, width, height) {
        super();

        this.ctx = ctx;
        this.width = width;
        this.height = height;

        // Background
        this.background = new Background(this.ctx); // Backdrop
        this.victoryTime = null; // store score
        this.state = "menu";

        // Background music
        this.music = new Music();
        this.music.play(); // Start music by default

        // Create UI
        this.ui = new Ui(this.ctx, this);

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
        this.objects = []; // Collectibles

        this.score = 0;
        this.savatteCollected = false;

        // Handle player input
        this.keys = {};
        window.addEventListener("keydown", e => {
            this.keys[e.code] = true;
            // Press 'm' to mute/play music
            if (e.code === "KeyM") { this.music.pressMute(); }
        });
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
                }, 575);
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
                }, 250);
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
            
            this.ui.startTime = Date.now(); // Syncs up clock to when game is started
        } 

        // Restart game
        else if ((this.state === "gameover" || this.state === "victory") && this.keys["Enter"]) {
            this.ui.startTime = Date.now();
            
            // Resets player, enemy and collectibles
            this.player.dead = false;
            this.playerHP = 5;
            this.player.x = 200;
            this.player.y = 200;

            this.enemy.dead = false;
            this.enemyHP = 5;
            this.enemy.x = this.width * 0.85;
            this.enemy.y = this.height / 2

            this.objects = [];
            this.state = "playing"; // Restarts
        }

        // ------------
        //   Gameloop
        // ------------
        if (this.state === "playing") {
            // Update background
            this.background.update();
            this.background.draw();

            // Update systems
            this.savatteSpawner.update(this);
            this.mangoSpawner.update(this);

            this.player.update(this);
            this.player.draw();

            this.enemy.update(this);
            this.enemy.draw();
    
            // Update and draw every object in the game
            this.objects.forEach(obj => {
                obj.update(this);
                obj.draw();
            });
    
            // Removes used sprites (i.e. collectables)
            this.objects = this.objects.filter(o => !o.dead);

            // Draw HUD
            this.ui.draw();
        } 

        // Draw UI for each game state
        else if (this.state === "menu") {
            this.ui.drawMenu();
        }  else if (this.state === "gameover") {
            this.ui.drawGameOver();
            
            // Reset animations
            this.player.animations["fly"].reset();
            this.player.animations["shoot"].reset();
            this.player.animations["hurt"].reset();

            this.enemy.animations["idle"].reset();
            this.enemy.animations["shoot"].reset();
            this.enemy.animations["hurt"].reset();

        } else if (this.state === "victory") {
            this.ui.drawVictory(this.victoryTime);

            // Reset animations
            this.player.animations["fly"].reset();
            this.player.animations["shoot"].reset();
            this.player.animations["hurt"].reset();

            this.enemy.animations["idle"].reset();
            this.enemy.animations["shoot"].reset();
            this.enemy.animations["hurt"].reset();
        }
    }

    start() {
        this.nextFrame();
    }
}

export default Game;