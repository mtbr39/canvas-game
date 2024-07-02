import { State, StateManager } from "../module/state";

export class VillagerBehavior {
    constructor(option) {
        option.system.update.submit(this);
        option.system.render.submit(this);
        this.drawer = option.system.drawer;

        this.selfObject = option.selfObject;
        this.pathMoving = option.pathMoving;

        // this.state = "decide";
        this.afterArivalState = "";
        
        this.destinationText = "";

        this.stateTexts = {
            walkRandomPath: "ふらふらしている", 
            stop: "立ち止まっている",
            pathMove: "目的地に向かっている",
            宿屋で休む: "宿屋で休んでいる",
        };

        this.stateManager = new StateManager({actor: this, defaultState: decideState});
    }

    update() {
        this.stateManager.update();
    }

    changeStatePathMove(destinationText, nextState) {
        this.destinationText = destinationText;
        // this.changeState("pathMove");
        this.stateManager.setState(pathMoveState);
        this.afterArivalState = nextState;
    }

    update2() {
        switch (this.state) {
            
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
        const stateText = this.destinationText + "に向かっている";
        this.drawer.text(stateText, x, y - 10, { scalable: true });
        if (this.state === "pathMove") {
            const stateText = this.destinationText + "に向かっている";
            this.drawer.text(stateText, x, y - 10, { scalable: true });
        } else {
            let stateText = this.stateTexts[this.state] || this.state;
            // this.drawer.text(stateText, x, y - 10, { scalable: true });
            // this.drawer.text(this.state, x, y - 10, { scalable: true });
        }
    }
}

const decideState = {
    name: "decide",
    handleInput: (manager, actor, input) => {
        manager.setState(input);
    },
    update: (manager, actor) => {
        const dice = Math.random() * 100;
        if (dice > 60) {
            manager.setState(walkRandomPathState);
        } else if (dice > 40) {
            manager.setState(stopState);
        } else if (dice > 20) {
            manager.setState(goInnState);
        } 
        // else if (dice > 0) {
        //     manager.setState("武器屋に行く");
        // }

        // manager.setState(walkRandomPathState);
    }
}

const walkRandomPathState = {
    name: "walkRandomPath",
    handleInput: (manager, actor, input) => {
        manager.setState(input);
    },
    update: (manager, actor) => {
        manager.runOnce(() => {
            let isSuccess = false;
            if (Math.random() > 0.1) {
                isSuccess = actor.pathMoving.findRandomInCurrentArea();
            } else {
                isSuccess = actor.pathMoving.findRandom();
            }
            if (!isSuccess) {
                manager.setState(decideState);
            }
        });
        
        if (actor.pathMoving.isArrived) {
            manager.setState(decideState);
        }
    }
}

const pathMoveState = {
    name: "pathMove",
    handleInput: (manager, actor, input) => {
        manager.setState(input);
    },
    update: (manager, actor) => {
        if (actor.pathMoving.isArrived) {
            manager.setState(actor.afterArivalState);
        }
    }
}

const stopState = {
    name: "stop",
    handleInput: (manager, actor, input) => {
        manager.setState(input);
    },
    update: (manager, actor) => {
        manager.wait(60 + Math.floor(Math.random() * 120), () => {
            actor.pathMoving.stop();
            manager.setState(decideState);
        });
    }
}

// 宿屋に向かう
const goInnState = {
    name: "goInn",
    handleInput: (manager, actor, input) => {
        manager.setState(input);
    },
    update: (manager, actor) => {
        manager.runOnce(() => {
            const isSuccess = actor.pathMoving.findInCurrentArea("宿屋");
            if (isSuccess) {
                actor.changeStatePathMove("宿屋", restInnState);
            } else {
                manager.setState(walkRandomPathState);
            }
        });
    }
}

// 宿屋で休む
const restInnState = {
    name: "restInn",
    handleInput: (manager, actor, input) => {
        manager.setState(input);
    },
    update: (manager, actor) => {
        const storeFacility = actor.pathMoving.arrivedPlace.context.facilities.find((facility)=>{return facility.type === "宿屋"});
        if (storeFacility) {
            manager.runOnce(() => {
                if (storeFacility.checkIn() === "full") {
                    manager.setState(decideState);
                }
            });
            manager.wait(300 + Math.floor(Math.random() * 300), () => {
                storeFacility.checkOut();
                manager.setState(decideState);
            });
        } else {
            manager.setState(decideState);
        }
    }
}

// const State = {
//     handleInput: (manager, actor, input) => {
//         manager.setState(input);
//     },
//     update: (manager, actor) => {
        
//     }
// }
// case "武器屋に行く": {
//     this.runOnce(() => {
//         const isSuccess = this.pathMoving.findInCurrentArea("武器屋");
//         if (isSuccess) {
//             this.changeStatePathMove("武器屋", "買い物");
//         } else {
//             this.changeState("walkRandomPath");
//         }
//     });
//     break;
// }

// const State = {
//     handleInput: (manager, actor, input) => {
//         manager.setState(input);
//     },
//     update: (manager, actor) => {
        
//     }
// }
// case "買い物": {
//     const storeFacility = this.pathMoving.arrivedPlace.context.facilities.find((facility)=>{return facility.type === "武器屋"});
//     if (storeFacility) {
//         this.wait(180 + Math.floor(Math.random() * 180), () => {
//             storeFacility.buyGood("鉄の剣", 1);

//             this.changeState("decide");
//         });
//     }
//     break;
// }
