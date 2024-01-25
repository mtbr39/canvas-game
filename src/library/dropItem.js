import { GameObject } from "../system/gameObject";

export class DropItem {
    constructor(option) {
        const system = option.system;
        system.collision.submit(this);

        this.gameObject = new GameObject({system:system, shapeDraw: true, layers: ["dropItem"]});
        this.collisionSystem = system.collision;

        this.name = option.name || "none";
    }

    picked() {
        this.collisionSystem.unsubmit(this);
        this.deletePicture();
        this.gameObject = null;
    }

    deletePicture() {
        this.gameObject.shapeDraw = false;
    }
}