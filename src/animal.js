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

        this.gameObject = new GameObject({x: Math.random()*this.drawer.gameSize.width, y: Math.random()*this.drawer.gameSize.height});
        this.type = option.type || "noType";

        this.obstacleChecker = new ObstacleChecker({system:system, gameObject: this.gameObject, gameSize: this.drawer.gameSize});
        this.uniqueAppearance = new UniqueAppearance({ renderSystem: this.renderSystem, gameObject: this.gameObject, drawer: this.drawer});
        this.vision = new Vision({system: system, body: this.gameObject});
        this.boidBehavior = new BoidBehavior({ vision: this.vision });
    }

    draw() {
        let g = this.gameObject;
        
        // this.uniqueAppearance.draw();

    }

    update() {
        this.randomWalkAction();
        this.obstacleChecker.update();
    }

    onCollision(collisionData = {}) {
        const other = collisionData.otherObject;
        // console.log("hit-debug", other);
        
    }

    randomWalkAction() {
        let g = this.gameObject;
        g.rotationSpeed += 0.02 * (Math.random()-0.5);
        g.rotationSpeed = Math.max(Math.min(g.rotationSpeed, 0.05), -0.05);
        g.direction += g.rotationSpeed;
        this.moveTowardsDirection();
    }
    

    moveTowardsDirection() {
        let g = this.gameObject;
        g.x += g.velocity * Math.cos(g.direction);
        g.y += g.velocity * Math.sin(g.direction);
    }
}
