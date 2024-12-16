import { GameObject2 } from "../../system/gameObject2";
import { ClickMover } from "../sword/clickMover";

export class Player {
    constructor(option = {}) {
        this.option = option;

        this.className = 'champion';

        const id = option.id || Math.floor(Math.random() * 100000);
        this.id = id;

        this.isOtherPlayer = !!option.isOtherPlayer;

        const gameObject = new GameObject2({});
        this.gameObject = gameObject;

        if (!this.isOtherPlayer) {

            this.clickMover = new ClickMover({gameObject});

        }

        this.drawShapes = [
            {
                type: 'circle', positionObject: gameObject, radius: 10, lineWidth: 4
            },
            {
                type: 'rect', positionObject: gameObject, w: gameObject.width, h: gameObject.height, lineWidth: 4
            }
        ];

        this.syncRules = {
            host: [
            ],
            request: [
            ],
            client: [
                'gameObject.x',
                'gameObject.y',
            ],
        };
    }

}
