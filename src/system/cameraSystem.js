export class CameraSystem {
    constructor(option) {
        const system = option.system;
        this.drawer = system.drawer;

        system.update.submit(this);
        system.input.submitHandler({ eventName: "wheel", handler: this.scrollHandler.bind(this) });
        system.input.submitHandler({ eventName: "pointerdrag", handler: this.pointerDragHandler.bind(this) });

        this.zoomResult = this.drawer.camera.zoom;
        this.zoomMin = 0.5;
        this.positionResult = this.drawer.camera.position;
    }

    update() {
        this.drawer.camera.zoom = this.lerp(this.drawer.camera.zoom, this.zoomResult, 0.1);
        this.drawer.camera.position.x = this.lerp(this.drawer.camera.position.x, this.positionResult.x, 0.1);
        this.drawer.camera.position.y = this.lerp(this.drawer.camera.position.y, this.positionResult.y, 0.1);
    }

    scrollHandler(ev) {
        const wheelValue = ev.wheelValue;
        this.setZoom(this.zoomResult - wheelValue * 0.001);
    }

    pointerDragHandler(ev) {
        const delta = ev.pointerDelta;
        this.setPosition({x: this.positionResult.x - delta.x * this.drawer.scale, y: this.positionResult.y - delta.y * this.drawer.scale});
    }

    setZoom(value) {
        this.zoomResult = Math.max(this.zoomMin, value);
    }

    setPosition(position) {
        this.positionResult = position;
    }

    lerp(start, end, t) {
        return start * (1 - t) + end * t;
    }
}