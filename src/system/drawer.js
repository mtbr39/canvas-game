export class Drawer {
    constructor(option) {
        this.ctx = option.ctx;
        this.scale = option.scale || 1;
        this.camera = { position: { x: 0, y: 0 }, zoom: 1 };

        this.gameSize = {
            width: this.ctx.canvas.width / this.scale,
            height: this.ctx.canvas.height / this.scale,
        };

        this.images = {};

        this.ctx.imageSmoothingEnabled = false;

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
                        x: point.x / (scale * this.camera.zoom) + this.camera.position.x,
                        y: point.y / (scale * this.camera.zoom) + this.camera.position.y,
                    };
                },
                inversePosition: (x, y) => {
                    return [
                        x / (scale * this.camera.zoom) + this.camera.position.x,
                        y / (scale * this.camera.zoom) + this.camera.position.y,
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
                },
            };
        };
    }

    initialLoadImages(assets) {
        const loadRecursive = (images, prefix = "") => {
            for (const key in images) {
                if (typeof images[key] === "object") {
                    loadRecursive(images[key], prefix + key);
                } else {
                    this.loadImage(prefix + key, images[key]);
                }
            }
        };

        loadRecursive(assets.images);
    }

    rect(_x, _y, _w, _h, option = {}) {
        let [x, y] = this.scaler().position(_x, _y);
        let w = this.scaler().value(_w);
        let h = this.scaler().value(_h);
        
        let offsetX = option.offsetX || 0;
        let offsetY = option.offsetY || 0;        
        [offsetX, offsetY] = this.scaler().array([offsetX, offsetY]);

        if (option.isSizeFix) {
            [w, h] = this.scaler().array([_w, _h]);
        }
        if (option.isUI) {
            [x, y, w, h] = this.scaler().array([_x, _y, _w, _h]);
        }
        const isFill = option.isFill || false;
        const color = option.color || "gray";
        const lineWidth = option.lineWidth !== undefined ? option.lineWidth : 1;

        this.ctx.lineWidth = lineWidth;
        if (isFill) {
            this.ctx.fillStyle = color;
            this.ctx.fillRect(x+offsetX, y+offsetY, w, h);
        } else {
            this.ctx.strokeStyle = color;
            this.ctx.strokeRect(x+offsetX, y+offsetY, w, h);
        }
    }

    circle(_x, _y, _radius, option = {}) {
        let [x, y] = this.scaler().position(_x, _y);
        let radius = this.scaler().value(_radius);
        const isFill = option.isFill || false;
        const color = option.color || "gray";
        const alpha = option.alpha !== undefined ? option.alpha : 1.0;
        const lineWidth = option.lineWidth !== undefined ? option.lineWidth : 1;
        const gradientColor = option.gradientColor;

        if (option.isSizeFix) {
            [radius] = this.scaler().array([_radius]);
        }
        if (option.isUI) {
            [x, y, radius] = this.scaler().array([_x, _y, _radius]);
        }
        
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, Math.PI * 2);
        this.ctx.lineWidth = lineWidth;

        if (isFill || gradientColor) {
            this.ctx.fillStyle = color;
            if (gradientColor) this.setFillStyleGradient(x, y, radius, gradientColor); 
            this.ctx.globalAlpha = alpha;
            this.ctx.fill();
        } else {
            this.ctx.strokeStyle = color;
            this.ctx.globalAlpha = alpha;
            this.ctx.stroke();
        }

        this.initStyle();
        this.ctx.lineWidth = 1;
        this.ctx.closePath();
    }

    setFillStyleGradient(_x, _y, _width, color = { r: 255, g: 255, b: 255 }) {
        const gradient = this.ctx.createRadialGradient(_x, _y, 0, _x, _y, _width);
        gradient.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, 0.7)`);
        gradient.addColorStop(1, `rgba(${color.r}, ${color.g}, ${color.b}, 0)`);

        this.ctx.fillStyle = gradient;
    }

    line(_startX, _startY, _endX, _endY, option = {}) {
        const [startX, startY] = this.scaler().position(_startX, _startY);
        const [endX, endY] = this.scaler().position(_endX, _endY);
        const color = option.color || "gray";
        this.ctx.strokeStyle = color;
        this.ctx.fillStyle = color;
    
        this.ctx.lineWidth = option.lineWidth ? this.scaler().value(option.lineWidth) : 1;
        this.ctx.beginPath();
        this.ctx.moveTo(startX, startY);
        this.ctx.lineTo(endX, endY);
        this.ctx.stroke();

        // 線の両端を丸くするオプションが有効な場合
        if (option.rounded) {
            this.ctx.beginPath();
            // 線の幅の半分を半径として円を描画
            const radius = this.ctx.lineWidth / 2;
            this.ctx.arc(startX, startY, radius, 0, Math.PI * 2);
            this.ctx.arc(endX, endY, radius, 0, Math.PI * 2);
            this.ctx.fill();
        }

        this.initStyle();
    }

    text(_text, _positionX, _positionY, option = {}) {
        const color = option.color || "gray";
        const scalable = option.scalable || false;
        let fontSize = option.fontSize || 12;
        const fontFamily = option.fontFamily || "Serif";
        const isUI = option.isUI;
        const alpha = option.alpha !== undefined ? option.alpha : 1.0;
        const textAlign = option.textAlign || "center";
        const lineHeight = 1.5;

        if (scalable) {
            fontSize = this.scaler().value(fontSize);
        } else {
            fontSize = fontSize * this.scale;
        }
        
        const fontSizeString = fontSize + "px";

        let [positionX, positionY] = this.scaler().position(_positionX, _positionY);
        if (isUI) {
            [positionX, positionY] = this.scaler().array([_positionX, _positionY]);
        }
        positionY -= fontSize / 2;

        this.ctx.globalAlpha = alpha;
        this.ctx.fillStyle = color;
        this.ctx.font = fontSizeString + " " + fontFamily;
        this.ctx.textAlign = textAlign;
        // this.ctx.fillText(_text, positionX, positionY);

        const textLines = String(_text).split("\n"); // 改行ごとにテキストを分割

        textLines.forEach((line, index) => {
            const yPos = positionY + index * fontSize * lineHeight;
            this.ctx.fillText(line, positionX, yPos);
        });

        this.ctx.textBaseline = "top";

        this.initStyle();
    }

    loadImage(name, path) {
        const img = new Image();
        img.src = path;
        img.onload = () => {
            this.images[name] = img; // 画像を格納
        };
    }

    image(name, _x, _y, option = {}) {
        const isflipX = option.isflipX || false;
        let [x, y] = this.scaler().position(_x, _y);
        const img = this.images[name];

        this.ctx.globalAlpha = option.alpha !== undefined ? option.alpha : 1.0;

        if (img) {
            let width = option.width;
            let height = option.height;

            if (option.isUI) {
                [x, y, width, height] = this.scaler().array([_x, _y, width, height]);
            } else {
                width = this.scaler().value(width);
                height = this.scaler().value(height);
            }

            if (width && !height) {
                const aspectRatio = img.width / img.height;
                height = width / aspectRatio;
            } else if (!width && height) {
                const aspectRatio = img.width / img.height;
                width = height * aspectRatio;
            } else if (!width && !height) {
                width = img.width;
                height = img.height;
            }

            if (isflipX) {
                this.ctx.save(); // 現在の状態を保存

                // x 軸方向に反転するために座標系を変更
                this.ctx.translate(x + width, y);
                this.ctx.scale(-1, 1);

                // 左右反転して描画
                this.ctx.drawImage(img, 0, 0, width, height);

                this.ctx.restore(); // 保存した状態に戻す
            } else {
                // 左右反転が不要な場合は通常通り描画
                this.ctx.drawImage(img, x, y, width, height);
            }
        }
        this.initStyle();
        
    }

    initStyle() {
        this.removeShadow();
        this.ctx.globalAlpha = 1.0;
    }

    setShadow(x,y,blur=4,rgba="rgba(0, 0, 0, 0.5)") {
        // 影を設定する
        this.ctx.shadowOffsetX = x;
        this.ctx.shadowOffsetY = y;
        this.ctx.shadowBlur = blur;
        this.ctx.shadowColor = rgba;
    }

    removeShadow() {
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 0;
        this.ctx.shadowBlur = 0;
        this.ctx.shadowColor = 'rgba(0, 0, 0, 0)';
    }
}
