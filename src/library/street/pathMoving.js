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

        this.log = {};
    }

    walk(path) {
        if (path) {
            this.currentPath = path;
            this.reachIndex = 0;
            this.state = "moving";
            this.isArrived = false;
        }
    }

    walkTo(areaName, destinationName) {
        
        const path = this.streetPath.findCrossAreaPath(this.selfObject, areaName, destinationName);

        this.walk(path);
    }

    walkToVertex(destinationVertex) {
        
        const path = this.streetPath.findCrossAreaPathByDestinationVertex(this.selfObject, destinationVertex);

        this.walk(path);
    }

    findInCurrentArea(destinationName) {
        const nearestVertex = this.streetPath.findNearestWorldVertex(this.selfObject);
        const currentArea = nearestVertex.belongingArea;
        const path = this.streetPath.findCrossAreaPath(this.selfObject, currentArea, destinationName);

        this.walk(path);
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
                            this.currentPath = [];
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
        this.walkToVertex(randomVertex);
    }
}
