import { talkData } from "../../talkData";
import { UIElement } from "./UIElement";

export class DialogBox {
    constructor(option) {
        const system = option.system;
        this.system = system;
        system.render.submit(this);

        this.drawer = system.drawer;

        this.talkData = talkData;


        this.size = {width: Math.min(this.drawer.gameSize.width, 300), height: this.drawer.gameSize.height*0.2}
        option.size = this.size;
        option.alignment = {typeX: "center", typeY: "bottom", bottom: 20}
        this.uiElement = new UIElement(option);
        this.position = this.uiElement.position;
    }

    draw() {
        this.drawer.rect(this.position.x, this.position.y, this.size.width, this.size.height, {isUI: true, lineWidth: 2, color: "white"});
        this.drawer.text("QWE\nQWEQWE", this.position.x + this.size.width*0.35, this.position.y + this.size.height*0.3, {isUI: true, color: "white", fontSize: 40, textAlign: "left"});
    }
}
