import { talkData } from "../../talkData";
import { UIElement } from "./UIElement";

export class DialogBox {
    constructor(option) {
        const system = option.system;
        this.system = system;
        system.render.submit(this);
        system.input.submitHandler({ eventName: "pointerdown", handler: this.pointerdownHandler.bind(this), primeNumber: 100 });

        this.drawer = system.drawer;

        this.talkData = talkData;


        this.size = {width: Math.min(this.drawer.gameSize.width, 300), height: this.drawer.gameSize.height*0.2}
        option.size = this.size;
        option.alignment = {typeX: "center", typeY: "bottom", bottom: 20}
        this.uiElement = new UIElement(option);
        this.position = this.uiElement.position;

        this.currentTalk = {};
    }

    draw() {
        if (!this.uiElement.isDisplay) {
            return;
        }

        this.drawer.rect(this.position.x, this.position.y, this.size.width, this.size.height, {isUI: true, lineWidth: 2, color: "white"});
        if (this.currentTalk.text) {
            this.drawer.text(this.currentTalk.text, this.position.x + this.size.width*0.35, this.position.y + this.size.height*0.3, {isUI: true, color: "white", fontSize: 40, textAlign: "left"});
        }
        
    }

    startTalk(_talkID) {
        const talkID = _talkID;
        const talks = talkData[talkID];
        this.currentTalk = talks[0];

        this.uiElement.isDisplay = true;

    }

    pointerdownHandler(ev) {
        if (!this.uiElement.isDisplay) return;
        let preventOtherHandlers = false;

        const screenPoint = ev.screenPoint;
        if (this.containsPoint(screenPoint)) {
            // this.handler();
            preventOtherHandlers = true;
            return preventOtherHandlers;
        }

        return preventOtherHandlers;
    }

    containsPoint(point) {
        if (this.position.x <= point.x && point.x <= this.position.x + this.size.width &&
            this.position.y <= point.y && point.y <= this.position.y + this.size.height) {
            return true;
        } else {
            return false;
        }
    }

}
