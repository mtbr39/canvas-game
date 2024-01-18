export class ObstacleChecker {
    constructor(option = {}) {
        const system = option.system;
        system.update.submit(this);
        this.gameObject = option.gameObject;
        this.gameSize = option.gameSize;
    }

    update() {
        // this.warpOverGameEdge();
        this.collideGameEdge();
    }

    warpOverGameEdge() {
        const g = this.gameObject;

        // ゲームオブジェクトがゲームサイズの外に出ていないかチェック
        if (g.x + g.width < 0) {
            g.x = this.gameSize.width;  // 左から出たら右に出現
        }
        if (g.y + g.height < 0) {
            g.y = this.gameSize.height; // 上から出たら下に出現
        }
        if (g.x > this.gameSize.width) {
            g.x = - g.width;  // 右から出たら左に出現
        }
        if (g.y > this.gameSize.height) {
            g.y = - g.height;  // 下から出たら上に出現
        }
    }

    collideGameEdge() {
        const g = this.gameObject;

        // ゲームオブジェクトがゲームサイズの外に出ていないかチェック
        if (g.x < 0) {
            g.x = 0;  // 左から出たら右に出現
        }
        if (g.y < 0) {
            g.y = 0; // 上から出たら下に出現
        }
        if (g.x > this.gameSize.width) {
            g.x = - g.width;  // 右から出たら左に出現
        }
        if (g.y > this.gameSize.height) {
            g.y = - g.height;  // 下から出たら上に出現
        }
    }
}
