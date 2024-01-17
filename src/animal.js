import { GameObject } from "./system/gameObject";

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

    update() {
        this.gameObject.x++;
    }

    onCollision(collisionData = {}) {
        const other = collisionData.otherObject;
        // console.log("hit-debug", other);
        
    }
}
