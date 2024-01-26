export class SingleButton {
    constructor(option) {
        const system = option.system;
        system.render.submit(this);
        system.input.submitHandler({ eventName: "pointerdown", handler: this.pointerdownPrimeHandler.bind(this), isPrime: true });
        
        this.drawer = system.drawer;

        this.position = option.position;
        this.size = option.size;
        this.text = option.text || "";
        this.handler = option.handler;
    }

    draw() {
        this.drawer.rect(this.position.x, this.position.y, this.size.width, this.size.height, {isUI: true, lineWidth: 2, color: "white"});
        const center = {x: this.position.x + this.size.width/2, y: this.position.y + this.size.height/2};
        this.drawer.text(this.text, center.x, center.y, {color: "white", isUI: true, fontSize: 30});
    }

    pointerdownPrimeHandler(ev) {
        
        const screenPoint = ev.screenPoint;
        
        if (this.containsPoint(screenPoint)) {
            this.handler();
            const preventOtherHandlers = true;
            return preventOtherHandlers;
        }
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