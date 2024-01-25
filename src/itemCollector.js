import { BoidBehavior } from "./library/boidBehavior";
import { ClickMover } from "./library/clickMover";
import { ItemPicker } from "./library/itemPicker";
import { ObstacleChecker } from "./library/obstacleChecker";
import { UniqueAppearance } from "./library/uniqueAppearance";
import { Vision } from "./library/vision";
import { GameObject } from "./system/gameObject";

export class ItemCollector {
    constructor(option) {
        const system = option.systemList;
        this.drawer = system.drawer;
        this.collisionSystem = system.collision;
        this.collisionSystem.submit(this);
        this.renderSystem = system.render;

        const layersArray = option.layers || [];

        this.gameObject = new GameObject({
            system: system,
            velocity: 0,
            width: option.width,
            height: option.height,
            layers: layersArray,
            shapeDraw: true,
            doesDirectionMove: true,
        });

        this.clickMover = new ClickMover({ system: system, gameObject: this.gameObject });

        this.itemPicker = new ItemPicker({ system: system, gameObject: this.gameObject });

        // this.vision = new Vision({ system: system, body: this.gameObject, sizeRatio: option.visionSizeRatio });
    }
}
