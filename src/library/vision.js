import { GameObject } from "../system/gameObject";

export class Vision {
    constructor(option) {
        const system = option.system;
        system.collision.submit(this);
        system.update.submit(this);
        system.render.submit(this);
        this.drawer = system.drawer;

        this.body = option.body;
        const sizeRatio = option.sizeRatio || 3;
        this.gameObject = new GameObject({
            system: system,
            x: this.body.x,
            y: this.body.y,
            width: this.body.width * sizeRatio,
            height: this.body.height * sizeRatio,
            layer: "vision",
        });
        this.handler = {};
    }

    // submitted handler must be : (collisionData)=>void
    submitHandler(_handler) {
        this.handler = _handler;
    }

    update() {
        const g = this.gameObject;
        g.x = this.body.x + this.body.width / 2 - g.width / 2;
        g.y = this.body.y + this.body.height / 2 - g.height / 2;
    }

    draw() {
        const { x, y, width, height } = this.gameObject;
        // this.drawer.rect(x, y, width, height);
    }

    onCollision(collisionData = {}) {
        const other = collisionData.otherObject;
        this.handler(collisionData);
    }
}
