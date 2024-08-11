import { Champion } from "../library/sword/champion";


export default (reson) => {
    console.log("v0806");
    const Reson = reson;
    const systemList = Reson.systemList;

    const colors = {
        bg: "#FAFAFA", //"#acdcaa",
        main: "#393939"
    };

    Reson.renderSystem.setBackGroundColor(colors.bg);

    const champion = new Champion();
    Reson.add(champion);
    
}