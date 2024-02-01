export class GameLoop {
    constructor(gameUpdateFunction = () => {}) {
        this.gameUpdateFunction = gameUpdateFunction;
        this.lastTimestamp = 0;
        this.targetFps = 60;
        this.frameDuration = 1000 / this.targetFps;
        this.isStop = false;
        this.fps = 0;
        this.fpsHistory = [];

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
        this.calcFps(Math.round(10000 / elapsed));

        if (elapsed >= this.frameDuration) {
            this.lastTimestamp = timestamp - (elapsed % this.frameDuration);
            this.gameUpdateFunction();
        }

        if (this.isStop) {
            return;
        }
        requestAnimationFrame((timestamp) => this.gameLoop(timestamp));
    }

    calcFps(fps) {
        this.fpsHistory.push(fps);

        if (this.fpsHistory.length > 10) {
            this.fpsHistory.shift();
        }

        const sum = this.fpsHistory.reduce((total, fps) => total + fps, 0);
        const averageFps = Math.round(sum / this.fpsHistory.length);

        this.fps = averageFps;
    }
}

export class FpsDisplay {
    constructor(option) {
        const system = option.system;
        system.render.submit(this);
        this.drawer = system.drawer;

        this.gameLoop = option.gameLoop;

        this.visible = false;
    }

    draw() {
        if (this.visible) {
            this.drawer.text(`fps: ${this.gameLoop.fps}`, 40, 20, { color: "white", isUI: true });
        }
    }
}
