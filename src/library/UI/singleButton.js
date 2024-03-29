import { UIElement } from "./UIElement";

export class SingleButton {
    constructor(option) {
        const system = option.system;
        system.render.submit(this);
        system.input.submitHandler({ eventName: "pointerdown", handler: this.pointerdownPrimeHandler.bind(this), primeNumber: 100 });
        
        this.drawer = system.drawer;

        this.size = option.size;
        this.uiElement = new UIElement(option);
        this.position = this.uiElement.position;

        this.text = option.text || "";
        this.handler = option.handler;
    }

    draw() {
        if (!this.uiElement.isDisplay) return;

        this.drawer.rect(this.position.x, this.position.y, this.size.width, this.size.height, {isUI: true, lineWidth: 2, color: "white"});
        const center = {x: this.position.x + this.size.width/2, y: this.position.y + this.size.height/2};
        this.drawer.text(this.text, center.x, center.y, {color: "white", isUI: true, fontSize: 12});
    }

    pointerdownPrimeHandler(ev) {
        if (!this.uiElement.isDisplay) return;
        let preventOtherHandlers = false;

        const screenPoint = ev.screenPoint;
        
        if (this.containsPoint(screenPoint)) {
            this.handler();
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