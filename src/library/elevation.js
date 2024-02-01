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
    }

    get groundPosition() {
        return { x: this.gameObject.x, y: this.gameObject.y + this.high };
    }

    update() {
        const g = this.gameObject;

        

        console.log("elevation.onCollision", this.floorState, this.high);

        if (this.floorState === "ground") {
            this.fallSpeed = 0;
        } else if (this.floorState === "air") {
            this.fallSpeed = this.gravityAccelerate(this.fallSpeed);
            g.y += this.fallSpeed;
            this.high -= this.fallSpeed;
        }

        this.checkGround(0);

        // this.floorState = "none"; // 接地or空中は毎フレーム計算するためリセット
    }

    jump(force) {
        this.floorState = "air";
        this.fallSpeed -= force;
    }

    gravityAccelerate(speed) {
        const maxSpeed = 4;
        // const minSpeed = 4;
        let resultSpeed = (speed += 0.2);
        resultSpeed = Math.min(resultSpeed, maxSpeed);
        return resultSpeed;
    }

    onCollision(collisionData = {}) {
        const other = collisionData.otherObject;
        const otherGameObject = other.gameObject;
        const otherLayers = otherGameObject.layers;

        if (otherLayers.includes("floor")) {
            const floor = other;
            this.checkGround(floor.high);

            if (floor.high != 0) {
                //デバッグ用コード : 0の床以外に乗ったら、瞬時にその高さに乗る
                // this.high = floor.high;
            }
        }
    }

    checkGround(floorHigh) {
        if (this.inRange(this.high, floorHigh, 4) && this.fallSpeed > 0) {
            console.log("床に乗った-debug", floorHigh);
            this.high = floorHigh;
            this.floorState = "ground";
            // this.gameObject.velocity = 0;
        } else if (this.high > floorHigh) {
            if (this.floorState != "ground") {
                // すでに接地していたら空中にはしない
                this.floorState = "air";
            }
            this.floorState = "air";
        }
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

    onCollision(collisionData = {}) {
        const other = collisionData.otherObject;
        const otherGameObject = other.gameObject;
        const otherLayers = otherGameObject.layers;

        // console.log("floor.onCollision", otherLayers);

        if (otherLayers.includes("elevation")) {
        }
    }
}
