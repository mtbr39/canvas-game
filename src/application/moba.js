import { PointerMark } from "../library/boid/pointerMark";
import { FollowCamera } from "../library/module/followCamera";
import { Champion } from "../library/sword/champion";
import { Minion } from "../library/sword/minion";


export default (reson) => {
    console.log("v0806");
    const Reson = reson;
    const systemList = Reson.systemList;

    const colors = {
        // bg: "#FAFAFA", //"#acdcaa",
        bg: "#262626",
        main: "#393939",
        team01: "#34EFAE",
    };

    Reson.cameraSystem.turnOnDrag = false;
    Reson.renderSystem.setBackGroundColor(colors.bg);
    systemList.render.setBackGroundColor("#262626");

    const champion = new Champion();
    Reson.add(champion);

    new FollowCamera({system: systemList, targetObject: champion.gameObject, isSmooth: false});

    for(let i=0; i<20; i++) {
        const minion = new Minion({color: colors.team01});
        Reson.add(minion);
    }

    const animalFactory = Reson.animalFactory;
    animalFactory.make({ number: 30, layers: ["unit", "team01"], speciesName: "boidB", shapeColor: "#94E4A9", width: 10, height: 10, velocity: 0.4, });
    animalFactory.make({ number: 30, layers: ["unit", "team02"], speciesName: "boidE", shapeColor: "#FFA769", width: 10, height: 10, velocity: 0.3, });

    const pointerMark = new PointerMark({ systemList });
    
}