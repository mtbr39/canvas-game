export class VillagerBehavior {
    constructor(option) {
        option.system.update.submit(this);
        option.system.render.submit(this);
        this.drawer = option.system.drawer;

        this.selfObject = option.selfObject;
        this.pathMoving = option.pathMoving;

        this.state = "宿屋で休む";
        this.stateCount = 0;
        this.doneOnce = false;
        this.doneOnceWait = false;

        this.stateTexts = {
            stop: "立ち止まっている",
            pathMove: "目的地に向かっている",
            "宿屋で休む": "宿屋で休んでいる"
        }
    }

    changeState(state) {
        this.state = state;
        this.doneOnce = false;
    }

    runOnce( runFunction ) {
        if (!this.doneOnce) {
            runFunction();
            this.doneOnce = true;
        }
    }

    wait(waitTime, callback) {
        if (!this.doneOnceWait) {
            this.stateCount = waitTime;
            this.doneOnceWait = true;
        }
        this.stateCount--;
        if (this.stateCount < 0) {
            this.doneOnceWait = false;
            callback();
        }
    }

    update() {
        switch (this.state) {
            case "decide": {
                const dice = Math.random() * 100;
                if (dice > 50) {
                    this.changeState("walkRandomPath");
                } else {
                    this.changeState("stop");
                }
                break;
            }
            case "walkRandomPath": {
                this.runOnce(()=>{this.pathMoving.findRandom();})
                
                if (this.pathMoving.isArrived) {
                    this.changeState("decide");
                }
                break;
            }
            case "stop": {
                this.wait(60 + Math.floor(Math.random() * 120), () => {
                    this.changeState("decide");
                });
                break;
            }
            case "宿屋で休む": {
                this.runOnce(()=>{this.pathMoving.findInCurrentArea("宿屋");})

                if (this.pathMoving.isArrived) {
                    this.wait(300 + Math.floor(Math.random() * 300), () => {
                        this.changeState("decide");
                    });
                }
                break;
            }
            default: {
                break;
            }
        }

    }

    draw() {
        const {x, y} = this.selfObject;
        const stateText = this.stateTexts[this.state];
        if (stateText) {
            this.drawer.text(stateText, x, y-10, {scalable: true});
        }
        
    }
}