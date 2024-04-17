export class PathMoving {
    constructor(option = {}) {
        option.system.update.submit(this);
        this.selfObject = option.selfObject;
        this.streetPath = option.streetPath;

        this.currentPath = [];
        this.reachIndex = 0;
        this.state = "none";

        this.isArrived = true;
        this.moveSpeed = 2;
    }

    walkTo(areaName, destinationName) {
        
        const path = this.streetPath.findCrossAreaPath(this.selfObject, areaName, destinationName);

        this.currentPath = path;
        this.reachIndex = 0;
        this.state = "moving";
        this.isArrived = false;
    }

    update() {
        switch (this.state) {
            case "none": {
                break;
            }
            case "moving": {
                try {

                    const point = this.currentPath[this.reachIndex];
                    this.selfObject.velocity = this.moveSpeed;
                    this.selfObject.moveTowardsPosition(point);

                    const reachRange = 10;
                    if (this.selfObject.distance(point) < reachRange) {
                        this.reachIndex++;
                        // Path配列の最後ならば移動終了
                        if (this.reachIndex >= this.currentPath.length) {
                            this.reachIndex = 0;
                            this.selfObject.stopMoving();
                            this.state = "none";
                            this.isArrived = true;
                        }

                    }

                } catch (error) {
                    console.log("PathMoving::update", error);
                }

                break;
            }
            default: {
                break;
            }
        }
    }

    findRandom() {
        const randomVertex = this.streetPath.getWorldRandomVertex();
        this.walkTo(randomVertex.belongingArea, randomVertex.name);
    }
}
