import { Champion } from "../library/sword/champion";


export default (reson) => {
    console.log("v0806");
    const Reson = reson;
    const systemList = Reson.systemList;

    const colors = {
        bg: "#FAFAFA", //"#acdcaa",
        street: "#E6E6E6",
        main: "#393939"


    };

    Reson.cameraSystem.turnOnDrag = true;
    systemList.render.setBackGroundColor(colors.bg);

    // const champion = new Champion();
    // Reson.champion()
    
}