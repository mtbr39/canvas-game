

export class SkillHitBox {
    constructor(option = {}) {

        this.position = option.position || {x: 100, y: 100};

        this.drawShapes = [
            {type: 'rect', positionObject: this.position, w: 40, h: 40, color: "red"},
        ];
    }
}