export class BoidBehavior2 {
    constructor(option) {
        this.vision = option.vision;
        this.vision.submitHandler(this.visionHandler.bind(this));

        this.selfObject = option.selfObject;
        this.speciesName = option.speciesName;

        this.inputConfigs = [
            { eventName: "pointerdown", handler: this.pointerdownHandler.bind(this) }
        ];

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

    visionBehavior(layers, distance, angle, otherEntity) {

        const otherGameObject = otherEntity.gameObject;

        if (layers.includes(this.speciesName)) {
            
            if (distance > this.selfObject.width * 5.0) {
                // 近付く (ここでは向きを変えてるだけ、自動で前進する前提)
                this.selfObject.turnTowardsDirection(angle, 0.002 * Math.random());
            } else if (distance < this.selfObject.width * 4.0) {
                // 近すぎたら止まる
                this.selfObject.stopMoving();
            }
        }
    }

    visionHandler = (collisionData = {}) => {
        const other = collisionData.otherObject;
        const otherObject = other.gameObject;
        if (otherObject === this.selfObject) {
            return;
        }
        const distance = this.selfObject.distanceTo(otherObject.x, otherObject.y);
        const edgeDistance = distance - otherObject.width/2 - this.selfObject.width/2;
        const angle = this.selfObject.angleTo(otherObject.x, otherObject.y);
        const otherLayers = otherObject.layers;

        this.visionBehavior(otherLayers, edgeDistance, angle, other);

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
