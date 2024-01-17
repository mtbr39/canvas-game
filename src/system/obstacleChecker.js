export class ObstacleChecker {
    constructor(option = {}) {
        this.gameObject = option.gameObject;
        this.gameSize = option.gameSize;
    }

    update() {
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
}
