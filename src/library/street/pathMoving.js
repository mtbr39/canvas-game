export class PathMoving {
    constructor(option = {}) {
        this.selfObject = option.selfObject;
        this.streetPath = option.streetPath;

        this.walkTo("宿屋");
    }

    walkTo(destinationName) {
        const areaGraph = this.streetPath.getAreaGraphByName("city01");
        const nearestVertex = areaGraph.findNearestVertex(this.selfObject);
        console.log("near-debug", nearestVertex);
    }

}