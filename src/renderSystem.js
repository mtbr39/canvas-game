export class RenderSystem {
    constructor(option) {
        this.ctx = option.ctx;
        this.objects = option.objects;
    }

    draw() {
        this.ctx.fillStyle = "#002451";
        this.ctx.fillRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);

        this.objects.forEach((object) => {
            object.draw();
        });
    }
}