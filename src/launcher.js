import { Reson } from "./system/reson";
import { assets } from "./const/assets";

import { ItemCollector } from "./library/building/itemCollector";
import { PointerMark } from "./library/boid/pointerMark";
import { MapBuilder } from "./library/building/mapBuilder";
import { StreetHuman } from "./library/street/streetHuman";
import { StreetPath } from "./library/street/streetPath";
import { StreetGenerator } from "./library/street/streetGenerator";
import { PlaceManager } from "./library/street/placeManager";
import { DropItem } from "./library/building/dropItem";
import Ensemble from './library/ensemble/ensembleMain';
import Street from './application/street';
import Moba from './application/moba';


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
        if (this.projectID === "routeman") {
            Street(this.reson);
        }
        if (this.projectID === "ensemble") {
            Ensemble.init(this.reson);
        }
        if (this.projectID === "moba") {
            Moba(this.reson);
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
        console.log("v2115");
        const systemList = this.reson.systemList;

        this.reson.cameraSystem.turnOnDrag = false;
        systemList.render.setBackGroundColor("#262626");
        systemList.drawer.initialLoadImages(assets);

        new MapBuilder({system: systemList});
        
        const animalFactory = this.reson.animalFactory;
        animalFactory.hasElevation = true;
        animalFactory.make({ number: 50, x: 200, y: 400,layers: ["animal"], speciesName: "boidA" });
        animalFactory.make({ number: 30, x: 200, y: 400,layers: ["animal"], speciesName: "boidB", shapeColor: "#94E4A9", width: 15, height: 15, velocity: 0.4, });
        animalFactory.make({ number: 5, x: 200, y: 400,layers: ["animal"], speciesName: "boidC", shapeColor: "#FF8E87", width: 20, height: 20, velocity: 0.5, });
        animalFactory.make({ number: 2, x: 200, y: 400,layers: ["animal"], speciesName: "boidE", shapeColor: "#FFA769", width: 25, height: 25, velocity: 0.3, });
        animalFactory.make({ number: 20, x: 200, y: 400,layers: ["animal"], speciesName: "boidE", shapeColor: "#FFA769", width: 10, height: 10, velocity: 0.3, });

        const itemCollector = new ItemCollector({systemList: systemList});
        
        for (let i=0; i<20; i++) {
            const itemName = `${Math.floor(Math.random()*10)}`;
            new DropItem({system: systemList, name: itemName});
        }
        
    }
    
}