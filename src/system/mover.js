export class Mover {
    constructor(option = {}) {
        this.box = option.box || { x: 0, y: 0, w: 50, h: 50 }; // 初期位置とサイズ

        this.position = [this.box.x, this.box.y]; // 位置ベクトル
        this.v = option.v || [0, 0]; // 速度ベクトル
        this.a = option.a || [0, 0]; // 加速度ベクトル
        // vがベクトルであるため角度の情報を含んでいる v=[x,y]かv=[r,Θ]の違い

        this.r = option.r || 0;   // 角度（ラジアン）
        this.rv = option.rv || 0; // 角速度（ラジアン/フレーム）

        this.friction = option.friction || 0.01; // 摩擦係数
    }

    update() {
        // 加速度を速度に加算
        this.v = Vector.add(this.v, this.a);

        // 摩擦を適用
        const speed = Vector.magnitude(this.v);
        if (speed > 0) {
            const friction = this.friction * speed;

            const frictionVector = Vector.scale(Vector.normalize(this.v), -friction);
            this.v = Vector.add(this.v, frictionVector);

            // 極小速度はゼロにする（静止状態への遷移）
            if (Vector.magnitude(this.v) < 0.01) {
                this.v = [0, 0];
            }
        }

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

    to(point, speed) {
        this.rv = 0;
        // 目標点へのベクトルを計算
        const targetVector = Vector.sub([point.x, point.y], this.position);

        // 正規化（単位ベクトル化）
        const normalizedVector = Vector.normalize(targetVector);

        // 指定された速度を掛けて速度ベクトルを設定
        this.v = Vector.scale(normalizedVector, speed);
    }

    to2(point) {
        this.rv = 0;
        const targetVector = Vector.sub([point.x, point.y], this.position);
        const distance = Vector.magnitude(targetVector);

        // 摩擦を考慮して必要な初期速度を計算
        const requiredSpeed = Math.sqrt(2 * this.friction * distance);

        // 正規化（単位ベクトル化）
        const normalizedVector = Vector.normalize(targetVector);

        // 初期速度を設定
        this.v = Vector.scale(normalizedVector, requiredSpeed);
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
    scale(v, scalar) {
        return [v[0] * scalar, v[1] * scalar];
    }
};

