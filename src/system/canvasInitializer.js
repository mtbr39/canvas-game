export class CanvasInitializer {
    constructor(option) {
        this.canvas = option.canvas;
        this.ctx = this.canvas.getContext("2d");

        const canvasAreaRatio = 0.001 * 2.0;
        
        this.resizeCanvas();
        
        this.gameToCanvasScale = Math.sqrt(this.canvas.width * this.canvas.height) * canvasAreaRatio; // this.canvasのピクセル面積に対して描写比率を決定

    }

    resizeCanvas() {
        let cssCanvasSize = {
            width: document.documentElement.clientWidth,
            height: document.documentElement.clientHeight,
        };
        let pixelRatioCanvasSize = {
            width: cssCanvasSize.width * window.devicePixelRatio,
            height: cssCanvasSize.height * window.devicePixelRatio,
        };

        this.canvas.style.width = `${cssCanvasSize.width}px`;
        this.canvas.style.height = `${cssCanvasSize.height}px`;
        this.canvas.width = pixelRatioCanvasSize.width;
        this.canvas.height = pixelRatioCanvasSize.height;
    }
}
