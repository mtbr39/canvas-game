import { GameObject } from "../system/gameObject";

export class MapBuilder {
    constructor(option) {
        const system = option.system;

        this.buildings = [];

        new Building({
            system: system,
            x: 0,
            y: 0,
            width: 200,
            height: 100,
            color: "red",
        });
    }

    makeBuilding() {}
}

class Building {
    constructor(option) {
        this.system = option.system;
        this.x = option.x;
        this.y = option.y;
        this.width = option.width;
        this.height = option.height;
        // this.color = option.color;

        this.walls = [];

        this.makeRoom(1, 1, this.width, this.height, 10);
    }

    makeWall(type, x, y, extent, thickness) {
        let width, height;

        if (type === "vertical") {
            width = thickness;
            height = extent;
        } else if (type === "horizontal") {
            width = extent;
            height = thickness;
        } else {
            throw new Error(`makeWall() : Invalid type: ${type}`);
        }

        const wallGameObject = new GameObject({
            system: this.system,
            x: x,
            y: y,
            width: width,
            height: height,
            shapeDraw: true,
            isStatic: true,
        });
        this.walls.push(
            new Wall({
                system: this.system,
                gameObject: wallGameObject,
            })
        );
    }

    makeRoom(x, y, width, height, thickness) {
        // 上の壁
        this.makeWall("horizontal", x, y, width, thickness);
        // 下の壁
        this.makeWall("horizontal", x, y + height - thickness, width, thickness);
        // 左の壁
        this.makeWall("vertical", x, y, height, thickness,);
        // 右の壁
        this.makeWall("vertical", x + width - thickness, y, height, thickness);
    }
}

class Wall {
    constructor(option) {
        const system = option.system;
        this.gameObject = option.gameObject;
        system.collision.submit(this);
    }
}
