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

        this.drawShapes = [
            {type: 'rect', positionObject: this.gameObject, w: 10, h: 10, color: "red"},
        ];

        this.components = [
            this.gameObject,
        ];
    }

    update() {
        // this.gameObject.x ++;
    }
}