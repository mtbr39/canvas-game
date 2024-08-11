import { GameObject } from "../../system/gameObject";

export class Champion {
    constructor(option) {
        const system = option.systemList;
        this.drawer = system.drawer;
        this.collisionSystem = system.collision;
        this.renderSystem = system.render;

        this.gameObject = new GameObject({
            system: system,
        });
    }

}
