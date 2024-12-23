import { Vision2 } from "../module/vision2";

export class AroundView {
    constructor(option) {
        this.vision = option.vision;
        this.vision.submitHandler(this.visionBehavior.bind(this));

        this.objectList = []; //{layers, distance, angle, otherEntity}[]
        this.objectListStack = []; //{layers, distance, angle, otherEntity}[]

        this.isScanning = false;

    }

    update() {
        this.objectList = this.objectListStack;
        this.objectListStack = [];
        // if (this.isScanning) {
        //     this.isScanning = false;
        // }
        this.startScan();
    }

    visionBehavior(layers, distance, angle, otherEntity) {

        const otherGameObject = otherEntity.gameObject;

        // if (this.isScanning) {
            this.objectListStack.push({layers, distance, angle, otherEntity});
        // }
    }

    startScan() {
        // this.objectList = [];
        this.isScanning = true;
    }
}
