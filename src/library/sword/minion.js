import { Collider } from "../../system/collider";
import { GameObject2 } from "../../system/gameObject2";
import { Vision2 } from "../module/vision2";
import { BoidBehavior2 } from "./boidBehavior2";
import { DamageTrader } from "./damageTrader";
import { HealthBar } from "./healthBar";

export class Minion {
    constructor(option) {
        this.option = option;

        this.className = 'minion';

        const id = option.id || Math.floor(Math.random() * 100000);
        this.id = id;

        const layersArray = [...(option.layers || [])];
        if (option.speciesName) layersArray.push(option.speciesName);

        let gameObject = {};

        const isSelfDriven = option.isSelfDriven != undefined ? option.isSelfDriven : true;

        if (isSelfDriven === false) {

            gameObject = new GameObject2({
                name: "minon" + this.id,
                velocity: option.velocity || 0.5,
                layers: layersArray,
                isRandomWalk: false,
            });
            this.gameObject = gameObject;

        } else {

            gameObject = new GameObject2({
                name: "minon" + this.id,
                velocity: option.velocity || 0.5,
                layers: layersArray,
            });
            this.gameObject = gameObject;

            this.vision = new Vision2({ body: this.gameObject, sizeRatio: option.visionSizeRatio });

            this.boidBehavior = new BoidBehavior2({
                vision: this.vision,
                selfObject: this.gameObject,
                speciesName: option.speciesName,
            });

        }

        this.collider = new Collider({ gameObject: this.gameObject, isKinetic: true, layers: layersArray });

        this.healthBar = new HealthBar({id, gameObject: this.gameObject, barType: 'small'});

        this.teamName = "team02";

        this.damageTrader = new DamageTrader({gameObject, layerName: this.teamName, health: this.healthBar});

        this.drawShapes = [
            {
                type: 'circle', positionObject: this.gameObject, radius: 6, color: option.color || 'gray'
            },
            {
                type: 'rect', positionObject: this.gameObject, w: gameObject.width, h: gameObject.height, color: option.color || 'gray'
            }
        ];

        this.positionSync = true;

        this.syncRules = {
            host: [
                'id',
                'className',
                'gameObject.x',
                'gameObject.y',
            ],
            request: [
                'healthBar.current'
            ],
            client: [
            ],
        };

    }

    static create(option) {
        return new Minion(option);
    }

}
