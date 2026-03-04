// This is the project's entry point
// Script loaded with defer, so document body should be all set

const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

function resizeWindow() {
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
}

function nextFrame() {
    resizeWindow() // Could remove later on for optimization
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw code here
    ctx.fillStyle = "blue";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Gameplay loop implementation in here
function gameLoop() {
    
    // TODO: Menu screen
    // TODO: Intro cutscene
    // TODO: Actual gameplay loop
    // TODO: Final boss fight
    // TODO: Endgame

}

window.addEventListener("resize", resizeWindow);
nextFrame();