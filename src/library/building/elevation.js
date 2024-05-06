import { Collider } from "../../system/collider";
import { GameObject } from "../../system/gameObject";
import { SurfacePattern } from "./SurfacePattern";

export class Elevation {
    constructor(option) {
        const system = option.system;
        system.update.submit(this);

        this.gameObject = option.gameObject;
        system.collision.submit(this);

        this.high = option.high || 0;
        // this.pillarHeight = option.pillarHeight || 0;
        this.floorState = "none";

        this.fallSpeed = 0;

        this.collidedFloorList = [];

        this.isUnderAnyFloor = false;
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
            this.collidedFloorList.push(floor.high);
        }

        if (otherLayers.includes("step")) {
            const step = other;
            const stepHigh = step.getHighAtPoint(this.gameObject.y);
            this.collidedFloorList.push(stepHigh);
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
        let underAnyFloor = false;
        this.collidedFloorList.forEach((floorHigh) => {
            if (this.high + this.gameObject.height * 0.5 < floorHigh) {
                underAnyFloor = true;
            }
        });
        this.isUnderAnyFloor = underAnyFloor;

        let existGroundFloor = false;
        let groundFloorHigh = 0;
        this.collidedFloorList.forEach((floorHigh) => {
            if (this.inRange(this.high, floorHigh, 10)) {
                if (this.fallSpeed >= 0) {
                    
                    existGroundFloor = true;
                    groundFloorHigh = Math.max(floorHigh, groundFloorHigh);
                }
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
        let resultSpeed = (speed += 0.4);
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

        this.surfacePattern = new SurfacePattern({ baseColor: "#3d3d3d", gameObject: this.gameObject, system: system });
    }

    onCollision(collisionData = {}) {}
}

export class Step {
    constructor(option) {
        const system = option.system;

        option.shapeDraw = true;

        const layers = option.layers || [];
        layers.push("step");
        option.layers = layers;

        this.gameObject = new GameObject(option);
        system.collision.submit(this);

        this.topHeight = option.topHeight || 0;
        this.bottomHeight = option.bottomHeight || 0;

        this.surfacePattern = new SurfacePattern({ pattern: "step", gameObject: this.gameObject, system: system });
    }

    getHighAtPoint(gamePositionY) {
        const highRange = this.topHeight - this.bottomHeight;
        const ratio = gamePositionY - this.gameObject.y;
        const modRatio = Math.max(0, Math.min(ratio, this.gameObject.height));
        const result = this.bottomHeight + highRange - (highRange * modRatio) / this.gameObject.height;
        return result;
    }

    onCollision(collisionData = {}) {}
}

export class FrontWall {
    constructor(option) {
        const system = option.system;

        this.height = option.height || 0;
        this.bottomHeight = option.bottomHeight || 0;

        option.shapeDraw = true;

        const layers = option.layers || [];
        layers.push("frontWall");
        option.layers = layers;

        this.gameObject = new GameObject(option);
        this.collider = new Collider({ gameObject: this.gameObject, isStatic: true });
        system.collision.submit(this);

        this.surfacePattern = new SurfacePattern({ baseColor: "#2e2e2e", gameObject: this.gameObject, system: system });
    }

    getHighAtPoint(gamePositionY) {
        const highRange = this.height;
        return this.bottomHeight + highRange - (highRange * (gamePositionY - this.gameObject.y)) / this.gameObject.height;
    }

    getOffset(high) {
        const offset = high - this.bottomHeight;
        return offset;
    }

    onCollision(collisionData = {}) {}
}
