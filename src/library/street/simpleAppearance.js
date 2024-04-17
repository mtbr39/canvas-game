export class SimpleAppearance {
    constructor(option) {
        option.system.render.submit(this);
        this.drawer = option.system.drawer;

        this.gameObject = option.gameObject;

        this.pulseAnime = -1;
    }

    draw() {
        const {x, y} = this.gameObject;
        this.drawer.circle(x, y, 4, {lineWidth: 4});

        const timeLength = 60;
        this.pulseAnime--;
        if (this.pulseAnime > 0) {
            this.drawer.circle(x, y, Math.sqrt(timeLength-this.pulseAnime)*6, {lineWidth: 2, alpha: this.pulseAnime/timeLength});
        } else if (this.pulseAnime < -timeLength/2) {
            this.pulseAnime = timeLength;
        }
    }
}