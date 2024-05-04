import { UndirectedPathGraph } from "./undirectedPathGraph";

export class StreetPath {
    constructor(option) {
        const system = option.system;
        this.drawer = system.drawer;
        system.render.submit(this);

        this.worldGraph = new UndirectedPathGraph();

        this.initPath();
    }

    initPath() {
        const cityGraphs = [];
        const worldRadius = 3000;

        // const cityRects = [
        //     {x: -1*worldRadius/4, y: -1*worldRadius/4, w: worldRadius/2, h: worldRadius/2},
        //     {x: -1*worldRadius, y: -1*worldRadius, w: worldRadius/4, h: worldRadius/4},
        // ];

        const cityRects = [];

        Array(8).fill().forEach(()=>{ this.generateNonOverlappingRect(worldRadius, cityRects) });

        for (let i = 0; i < cityRects.length; i++) {
            const areaName = "city" + i;
            const generatedGraph = this.generateGraphInRect(areaName, cityRects[i], 80, 40);
            cityGraphs.push(
                generatedGraph
            );
        }

        const worldRect = {x: -1*worldRadius, y: -1*worldRadius, w: worldRadius*2, h: worldRadius*2};
        const mapGraph = this.generateGraphInRect("map0", worldRect, 40, 100, cityRects);

        for (let i = 0; i < cityRects.length; i++) {
            const areaName = "city" + i;
            mapGraph.linkOtherGraphClosest(cityGraphs[i].vertices);

            this.worldGraph.addEdge(this.worldGraph.getVertexByName("map0"), this.worldGraph.getVertexByName( areaName ));
        }
    }

    generateNonOverlappingRect(worldRadius, cityRects) {
        const newRect = {
            x: Math.random() * worldRadius - worldRadius / 2,
            y: Math.random() * worldRadius - worldRadius / 2,
            w: Math.random() * worldRadius / 2,
            h: Math.random() * worldRadius / 2
        };
    
        let isOverlapping = false;
        for (const rect of cityRects) {
            if (
                newRect.x < rect.x + rect.w &&
                newRect.x + newRect.w > rect.x &&
                newRect.y < rect.y + rect.h &&
                newRect.y + newRect.h > rect.y
            ) {
                isOverlapping = true;
                break;
            }
        }
    
        if (!isOverlapping) {
            cityRects.push(newRect);
        } else {
            console.log("Generated rectangle is overlapping with existing rectangles. Retry generation.");
        }
    }

    generateGraphInRect(areaName, rect, vertexNum, removeRange, removeRects = []) {
        const graph = new UndirectedPathGraph();
        const {x,y,w,h} = rect;
        for (let j = 0; j < vertexNum; j++) {
            graph.addVertex({ x: x + Math.random() * w, y: y + Math.random() * h, belongingArea: areaName });
        }

        graph.removeCloseVertex(removeRange);
        if (removeRects.length > 0) graph.removeVerticesInsideRects(removeRects);
        graph.connectGroups();

        this.worldGraph.addVertex({ name: areaName, areaGraph: graph });
        
        return graph;
    }

    draw() {
        this.worldGraph.vertices.forEach((worldVertex) => {
            worldVertex.areaGraph.vertices.forEach((vertex) => {
                vertex.edges.forEach((edge) => {
                    this.drawer.line(vertex.x, vertex.y, edge.vertex.x, edge.vertex.y, { color: "#eeeeee", lineWidth: 20, rounded: true });
                });
            });
        });

        this.worldGraph.vertices.forEach((worldVertex) => {
            worldVertex.areaGraph.vertices.forEach((vertex) => {
                this.drawer.rect(vertex.x, vertex.y - 32, 20, 20, { color: "#fb6e38", isFill: true });
                this.drawer.text(vertex.name, vertex.x, vertex.y, { scalable: true });
            });
        });
    }

    getAreaGraphByName(graphName) {
        for (const worldVertex of this.worldGraph.vertices) {
            if (worldVertex.name === graphName) {
                return worldVertex.areaGraph;
            }
        }
    }

    getAreaGraphByVertex(currentVertex) {
        let areaGraph = null;
        this.worldGraph.vertices.forEach((worldVertex, worldGraphIndex) => {
            worldVertex.areaGraph.vertices.forEach((vertex) => {
                if (currentVertex == vertex) {
                    areaGraph = this.worldGraph.vertices[worldGraphIndex];
                }
            });
        });
        return areaGraph;
    }

    findNearestWorldVertex(currentPoint) {
        let nearestVertex = null;
        let distance = Infinity;
        this.worldGraph.vertices.forEach((worldVertex) => {
            const foundVertex = worldVertex.areaGraph.findNearestVertex(currentPoint);
            const fountDistance = foundVertex.distance(currentPoint);
            if (fountDistance < distance) {
                distance = fountDistance;
                nearestVertex = foundVertex;
            }
        });
        return nearestVertex;
    }

    findCrossAreaPath(currentPoint, areaName, destinationName) {
        const destinationAreaGraph = this.getAreaGraphByName(areaName);
        const destinationVertex = destinationAreaGraph.getVertexByName(destinationName);
        if (!destinationVertex) {
            return null;
        }
        return this.findCrossAreaPathByDestinationVertex(currentPoint, destinationVertex);
    }

    findCrossAreaPathByDestinationVertex(currentPoint, destinationVertex) {
        const areaName = destinationVertex.belongingArea;
        const nearestVertex = this.findNearestWorldVertex(currentPoint);

        const areaGraph = this.getAreaGraphByVertex(nearestVertex);
        const currentAreaName = areaGraph.name;
        const worldPath = this.worldGraph.shortestPathByName(currentAreaName, areaName);

        let crossAreaPath = [];

        worldPath.forEach((worldVertex, index) => {
            const areaGraph = worldVertex.areaGraph;

            let areaStartVertex = nearestVertex;
            if (index > 0) {
                areaStartVertex = areaGraph.getVertexByName(worldPath[index - 1].name);
            }

            let areaEndVertex = null;
            if (index + 1 < worldPath.length) {
                areaEndVertex = areaGraph.getVertexByName(worldPath[index + 1].name);
            } else {
                areaEndVertex = destinationVertex;
            }

            const areaPath = areaGraph.shortestPath(areaStartVertex, areaEndVertex);

            crossAreaPath.push(areaPath);
        });

        return [].concat(...crossAreaPath);
    }

    getWorldRandomVertex() {
        let randomAreaVertics = this.worldGraph.vertices[Math.floor(Math.random() * this.worldGraph.vertices.length)];
        return randomAreaVertics.areaGraph.getRandomVertex();
    }

    getRandomInCurrentArea(currentPoint) {
        const nearVertex = this.findNearestWorldVertex(currentPoint);
        let worldVertex = this.worldGraph.getVertexByName(nearVertex.belongingArea);
        return worldVertex.areaGraph.getRandomVertex();
    }
}
