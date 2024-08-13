

export class Backpack {
    constructor(option={}) {
        this.id = option.id || null;
        this.gold = 0;
        this.score = 0;

        this.eventConfigs = [
            {eventName: 'onKill', callback: this.onKill.bind(this)},
        ];

    }

    addScore(delta) {
        this.score += delta;
        console.log("delta-debug", delta, this.score);
    }

    onKill(data) {
        console.log("onkill-debug", data);
        this.addScore(11);
    }

}