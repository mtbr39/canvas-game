export class VillagerBehavior {
    constructor(option) {
        option.system.update.submit(this);
        option.system.render.submit(this);
        this.drawer = option.system.drawer;

        this.selfObject = option.selfObject;
        this.pathMoving = option.pathMoving;

        this.state = "decide";
        this.afterArivalState = "";
        this.stateCount = 0;
        this.doneOnce = false;
        this.doneOnceWait = false;
        this.destinationText = "";

        this.stateTexts = {
            walkRandomPath: "ふらふらしている", 
            stop: "立ち止まっている",
            pathMove: "目的地に向かっている",
            宿屋で休む: "宿屋で休んでいる",
        };
    }

    changeState(state) {
        this.state = state;
        this.doneOnce = false;
    }

    changeStatePathMove(destinationText, nextState) {
        this.destinationText = destinationText;
        this.changeState("pathMove");
        this.afterArivalState = nextState;
    }

    runOnce(runFunction) {
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
                if (dice > 60) {
                    this.changeState("walkRandomPath");
                } else if (dice > 40) {
                    this.changeState("stop");
                } else if (dice > 20) {
                    this.changeState("宿屋に向かう");
                } else if (dice > 0) {
                    this.changeState("武器屋に行く");
                }
                break;
            }
            case "walkRandomPath": {
                this.runOnce(() => {
                    if (Math.random() > 0.1) {
                        this.pathMoving.findRandomInCurrentArea();
                    } else {
                        this.pathMoving.findRandom();
                    }
                });

                if (this.pathMoving.isArrived) {
                    this.changeState("decide");
                }
                break;
            }
            case "pathMove": {
                if (this.pathMoving.isArrived) {
                    this.changeState(this.afterArivalState);
                }
                break;
            }
            case "stop": {
                this.wait(60 + Math.floor(Math.random() * 120), () => {
                    this.changeState("decide");
                });
                break;
            }
            case "宿屋に向かう": {
                this.runOnce(() => {
                    const isSuccess = this.pathMoving.findInCurrentArea("宿屋");
                    if (isSuccess) {
                        this.changeStatePathMove("宿屋", "宿屋で休む");
                    } else {
                        this.changeState("walkRandomPath");
                    }
                });
                break;
            }
            case "宿屋で休む": {
                const storeFacility = this.pathMoving.arrivedPlace.context.facilities.find((facility)=>{return facility.type === "宿屋"});
                if (storeFacility) {
                    this.runOnce(() => {
                        if (storeFacility.checkIn() === "full") {
                            this.changeState("decide");
                        }
                    });
                    this.wait(300 + Math.floor(Math.random() * 300), () => {
                        storeFacility.checkOut();
                        this.changeState("decide");
                    });
                } else {
                    this.changeState("decide");
                }

                break;
            }
            case "武器屋に行く": {
                this.runOnce(() => {
                    const isSuccess = this.pathMoving.findInCurrentArea("武器屋");
                    if (isSuccess) {
                        this.changeStatePathMove("武器屋", "買い物");
                    } else {
                        this.changeState("walkRandomPath");
                    }
                });
                break;
            }
            case "買い物": {
                const storeFacility = this.pathMoving.arrivedPlace.context.facilities.find((facility)=>{return facility.type === "武器屋"});
                if (storeFacility) {
                    this.wait(180 + Math.floor(Math.random() * 180), () => {
                        storeFacility.buyGood("鉄の剣", 1);

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
        const { x, y } = this.selfObject;
        if (this.state === "pathMove") {
            const stateText = this.destinationText + "に向かっている";
            this.drawer.text(stateText, x, y - 10, { scalable: true });
        } else {
            let stateText = this.stateTexts[this.state] || this.state;
            // this.drawer.text(stateText, x, y - 10, { scalable: true });
        }
    }
}
