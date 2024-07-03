export class PenManager {
    constructor(option) {
        const system = option.system;
        system.render.submit(this);
        system.input.submitHandler({eventName: "pointerdown", handler: this.pointerdownHandler.bind(this)});

        this.drawer = system.drawer;

        this.streetGenerator = option.streetGenerator;
        this.streetPath = this.streetGenerator.streetPath;


        this.currentSelectedVertex = null;
    }

    pointerdownHandler(ev) {
        const client = ev.client;

        

        const clickPosition = {x: client.x, y: client.y};
        const nearestV = this.streetPath.findNearestWorldVertex(clickPosition);

        if (this.currentSelectedVertex) {
            // 頂点を選択した状態でクリックしたら、新しく頂点を作る
            const currentArea = this.streetPath.getAreaByVertex(this.currentSelectedVertex);
            const currentAreaGraph = currentArea.areaGraph;
            const currentAreaName = currentArea.name;
            
            
            const newV = currentAreaGraph.addVertex({x: clickPosition.x, y: clickPosition.y, belongingArea: currentAreaName});
            currentAreaGraph.addEdge(this.currentSelectedVertex, newV);

            this.currentSelectedVertex = null;
        } else {
            // 頂点を選択してない状態でクリックしたら、頂点を選択する
            this.currentSelectedVertex = nearestV;
        }
        
    }

    draw() {
        // 現在選択している点を表示する
        if (this.currentSelectedVertex) {
            const {x, y} = this.currentSelectedVertex;
            this.drawer.circle(x, y, 10, {color: "red"});
        }
    }

}