import { PointerMark } from "../library/boid/pointerMark";
import { FollowCamera } from "../library/module/followCamera";
import { Champion } from "../library/sword/champion";


export default (reson) => {
    console.log("v0806");
    const Reson = reson;
    const systemList = Reson.systemList;

    const colors = {
        bg: "#FAFAFA", //"#acdcaa",
        main: "#393939"
    };

    Reson.cameraSystem.turnOnDrag = false;
    Reson.renderSystem.setBackGroundColor(colors.bg);

    const champion = new Champion();
    Reson.add(champion);

    new FollowCamera({system: systemList, targetObject: champion.gameObject, isSmooth: false});

    const animalFactory = Reson.animalFactory;
    animalFactory.make({ number: 20, layers: ["animal"], speciesName: "boidA" });
    animalFactory.make({ number: 10, layers: ["animal"], speciesName: "boidB", shapeColor: "#94E4A9", width: 15, height: 15, velocity: 0.4, });
    animalFactory.make({ number: 10, layers: ["animal"], speciesName: "boidE", shapeColor: "#FFA769", width: 10, height: 10, velocity: 0.3, });

    const pointerMark = new PointerMark({ systemList });
    
}