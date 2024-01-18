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
  }

  randomWalkAction() {
    this.rotationSpeed += 0.02 * (Math.random() - 0.5);
    this.rotationSpeed = Math.max(Math.min(this.rotationSpeed, 0.05), -0.05);
    this.direction += this.rotationSpeed;
    this.moveTowardsDirection();
  }

  moveTowardsDirection() {
    this.x += this.velocity * Math.cos(this.direction);
    this.y += this.velocity * Math.sin(this.direction);
  }
}
