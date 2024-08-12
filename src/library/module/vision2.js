import { Collider } from "../../system/collider";
import { GameObject } from "../../system/gameObject";
import { GameObject2 } from "../../system/gameObject2";

export class Vision2 {
    constructor(option) {

        this.body = option.body;
        const sizeRatio = option.sizeRatio || 4;
        this.gameObject = new GameObject2({
            x: this.body.x,
            y: this.body.y,
            width: this.body.width * sizeRatio,
            height: this.body.height * sizeRatio,
            layer: "vision",
        });

        this.collider = new Collider({isKinetic: true});
        
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

    onCollision(collisionData = {}) {
        const other = collisionData.otherObject;
        this.handler(collisionData);
    }
}
