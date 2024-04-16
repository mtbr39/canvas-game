export class StreetPath {
    constructor(option) {
        const system = option.system;
        this.drawer = system.drawer;
        system.render.submit(this);

        this.worldMapGraph = new UndirectedPathGraph();
        this.graph1 = {};

        this.initPath();
    }

    initPath() {
        // let pathMap = {
        //     array: [
        //         {
        //             id: 0,
        //             placeName: "hospital",
        //             isArea: false,
        //             area: {},
        //             point: {},
        //             connectedPoint: {},
        //             routeInfo: [
        //                 {
        //                     destination: "dest-name01",
        //                     nextPointId: 13,
        //                 },
        //                 {
        //                     destination: "dest-name01",
        //                     nextPointId: 13,
        //                 },
        //             ],
        //         },
        //     ],
        // };

        this.graph1 = new UndirectedPathGraph();
        const min = 100;
        const max = 800;
        for (let i = 0; i < 40; i++) {
            this.graph1.addVertex({ x: Math.random() * (max - min), y: Math.random() * (max - min) });
        }

        this.graph1.removeCloseVertex(20);
        this.graph1.connectGroups();

        const innVertex = this.graph1.getRandomVertex();
        const fieldVertex = this.graph1.getRandomVertex();
        innVertex.name = "宿屋";
        fieldVertex.name = "フィールド";

        // let path = this.graph1.shortestPath(innVertex, fieldVertex);
        let path = this.graph1.shortestPathByName("宿屋", "フィールド");

        this.worldMapGraph.addVertex({name: "city01", areaGraph: this.graph1});

        console.log("graph-debug2", path, this.worldMapGraph);
    }

    draw() {
        this.graph1.vertices.forEach((vertex) => {
            this.drawer.circle(vertex.x, vertex.y, 10);
            this.drawer.text(vertex.name, vertex.x, vertex.y);
            vertex.edges.forEach((edge) => {
                // console.log("ve-debug", edge.vertex.x, vertex.x);
                this.drawer.line(vertex.x, vertex.y, edge.vertex.x, edge.vertex.y);
            });
        });
    }

    getAreaGraphByName(graphName) {
        for (const worldMapVertex of this.worldMapGraph.vertices) {
            if (worldMapVertex.name === graphName) {
                return worldMapVertex.areaGraph;
            }
        }
    }
}

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    distance(point2) {
        return Math.sqrt(Math.pow(point2.x - this.x, 2) + Math.pow(point2.y - this.y, 2));
    }
}

class PathVertex {
    constructor(option = {}) {
        this.edges = [];

        this.x = option.x || 0;
        this.y = option.y || 0;
        this.name = option.name || "";
        this.areaGraph = option.areaGraph || "";
    }

    distance(vertex2) {
        return Math.sqrt(Math.pow(vertex2.x - this.x, 2) + Math.pow(vertex2.y - this.y, 2));
    }
}

class Edge {
    constructor(vertex, weight = 0) {
        this.vertex = vertex;
        this.weight = weight;
    }
}

class UndirectedPathGraph {
    constructor() {
        this.vertices = [];
    }

    addVertex(value) {
        const newVertex = new PathVertex(value);
        this.vertices.push(newVertex);
        return newVertex;
    }

    // 辺を追加するメソッド
    addEdge(vertex1, vertex2) {
        if (!vertex1 instanceof PathVertex || !vertex2 instanceof PathVertex) {
            throw new Error("Both arguments must be instances of Vertex");
        }

        if (vertex1 === vertex2) {
            // 自分自身とは結ばないようにする
            return;
        }

        //頂点同士の距離を辺の重みとする
        const weight = vertex1.distance(vertex2);

        vertex1.edges.push(new Edge(vertex2, weight));

        // 無向グラフの性質を考慮して、vertex2からvertex1への辺を追加する必要がある
        if (!vertex2.edges.some((edge) => edge.vertex === vertex1)) {
            vertex2.edges.push(new Edge(vertex1, weight));
        }
    }

    // 頂点を削除するメソッド
    removeVertex(vertexToRemove) {
        // 削除対象の頂点を配列からフィルタリングして削除する
        this.vertices = this.vertices.filter((vertex) => vertex !== vertexToRemove);

        // 削除された頂点に接続されている辺を削除する
        this.vertices.forEach((vertex) => {
            vertex.edges = vertex.edges.filter((edge) => edge.vertex !== vertexToRemove);
        });
    }

    findNearestVertex(point) {
        let nearestVertex = null;
        let minDistance = Infinity;
    
        for (const vertex of this.vertices) {
            // PathVertexクラスのdistanceメソッドを使用して距離を計算
            const distance = vertex.distance(point);
            if (distance < minDistance) {
                minDistance = distance;
                nearestVertex = vertex;
            }
        }
    
        return nearestVertex;
    }

    removeCloseVertex(minDistance) {
        // 頂点をループして近すぎる頂点を検出し、取り除く
        for (let i = 0; i < this.vertices.length; i++) {
            const vertex1 = this.vertices[i];
            for (let j = i + 1; j < this.vertices.length; j++) {
                const vertex2 = this.vertices[j];
                if (vertex1.distance(vertex2) < minDistance) {
                    // vertex1とvertex2が近すぎる場合、vertex2を取り除く
                    this.removeVertex(vertex2);
                    j--; // 頂点が1つ減ったため、再度同じインデックスをチェックする必要がある
                }
            }
        }
    }

    getRandomVertex() {
        return this.vertices[Math.floor(Math.random() * this.vertices.length)];
    }

    getVertexByName(name) {
        for (const vertex of this.vertices) {
            if (vertex.name === name) {
                return vertex;
            }
        }
        return null; // 該当する頂点が見つからない場合はnullを返す
    }

    isConnected() {
        const visited = new Array(this.vertices.length).fill(false);

        // 深さ優先探索を使用して連結性を確認する
        const dfs = (vertex) => {
            visited[vertex] = true;
            this.vertices[vertex].edges.forEach((edge) => {
                const neighbor = this.vertices.indexOf(edge.vertex);
                if (!visited[neighbor]) {
                    dfs(neighbor);
                }
            });
        };

        dfs(0); // 0番目の頂点から深さ優先探索を開始
        return visited.every((value) => value);
    }

    // グラフを連結にするメソッド
    connectGroups() {
        // グループを作成し、各頂点を個別のグループに配置する
        const groups = this.vertices.map((vertex) => [vertex]);

        // グラフが連結でない場合は処理を繰り返す
        while (!this.isConnected()) {
            let minDistance = Infinity;
            let closestVertex1 = null;
            let closestVertex2 = null;

            // 各グループ内の各頂点と他のグループの各頂点の距離を計算し、最も近い頂点同士を見つける
            groups.forEach((group) => {
                group.forEach((vertex1) => {
                    this.vertices.forEach((vertex2) => {
                        if (!group.includes(vertex2)) {
                            const distance = vertex1.distance(vertex2);
                            if (distance < minDistance) {
                                minDistance = distance;
                                closestVertex1 = vertex1;
                                closestVertex2 = vertex2;
                            }
                        }
                    });
                });
            });

            // 最も近い頂点同士を辺で結ぶ
            if (closestVertex1 && closestVertex2) {
                this.addEdge(closestVertex1, closestVertex2);
            }

            // グループを統合
            const indexToRemove = groups.findIndex((group) => group.includes(closestVertex2));
            groups[indexToRemove].push(...groups.find((group) => group.includes(closestVertex1)));
            groups.splice(
                groups.findIndex((group) => group.includes(closestVertex1)),
                1
            );
        }
    }

    shortestPathByName(startName, endName) {
        const startVertex = this.getVertexByName(startName);
        const endVertex = this.getVertexByName(endName);
        return this.shortestPath(startVertex, endVertex);
    }

    // 始点から終点までの最短経路を求めるメソッド
    shortestPath(startVertex, endVertex) {
        const distances = new Map(); // 頂点ごとの最短距離を保持するマップ
        const visited = new Set(); // 訪れた頂点を記録するセット
        const previousVertices = new Map(); // 最短経路を保持するマップ

        this.vertices.forEach((vertex) => {
            distances.set(vertex, vertex === startVertex ? 0 : Infinity);
        });

        while (visited.size < this.vertices.length) {
            const currentVertex = this.getVertexWithMinDistance(distances, visited);

            currentVertex.edges.forEach((edge) => {
                const neighborVertex = edge.vertex;
                const totalDistance = distances.get(currentVertex) + edge.weight;
                if (totalDistance < distances.get(neighborVertex)) {
                    distances.set(neighborVertex, totalDistance);
                    previousVertices.set(neighborVertex, currentVertex);
                }
            });

            visited.add(currentVertex);
        }

        const shortestPath = [];
        let current = endVertex;
        while (current !== startVertex) {
            shortestPath.unshift(current);
            current = previousVertices.get(current);
        }
        shortestPath.unshift(startVertex);

        return shortestPath;
    }

    // 未訪問かつ最短距離の頂点を取得するヘルパーメソッド
    getVertexWithMinDistance(distances, visited) {
        let minDistance = Infinity;
        let minVertex = null;
        distances.forEach((distance, vertex) => {
            if (!visited.has(vertex) && distance < minDistance) {
                minDistance = distance;
                minVertex = vertex;
            }
        });
        return minVertex;
    }
}
