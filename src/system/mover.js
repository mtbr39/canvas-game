export class Mover {
    constructor(option = {}) {
        this.box = option.box || { x: 0, y: 0, w: 50, h: 50 }; // 初期位置とサイズ

        this.position = [this.box.x, this.box.y]; // 位置ベクトル
        this.v = option.v || [0, 0]; // 速度ベクトル
        this.a = option.a || [0, 0]; // 加速度ベクトル
        // vがベクトルであるため角度の情報を含んでいる v=[x,y]かv=[scalar,theta]の違い

        this.r = option.r || 0;   // 角度（ラジアン）
        this.rv = option.rv || 0; // 角速度（ラジアン/フレーム）
    }

    update() {
        // 加速度を速度に加算
        this.v = Vector.add(this.v, this.a);

        // 速度の角度を計算して更新
        this.r = Math.atan2(this.v[1], this.v[0]);

        // 角速度に応じて速度ベクトルを回転
        const cosRv = Math.cos(this.rv);
        const sinRv = Math.sin(this.rv);
        const [vx, vy] = this.v;

        this.v = [
            vx * cosRv - vy * sinRv,
            vx * sinRv + vy * cosRv,
        ];

        // 速度を位置に加算
        this.position = Vector.add(this.position, this.v);

        // boxの位置を更新
        this.box.x = this.position[0];
        this.box.y = this.position[1];
    }
}



const Vector = {
    add(v1, v2) {
        return [v1[0] + v2[0], v1[1] + v2[1]];
    },
    sub(v1, v2) {
        return [v1[0] - v2[0], v1[1] - v2[1]];
    },
    scale(v, scalar) {
        return [v[0] * scalar, v[1] * scalar];
    },
    magnitude(v) {
        return Math.sqrt(v[0] ** 2 + v[1] ** 2);
    },
    normalize(v) {
        const mag = this.magnitude(v);
        return mag === 0 ? [0, 0] : [v[0] / mag, v[1] / mag];
    },
};

