export class CameraSystem {
    constructor(option) {
        const system = option.system;
        this.drawer = system.drawer;
        system.input.submitHandler({ eventName: "scroll", handler: this.scrollHandler.bind(this) });
    }

    scrollHandler(ev) {
        const scrollTop = ev.target.scrollingElement.scrollTop;
    }
}