import Game from "./game.js";
import Background from "./background.js";
import Ui from "./ui.js";

// Canvas setup
const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

function resizeWindow() {
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
}

window.addEventListener("resize", resizeWindow);
resizeWindow();

// Create objects
const background = new Background(ctx);
const ui = new Ui(ctx, canvas);
const game = new Game(ctx, canvas.width, canvas.height, ui);

// Loop background, game, ui
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (game.state === "menu") game.drawMenu();
    else if (game.state === "gameover") game.drawGameOver();
    else if (game.state === "victory") game.drawVictory();
    else if (game.state === "playing") {
        background.update();
        background.draw();

        ui.update(game);
        ui.draw();
    }

    game.nextFrame();

    requestAnimationFrame(animate);
}

animate();