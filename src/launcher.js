import { ItemCollector } from "./itemCollector";
import { PointerMark } from "./library/pointerMark";
import { Reson } from "./system/reson";

export class Launcher {
    constructor(option={}) {

        this.canvas = option.canvas;
        if (this.canvas === undefined) {
            this.canvas = document.createElement("canvas");
            document.body.appendChild(this.canvas);
        }

        this.reson = new Reson( this.canvas );

        this.projectID = option.projectID || "no_projectID";

        if (this.projectID === "boidfish") {
            this.boidfish();
        }
        if (this.projectID === "canvas2d") {
            this.canvas2d();
        }
    

    }

    boidfish() {
        const bg = this.reson.backgroundPattern;
        bg.backgroundText = "群れシミュ";
        
        const animalFactory = this.reson.animalFactory;
        animalFactory.make({ number: 1, layers: ["animal"], speciesName: "boidA", shapeColor: "white", width: 100, height: 100, velocity: 0.2, limitOfRotationSpeed: 0.001});
        animalFactory.make({ number: 100, layers: ["animal"], speciesName: "boidA" });
        animalFactory.make({ number: 30, layers: ["animal"], speciesName: "boidB", shapeColor: "#94E4A9", width: 15, height: 15, velocity: 0.4, });
        animalFactory.make({ number: 8, layers: ["animal"], speciesName: "boidC", shapeColor: "#FF8E87", width: 20, height: 20, velocity: 0.5, });
        animalFactory.make({ number: 3, layers: ["animal"], speciesName: "boidE", shapeColor: "#FFA769", width: 25, height: 25, velocity: 0.3, });
        animalFactory.make({ number: 40, layers: ["animal"], speciesName: "boidE", shapeColor: "#FFA769", width: 10, height: 10, velocity: 0.3, });
    
        const pointerMark = new PointerMark({ systemList: this.reson.systemList });
    }

    canvas2d() {
        const animalFactory = this.reson.animalFactory;
        // animalFactory.make({ number: 100, layers: ["animal"], speciesName: "boidA" });

        this.reson.cameraSystem.disable = true;

        const itemCollector = new ItemCollector({systemList: this.reson.systemList});
    }
}