import { PointerMark } from "../library/boid/pointerMark";
import { FollowCamera } from "../library/module/followCamera";
import { Champion } from "../library/sword/champion";
import { Minion } from "../library/sword/minion";

export default (reson) => {
    console.log("v0903");
    const Reson = reson;
    const systemList = Reson.systemList;

    const colors = {
        // bg: "#FAFAFA", //"#acdcaa",
        bg: "#262626",
        main: "#393939",
        team01: "#34EFAE",
    };

    Reson.socketSystem.init();
    
    Reson.cameraSystem.turnOnDrag = false;
    Reson.renderSystem.setBackGroundColor(colors.bg);
    systemList.render.setBackGroundColor("#262626");

    const champion = new Champion();
    Reson.add(champion);

    Reson.socketSystem.hostCallback = () => {

        for(let i=0; i<10; i++) {
            const minion = new Minion({color: colors.team01, layers: ["unit", "team02"], speciesName: "minionA"});
            Reson.add(minion);
        }
    }

    new FollowCamera({system: systemList, targetObject: champion.gameObject, isSmooth: false});

    const pointerMark = new PointerMark({ systemList });
    
}