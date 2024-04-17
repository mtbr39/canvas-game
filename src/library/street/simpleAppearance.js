export class SimpleAppearance {
    constructor(option) {
        option.system.render.submit(this);
        this.drawer = option.system.drawer;

        this.gameObject = option.gameObject;
        this.color = option.color || "gray";

        this.timeLength = 60;
        this.pulseAnime = -1;
    }

    draw() {
        const { x, y } = this.gameObject;
        this.drawer.circle(x, y, 2, { lineWidth: 2, color: this.color });

        if (this.pulseAnime > 0) {
            this.pulseAnime--;
            this.drawer.circle(x, y, Math.sqrt(this.timeLength - this.pulseAnime) * 6, {
                lineWidth: 2,
                alpha: this.pulseAnime / this.timeLength,
                color: this.color,
            });
        }
    }

    playPulseAnime() {
        this.pulseAnime = this.timeLength;
    }
}
