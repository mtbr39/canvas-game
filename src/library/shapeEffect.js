export class ShapeEffect {
    constructor(option) {
        const system = option.system;
        system.render.submit(this);
        this.drawer = system.drawer;

        this.position = {x:0, y:0};

        this.isPlaying = false;
        this.count = 0;
    }

    play(option) {
        this.position = option.position;
        this.isPlaying = true;
        this.count = 0;
    }

    draw() {
        

        if (this.isPlaying) {
            this.count++;
            for (let i=0; i<5; i++) {
                // x = x * ( 1 + randomRange*(Math.random()-0.5));
                // y = y * ( 1 + randomRange*(Math.random()-0.5));
                this.playPulse(this.position, this.count+i, 3, 40, {color: "white"});
            }
            
        }
    }

    playPulse(position, count, speed, fadingTime=600, option={}) {
        let {x, y} = position;
        let radius = count * speed;
        let alpha = Math.max((fadingTime-count) / fadingTime, 0);
        option.alpha = alpha;

        this.drawer.circle(x, y, radius, option);
    }
}