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
                inversePoint: (point) => {
                    return {
                        x: (point.x / (scale * this.camera.zoom)) + this.camera.position.x,
                        y: (point.y / (scale * this.camera.zoom)) + this.camera.position.y,
                    };
                },
                inversePosition: (x, y) => {
                    return [
                        (x / (scale * this.camera.zoom)) + this.camera.position.x,
                        (y / (scale * this.camera.zoom)) + this.camera.position.y,
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
        const lineWidth = option.lineWidth !== undefined ? option.lineWidth : 1;
    
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, Math.PI * 2);
        this.ctx.lineWidth = lineWidth;
    
        if (isFill) {
            this.ctx.fillStyle = color;
            this.ctx.globalAlpha = alpha;
            this.ctx.fill();
        } else {
            this.ctx.strokeStyle = color;
            this.ctx.globalAlpha = alpha;
            this.ctx.stroke();
        }
    
        this.ctx.globalAlpha = 1.0;
        this.ctx.lineWidth = 1;
        this.ctx.closePath();
    }
    

    line(_startX, _startY, _endX, _endY, lineWidth = 1) {
        const [startX, startY] = this.scaler().position(_startX, _startY);
        const [endX, endY] = this.scaler().position(_endX, _endY);
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.moveTo(startX, startY);
        this.ctx.lineTo(endX, endY);
        this.ctx.stroke();
    }

    text(_text, _positionX, _positionY, option={}) {
        const color = option.color || "black";
        const scalable = option.scalable || false;
        let fontSize = option.fontSize || 16;
        if (scalable) fontSize = this.scaler().value(fontSize);
        const fontSizeString = fontSize + "px";
        const fontFamily = option.fontFamily || "Serif";
        const [positionX, positionY] = this.scaler().position(_positionX, _positionY);
        const alpha = option.alpha !== undefined ? option.alpha : 1.0;
        
        this.ctx.globalAlpha = alpha;
        this.ctx.fillStyle = color;
        this.ctx.font = fontSizeString + " " + fontFamily;
        this.ctx.textAlign = "center";
        this.ctx.fillText(_text, positionX, positionY);

        this.ctx.globalAlpha = 1.0;
    }
}
