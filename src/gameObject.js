export class GameObject {
  constructor(name, x=0, y=0, width=10, height=20) {
    this.name = name;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
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
