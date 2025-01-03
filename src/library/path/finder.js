import { Box } from "../../system/box";
import { Mover } from "../../system/mover";

export class Finder {
    constructor(option = {}) {
        this.option = option;

        const id = option.id || Math.floor(Math.random() * 100000);
        this.id = id;

        this.name = id;

        this.box = new Box({});

        this.mover = new Mover({box: this.box});
        this.mover.v = [1,0];
        this.mover.rv = 0.02;

        this.drawShapes = [
            {
                type: 'rect', positionObject: this.box, w: this.box.w, h: this.box.h, lineWidth: 4
            }
        ];

        
    }

}
