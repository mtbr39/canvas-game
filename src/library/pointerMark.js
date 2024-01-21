import { GameObject } from "../system/gameObject";

export class PointerMark {
    constructor(option) {
        const system = option.systemList;
        this.drawer = system.drawer;
        this.renderSystem = option.systemList.render;
        system.input.submitHandler({eventName: "pointerdown", handler: this.pointerdownHandler.bind(this)});

        this.pointerMark = new GameObject({system: system, shapeDraw: true, width: 10, height: 10});
    }

    pointerdownHandler(ev) {
        const client = ev.client;

        this.pointerMark.x = client.x - this.pointerMark.width/2;
        this.pointerMark.y = client.y - this.pointerMark.height/2;
    }
}