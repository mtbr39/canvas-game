

export class HealthBar {
    constructor(option = {}) {

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

    }

    updateHealth() {

        if (this.current <= 0) {
            this.current = 0;
        }

        const rate = this.current / this.max;
        this.drawShapes[1].w = this.barWidth * rate;
    }

    dealDamage(damage) {
        this.current -= damage;
        this.updateHealth();
    }
}