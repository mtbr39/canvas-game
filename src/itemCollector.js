import { UIManager } from "./library/UI/UIManager";
import { ClickMover } from "./library/clickMover";
import { FollowCamera } from "./library/followCamera";
import { ItemBag } from "./library/UI/itemBag";
import { ItemPicker } from "./library/itemPicker";
import { GameObject } from "./system/gameObject";
import { DialogBox } from "./library/UI/DialogBox";
import { SpriteAppearance } from "./library/spriteAppearance";
import { Elevation } from "./library/elevation";
import { Collider } from "./system/collider";

export class ItemCollector {
    constructor(option) {
        const system = option.systemList;
        this.drawer = system.drawer;
        this.collisionSystem = system.collision;
        this.renderSystem = system.render;

        this.gameObject = new GameObject({
            system: system,
            velocity: 0,
            width: option.width,
            height: option.height,
            shapeDraw: false,
            doesDirectionMove: true,
        });
        this.collider = new Collider({ gameObject: this.gameObject, isKinetic: true });
        this.collisionSystem.submit(this);

        this.elevation = new Elevation({ system: system, gameObject: this.gameObject });

        this.spriteAppearance = new SpriteAppearance({
            system: system,
            gameObject: this.gameObject,
            elevation: this.elevation,
        });

        this.clickMover = new ClickMover({ system: system, gameObject: this.gameObject, elevation: this.elevation});
        this.followCamera = new FollowCamera({ system: system, targetObject: this.gameObject });

        this.itemPicker = new ItemPicker({ system: system, gameObject: this.gameObject });
        this.itemBag = new ItemBag({ system: system, items: this.itemPicker.items });

        this.dialogBox = new DialogBox({ system: system });
        // this.dialogBox.startTalk("scene01");

        const uiManager = new UIManager({ system: system, itemBag: this.itemBag });
    }
}
