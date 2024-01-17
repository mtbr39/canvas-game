import { GameObject } from "./system/gameObject";
import { ObstacleChecker } from "./system/obstacleChecker";

export class Animal {
    constructor(option) {
        this.drawer = option.drawer;
        this.gameObject = new GameObject({x: Math.random()*this.drawer.gameSize.width, y: Math.random()*this.drawer.gameSize.height});
        this.type = option.type || "noType";

        this.obstacleChecker = new ObstacleChecker({gameObject: this.gameObject, gameSize: this.drawer.gameSize});
    }

    draw() {
        let g = this.gameObject;
        this.drawer.rect(g.x, g.y, g.width, g.height);

    }

    update() {
        // this.gameObject.x++;
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
