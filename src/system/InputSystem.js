export class InputSystem {
    constructor(option) {
        this.drawer = option.drawer;
        this.scaler = option.drawer.scaler();

        this.isPointerHold = false;
        this.isRightClick = false;
        this.handlers = {
            "pointerdown": [],
            "pointermove": [],
            "pointerup": []
        };
        window.addEventListener("keydown", this.handleKeydown.bind(this));
        window.addEventListener("keyup", this.handleKeyup.bind(this));
        window.addEventListener("pointerdown", this.handlePointerDown.bind(this));
        window.addEventListener("pointermove", this.handlePointerMove.bind(this));
        window.addEventListener("pointerup", this.handlePointerUp.bind(this));
        window.addEventListener("contextmenu", function (ev) {
            ev.preventDefault();
        });
    }

    submitHandler(option) {
        const eventName = option.eventName;
        const handler = option.handler;
        this.handlers[eventName].push(handler);
    }

    handleKeydown(event) {
        switch (event.key) {
            case "w":
            case "s":
                // velocity.speedY = 0;
                break;
            case "a":
            case "d":
                // velocity.speedX = 0;
                break;
        }
    }

    handleKeyup(event) {}

    handlePointerDown(ev) {
        this.isPointerHold = true;
        this.isRightClick = ev.button === 2;
        const clientX = ev.clientX * window.devicePixelRatio;
        const clientY = ev.clientY * window.devicePixelRatio;
        const [x, y] = this.scaler.array([clientX, clientY]);
        ev.client = {x: x, y: y};
        
        this.handlers["pointerdown"].forEach((handler) => {
            handler(ev);
        });
    }

    handlePointerMove(ev) {
        const clientX = ev.clientX * window.devicePixelRatio;
        const clientY = ev.clientY * window.devicePixelRatio;

        
    }

    handlePointerUp(ev) {
        this.isPointerHold = false;
        const clientX = ev.clientX * window.devicePixelRatio;
        const clientY = ev.clientY * window.devicePixelRatio;
    }
}
