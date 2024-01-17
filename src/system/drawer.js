export class Drawer {
    constructor(option) {
        this.ctx = option.ctx;
        this.scale = option.scale || 1;
        
        this.gameSize = {width: this.ctx.canvas.width / this.scale, height: this.ctx.canvas.height / this.scale};

        this.scaler = () => {
            let scale = this.scale;
            let gameSize = {};
    
            return {
                      point: (point) => {
            return {
              x: point.x * scale,
              y: point.y * scale,
            };
          },
          value: (value) => {
            return value * scale;
          },
          array: (array) => {
              return array.map(value => value * scale);
          },
          array2: (array) => {
              const adjustedScale = scale * 1.05; // 0.000001など微小な調整値を加える
              return array.map(value => value * adjustedScale);
          },
          setScale: (newScale) => {
            scale = newScale;
          },
          setGameSize: (newGameSize) => {
              gameSize = newGameSize;
          },
          getScale: () => {
            return scale;
          }
            };
        };
    }



    rect(_x, _y, _w, _h, option={}) {
        let [x, y, w, h] = this.scaler().array([_x, _y, _w, _h]);
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

    circle(_x, _y, _radius, option={}) {
        const [x, y] = this.scaler().array([_x, _y]);
        const radius = this.scaler().value(_radius);
        const isFill = option.isFill || false;
        const color = option.color || "gray";

        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, Math.PI * 2); // 円を描画するパスを設定

        if (isFill) {
            this.ctx.fillStyle = color;
            this.ctx.fill();
        } else {
            this.ctx.strokeStyle = color;
            this.ctx.stroke();
        }
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
