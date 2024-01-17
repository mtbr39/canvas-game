export class UniqueAppearance {
    constructor(option = {}) {
        this.gameObject = option.gameObject;
        this.drawer = option.drawer;

        this.eyeSize = 0.08;
        this.eyeDistance = 0.4;     //中心からの目の距離
        this.eyeGap = 0.15*Math.PI; //目同士の距離
    }

    draw() {
        const g = this.gameObject;
        this.drawer.rect(g.x, g.y, g.width, g.height, {color: "#A9DAFF"});

        const center = {x: g.x + g.width*0.5, y: g.y + g.height*0.5}

        const rightEyePosition = this.rotatePointAroundCenter(center, g.width*this.eyeDistance, g.direction+this.eyeGap);
        const leftEyePosition = this.rotatePointAroundCenter(center, g.width*this.eyeDistance, g.direction-this.eyeGap);

        // 円を描写
        this.drawer.circle(rightEyePosition.x, rightEyePosition.y, g.width * this.eyeSize, { color: "#A9DAFF" });
        this.drawer.circle(leftEyePosition.x, leftEyePosition.y, g.width * this.eyeSize, { color: "#A9DAFF" });
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
}