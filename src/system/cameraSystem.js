export class CameraSystem {
    constructor(option) {
        const system = option.system;
        this.drawer = system.drawer;

        system.update.submit(this);
        system.input.submitHandler({ eventName: "wheel", handler: this.scrollHandler.bind(this) });
        system.input.submitHandler({ eventName: "pointerdrag", handler: this.pointerDragHandler.bind(this) });

        this.zoomResult = this.drawer.camera.zoom;
        this.zoomMin = 0.5;
        this.positionResult = {...this.drawer.camera.position};

        this.prevZoom = this.zoomResult;
        this.prevPosition = this.positionResult;

        this.offsetResult = {x:0,y:0};

        this.turnOnDrag = true;
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
        if (this.turnOnDrag) {
            const delta = ev.pointerDelta;
            this.setPosition({ x: this.positionResult.x - delta.x * this.drawer.scale, y: this.positionResult.y - delta.y * this.drawer.scale });
        }
    }

    updateOffset() {
        const zoom = this.drawer.camera.zoom;
        const center = { x: this.drawer.gameSize.width / 2, y: this.drawer.gameSize.height / 2 };

        const deltaX = (1 - zoom) * center.x;
        const deltaY = (1 - zoom) * center.y;

        this.offsetResult = {x: deltaX, y: deltaY};
    }

    setZoom(value) {
        const previousZoom = this.zoomResult;
        this.zoomResult = Math.max(this.zoomMin, value);
        const center = { x: this.drawer.gameSize.width / 2 / this.zoomResult, y: this.drawer.gameSize.height / 2 / this.zoomResult};

        // カメラビューの中心を固定するための位置の変更を計算
        const zoomRatio = this.zoomResult / previousZoom;
        const deltaX = (1 - zoomRatio) * center.x;
        const deltaY = (1 - zoomRatio) * center.y;

        // 位置を適切に更新
        this.setPosition({
            x: this.positionResult.x - deltaX,
            y: this.positionResult.y - deltaY,
        });
    }

    setPosition(position) {
        this.positionResult = position;
    }

    lerp(start, end, t) {
        return start * (1 - t) + end * t;
    }
}
