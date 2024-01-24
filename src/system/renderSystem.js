import { CameraSystem } from "./cameraSystem";

export class RenderSystem {
    constructor(option) {
        this.drawer = option.drawer;
        this.ctx = option.drawer.ctx;
        this.objects = [];

        this.debugMode = true;
        this.debugText = "";
    }

    // submitted object must have : draw()
    submit(object) {
        this.objects.push(object);
    }

    draw() {
        this.ctx.fillStyle = "#002451";
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

        if (this.debugMode) {
            this.drawer.text(this.debugText, 100,100, {fontSize:32, color:"white"});
        }
        
        this.objects.forEach((object) => {
            object.draw();
        });
    }
}