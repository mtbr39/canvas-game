export class RenderSystem {
    constructor(option) {
        this.objects = option.objects;
    }

    draw() {
        this.objects.forEach((object) => {
            object.draw();
        });
    }
}