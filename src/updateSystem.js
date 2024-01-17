export class UpdateSystem {
    constructor(option) {
        this.objects = option.objects;
    }

    update() {
        this.objects.forEach((object) => {
            object.update();
        });
    }
}