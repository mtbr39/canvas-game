export class CameraSystem {
    constructor(option) {
        const system = option.system;
        this.drawer = system.drawer;

        system.update.submit(this);
        system.input.submitHandler({ eventName: "wheel", handler: this.scrollHandler.bind(this) });

        this.zoomResult = this.drawer.camera.zoom;
        this.zoomMin = 0.5;
    }

    update() {
        this.drawer.camera.zoom = this.lerp(this.drawer.camera.zoom, this.zoomResult, 0.1);
    }

    scrollHandler(ev) {
        const wheelValue = ev.wheelValue;
        this.setZoomResult(this.zoomResult - wheelValue * 0.001);
    }

    setZoomResult(value) {
        this.zoomResult = Math.max(this.zoomMin, value);
    }

    lerp(start, end, t) {
        return start * (1 - t) + end * t;
    }
}