

export class HealthBar {
    constructor(option = {}) {

        const { gameObject } = option;


        this.drawShapes = [
            {type: 'rect', positionObject: gameObject, w: 60, h: 8, offsetX: -30, offsetY: -30, isSizeFix: true},
            {type: 'rect', positionObject: gameObject, w: 40, h: 8, offsetX: -30, offsetY: -30, isSizeFix: true}
        ];

    }
}