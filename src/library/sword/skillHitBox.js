import { Collider } from "../../system/collider";
import { GameObject2 } from "../../system/gameObject2";


export class SkillHitBox {
    constructor(option = {}) {

        const initPosition = option.position || {x: 100, y: 100};

        this.gameObject = new GameObject2({
            x: initPosition.x,
            y: initPosition.y,
            velocity: option.speed || 0,
            direction: option.direction || Math.PI,
        });

        this.teamName = "team01";

        this.collider = new Collider({isKinetic: true, layers: [this.teamName, "skillLayer"]});

        this.drawShapes = [
            {type: 'rect', positionObject: this.gameObject, w: 10, h: 10, color: "red"},
        ];

        this.damage = 240;

        this.isLance = false; // ユニットを貫通するか

        this.active = true;
    }

    update() {
        // this.gameObject.x ++;
    }

    onCollision(collisionData = {}) {
        if (!this.active) return;

        const other = collisionData.otherObject;
        if (other?.collider?.layers) {
            const otherLayers = other.collider.layers;
            
            if (!this.isLance) {

                if (otherLayers.includes('unit') && !otherLayers.includes(this.teamName)) {
                    this.setActive(false);
                }

            }

        }
    }

    setActive(_active) {

        if (_active) {

        } else {
            this.drawShapes = [];
        }

        this.active = _active;
    }
}