export class FollowCamera {
    constructor(option) {
        const system = option.system;
        system.update.submit(this);

        // 引数
        this.drawer = system.drawer;
        this.target = option.targetObject;

        // 設定値

        
        // 利用値
        this.offset = {x:0,y:0};
    }

    update() {
        const targetCenter = { x: this.target.x + this.target.width / 2, y: this.target.y + this.target.height / 2 };
        const gameSize = {width: this.drawer.gameSize.width / this.drawer.camera.zoom, height: this.drawer.gameSize.height / this.drawer.camera.zoom};
        const offsetResult = this.target.getVectorToDirection(40 / this.drawer.camera.zoom);
        this.offset.x = this.lerp(this.offset.x, offsetResult.x, 0.02);
        this.offset.y = this.lerp(this.offset.y, offsetResult.y, 0.02);
        // 最大速度
        const maxSpeed = 5;
    
        // 現在位置から目標位置までの距離を計算
        const distanceX = targetCenter.x - gameSize.width / 2 + this.offset.x - this.drawer.camera.position.x;
        const distanceY = targetCenter.y - gameSize.height / 2 + this.offset.y - this.drawer.camera.position.y;
    
        // lerpFactor を可変にし、目標位置に近づくほど速度を上げる
        const lerpFactorX = Math.min(1, Math.abs(distanceX) / maxSpeed);
        const lerpFactorY = Math.min(1, Math.abs(distanceY) / maxSpeed);
    
        // X軸方向の更新
        this.drawer.camera.position.x += distanceX * lerpFactorX;
    
        // Y軸方向の更新
        this.drawer.camera.position.y += distanceY * lerpFactorY;
    }

    lerp(start, end, t) {
        return start * (1 - t) + end * t;
    }
}
