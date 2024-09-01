

export class HealthBar {
    constructor(option = {}) {

        this.id = option.id || null;

        const {
            gameObject,
            barType = 'medium',
        } = option;

        let barHeight, barWidth;
        if (barType === 'medium') {
            barHeight = 8;
            barWidth = 60;
        }
        if (barType === 'small') {
            barHeight = 2;
            barWidth = 20;
        }
        this.barWidth = barWidth;

        this.max = 1000;
        this.current = this.max;


        this.drawShapes = [
            {type: 'rect', positionObject: gameObject, w: barWidth, h: barHeight, offsetX: -1*barWidth/2, offsetY: -30, isSizeFix: true, color: "#3C3C3C", isFill: true},
            {type: 'rect', positionObject: gameObject, w: barWidth, h: barHeight, offsetX: -1*barWidth/2, offsetY: -30, isSizeFix: true, color: "#34EFAE", isFill: true}
        ];

        this.sendEvent = true;

        // this.isHostControlled = !!option.isHostControlled;

    }

    updateBar() {

        const rate = this.current / this.max;
        this.drawShapes[1].w = this.barWidth * rate;

    }

    dealDamage(damageData) {
        this.current -= damageData.damage;

        if (this.current <= 0) {
            this.current = 0;
            this.onDead(damageData.sourceID);
        }

        this.updateBar();
    }

    onDead(killerID) {
        const data = {
            killerID,
            deadID : this.id
        };
        this.sendEvent('onKill', data)
    }
}