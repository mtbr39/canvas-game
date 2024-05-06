import { GameObject } from "../../system/gameObject";
import { ShapeEffect } from "./shapeEffect";

export class PointerMark {
    constructor(option) {
        const system = option.systemList;
        this.drawer = system.drawer;
        this.renderSystem = option.systemList.render;
        system.input.submitHandler({eventName: "pointerdown", handler: this.pointerdownHandler.bind(this)});

        const debugPointerMark = false;
        this.pointerMark = new GameObject({system: system, shapeDraw: debugPointerMark, width: 10, height: 10});
        this.effect = new ShapeEffect({system: system});
    }

    pointerdownHandler(ev) {
        const client = ev.client;

        this.effect.play({position: client});

        this.pointerMark.x = client.x - this.pointerMark.width/2;
        this.pointerMark.y = client.y - this.pointerMark.height/2;
    }
}