import { Vision2 } from "../module/vision2";

export class AroundView {
    constructor(option) {
        this.vision = option.vision;
        this.vision.submitHandler(this.visionBehavior.bind(this));

        this.objectList = []; //{layers, distance, angle, otherEntity}[]

        this.isScanning = false;

    }

    update() {
        if (this.isScanning) {
            this.isScanning = false;
        }
        this.startScan();
    }

    visionBehavior(layers, distance, angle, otherEntity) {

        const otherGameObject = otherEntity.gameObject;

        if (this.isScanning) {
            this.objectList.push({layers, distance, angle, otherEntity});
        }
        

        // if (layers.includes(this.speciesName)) {
            
        //     if (distance > this.selfObject.width * 5.0) {
        //         // 近付く (ここでは向きを変えてるだけ、自動で前進する前提)
        //         this.selfObject.turnTowardsDirection(angle, 0.002 * Math.random());
        //     } else if (distance < this.selfObject.width * 4.0) {
        //         // 近すぎたら止まる
        //         this.selfObject.stopMoving();
        //     }
        // }
    }

    startScan() {
        this.objectList = [];
        this.isScanning = true;
    }
}
