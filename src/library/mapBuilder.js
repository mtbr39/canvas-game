import { GameObject } from "../system/gameObject";

export class MapBuilder {
    constructor(option) {
        const system = option.system;

        this.buildings = [];

        // Add constructor logic here
    }

    makeBuilding() {}

    // Add methods and properties here
}

class Building {
    constructor(option) {
        this.x = option.x;
        this.y = option.y;
        this.width = option.width;
        this.height = option.height;
        this.color = option.color;

        this.gameObject = new GameObject({
            system: this.system,
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
            shapeDraw: true,
            shapeColor: this.color,
        });
    }
}
