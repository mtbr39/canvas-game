import { BoidBehavior } from "./library/boidBehavior";
import { ObstacleChecker } from "./library/obstacleChecker";
import { UniqueAppearance } from "./library/uniqueAppearance";
import { Vision } from "./library/vision";
import { GameObject } from "./system/gameObject";

export class Animal {
    constructor(option) {
        const system = option.systemList;
        this.drawer = system.drawer;
        this.collisionSystem = option.systemList.collision;
        this.collisionSystem.submit(this);
        this.renderSystem = option.systemList.render;
        system.update.submit(this);

        const layersArray = option.layers || [];
        if(option.speciesName) layersArray.push(option.speciesName);
        this.gameObject = new GameObject({
            system: system,
            velocity: option.velocity || 0.5,
            x: Math.random() * this.drawer.gameSize.width,
            y: Math.random() * this.drawer.gameSize.height,
            width: option.width,
            height: option.height,
            layers: layersArray,
        });
        this.type = option.type || "noType";

        this.obstacleChecker = new ObstacleChecker({
            system: system,
            gameObject: this.gameObject,
            gameSize: this.drawer.gameSize,
        });
        this.uniqueAppearance = new UniqueAppearance({
            renderSystem: this.renderSystem,
            gameObject: this.gameObject,
            drawer: this.drawer,
            decorationValues: option.decorationValues,
            shapeColor: option.shapeColor
        });
        this.vision = new Vision({ system: system, body: this.gameObject });
        this.boidBehavior = new BoidBehavior({
            system: system,
            vision: this.vision,
            selfObject: this.gameObject,
            speciesName: option.speciesName
        });
    }

    draw() {}

    update() {
        this.gameObject.randomWalkAction();
        this.obstacleChecker.update();
    }

    onCollision(collisionData = {}) {
        const other = collisionData.otherObject;
    }
}
