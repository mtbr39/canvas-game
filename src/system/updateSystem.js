export class UpdateSystem {
    constructor(option) {
        this.objects = [];
    }

    // submitted object must have : update()
    submit(object) {
        this.objects.push(object);
    }

    update() {
        this.objects.forEach((object) => {
            object.update();
        });
    }
}