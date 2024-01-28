import { UIManager } from "./library/UI/UIManager";
import { ClickMover } from "./library/clickMover";
import { FollowCamera } from "./library/followCamera";
import { ItemBag } from "./library/UI/itemBag";
import { ItemPicker } from "./library/itemPicker";
import { GameObject } from "./system/gameObject";

export class ItemCollector {
    constructor(option) {
        const system = option.systemList;
        this.drawer = system.drawer;
        this.collisionSystem = system.collision;
        this.collisionSystem.submit(this);
        this.renderSystem = system.render;

        this.gameObject = new GameObject({
            system: system,
            velocity: 0,
            width: option.width,
            height: option.height,
            shapeDraw: true,
            doesDirectionMove: true,
        });

        this.clickMover = new ClickMover({ system: system, gameObject: this.gameObject });

        this.itemPicker = new ItemPicker({ system: system, gameObject: this.gameObject });

        this.itemBag = new ItemBag({system: system, items: this.itemPicker.items});


        const uiManager = new UIManager({system: system, itemBag: this.itemBag});

        this.followCamera = new FollowCamera({system: system, targetObject: this.gameObject});

        // this.vision = new Vision({ system: system, body: this.gameObject, sizeRatio: option.visionSizeRatio });
    }
}
