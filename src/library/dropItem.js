import { GameObject } from "../system/gameObject";

export class DropItem {
    constructor(option) {
        const system = option.system;
        system.render.submit(this);
        this.gameObject = new GameObject({system:system, shapeDraw: true, layers: ["dropItem"]});
        system.collision.submit(this);

        this.drawer = system.drawer;
        this.collisionSystem = system.collision;

        this.name = option.name || "none";
        this.isDelete = false;
    }

    draw() {
        if (!this.isDelete) {
            this.drawer.text(this.name, this.gameObject.x, this.gameObject.y, {color: "gray", fontSize: 10});
        }
        
    }

    picked() {
        this.collisionSystem.unsubmit(this);
        this.delete();
    }

    delete() {
        this.deletePicture();
        this.gameObject = null;
        this.isDelete = true;
    }

    deletePicture() {
        this.gameObject.shapeDraw = false;
    }
}