import { GameObject2 } from "../../system/gameObject2";
import { ClickMover } from "./clickMover";
import { HealthBar } from "./healthBar";
import { SkillCaster } from "./skillCaster";
import { DamageTrader } from './damageTrader';

export class Champion {
    constructor(option) {



        const gameObject = new GameObject2({});
        this.gameObject = gameObject;

        this.clickMover = new ClickMover({gameObject});

        this.healthBar = new HealthBar({gameObject});

        this.skillCaster = new SkillCaster({gameObject});

        this.teamName = "team01";

        this.damageTrader = new DamageTrader({gameObject, layerName: this.teamName, health: this.healthBar});

        this.components = [
            this.gameObject,
            this.clickMover,
            this.healthBar,
            this.skillCaster,
        ];

        this.drawShapes = [
            {
                type: 'circle', positionObject: gameObject, radius: 10, lineWidth: 4
            },
            {
                type: 'rect', positionObject: gameObject, w: gameObject.width, h: gameObject.height, lineWidth: 4
            }
        ];
    }

}
