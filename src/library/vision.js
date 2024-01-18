import { GameObject } from "../system/gameObject";

export class Vision {
    constructor(option) {
        const system = option.system;
        system.collision.submit(this);
        system.update.submit(this);
        system.render.submit(this);
        this.drawer = system.drawer;

        this.body = option.body;
        this.gameObject = new GameObject({system: system, x: this.body.x, y: this.body.y, width: this.body.width*10 , height: this.body.height*10, layer: "vision"});
        this.handler = {};
    }

    // submitted handler must be : (collisionData)=>void
    submitHandler(_handler) {
        this.handler = _handler;
    }

    update() {
        const g = this.gameObject;
        g.x = this.body.x + this.body.width/2 - g.width/2;
        g.y = this.body.y + this.body.height/2 - g.height/2;
    }

    draw() {
        const {x, y, width, height} = this.gameObject;
        // this.drawer.rect(x, y, width, height);
    }

    onCollision(collisionData = {}) {
        const other = collisionData.otherObject;
        this.handler(collisionData);
    }
}

export class BoidBehavior {
    constructor(option) {
        this.vision = option.vision;
        this.vision.submitHandler(this.visionHandler);


        this.selfObject = option.selfObject;
        console.log("self-debug", this.selfObject);
    }

    visionHandler = (collisionData = {}) => {
        const other = collisionData.otherObject;
        const otherObject = other.gameObject;
        if (otherObject.layer == "animalBody" && otherObject !== this.selfObject) {
            this.selfObject.turnTowardsDirection(otherObject.direction, 0.0005*Math.random());
            const distance = this.selfObject.distanceTo(otherObject.x, otherObject.y);
            const angle = this.selfObject.angleTo(otherObject.x, otherObject.y);
            if (distance > this.vision.gameObject.width*0.4) {
                // console.log("近づく", distance);
                this.selfObject.turnTowardsDirection(angle, 0.0005*Math.random());
            } else if (distance < this.vision.gameObject.width*0.2) {
                // console.log("離れる");
                this.selfObject.turnTowardsDirection(angle+Math.PI, 0.001+0.003*Math.random());
            }
        }
    }
}