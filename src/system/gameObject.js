export class GameObject {
  constructor(option = {}) {
    this.name = option.name || Math.random() * 10000;
    this.x = option.x || 0;
    this.y = option.y || 0;
    this.width = option.width || 10;
    this.height = option.height || 10;
  }

  // ゲームオブジェクトの描画メソッド
  draw() {
    // 描画のための共通の処理
  }

  // 衝突判定メソッド
  collidesWith(otherObject) {
    // 衝突判定のロジック
    // console.log("collide-debug", otherObject);
    this.x ++;
  }
}
