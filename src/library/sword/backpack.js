

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
        console.log("delta-info", delta, this.score);
    }

    onKill(data) {
        console.log("onkill-info", data);
        this.addScore(11);
    }

}