export class ShootableStone {
    constructor(option = {}) {

        this.box = option.box;
        this.mover = option.mover;

        this.inputConfigs = [
            {
                eventName: 'pointerdown',handler: this.onClick.bind(this)
            }
        ];

        this.colors = {
            selected: 'blue',
        }

        this.destinationPoint = {x:0, y:0, w: 10, h: 10};

        this.drawShapes = [
            { type: 'rect', rect: this.box, lineWidth: 6, color: 'transparent' },
            { type: 'rect', rect: this.destinationPoint, lineWidth: 6, color: 'white' }
        ];

        this.stateName = {default: 0, selected: 1, destinated: 2, shooted: 3};
        this.state = this.stateName.default;
    }

    onClick(e) {
        if (this.state === this.stateName.destinated) {

            const isClickedDest = this.containsPoint( this.destinationPoint, e.client );

            if (isClickedDest) {
                this.state = this.stateName.shooted;

                // this.mover.f();
                this.mover.to2(this.destinationPoint);
                // this.mover.v = [1, 0];
                // this.mover.rv = 0;
            }

        }

        if (this.state === this.stateName.default) {

            const isClicked = this.containsPoint( this.box, e.client );

            if (isClicked) {
                // this.setActive(true);
    
                this.state = this.stateName.selected;
                this.drawShapes[0].color = this.colors.selected;
            }

        }
        else if (this.state === this.stateName.selected || this.state === this.stateName.destinated) {

            this.destinationPoint.x = e.client.x;
            this.destinationPoint.y = e.client.y;
            this.drawShapes[1].color = 'red';

            this.state = this.stateName.destinated;
        }
        
    }

    containsPoint(box, point) {
        if (
            box.x <= point.x &&
            point.x <= box.x + box.w &&
            box.y <= point.y &&
            point.y <= box.y + box.h
        ) {
            return true;
        } else {
            return false;
        }
    }
}