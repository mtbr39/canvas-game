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

        if (option.displayLine) {
            this.drawShapes = [
                {
                    type: 'rect', positionObject: this.gameObject, w: this.gameObject.width, h: this.gameObject.height, lineWidth: 1
                }
            ];
        }
        
        this.handler = {};
    }

    submitHandler(visionCallback) {
        // handler must be : (collisionData)=>void
        this.handler = (collisionData) => {
            this.visionHandler(collisionData, visionCallback)
        };
    }

    // visionCallbackは(otherLayers, edgeDistance, angle, other) という引数を渡される
    visionHandler = (collisionData = {}, visionCallback) => {
        const other = collisionData.otherObject;
        const otherObject = other.gameObject;
        if (otherObject === this.body) {
            return;
        }
        const distance = this.body.distanceTo(otherObject.x, otherObject.y);
        const edgeDistance = distance - otherObject.width/2 - this.body.width/2;
        const angle = this.body.angleTo(otherObject.x, otherObject.y);
        const otherLayers = otherObject.layers;

        visionCallback(otherLayers, edgeDistance, angle, other);

    };

    update() {
        const g = this.gameObject;
        g.x = this.body.x + this.body.width / 2 - g.width / 2;
        g.y = this.body.y + this.body.height / 2 - g.height / 2;
    }

    onCollision(collisionData = {}) {
        const other = collisionData.otherObject;
        if (typeof this.handler === 'function') {
            this.handler(collisionData);
        } else {
            // console.warn('Visionにhandler関数が存在しません。');
        }
    }
}
