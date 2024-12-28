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

        if (otherGameObject.layers.includes('human')) {
            this.objectListStack.push({info: `${otherEntity.name}という名前の人物が、次のように言っています。:「${otherEntity.speakBehavior.speechText}」`});
        }
        if (otherGameObject.layers.includes('descriptiveItem')) {
            this.objectListStack.push({layers, distance, angle, name: otherEntity.name, description: otherEntity.description});
        }
    }

    startScan() {
        // this.objectList = [];
        this.isScanning = true;
    }
}
