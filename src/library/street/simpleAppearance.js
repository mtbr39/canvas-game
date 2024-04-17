export class SimpleAppearance {
    constructor(option) {
        option.system.render.submit(this);
        this.drawer = option.system.drawer;

        this.gameObject = option.gameObject;

        this.timeLength = 60;
        this.waitTime = 30;

        this.pulseAnime = (-1) * Math.random() * this.waitTime; // 負の数の時がアニメの待ち時間
    }

    draw() {
        const {x, y} = this.gameObject;
        this.drawer.circle(x, y, 4, {lineWidth: 4});

        this.pulseAnime--;
        if (this.pulseAnime > 0) {
            this.drawer.circle(x, y, Math.sqrt(this.timeLength-this.pulseAnime)*6, {lineWidth: 2, alpha: this.pulseAnime/this.timeLength});
        } else if (this.pulseAnime < -1 * this.waitTime) {
            this.pulseAnime = this.timeLength;
        }
    }
}