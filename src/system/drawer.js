export class Drawer {
    constructor(option) {
        this.ctx = option.ctx;
        this.scale = option.scale || 1;
        this.camera = {position: {x: 0, y: 0}, zoom: 1}

        this.gameSize = {
            width: this.ctx.canvas.width / this.scale,
            height: this.ctx.canvas.height / this.scale,
        };

        this.scaler = () => {
            let scale = this.scale;

            return {
                point: (point) => {
                    return {
                        x: (point.x - this.camera.position.x) * scale * this.camera.zoom,
                        y: (point.y - this.camera.position.y) * scale * this.camera.zoom,
                    };
                },
                position: (x, y) => {
                    return [
                        (x - this.camera.position.x) * scale * this.camera.zoom,
                        (y - this.camera.position.y) * scale * this.camera.zoom,
                    ];
                },
                value: (value) => {
                    return value * scale * this.camera.zoom;
                },
                array: (array) => {
                    return array.map((value) => value * scale);
                },
                inverseArray: (array) => {
                    return array.map((value) => value / scale);
                }
            };
        };
    }

    rect(_x, _y, _w, _h, option = {}) {
        let [x, y] = this.scaler().position(_x, _y);
        let w = this.scaler().value(_w);
        let h = this.scaler().value(_h);
        const isFill = option.isFill || false;
        const color = option.color || "gray";
        if (isFill) {
            this.ctx.fillStyle = color;
            this.ctx.fillRect(x, y, w, h);
        } else {
            this.ctx.strokeStyle = color;
            this.ctx.strokeRect(x, y, w, h);
        }
    }

    circle(_x, _y, _radius, option = {}) {
        const [x, y] = this.scaler().position(_x, _y);
        const radius = this.scaler().value(_radius);
        const isFill = option.isFill || false;
        const color = option.color || "gray";
        const alpha = option.alpha !== undefined ? option.alpha : 1.0;
    
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, Math.PI * 2);
    
        if (isFill) {
            this.ctx.fillStyle = color;
            this.ctx.globalAlpha = alpha;
            this.ctx.fill();
        } else {
            this.ctx.strokeStyle = color;
            this.ctx.globalAlpha = alpha;
            this.ctx.stroke();
        }
    
        this.ctx.globalAlpha = 1.0; // 描画後に透明度を元に戻す
        this.ctx.closePath();
    }

    line(_startX, _startY, _endX, _endY, lineWidth = 1) {
        const [startX, startY, endX, endY] = this.scaler.array([_startX, _startY, _endX, _endY]);
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.moveTo(startX, startY);
        this.ctx.lineTo(endX, endY);
        this.ctx.stroke();
    }

    text(_text, _color, _positionX, _positionY, _fontSize = "12px", _fontFamily = "Serif") {
        const [positionX, positionY] = this.scaler.array([_positionX, _positionY]); // 座標をスケール
        this.ctx.fillStyle = _color; // テキストカラーを引数で指定
        this.ctx.font = _fontSize + " " + _fontFamily; // フォントとサイズを引数で指定
        this.ctx.textAlign = "center";
        this.ctx.fillText(_text, positionX, positionY);
    }
}
