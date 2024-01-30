export class SpriteAppearance {
    constructor(option = {}) {
        const system = option.system;
        system.render.submit(this);

        this.gameObject = option.gameObject;
        this.drawer =  system.drawer;

        this.imageName = "walkGirl";
        this.frame = 0;
        this.animationFrame = 0;
    }

    draw() {
        const g = this.gameObject;

        if (g.velocity > 0.1) { //動いてるならば
            this.incrementAnimationFrame();
        } else {
            this.frame = 0;
        }
        this.drawer.image(this.imageName + (this.frame), g.x, g.y);
    }

    incrementAnimationFrame() {
        // animationFrame を増やす
        this.animationFrame++;

        // 10フレームごとに incrementFrame を呼び出す
        if (this.animationFrame % 10 === 0) {
            this.incrementFrame();
        }
    }

    incrementFrame() {
        this.frame++;
        if (this.frame > 3) {
            this.frame = 0;
        }
    }
}
