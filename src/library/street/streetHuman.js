import { BoidBehavior } from "../boidBehavior";
import { Elevation } from "../elevation";
import { ObstacleChecker } from "../obstacleChecker";
import { UniqueAppearance } from "../uniqueAppearance";
import { Vision } from "../vision";
import { Collider } from "../../system/collider";
import { GameObject } from "../../system/gameObject";
import { PathMoving } from "./pathMoving";

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
            velocity: option.velocity || 0.5,
            x: option.x || Math.random() * this.drawer.gameSize.width,
            y: option.y || Math.random() * this.drawer.gameSize.height,
            width: option.width,
            height: option.height,
            layers: layersArray,
            limitOfRotationSpeed: option.limitOfRotationSpeed,
        });
        this.collider = new Collider({ gameObject: this.gameObject, isKinetic: true });
        this.collisionSystem.submit(this);


        this.obstacleChecker = new ObstacleChecker({
            system: system,
            gameObject: this.gameObject,
            gameSize: this.drawer.gameSize,
        });

        this.uniqueAppearance = new UniqueAppearance({
            renderSystem: this.renderSystem,
            gameObject: this.gameObject,
            drawer: this.drawer,
            decoInfo: option.decoInfo,
            shapeColor: option.shapeColor,
        });

        

        this.pathMoving = new PathMoving({
            pathMap: option.pathMap,
            path: {}
        });

        // this.vision = new Vision({ system: system, body: this.gameObject, sizeRatio: option.visionSizeRatio });

        // this.boidBehavior = new BoidBehavior({
        //     system: system,
        //     vision: this.vision,
        //     selfObject: this.gameObject,
        //     speciesName: option.speciesName,
        // });
    }

}
