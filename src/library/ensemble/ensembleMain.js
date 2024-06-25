
const ensemble = {
    init(reson) {
        console.log("qweqwe");

        const Reson = reson;

        Reson.systemList.render.setBackGroundColor("white");
        const obj01 = new Obj1({system: Reson.systemList});



    },


};

export default ensemble;

class Obj1 {
    constructor(option) {
        const system = option.system;
        system.render.submit(this);
        // system.update.submit(this);
        // system.collision.submit(this);
        this.drawer = system.drawer;

        this.time = 0;
        this.timeSpeed = 0.01;
    }

    draw() {
        this.time += this.timeSpeed;
        const time = this.time;

        this.drawer.rect(10*time,0,100,100, {color: 'black'});
    }

}