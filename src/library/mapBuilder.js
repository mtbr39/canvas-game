import { Collider } from "../system/collider";
import { GameObject } from "../system/gameObject";
import { Elevation, Floor, FrontWall, Step } from "./elevation";

export class MapBuilder {
    constructor(option) {
        const system = option.system;
        this.system = system;

        this.buildings = [];

        this.makeBuilding();
    }

    makeBuilding() {
        new Building({
            system: this.system,
            x: 1,
            y: 1,
            width: 200,
            height: 300,
            depth:100,
        });
        new Step({system: this.system, x:1, y:201, width:200, height: 110, bottomHeight: 0, topHeight: 100, });

        new Building({
            system: this.system,
            x: 300,
            y: 1,
            width: 200,
            height: 100,
            depth:50,
        });
        new Step({system: this.system, x:300, y:51, width:200, height: 110, bottomHeight: 0, topHeight: 50, });
        
        // new Floor({system: this.system, x:100, y:100, width:200, height:200, high: 50, });
        // new Step({system: this.system, x:100, y:300, width:100, height: 100, bottomHeight: 0, topHeight: 50, });
        // new FrontWall({system: this.system, x:200, y:300, width:100, height: 50, bottomHeight: 0 });
    }
}

class Building {
    constructor(option) {
        this.system = option.system;
        this.x = option.x;
        this.y = option.y;
        this.width = option.width;
        this.height = option.height;
        this.depth = option.depth || 50;

        this.walls = [];

        this.makeRoom(this.x, this.y, this.width, this.height, 10, this.depth);
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
        });
        this.walls.push(
            new Wall({
                system: this.system,
                gameObject: wallGameObject,
            })
        );
    }

    makeWallRect(x, y, width, height, thickness) {
        // 上の壁
        this.makeWall("horizontal", x, y, width, thickness);
        // 下の壁
        // this.makeWall("horizontal", x, y + height - thickness, width, thickness);
        // 左の壁
        this.makeWall("vertical", x, y, height, thickness,);
        // 右の壁
        this.makeWall("vertical", x + width - thickness, y, height, thickness);
    }

    // Building クラスの makeRoom メソッドを更新
    makeRoom(x, y, width, height, thickness, depth) {
        // 四角形の壁
        this.makeWallRect(x, y, width, height, thickness);
        // 前面の壁
        // this.makeFrontWall(x, y, width, height, depth);
        // 左右の壁
        this.makeSideWalls(x, y, width, height, thickness);
        // 床
        this.makeFloor(x, y, width, height, depth);
    }

    // 前面の壁を作成するメソッド
    makeFrontWall(x, y, width, height, depth) {
        new FrontWall({ system: this.system, x: x, y: y + height - depth, width: width, height: depth, bottomHeight: 0 });
    }

    // 左右の壁を作成するメソッド
    makeSideWalls(x, y, width, height, thickness) {
        this.makeWall("vertical", x, y, height, thickness);
        this.makeWall("vertical", x + width - thickness, y, height, thickness);
    }

    // 床を作成するメソッド
    makeFloor(x, y, width, height, depth) {
        new Floor({ system: this.system, x: x, y: y-depth, width: width, height: height, high: depth });
    }
}

class Wall {
    constructor(option) {
        const system = option.system;
        this.gameObject = option.gameObject;
        this.collider = new Collider({gameObject: this.gameObject, isStatic: true});
        this.bottomHeight = option.bottomHeight || 0;
        this.pillarHeight = option.pillarHeight || 10;
        system.collision.submit(this);
    }
}
