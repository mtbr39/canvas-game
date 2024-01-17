export class GameLoop {
    constructor(gameUpdateFunction = () => {}) {
        this.gameUpdateFunction = gameUpdateFunction;
        this.lastTimestamp = 0;
        this.targetFps = 60;
        this.frameDuration = 1000 / this.targetFps;

        requestAnimationFrame((timestamp) => {
            this.lastTimestamp = timestamp;
            this.gameLoop(timestamp);
        });
    }

    gameLoop(timestamp) {
        const elapsed = timestamp - this.lastTimestamp;

        if (elapsed >= this.frameDuration) {
            this.lastTimestamp = timestamp - (elapsed % this.frameDuration);

            this.gameUpdateFunction();
        }

        requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
    }
}