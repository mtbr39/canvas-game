import { Angle } from "./angle";

export class ObstacleChecker {
    constructor(option = {}) {
        const system = option.system;
        system.update.submit(this);
        this.gameObject = option.gameObject;
        this.gameSize = option.gameSize;
        const longSide = Math.max(this.gameSize.width, this.gameSize.height);
        this.cageSize = {width: longSide * 1.2, height: longSide * 1.2}
    }

    update() {
        // this.warpOverGameEdge();
        this.collideGameEdge();
    }

    warpOverGameEdge() {
        const g = this.gameObject;

        // ゲームオブジェクトがゲームサイズの外に出ていないかチェック
        if (g.x + g.width < 0) {
            g.x = this.cageSize.width;  // 左から出たら右に出現
        }
        if (g.y + g.height < 0) {
            g.y = this.cageSize.height; // 上から出たら下に出現
        }
        if (g.x > this.cageSize.width) {
            g.x = - g.width;  // 右から出たら左に出現
        }
        if (g.y > this.cageSize.height) {
            g.y = - g.height;  // 下から出たら上に出現
        }
    }

    collideGameEdge() {
        const g = this.gameObject;

        // ゲームオブジェクトがゲームサイズの外に出ていないかチェック
        if (g.x < 0) {
            g.x = 0;
            g.direction = Angle.reflectYAxis(g.direction);
        }
        if (g.y < 0) {
            g.y = 0;
            g.direction = Angle.reflectXAxis(g.direction);
        }
        if (g.x + g.width > this.cageSize.width) {
            g.x = this.cageSize.width - g.width;
            g.direction = Angle.reflectYAxis(g.direction);
        }
        if (g.y + g.height > this.cageSize.height) {
            g.y = this.cageSize.height - g.height;
            g.direction = Angle.reflectXAxis(g.direction);
        }
    }
}
