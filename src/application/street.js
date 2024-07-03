import { assets } from "../const/assets";

import { StreetHuman } from "../library/street/streetHuman";
import { StreetPath } from "../library/street/streetPath";
import { StreetGenerator } from "../library/street/streetGenerator";
import { PlaceManager } from "../library/street/placeManager";
import { PenManager } from "../library/street/penManager";
import { PointerMark } from "../library/boid/pointerMark";

export default (reson) => {
    console.log("v703");
    const Reson = reson;
    const systemList = Reson.systemList;

    Reson.cameraSystem.turnOnDrag = true;
    systemList.render.setBackGroundColor("#acdcaa");
    systemList.drawer.initialLoadImages(assets);

    const streetPath = new StreetPath({system: systemList});

    const placeManager = new PlaceManager({system: systemList});

    const streetGenerator = new StreetGenerator({system: systemList, streetPath: streetPath, placeManager: placeManager});

    const penManager = new PenManager({system: systemList, streetGenerator: streetGenerator});

    new PointerMark({systemList: systemList});

    for (let i=0; i < 11; i++) {
        new StreetHuman({systemList: systemList, streetPath: streetPath, placeManager: placeManager});
    }

    const animalFactory = Reson.animalFactory;
    // animalFactory.hasElevation = true;
    // animalFactory.make({ number: 50, x: 200, y: 400,layers: ["animal"], speciesName: "boidA", shapeColor: "gray", hasNotWall: true });
    // animalFactory.make({ number: 30, x: 200, y: 400,layers: ["animal"], speciesName: "boidB", shapeColor: "gray", hasNotWall: true, width: 15, height: 15, velocity: 0.4, });
    
    
}