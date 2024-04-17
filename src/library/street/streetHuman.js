import { BoidBehavior } from "../boidBehavior";
import { Elevation } from "../elevation";
import { ObstacleChecker } from "../obstacleChecker";
import { UniqueAppearance } from "../uniqueAppearance";
import { Vision } from "../vision";
import { Collider } from "../../system/collider";
import { GameObject } from "../../system/gameObject";
import { PathMoving } from "./pathMoving";
import { SimpleAppearance } from "./simpleAppearance";
import { VillagerBehavior } from "./villagerBehavior";

export class StreetHuman {
    constructor(option) {
        const system = option.systemList;
        this.drawer = system.drawer;
        this.collisionSystem = system.collision;
        this.renderSystem = system.render;

        const layersArray = option.layers || [];
        if (option.speciesName) layersArray.push(option.speciesName);

        this.gameObject = new GameObject({
            system: system,
            velocity: option.velocity || 2.0,
            x: option.x || Math.random() * this.drawer.gameSize.width,
            y: option.y || Math.random() * this.drawer.gameSize.height,
            width: option.width,
            height: option.height,
            layers: layersArray,
            limitOfRotationSpeed: option.limitOfRotationSpeed,
        });
        this.collider = new Collider({ gameObject: this.gameObject, isKinetic: true });
        this.collisionSystem.submit(this);

        this.simpleAppearance = new SimpleAppearance({
            system: system,
            gameObject: this.gameObject,
            color: "#736b68"
        });

        this.pathMoving = new PathMoving({
            system: system,
            selfObject: this.gameObject,
            streetPath: option.streetPath
        });

        this.villagerBehavior = new VillagerBehavior({
            system: system,
            selfObject: this.gameObject,
            pathMoving: this.pathMoving
        });

    }

}
