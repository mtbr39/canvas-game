export class Box {
    constructor(option = {}) {

        const respawn = option.respawn || [0, 0, 100, 100];
        const [rx,ry,rw,rh] = respawn;

        this.x = option.x || rx + Math.random() * rw;
        this.y = option.y || ry + Math.random() * rh;
        
        this.w = option.w || 10;
        this.h = option.h || 10;
        
    }

}
