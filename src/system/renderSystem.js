import { CameraSystem } from "./cameraSystem";

export class RenderSystem {
    constructor(option) {
        this.drawer = option.drawer;
        this.ctx = option.drawer.ctx;
        this.objects = [];

        
    }

    // submitted object must have : draw()
    submit(object) {
        this.objects.push(object);
    }

    draw() {
        this.ctx.fillStyle = "#002451";
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

        this.objects.forEach((object) => {
            object.draw();
        });
    }
}