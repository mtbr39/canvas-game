import { Collider } from "../../system/collider";
import { GameObject } from "../../system/gameObject";
import { DialogBox } from "../UI/DialogBox";
import { UIManager } from "../UI/UIManager";
import { ItemBag } from "../UI/itemBag";
import { SingleButton } from "../UI/singleButton";
import { SpriteAppearance } from "../appearance/spriteAppearance";
import { FollowCamera } from "../module/followCamera";
import { ClickMover } from "./clickMover";
import { Elevation } from "./elevation";
import { ItemPicker } from "./itemPicker";


export class ItemCollector {
    constructor(option) {
        const system = option.systemList;
        this.drawer = system.drawer;
        this.collisionSystem = system.collision;
        this.renderSystem = system.render;

        this.gameObject = new GameObject({
            system: system,
            name: "itemCollector",
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

        this.clickMover = new ClickMover({ system: system, gameObject: this.gameObject, elevation: this.elevation });
        this.followCamera = new FollowCamera({ system: system, targetObject: this.gameObject });

        this.itemPicker = new ItemPicker({ system: system, gameObject: this.gameObject });
        this.itemBag = new ItemBag({ system: system, items: this.itemPicker.items });

        this.dialogBox = new DialogBox({ system: system });
        this.dialogBox.startTalk("scene01");

        const uiManager = new UIManager({ system: system, itemBag: this.itemBag});
        uiManager.UIObject = {
            open: {
                UIList: [
                    new SingleButton({
                        system: system,
                        text: "Shop",
                        alignment: {typeX: "right", typeY: "top", top: 20, right: 20},
                        size: { width: 100, height: 32 },
                        isDisplay: true,
                        handler: () => { uiManager.switchDisplayPage('shopHome', 'open') },
                    }),
                ],
            },
            shopHome: {
                UIList: [
                    new SingleButton({
                        system: system,
                        text: "Buy",
                        alignment: {typeX: "right", typeY: "top", top: 20, right: 20},
                        size: { width: 100, height: 32 },
                        handler: () => {},
                    }),
                    new SingleButton({
                        system: system,
                        text: "Sell",
                        alignment: {typeX: "right", typeY: "top", top: 60, right: 20},
                        size: { width: 100, height: 32 },
                        handler: () => {},
                    }),
                    new SingleButton({
                        system: system,
                        text: "Back",
                        alignment: {typeX: "right", typeY: "top", top: 100, right: 20},
                        size: { width: 100, height: 32 },
                        handler: () => { uiManager.switchDisplayPage('open', 'shopHome') },
                    }),
                ],
            },
        };
        const bagButton = new SingleButton({
            system: system,
            text: "ItemBag",
            alignment: {typeX: "left", typeY: "top", top: 20, left: 20},
            size: { width: 100, height: 32 },
            handler: () => {uiManager.switchDisplayPage('bagContent', 'bagOpen')},
            isDisplay: true
        });
        const bagCloseButton = new SingleButton({
            system: system,
            text: "Close ItemBag",
            alignment: {typeX: "left", typeY: "top", top: 20, left: 20},
            size: { width: 100, height: 32 },
            handler: () => {uiManager.switchDisplayPage('bagOpen', 'bagContent')},
        });
        uiManager.UIObject['bagOpen'] = {UIList: [bagButton]};
        uiManager.UIObject['bagContent'] = {UIList: [bagCloseButton, this.itemBag]};
        
    }
}
