export class GameObject {
    constructor(option = {}) {
        const system = option.system;
        system.update.submit(this);

        const shapeDraw = option.shapeDraw;
        this.drawer = {};
        if (shapeDraw) {
            this.drawer = system.drawer;
            system.render.submit(this);
        }

        this.name = option.name || Math.floor(Math.random() * 10000);
        this.x = option.x || 0;
        this.y = option.y || 0;
        this.width = option.width || 10;
        this.height = option.height || 10;

        this.velocity = option.velocity || 0;
        this.direction = Math.random() * 2 * Math.PI;
        this.rotationSpeed = 0;
        this.limitOfRotationSpeed = option.limitOfRotationSpeed || 0.03;

        this.layers = option.layers || "";
    }

    draw() {
        const {x, y, width, height} = this;
        this.drawer.rect(x, y, width, height);
    }

    update() {
        this.randomWalkAction();
        this.updateDirection();
        this.moveTowardsDirection();
    }

    randomWalkAction() {
        this.rotationSpeed += 0.01 * (Math.random() - 0.5);
    }

    updateDirection() {
        this.rotationSpeed = Math.max(Math.min(this.rotationSpeed, this.limitOfRotationSpeed), -1 * this.limitOfRotationSpeed);
        this.direction += this.rotationSpeed;
        this.direction = ((this.direction + Math.PI) % (2 * Math.PI)) - Math.PI; // 角度の正規化
    }

    moveTowardsDirection() {
        this.x += this.velocity * Math.cos(this.direction);
        this.y += this.velocity * Math.sin(this.direction);
    }

    turnTowardsDirection(targetDirection, multiplier) {
        // 目標方向へ向く処理
        const angleDifference = targetDirection - this.direction;
        const normalizedDifference = ((angleDifference + Math.PI) % (2 * Math.PI)) - Math.PI; // 角度の正規化
        const turnAmount = normalizedDifference * multiplier; // 向くべき角度を計算
        this.rotationSpeed += turnAmount; // 向きを更新
    }

    turnTowardsPosition(targetPosition, multiplier, isBack = false) {
        let angle = this.angleTo(targetPosition.x, targetPosition.y);
        if (isBack) angle = angle + Math.PI; // isBack : 角度を180度逆にする
        this.turnTowardsDirection(angle, multiplier);
    }

    distanceTo(x, y) {
        const deltaX = this.x - x;
        const deltaY = this.y - y;
        return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    }

    angleTo(x, y) {
        const deltaX = x - this.x;
        const deltaY = y - this.y;
        return Math.atan2(deltaY, deltaX);
    }

    containsPoint(point) {
        if (this.x <= point.x && point.x <= this.x + this.width &&
            this.y <= point.y && point.y <= this.y + this.height) {
            return true;
        } else {
            return false;
        }
    }
    containsPointWithRange(point, width, height) {
        const rectX = this.x - width / 2;
        const rectY = this.y - height / 2;
    
        if (rectX <= point.x && point.x <= rectX + width &&
            rectY <= point.y && point.y <= rectY + height) {
            return true;
        } else {
            return false;
        }
    }
}
