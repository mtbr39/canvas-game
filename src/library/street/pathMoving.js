export class PathMoving {
    constructor(option = {}) {
        option.system.update.submit(this);
        this.selfObject = option.selfObject;
        this.streetPath = option.streetPath;

        this.currentPath = [];
        this.reachIndex = 0;
        this.state = "none";

        this.walkTo("宿屋");
    }

    walkTo(destinationName) {
        const areaGraph = this.streetPath.getAreaGraphByName("city01");
        const nearestVertex = areaGraph.findNearestVertex(this.selfObject);
        const destinationVertex = areaGraph.getVertexByName("宿屋");

        const path = areaGraph.shortestPath(nearestVertex, destinationVertex);
        this.currentPath = path;
        this.reachIndex = 0;
        this.state = "moving";

        console.log("near-debug", nearestVertex, destinationVertex, path);
    }

    update() {
        switch (this.state) {
            case "none": {
                break;
            }
            case "moving": {
                try {

                    const point = this.currentPath[this.reachIndex];
                    this.selfObject.moveTowardsPosition(point);

                    const reachRange = 10;
                    if (this.selfObject.distance(point) < reachRange) {
                        this.reachIndex++;
                        // Path配列の最後ならば移動終了
                        if (this.reachIndex >= this.currentPath.length) {
                            this.selfObject.stopMoving();
                            this.state = "none";
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
}
