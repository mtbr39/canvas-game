export class GameObject {
    constructor(option = {}) {
        const system = option.system;
        system.update.submit(this);

        this.name = option.name || Math.random() * 10000;
        this.x = option.x || 0;
        this.y = option.y || 0;
        this.width = option.width || 10;
        this.height = option.height || 10;

        this.velocity = option.velocity || 0;
        this.direction = Math.random() * 2 * Math.PI;
        this.rotationSpeed = 0;

        this.layers = option.layers || "";
    }

    update() {
        this.updateDirection();
        this.moveTowardsDirection();
    }

    randomWalkAction() {
        this.rotationSpeed += 0.02 * (Math.random() - 0.5);
        // this.direction += this.rotationSpeed;
    }

    updateDirection() {
        this.rotationSpeed = Math.max(Math.min(this.rotationSpeed, 0.03), -0.03);
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

        // this.direction += turnAmount; // 向きを更新
        // 向いた方向に移動
        // this.moveTowardsDirection();
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
}
