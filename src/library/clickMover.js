
export class ClickMover {
    constructor(option) {
        const system = option.system;
        system.input.submitHandler({eventName: "pointerdown", handler: this.pointerdownHandler.bind(this)});

        this.gameObject = option.gameObject;
        
    }

    pointerdownHandler(ev) {
        const client = ev.client;
        this.gameObject.velocity = 4;
        this.gameObject.moveTowardsPosition(client);
    }
}