import { Collider } from "../../system/collider";
import { GameObject2 } from "../../system/gameObject2";
import { Vision2 } from "../module/vision2";
import { ClickMover } from "../sword/clickMover";
import { AroundView } from "./aroundView";
import { SpeakBehavior } from "./speakBehavior";

export class Player {
    constructor(option = {}) {
        this.option = option;

        this.className = 'champion';

        const id = option.id || Math.floor(Math.random() * 100000);
        this.id = id;

        this.name = id;

        this.isOtherPlayer = !!option.isOtherPlayer;

        const gameObject = new GameObject2({layers: ["human"]});
        this.gameObject = gameObject;

        this.collider = new Collider({isKinetic: true});

        if (!this.isOtherPlayer) {

            if (option.isPlayer) {
                this.clickMover = new ClickMover({gameObject});
            }

        }

        this.vision = new Vision2({body: this.gameObject, sizeRatio: 20, displayLine: true});
        this.aroundView = new AroundView({body: this.gameObject, vision: this.vision});

        this.speakBehavior = new SpeakBehavior({gameObject, aroundView: this.aroundView});

        this.drawShapes = [
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
