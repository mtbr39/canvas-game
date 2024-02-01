import { BoidBehavior } from "./library/boidBehavior";
import { Elevation } from "./library/elevation";
import { ObstacleChecker } from "./library/obstacleChecker";
import { UniqueAppearance } from "./library/uniqueAppearance";
import { Vision } from "./library/vision";
import { Collider } from "./system/collider";
import { GameObject } from "./system/gameObject";

export class Animal {
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

        const hasElevation = option.hasElevation || false;
        if (hasElevation) {
            this.elevation = new Elevation({ system: system, gameObject: this.gameObject });
        }

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

        this.vision = new Vision({ system: system, body: this.gameObject, sizeRatio: option.visionSizeRatio });

        this.boidBehavior = new BoidBehavior({
            system: system,
            vision: this.vision,
            selfObject: this.gameObject,
            speciesName: option.speciesName,
        });
    }

}
