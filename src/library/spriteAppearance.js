export class SpriteAppearance {
    constructor(option = {}) {
        const system = option.system;
        system.render.submit(this);

        this.gameObject = option.gameObject;
        this.drawer = system.drawer;

        this.imageName = "walkGirl";
        this.frame = 0;
        this.animationFrame = 0;
    }

    draw() {
        const g = this.gameObject;

        if (g.velocity > 0.1) {
            this.incrementAnimationFrame();
        } else {
            this.frame = 0;
        }

        let isflipX = false;
        // gが右を向いているかどうか
        const isRightFacing = g.direction >= (-1 * Math.PI) / 2 && g.direction <= Math.PI / 2;
        if (isRightFacing) {
            isflipX = true;
        }

        // gがimageの足元に来るように調整
        const spriteWidth = g.width * 4;
        this.drawer.setShadow(0, 0, 2, "rgba(255, 255, 255, 0.5)");
        this.drawer.image(
            this.imageName + this.frame,
            g.x - spriteWidth * 0.35,
            g.y - spriteWidth * 0.7,
            { width: g.width * 4, isflipX: isflipX, shadow: [] }
        );
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
