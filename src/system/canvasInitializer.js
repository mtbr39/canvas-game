export class CanvasInitializer {
    constructor(option) {
        this.canvas = option.canvas;
        this.ctx = this.canvas.getContext("2d");

        const canvasAreaRatio = 0.002;

        this.resizeCanvas();

        // this.canvasのピクセル面積に対して描写比率を決定
        this.gameToCanvasScale =
            Math.sqrt(this.canvas.width * this.canvas.height) * canvasAreaRatio;

        this.styleSetting = new StyleSetting();
        
        // ウィンドウサイズ変更時にresizeCanvasを呼び出す
        window.addEventListener('resize', () => this.resizeCanvas());
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
                background: "#002451", 
                // overflow: "hidden",
            },
            canvas: {
                display: "block",
            },
        };

        this.apply("*", styles["*"]);
        this.apply("body", styles.body);
        this.apply("canvas", styles.canvas);
    }

    // スタイルを適用する関数
    apply(selector, properties) {
        const elements = document.querySelectorAll(selector);
        elements.forEach((element) => {
            Object.assign(element.style, properties);
        });
    }
}
