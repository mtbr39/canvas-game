export class GameLoop {
    constructor(gameUpdateFunction = () => {}) {
        this.gameUpdateFunction = gameUpdateFunction;
        this.lastTimestamp = 0;
        this.targetFps = 60;
        this.frameDuration = 1000 / this.targetFps;
        this.isStop = false;

        requestAnimationFrame((timestamp) => {
            this.lastTimestamp = timestamp;
            this.gameLoop(timestamp);
        });
    }

    stop() {
        this.isStop = true;
    }

    gameLoop(timestamp) {
        const elapsed = timestamp - this.lastTimestamp;

        if (elapsed >= this.frameDuration) {
            this.lastTimestamp = timestamp - (elapsed % this.frameDuration);

            this.gameUpdateFunction();
        }

        if (this.isStop) {
            return;
        }
        requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
    }
}