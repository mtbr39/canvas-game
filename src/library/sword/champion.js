import { GameObject2 } from "../../system/gameObject2";
import { ClickMover } from "./clickMover";
import { HealthBar } from "./healthBar";
import { SkillCaster } from "./skillCaster";
import { DamageTrader } from './damageTrader';
import { Backpack } from "./backpack";

export class Champion {
    constructor(option = {}) {
        this.option = option;

        this.className = 'champion';

        const id = option.id || Math.floor(Math.random() * 100000);
        this.id = id;

        this.isOtherPlayer = !!option.isOtherPlayer;

        const gameObject = new GameObject2({});
        this.gameObject = gameObject;



        this.healthBar = new HealthBar({id, gameObject});

        this.backpack = new Backpack({id});



        // this.clickMover = null;
        if (!this.isOtherPlayer) {

            this.clickMover = new ClickMover({gameObject});

            this.skillCaster = new SkillCaster({
                id,
                gameObject,
            });

        }

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

    static create(option) {
        return new Champion(option);
    }

}
