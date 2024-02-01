import { GameObject } from "../system/gameObject";

export class Elevation {
    constructor(option) {
        const system = option.system;
        system.update.submit(this);

        this.gameObject = option.gameObject;
        system.collision.submit(this);

        this.high = 0;
        this.floorState = "none";

        this.fallSpeed = 0;

        this.collidedFloorList = [];
    }

    get groundPosition() {
        return { x: this.gameObject.x, y: this.gameObject.y + this.high };
    }

    onCollision(collisionData = {}) {
        const other = collisionData.otherObject;
        const otherGameObject = other.gameObject;
        const otherLayers = otherGameObject.layers;

        if (otherLayers.includes("floor")) {
            const floor = other;
            this.collidedFloorList.push(floor);
            // this.checkGround(floor.high);

            if (floor.high != 0) {
                // デバッグ用コード : 0の床以外に乗ったら、瞬時にその高さに乗る
                // this.high = floor.high;
            }
        }
    }

    update() {
        const g = this.gameObject;

        if (this.floorState === "ground") {
            this.fallSpeed = 0;
        } else if (this.floorState === "air") {
            this.fallSpeed = this.gravityAccelerate(this.fallSpeed);
            g.y += this.fallSpeed;
            this.high -= this.fallSpeed;
        }

        this.checkGround();
    }

    checkGround() {
        let existGroundFloor = false;
        let groundFloorHigh = 0;
        this.collidedFloorList.forEach((floor) => {
            if (this.inRange(this.high, floor.high, 4) && this.fallSpeed >= 0) {
                existGroundFloor = true;
                groundFloorHigh = Math.max(floor.high, groundFloorHigh);
            }
        });
        this.collidedFloorList = [];

        if (existGroundFloor || this.high <= 0) {
            this.floorState = "ground";
            this.high = groundFloorHigh;
        } else {
            this.floorState = "air";
        }
    }

    jump(force) {
        this.floorState = "air";
        this.fallSpeed -= force;
    }

    gravityAccelerate(speed) {
        const maxSpeed = 8;
        // const minSpeed = 4;
        let resultSpeed = (speed += 0.6);
        resultSpeed = Math.min(resultSpeed, maxSpeed);
        return resultSpeed;
    }

    inRange(value1, value2, range) {
        return Math.abs(value1 - value2) < range;
    }
}

export class Floor {
    constructor(option) {
        const system = option.system;

        option.shapeDraw = true;
        const layers = option.layers || [];
        layers.push("floor");
        option.layers = layers;
        this.gameObject = new GameObject(option);
        system.collision.submit(this);

        this.high = option.high || 0;
    }

    onCollision(collisionData = {}) {}
}
