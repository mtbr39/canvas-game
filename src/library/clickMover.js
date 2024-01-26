export class ClickMover {
    constructor(option) {
        const system = option.system;
        this.system = system;
        system.update.submit(this);
        system.input.submitHandler({ eventName: "pointerdown", handler: this.pointerdownHandler.bind(this) });

        // 引数
        this.gameObject = option.gameObject;

        // 設定値
        this.moveVelocity = 4;
        this.minVelocity = this.moveVelocity * 0.1;

        // 利用値
        this.destination = { x: 0, y: 0 };
        this.isMove = false;
    }

    update() {
        if (this.isMove) {
            this.slowInRange();
        }
    }

    pointerdownHandler(ev) {
        const client = ev.client;
        this.move(client);

        // new GameObject({ system: this.system, x: client.x, y: client.y, shapeDraw: true });
    }

    move(position) {
        this.isMove = true;
        this.destination = {x: position.x - this.gameObject.width/2, y: position.y - this.gameObject.height/2};
        this.gameObject.velocity = this.moveVelocity;
        this.gameObject.moveTowardsPosition(this.destination);
        this.slowInRange();
    }

    slowInRange() {
        const distance = this.gameObject.distance(this.destination);
        const slowRange = this.moveVelocity * 10.0;

        if (distance < slowRange) {
            const distanceRate = distance / slowRange;
            const slowFactor = 1;
            const newVelocity = Math.max(this.minVelocity, this.lerp(this.moveVelocity, this.minVelocity, 1 - distanceRate));
            this.gameObject.velocity = newVelocity;
        }
        this.checkArrive();
    }

    checkArrive() {
        const distance = this.gameObject.distance(this.destination);
        if (distance < this.minVelocity * 2) {
            this.isMove = false;
            this.gameObject.velocity = 0;
        }
    }

    lerp(start, end, t) {
        return start * (1 - t) + end * t;
    }
}
