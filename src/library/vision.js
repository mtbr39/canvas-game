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
        const system = option.system;
        this.vision = option.vision;
        this.vision.submitHandler(this.visionHandler);

        this.selfObject = option.selfObject;
        this.speciesName = option.speciesName;

        system.input.submitHandler({eventName: "pointerdown", handler: this.pointerdownHandler.bind(this)});
    }

    visionHandler = (collisionData = {}) => {
        const other = collisionData.otherObject;
        const otherObject = other.gameObject;
        if (otherObject === this.selfObject) {
            return;
        }
        const otherLayers = otherObject.layers;
        if (otherLayers.includes(this.speciesName)) {

            // 1. 同じ方を向く
            this.selfObject.turnTowardsDirection(otherObject.direction, 0.0005*Math.random());
            
            const distance = this.selfObject.distanceTo(otherObject.x, otherObject.y);
            const angle = this.selfObject.angleTo(otherObject.x, otherObject.y);
            if (distance > this.vision.gameObject.width*0.45) {
                // 2. 近付く
                // console.log("近づく", distance);
                this.selfObject.turnTowardsDirection(angle, 0.001*Math.random());
            } else if (distance < this.vision.gameObject.width*0.2) {
                // 3. 近すぎたら離れる
                // console.log("離れる");
                this.selfObject.turnTowardsDirection(angle+Math.PI, 0.001+0.003*Math.random());
            }
        }
        if (!otherLayers.includes(this.speciesName) && otherLayers.includes("animal")) { 
            // 別の種だがanimalである場合、離れることだけをする
            const distance = this.selfObject.distanceTo(otherObject.x, otherObject.y);
            const angle = this.selfObject.angleTo(otherObject.x, otherObject.y);
            if (distance < this.vision.gameObject.width*0.2) {
                // console.log("otherAnimal 離れる");
                this.selfObject.turnTowardsDirection(angle+Math.PI, 0.003*Math.random());
            }
        }
    }

    pointerdownHandler(ev) {
        const client = ev.client;
        if (this.selfObject.containsPointWithRange(client, 100, 100)) {
            const angleToPointer = this.selfObject.angleTo(ev.client.x, ev.client.y);
            this.selfObject.direction = angleToPointer + Math.PI;
        }
        
    }
}