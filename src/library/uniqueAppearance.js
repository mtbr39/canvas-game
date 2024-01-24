import { Angle } from "./angle";

export class UniqueAppearance {
    constructor(option = {}) {
        this.renderSystem = option.renderSystem;
        this.renderSystem.submit(this);

        this.gameObject = option.gameObject;
        this.drawer = option.drawer;

        this.shapeColor = option.shapeColor || "#A9DAFF";

        this.symmetryStyle = option.decoInfo.symmetryStyle;
        this.decorationValues = option.decoInfo.decorationValues; //shape, offset, size(width, height), angle

        const decoLength = this.decorationValues.length;
        this.pastFlameUnit = 15;
        this.pastArrayLength = this.pastFlameUnit * decoLength;
        this.pastDirections = Array(this.pastArrayLength).fill(this.gameObject.direction);
        

        this.eyeSize = 0.08;
        this.eyeDistance = 0.3; //中心からの目の距離
        this.eyeGap = 0.2 * Math.PI; //目同士の距離
        this.eyeColor = "#002451";
    }

    draw() {
        const g = this.gameObject;

        // pastDirectionsに現在の方向を追加
        this.pastDirections.push(this.gameObject.direction);
        // 過去の方向が3回分を超えたら最古のものを削除
        if (this.pastDirections.length >= this.pastArrayLength) {
            this.pastDirections.shift();
        }

        // this.drawer.rect(g.x, g.y, g.width, g.height, { color: this.shapeColor });
        this.drawer.circle(g.x + g.width / 2, g.y + g.width / 2, 0.8* (g.width) / 2, { color: this.shapeColor, lineWidth: 2 });

        const center = { x: g.x + g.width * 0.5, y: g.y + g.height * 0.5 };

        const rightEyePosition = this.rotatePointAroundCenter(center, g.width * this.eyeDistance, g.direction + this.eyeGap);
        const leftEyePosition = this.rotatePointAroundCenter(center, g.width * this.eyeDistance, g.direction - this.eyeGap);

        this.decorationValues.forEach((deco, index) => {
            for (let i = 0; i <= this.symmetryStyle; i++) {
                let position = { x: 0, y: 0 };
                let decoAngle = 0;
                let drawDirection = this.pastDirections[index * this.pastFlameUnit];
                if (this.symmetryStyle === 0) {
                    decoAngle = drawDirection + Math.PI;
                } else if (this.symmetryStyle === 1) {
                    if (i == 0) {
                        decoAngle = drawDirection + deco.angle;
                    } else {
                        decoAngle = drawDirection - deco.angle;
                    }
                } else if (this.symmetryStyle === 2) {
                    if (i == 0) {
                        decoAngle = drawDirection + deco.angle;
                    } else if (i == 1) {
                        decoAngle = drawDirection + Math.PI;
                    } else {
                        decoAngle = drawDirection - deco.angle;
                    }
                }
                position = this.rotatePointAroundCenter(center, deco.offset * g.width * 0.05, decoAngle);

                if (deco.shape === "rect") {
                    this.drawer.rect(position.x, position.y, deco.size.width * g.width * 0.05, deco.size.height * g.width * 0.05, { color: this.shapeColor });
                } else if (deco.shape === "circle") {
                    this.drawer.circle(position.x, position.y, deco.size.width * g.width * 0.05, { color: this.shapeColor, isFill: true, alpha: 0.5 });
                }
            }
        });

        // 目を描写
        this.drawer.circle(rightEyePosition.x, rightEyePosition.y, g.width * this.eyeSize, { color: this.eyeColor, isFill: true, alpha: 0.5 });
        this.drawer.circle(leftEyePosition.x, leftEyePosition.y, g.width * this.eyeSize, { color: this.eyeColor, isFill: true, alpha: 0.5 });
        this.drawer.circle(rightEyePosition.x, rightEyePosition.y, g.width * this.eyeSize, { color: this.shapeColor, isFill: false });
        this.drawer.circle(leftEyePosition.x, leftEyePosition.y, g.width * this.eyeSize, { color: this.shapeColor, isFill: false });
    }

    rotatePointFromCurrent(current, center, angle) {
        // 現在の点と中心の相対座標を計算
        const relativeX = current.x - center.x;
        const relativeY = current.y - center.y;

        // 相対座標を指定された角度だけ回転
        const rotatedX = relativeX * Math.cos(angle) - relativeY * Math.sin(angle);
        const rotatedY = relativeX * Math.sin(angle) + relativeY * Math.cos(angle);

        // 回転後の座標に中心座標を加えて結果を返す
        const resultX = rotatedX + center.x;
        const resultY = rotatedY + center.y;

        return { x: resultX, y: resultY };
    }

    rotatePointAroundCenter(center, radius, angle) {
        // 相対座標を指定された角度だけ回転
        const rotatedX = radius * Math.cos(angle);
        const rotatedY = radius * Math.sin(angle);

        // 回転後の座標に中心座標を加えて結果を返す
        const resultX = rotatedX + center.x;
        const resultY = rotatedY + center.y;

        return { x: resultX, y: resultY };
    }

    static generateDecoInfo() {
        const randomSymmetryStyle = Math.floor(Math.random() * 3);
        const decorationValues = [];
        const decorationLength = 1 + Math.floor(Math.random() * 3);
        for (let i = 1; i < 1 + decorationLength; i++) {
            decorationValues.push(UniqueAppearance.generateDecoration());
        }
        return {
            symmetryStyle: randomSymmetryStyle,
            decorationValues: decorationValues,
        }
    }

    static generateDecoration() {
        // const shapes = ["circle", "rect"];
        const shapes = ["circle"];
        const randomShape = shapes[Math.floor(Math.random() * shapes.length)];

        const randomOffset = 3 + Math.random() * 15;
        const randomSize = { width: 2 + 8 * Math.random(), height: 1 + 10 * Math.random() };

        const randomAngle = Math.random() * 2 * Math.PI;

        return { shape: randomShape, offset: randomOffset, size: randomSize, angle: randomAngle };
    }
}
