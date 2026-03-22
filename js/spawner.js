import Collectable from "./collectable.js";

class Spawner {
    constructor(ctx, baseInterval, collectableArgs) {
        this.ctx = ctx;
        this.baseInterval = baseInterval;
        this.collectableArgs = collectableArgs;
    }

    update(game) {
        const rndSpawn = this.baseInterval * Math.floor(Math.random() * 2); // Adds some randomness

         if (game.frameTimer % rndSpawn === 0) {
            const x = game.width + 100; // Starts offscreen
            let y = Math.random() * ((game.height * 0.8) - this.collectableArgs.height) + this.collectableArgs.height / 2;

            // Clamp to region
            y = Math.min(
                Math.max(game.height * 0.2, y), 
                (game.height * 0.8 ) - this.collectableArgs.height / 2
            );

            this.collectableArgs.x = x;
            this.collectableArgs.y = y;

            const collectable = new Collectable(this.collectableArgs);
            game.objects.push(collectable);
            
            // NOTE: Other objects have event listeners to handle
            //       collection logic, typically orchestrated by Game
        }
    }
}

export default Spawner;