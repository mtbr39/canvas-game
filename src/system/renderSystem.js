import { CameraSystem } from "./cameraSystem";

export class RenderSystem {
    constructor(option) {
        this.drawer = option.drawer;
        this.ctx = option.drawer.ctx;
        this.objects = [];
        
        this.styleSetting = option.styleSetting

        this.debugMode = true;
        this.debugText = "";
        this.debugTextPosition = {x: 100, y: 100};

        this.backgroundColor = "#002451";
    }

    // submitted object must have : draw()
    submit(object) {
        this.objects.push(object);
    }

    draw() {
        this.ctx.fillStyle = this.backgroundColor;
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

        if (this.debugMode) {
            this.drawer.text(this.debugText, this.debugTextPosition.x, this.debugTextPosition.y, {fontSize:32, color:"white", isUI: true});
        }
        
        this.objects.forEach((object) => {
            object.draw();
        });
    }

    setBackGroundColor(color) {
        this.backgroundColor = color;
        this.styleSetting.apply("body", {background: color});
    }
}