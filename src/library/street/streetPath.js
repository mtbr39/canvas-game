export class StreetPath {
    constructor(option) {
        const system = option.system;
        this.drawer = system.drawer;
        system.render.submit(this);

        // x: option.x || Math.random() * this.drawer.gameSize.width,
        // y: option.y || Math.random() * this.drawer.gameSize.height,

        this.pointDetails = [];
        this.edges = [];

        this.graph1 = {};

        this.path1 = [];

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
        const max = 2000;
        for (let i = 0; i < 200; i++) {
            this.graph1.addVertex({ x: Math.random() * (max - min), y: Math.random() * (max - min) });
        }

        this.graph1.removeCloseVertex(30);
        this.graph1.connectGroups();

        console.log("graph-debug", this.graph1);
    }

    draw() {
        this.graph1.vertices.forEach((vertex) => {
            this.drawer.circle(vertex.x, vertex.y, 10);
            vertex.edges.forEach((edge) => {
                // console.log("ve-debug", edge.vertex.x, vertex.x);
                this.drawer.line(vertex.x, vertex.y, edge.vertex.x, edge.vertex.y);
            });
        });
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
        this.x = option.x || 0;
        this.y = option.y || 0;
        this.edges = [];
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
    addEdge(vertex1, vertex2, weight = 0) {
        if (!vertex1 instanceof PathVertex || !vertex2 instanceof PathVertex) {
            throw new Error("Both arguments must be instances of Vertex");
        }

        if (vertex1 === vertex2) {
            // 自分自身とは結ばないようにする
            return;
        }

        vertex1.edges.push(new Edge(vertex2, weight));

        // 無向グラフの性質を考慮して、vertex2からvertex1への辺を追加する必要がある
        if (!vertex2.edges.some(edge => edge.vertex === vertex1)) {
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
        const groups = this.vertices.map(vertex => [vertex]);

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
            const indexToRemove = groups.findIndex(group => group.includes(closestVertex2));
            groups[indexToRemove].push(...groups.find(group => group.includes(closestVertex1)));
            groups.splice(groups.findIndex(group => group.includes(closestVertex1)), 1);
        }
    }
    
}
