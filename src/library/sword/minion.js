import { Collider } from "../../system/collider";
import { GameObject2 } from "../../system/gameObject2";
import { Vision2 } from "../module/vision2";
import { BoidBehavior2 } from "./boidBehavior2";
import { DamageTrader } from "./damageTrader";
import { HealthBar } from "./healthBar";

export class Minion {
    constructor(option) {

        const id = Math.floor(Math.random() * 100000);

        const layersArray = [...(option.layers || [])];
        if (option.speciesName) layersArray.push(option.speciesName);

        const gameObject = new GameObject2({
            velocity: option.velocity || 0.5,
            layers: layersArray,
        });
        this.gameObject = gameObject;

        this.collider = new Collider({ gameObject: this.gameObject, isKinetic: true, layers: layersArray });

        this.vision = new Vision2({ body: this.gameObject, sizeRatio: option.visionSizeRatio });

        this.healthBar = new HealthBar({id, gameObject: this.gameObject, barType: 'small'});

        this.boidBehavior = new BoidBehavior2({
            vision: this.vision,
            selfObject: this.gameObject,
            speciesName: option.speciesName,
        });

        this.teamName = "team02";

        this.damageTrader = new DamageTrader({gameObject, layerName: this.teamName, health: this.healthBar});

        this.drawShapes = [
            {
                type: 'circle', positionObject: this.gameObject, radius: 6, color: option.color || 'gray'
            },
            {
                type: 'rect', positionObject: gameObject, w: gameObject.width, h: gameObject.height, color: option.color || 'gray'
            }
        ];
    }

}
