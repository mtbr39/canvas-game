export class GameObject2 {
    constructor(option = {}) {

        // this.shapeDraw = option.shapeDraw || true;

        this.name = option.name || Math.floor(Math.random() * 100000);
        const gameSize = {width: 100, height: 100}
        this.x = option.x || Math.random() * gameSize.width;
        this.y = option.y || Math.random() * gameSize.height;
        this.width = option.width || 10;
        this.height = option.height || 10;

        this.velocity = option.velocity || 0;
        this.direction = option.direction || Math.random() * 2 * Math.PI;
        this.rotationSpeed = 0;
        this.limitOfRotationSpeed = option.limitOfRotationSpeed || 0.03;
        this.doesDirectionMove = option.doesDirectionMove != false ? true : false;

        this.layers = option.layers || "";

        const isRandomWalk = option.isRandomWalk != undefined  ? option.isRandomWalk : true;
        if (!isRandomWalk) {
            this.update = () => {};
        }

        
    }

    draw() {
        // if (this.shapeDraw) {
        //     const {x, y, width, height} = this;
        //     this.drawer.rect(x, y, width, height);
        //     // this.drawer.text(this.name, x, y, {color:"white", fontSize: 6});
        // }

    }

    update() {
        this.updateDirection();
        this.moveTowardsDirection();
    }

    stopMoving() {
        this.velocity = 0;
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

    moveTowardsPosition(targetPosition) {
        this.direction = this.angleTo(targetPosition.x, targetPosition.y);
        // this.moveTowardsDirection();
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

    distance(position) {
        const deltaX = this.x - position.x;
        const deltaY = this.y - position.y;
        return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
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

    getVectorToDirection(rate, isBack = false) {
        if(isBack) rate = -1 * rate;
        return {x: rate * Math.cos(this.direction), y: rate * Math.sin(this.direction)};
    }
}
