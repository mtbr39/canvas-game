export class VillagerBehavior {
    constructor(option) {
        option.system.update.submit(this);
        option.system.render.submit(this);
        this.drawer = option.system.drawer;

        this.selfObject = option.selfObject;
        this.pathMoving = option.pathMoving;

        this.state = "walkRandomPath";
        this.stateCount = 0;


    }

    update() {
        switch (this.state) {
            case "decide": {
                const dice = Math.random() * 100;
                if (dice > 50) {
                    this.state = "walkRandomPath";
                } else {
                    this.state = "stop";
                    this.stateCount = 60 + Math.floor(Math.random()) * 120;
                }
                break;
            }
            case "walkRandomPath": {
                this.pathMoving.findRandom();
                this.state = "pathMove";
                break;
            }
            case "pathMove": {
                if (this.pathMoving.isArrived) {
                    this.state = "decide";
                }
                break;
            }
            case "stop": {
                this.stateCount--;
                if (this.stateCount < 0) {
                    this.state = "decide";
                }
                break;
            }
            case "宿屋に行く": {
                this.pathMoving.walkTo("city0", "宿屋");
                this.state = "pathMove";
                break;
            }
            default: {
                break;
            }
        }

    }

    draw() {
        const {x, y} = this.selfObject;
        this.drawer.text(this.state, x, y-10, {scalable: true});
    }
}