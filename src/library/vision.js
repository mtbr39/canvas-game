import { GameObject } from "../system/gameObject";

export class Vision {
    constructor(option) {
        const system = option.system;
        system.collision.submit(this);
        system.update.submit(this);
        system.render.submit(this);
        this.drawer = system.drawer;

        this.body = option.body;
        this.gameObject = new GameObject({
            system: system,
            x: this.body.x,
            y: this.body.y,
            width: this.body.width * 3,
            height: this.body.height * 3,
            layer: "vision",
        });
        this.handler = {};
    }

    // submitted handler must be : (collisionData)=>void
    submitHandler(_handler) {
        this.handler = _handler;
    }

    update() {
        const g = this.gameObject;
        g.x = this.body.x + this.body.width / 2 - g.width / 2;
        g.y = this.body.y + this.body.height / 2 - g.height / 2;
    }

    draw() {
        const { x, y, width, height } = this.gameObject;
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
        system.update.submit(this);
        this.vision = option.vision;
        this.vision.submitHandler(this.visionHandler);

        this.selfObject = option.selfObject;
        this.speciesName = option.speciesName;

        system.input.submitHandler({ eventName: "pointerdown", handler: this.pointerdownHandler.bind(this) });

        this.runMode = false;
        this.runModeCount = 0;
        this.defaultVelocity = this.selfObject.velocity;
        this.defaultRorationSpeed = this.selfObject.limitOfRotationSpeed;
        this.runVelocity = this.defaultVelocity * 2;
        this.runRotationSpeed = this.defaultRorationSpeed * 2;
        this.runFadeTime = 60;
    }

    update() {
        if (this.runMode) {
            this.runModeCount++;
            this.selfObject.velocity = this.lerp(this.runVelocity, this.defaultVelocity, this.runModeCount/this.runFadeTime);
            this.selfObject.limitOfRotationSpeed = this.lerp(this.runRotationSpeed, this.defaultRorationSpeed, this.runModeCount/this.runFadeTime);
            if (this.runModeCount >= this.runFadeTime) {
                this.runModeCount = 0;
                this.setRunMode(false);
            }
        }
        
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
            this.selfObject.turnTowardsDirection(otherObject.direction, 0.005 * Math.random());

            const distance = this.selfObject.distanceTo(otherObject.x, otherObject.y);
            const angle = this.selfObject.angleTo(otherObject.x, otherObject.y);
            if (distance > this.selfObject.width * 2.0) {
                // 2. 近付く
                this.selfObject.turnTowardsDirection(angle, 0.0005 * Math.random());
            } else if (distance < this.selfObject.width * 1.0) {
                // 3. 近すぎたら離れる
                this.selfObject.turnTowardsDirection(angle + Math.PI, 0.005 * Math.random());
            }
        }
        if (!otherLayers.includes(this.speciesName) && otherLayers.includes("animal")) {
            // 別の種だがanimalである場合
            if (otherObject.width >= this.selfObject.width * 1.2) {
                // 対象が自分より大きい場合
                this.setRunMode(true);
                // 離れる
                const distance = this.selfObject.distanceTo(otherObject.x, otherObject.y);
                const angle = this.selfObject.angleTo(otherObject.x, otherObject.y);
                if (distance - otherObject.width/2 < this.selfObject.width * 1.5) {
                    // this.selfObject.turnTowardsDirection(angle + Math.PI, (0.001 * Math.random() * otherObject.width ** 3) / 3000);
                    this.selfObject.turnTowardsDirection(angle + Math.PI, 0.005 * Math.random() * otherObject.width);
                }
            }
        }
    };

    pointerdownHandler(ev) {
        const client = ev.client;
        if (this.selfObject.containsPointWithRange(client, 100, 100)) {
            // const angleToPointer = this.selfObject.angleTo(ev.client.x, ev.client.y);
            // this.selfObject.direction = angleToPointer + Math.PI;
            this.selfObject.turnTowardsPosition(client,  0.1 + 0.3*Math.random(), true);
            this.setRunMode(true);
        }
    }

    setRunMode(runMode) {
        this.runMode = runMode
        if (runMode) {
            this.selfObject.velocity = this.runVelocity;
            this.selfObject.limitOfRotationSpeed = this.runRotationSpeed;
        } else {
            this.selfObject.velocity = this.defaultVelocity;
            this.selfObject.limitOfRotationSpeed = this.defaultRorationSpeed;
        }
    }

    lerp(start, end, t) {
        return start * (1 - t) + end * t;
    }
}
