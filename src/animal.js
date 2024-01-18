import { UniqueAppearance } from "./library/uniqueAppearance";
import { BoidBehavior, Vision } from "./library/vision";
import { GameObject } from "./system/gameObject";
import { ObstacleChecker } from "./system/obstacleChecker";

export class Animal {
    constructor(option) {
        const system = option.systemList;
        this.drawer = option.systemList.drawer;
        this.collisionSystem = option.systemList.collision;
        this.collisionSystem.submit(this);
        this.renderSystem = option.systemList.render;
        system.update.submit(this);

        const layersArray = option.layers || [];
        if(option.speciesName) layersArray.push(option.speciesName);
        this.gameObject = new GameObject({
            system: system,
            velocity: 0.3,
            x: Math.random() * this.drawer.gameSize.width,
            y: Math.random() * this.drawer.gameSize.height,
            width: 10,
            height: 10,
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
