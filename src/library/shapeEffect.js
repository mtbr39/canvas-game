export class ShapeEffect {
    constructor(option) {
        const system = option.system;
        system.render.submit(this);
        this.drawer = system.drawer;

        this.position = { x: 0, y: 0 };

        this.isPlaying = false;
        this.count = 0;
        this.fadeTime = 0;
    }

    play(option) {
        this.position = option.position;
        this.isPlaying = true;
        this.count = 0;
        this.fadeTime = option.fadeTime || 40;
    }

    draw() {
        if (this.isPlaying) {
            if (this.count <= this.fadeTime) this.count++;
            else this.isPlaying = false;

            for (let i = 0; i < 5; i++) {
                this.playPulse(this.position, this.count + i, 3, this.fadeTime, { color: "white" });
            }
        }
    }

    playPulse(position, count, speed, fadingTime = 600, option = {}) {
        let { x, y } = position;
        let radius = count * speed;
        let alpha = Math.max((fadingTime - count) / fadingTime, 0);
        option.alpha = alpha;

        this.drawer.circle(x, y, radius, option);
    }
}
