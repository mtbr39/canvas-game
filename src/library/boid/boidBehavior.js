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
        this.runVelocity = this.defaultVelocity * 1.5;
        this.runRotationSpeed = this.defaultRorationSpeed * 2;
        this.runTargetDirection = 0;
        this.runFadeTime = 30;
    }

    update() {
        this.selfObject.randomWalkAction();

        if (this.runMode) {
            this.runModeCount++;
            this.selfObject.velocity = this.lerp(this.runVelocity, this.defaultVelocity, this.runModeCount / this.runFadeTime);
            this.selfObject.limitOfRotationSpeed = this.lerp(this.runRotationSpeed, this.defaultRorationSpeed, this.runModeCount / this.runFadeTime);
            this.selfObject.turnTowardsDirection(this.runTargetDirection, 0.1 + 0.3 * Math.random(), true);
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
            this.selfObject.turnTowardsDirection(otherObject.direction, 0.004 * Math.random());

            const distance = this.selfObject.distanceTo(otherObject.x, otherObject.y);
            const angle = this.selfObject.angleTo(otherObject.x, otherObject.y);
            if (distance - otherObject.width/2 > this.selfObject.width * 1.5) {
                // 2. 近付く
                this.selfObject.turnTowardsDirection(angle, 0.002 * Math.random());
            } else if (distance - otherObject.width/2 < this.selfObject.width * 0.7) {
                // 3. 近すぎたら離れる
                this.selfObject.turnTowardsDirection(angle + Math.PI, 0.01 * Math.random());
            }
        }
        if (!otherLayers.includes(this.speciesName) && otherLayers.includes("animal")) {
            // 別の種だがanimalである場合
            if (otherObject.width >= this.selfObject.width * 1.2) {
                // 対象が自分より大きい場合
                // 離れる
                const distance = this.selfObject.distanceTo(otherObject.x, otherObject.y);
                if (distance - otherObject.width / 2 < this.selfObject.width * 1.0) {
                    this.runTargetDirection = this.selfObject.angleTo(otherObject.x, otherObject.y) + Math.PI;
                    this.setRunMode(true);
                }
            }
        }
    };

    pointerdownHandler(ev) {
        const client = ev.client;
        if (this.selfObject.containsPointWithRange(client, 100, 100)) {
            this.runTargetDirection = this.selfObject.angleTo(client.x, client.y) + Math.PI;
            
            this.setRunMode(true);
        }
    }

    setRunMode(runMode) {
        this.runMode = runMode;
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
