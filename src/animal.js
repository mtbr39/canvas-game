import { GameObject } from "./gameObject";

export class Animal {
    constructor(option) {
        this.gameObject = new GameObject();
        this.drawer = option.drawer;
        this.type = option.type || "noType";
    }

    draw() {
        let g = this.gameObject;
        this.drawer.rect(g.x, g.y, g.width, g.height);
        // switch (this.type) {
        //     case "cheetah": {
                
        //         break;
        //     }
        //     default: {

        //         break;
        //     }
        // }
    }

    onCollision() {
        
    }
}
