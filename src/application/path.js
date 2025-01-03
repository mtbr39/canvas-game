import { Finder } from "../library/path/finder";

const path = {
    init(reson) {
        console.log("v0104");

        const Reson = reson;

        const colors = {
            bg: "#262626",
            main: "#393939",
            team01: "#34EFAE",
        };
    
        Reson.cameraSystem.turnOnDrag = true;
        Reson.renderSystem.setBackGroundColor(colors.bg);

        const gameSize = Reson.drawer.gameSize;

        const finder = new Finder({});
        Reson.add(finder);

        // const player2 = new Player({isPlayer: false});
        // Reson.add(player2);

        // for (let i=0; i<2; i++) {
        //     Reson.add(new DescriptiveItem());
        // }


    },

};

export default path;