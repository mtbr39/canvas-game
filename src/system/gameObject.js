export class GameObject {
  constructor(option = {}) {
    this.name = option.name || Math.random() * 10000;
    this.x = option.x || 0;
    this.y = option.y || 0;
    this.width = option.width || 20;
    this.height = option.height || 20;

    this.velocity = option.velocity || 0.4;
    this.direction = Math.random() * 2 * Math.PI;
    this.rotationSpeed = 0;

    this.layer = option.layer || "";
  }

  randomWalkAction() {
    this.rotationSpeed += 0.005 * (Math.random() - 0.5);
    this.rotationSpeed = Math.max(Math.min(this.rotationSpeed, 0.02), -0.02);
    this.direction += this.rotationSpeed;
    this.moveTowardsDirection();
  }

  moveTowardsDirection() {
    this.x += this.velocity * Math.cos(this.direction);
    this.y += this.velocity * Math.sin(this.direction);
  }

  turnTowardsDirection(targetDirection, multiplier) {
    // 目標方向へ向く処理
    const angleDifference = targetDirection - this.direction;
    const normalizedDifference = (angleDifference + Math.PI) % (2 * Math.PI) - Math.PI; // 角度の正規化
    const turnAmount = normalizedDifference * multiplier; // 向くべき角度を計算
    this.direction += turnAmount; // 向きを更新

    // 向いた方向に移動
    // this.moveTowardsDirection();
  }
}
