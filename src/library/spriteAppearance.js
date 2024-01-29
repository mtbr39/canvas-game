export class SpriteAppearance {
    constructor(option = {}) {
        const system = option.system;
        system.render.submit(this);

        this.gameObject = option.gameObject;
        this.drawer =  system.drawer;

        this.imageName = "ice";
    }

    draw() {
        const g = this.gameObject;
        this.drawer.image(this.imageName, g.x, g.y);
    }
}
