import { Player } from "../library/ensemble/player";

const ensemble = {
    init(reson) {
        console.log("v1217");

        

        const Reson = reson;

        const colors = {
            bg: "#262626",
            main: "#393939",
            team01: "#34EFAE",
        };
    
        Reson.cameraSystem.turnOnDrag = false;
        Reson.renderSystem.setBackGroundColor(colors.bg);

        const gameSize = Reson.drawer.gameSize;

        const obj01 = new BackgroundObj({gameSize, Reson});
        Reson.add(obj01);

        const player = new Player();
        Reson.add(player);



    },


};

export default ensemble;

class BackgroundObj {
    constructor(option) {

        this.time = 0;
        this.timeSpeed = 0.01;
        
        this.gameSize = option.gameSize;

        this.position = {x: this.gameSize.width/2, y: this.gameSize.height*2}

        const dotNum = 20;
        for (let i=0; i<dotNum; i++) {
            for (let j=0; j<dotNum; j++) {
                const d = new DotShape({x: this.gameSize.width*i/dotNum, y: this.gameSize.height*j/dotNum});
                option.Reson.add(d);
            }
        }
        

        this.drawShapes = [
            {
                type: 'circle', positionObject: this.position, radius: this.gameSize.width, lineWidth: 4, isFill: true, color: 'white',
            },
        ];
    }


}

class DotShape {
    constructor(option) {
        this.position = {x: option.x, y: option.y}

        this.drawShapes = [
            {
                type: 'circle', positionObject: this.position, radius: 0.4, lineWidth: 1, isSizeFix: true, isFill: true, color: 'gray',
            },
        ];
    }


}