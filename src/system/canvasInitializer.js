export class CanvasInitializer {
    constructor(option) {
        this.canvas = option.canvas;
        this.ctx = this.canvas.getContext("2d");

        const canvasAreaRatio = 0.002;

        this.resizeCanvas();

        // this.canvasのピクセル面積に対して描写比率を決定
        this.gameToCanvasScale =
            Math.sqrt(this.canvas.width * this.canvas.height) * canvasAreaRatio;

        new StyleSetting();
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

class StyleSetting {
    constructor() {
        // CSSスタイルをオブジェクトとして定義
        const styles = {
            "*": {
                margin: 0,
                padding: 0,
                boxSizing: "border-box",
            },
            body: {
                overflow: "hidden",
            },
            canvas: {
                display: "block",
            },
        };

        this.applyStyles("*", styles["*"]);
        this.applyStyles("body", styles.body);
        this.applyStyles("canvas", styles.canvas);
    }

    // スタイルを適用する関数
    applyStyles(selector, properties) {
        const elements = document.querySelectorAll(selector);
        elements.forEach((element) => {
            Object.assign(element.style, properties);
        });
    }
}
