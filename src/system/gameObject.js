export class GameObject {
  constructor(option = {}) {
    this.name = option.name || Math.random() * 10000;
    this.x = option.x || 0;
    this.y = option.y || 0;
    this.width = option.width || 10;
    this.height = option.height || 10;

    this.velocity = option.velocity || 2;
    this.direction = 0;
    this.rotationSpeed = 0;
  }
}
