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
            { type: 'rect', rect: this.destinationPoint, lineWidth: 6, color: 'transparent' }
        ];
        this.baseShapeCount = this.drawShapes.length; // 予測点を除いた固定の図形数

        this.stateName = {default: 0, selected: 1, destinated: 2, shooted: 3};
        this.state = this.stateName.default;

        this.mover.rv = 0.002;
    }

    onClick(e) {
        if (this.state === this.stateName.destinated) {

            const isClickedDest = this.containsPoint( this.destinationPoint, e.client );

            if (isClickedDest) {
                this.state = this.stateName.shooted;
                this.clearPredictions();

                this.mover.to2(this.destinationPoint);
            }

        }

        if (this.state === this.stateName.default) {

            const isClicked = this.containsPoint( this.box, e.client );

            if (isClicked) {
                this.state = this.stateName.selected;
                this.drawShapes[0].color = this.colors.selected;
            }

        }
        else if (this.state === this.stateName.selected || this.state === this.stateName.destinated) {

            this.destinationPoint.x = e.client.x;
            this.destinationPoint.y = e.client.y;
            this.drawShapes[1].color = 'red';

            const simulatedMover = this.mover.clone();
            simulatedMover.to2(this.destinationPoint);
            const simulatedPositions = this.simulateMovements(simulatedMover, 10, 20);

            this.clearPredictions();
            simulatedPositions.forEach(position => {
                this.drawShapes.push({
                    type: 'rect',
                    rect: { x: position.x, y: position.y, w: 5, h: 5 }, // x, y は position、w, h は固定値
                    lineWidth: 1,
                    color: 'gray' // 必要に応じて色を変更
                });
            });

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

    clearPredictions() {
        this.drawShapes.splice(this.baseShapeCount);
    }

    // 渡されたmoverを進めるので、元のmoverを変化させたくない場合はclone()を渡す
    simulateMovements(mover, frameCount, interval = 1) {
        const positions = [];
    
        for (let i = 0; i < frameCount; i++) {
            for (let j = 0; j < interval; j++) {
                mover.update();
            }
            positions.push({ x: mover.box.x, y: mover.box.y });
        }
    
        return positions;
    }
}