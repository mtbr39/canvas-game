export class PathMoving {
    constructor(option = {}) {
        option.system.update.submit(this);
        this.selfObject = option.selfObject;
        this.streetPath = option.streetPath;
        this.placeManager = option.placeManager;

        this.currentPath = [];
        this.reachIndex = 0;
        this.state = "none";

        this.isArrived = true;
        this.arrivedVertex = {};
        this.arrivedPlace = {};

        this.moveSpeed = 0.5 + Math.random() * 1.0;

        this.log = {};
    }

    walk(path) {
        if (path) {
            this.currentPath = path;
            this.reachIndex = 0;
            this.state = "moving";
            this.isArrived = false;

            return true;
        } else {
            return false;
        }
    }

    walkTo(areaName, destinationName) {
        
        const path = this.streetPath.findCrossAreaPath(this.selfObject, areaName, destinationName);

        return this.walk(path);
    }

    walkToVertex(destinationVertex) {
        
        const path = this.streetPath.findCrossAreaPathByDestinationVertex(this.selfObject, destinationVertex);

        return this.walk(path);
    }

    findInCurrentArea(facilityType) {
        const nearestVertex = this.streetPath.findNearestWorldVertex(this.selfObject);
        const currentArea = nearestVertex.belongingArea;
        let destinationVerteces = this.placeManager.getVertecesByFacilityType(facilityType);
        if (destinationVerteces.length === 0) {
            return null;
        }
        // currentAreaでない頂点をフィルタリングしてdestinationVertecesを更新
        destinationVerteces = destinationVerteces.filter(vertex => vertex.belongingArea === currentArea);
        const destinationVertex = destinationVerteces[Math.floor(Math.random()*destinationVerteces.length)];
        if (!destinationVertex) {
            return null;
        }
        const path = this.streetPath.findCrossAreaPathByDestinationVertex(this.selfObject, destinationVertex);

        return this.walk(path);
    }

    update() {
        switch (this.state) {
            case "none": {
                break;
            }
            case "moving": {
                try {

                    const point = this.currentPath[this.reachIndex];
                    let deceleration = 1;
                    // if (this.reachIndex > 0) {
                    //     const edgeLength = this.currentPath[this.reachIndex].distance(this.currentPath[this.reachIndex-1]);
                    //     const distanceToNext = this.selfObject.distance(point);
                    //     const distanceToPrevious = this.selfObject.distance(this.currentPath[this.reachIndex-1]);
                    //     deceleration = Math.min(distanceToPrevious, Math.min(edgeLength*0.4, distanceToNext))/(edgeLength*0.5);

                    // }
                    this.selfObject.velocity = this.moveSpeed * (0.5 + 0.5*deceleration);
                    this.selfObject.moveTowardsPosition(point);

                    const reachRange = 10;
                    if (this.selfObject.distance(point) < reachRange) {
                        this.reachIndex++;
                        // Path配列の最後ならば移動終了
                        if (this.reachIndex >= this.currentPath.length) {
                            this.arrivedVertex = this.currentPath[this.currentPath.length-1];
                            this.arrivedPlace = this.placeManager.getPlaceByVertex(this.arrivedVertex);

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

    findRandomInCurrentArea() {
        const randomVertex = this.streetPath.getRandomInCurrentArea(this.selfObject);
        this.walkToVertex(randomVertex);
    }
}
