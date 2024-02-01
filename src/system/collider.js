export class Collider {
    constructor(option) {
        // this.gameObject = option.gameObject;
        this.isKinetic = option.isKinetic || false;
        this.isStatic = option.isStatic || false;
    }
}