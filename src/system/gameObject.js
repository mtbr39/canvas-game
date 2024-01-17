export class GameObject {
  constructor(option = {}) {
    this.name = option.name || Math.random() * 10000;
    this.x = option.x || 0;
    this.y = option.y || 0;
    this.width = option.width || 20;
    this.height = option.height || 20;

    this.velocity = option.velocity || 0.4;
    this.direction = Math.random() * 2*Math.PI;
    this.rotationSpeed = 0;
  }
}
