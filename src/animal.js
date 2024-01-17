import { GameObject } from "./gameObject";

export class Animal {
    constructor(option) {
        this.gameObject = new GameObject({x: Math.random()*100, y: Math.random()*100});
        this.drawer = option.drawer;
        this.type = option.type || "noType";
    }

    draw() {
        let g = this.gameObject;
        this.drawer.rect(g.x, g.y, g.width, g.height);

    }

    onCollision(collisionData = {}) {
        const other = collisionData.otherObject;
        // console.log("hit-debug", other);
        
    }
}
