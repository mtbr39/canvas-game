import { Collider } from "../../system/collider";
import { GameObject2 } from "../../system/gameObject2";
import { BoidBehavior2 } from "../boid/boidBehavior2";
import { Vision2 } from "../module/vision2";

export class Minion {
    constructor(option) {

        const layersArray = [...(option.layers || [])];
        if (option.speciesName) layersArray.push(option.speciesName);

        this.gameObject = new GameObject2({
            velocity: option.velocity || 0.5,
            layers: layersArray,
        });
        this.collider = new Collider({ gameObject: this.gameObject, isKinetic: true, layers: layersArray });

        this.vision = new Vision2({ body: this.gameObject, sizeRatio: option.visionSizeRatio });

        this.boidBehavior = new BoidBehavior2({
            vision: this.vision,
            selfObject: this.gameObject,
            speciesName: option.speciesName,
        });

        this.drawShapes = [
            {
                type: 'circle', positionObject: this.gameObject, radius: 10, color: option.color || 'gray'
            }
        ];
    }

}
