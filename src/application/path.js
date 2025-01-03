import { CustomVertex } from "../library/path/customVertex";
import { Finder } from "../library/path/finder";
import { generateRandomGraph } from "../library/path/graphUtl";

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

        //FIXME 試行回数が指数関数的
        const graph = generateRandomGraph(10, 2, 800, 800, CustomVertex);

        console.log("graph-debug", graph);


    },

};

export default path;