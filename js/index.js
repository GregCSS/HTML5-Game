// This is the project's entry point
// Script loaded with defer, so document body should be all set

import Player from "./player.js";

// ----------------
//   Canvas Stuff
// ----------------

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

function resizeWindow() {
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
}

function nextFrame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw code here
    ctx.fillStyle = "blue";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// --------------
//   Game Stuff
// --------------

const player = new Player();

// Catch keys
var keys = {};
window.addEventListener("keydown", e => keys[e.key] = true);
window.addEventListener("keyup", e => keys[e.key] = false); // Unset keys

// Gameplay loop implementation in here
function gameLoop() {
    player.update(keys);
    
    // TODO: Intro cutscene
    // TODO: Actual gameplay loop
    // TODO: Final boss fight
    // TODO: Endgame

    requestAnimationFrame(gameLoop);
}

window.addEventListener("resize", resizeWindow);
resizeWindow(); // Initial resize
nextFrame();

gameLoop();