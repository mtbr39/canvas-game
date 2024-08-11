
export class DrawSystem {
    constructor(option) {
        this.drawer = option.drawer;
        this.ctx = option.drawer.ctx;
        this.objects = [];
    }

    // submitted object must have : drawShapes
    submit(object) {
        this.objects.push(object);
    }

    draw() {
        
        this.objects.forEach((object) => {
            object.drawShapes.forEach((shape) => {
                const type = shape.type;
                if (type === "circle") {
                    const {x, y} = shape.positionObject;
                    const radius = shape.radius;
                    this.drawer.circle(x, y, radius);
                }

            });
            
        });
    }
}