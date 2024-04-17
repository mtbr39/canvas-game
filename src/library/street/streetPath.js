export class StreetPath {
    constructor(option) {
        const system = option.system;
        this.drawer = system.drawer;
        system.render.submit(this);

        this.worldGraph = new UndirectedPathGraph();

        this.initPath();
    }

    initPath() {
        const graph = [];
        for (let i = 0; i < 10; i++) {
            const areaName = "city" + i;

            graph.push(new UndirectedPathGraph());

            const graphUnit = 600;
            const min = 100 + graphUnit * i;
            for (let j = 0; j < 40; j++) {
                graph[i].addVertex({ x: min + Math.random() * graphUnit, y: 100 + Math.random() * graphUnit });
            }

            graph[i].removeCloseVertex(20);
            graph[i].connectGroups();

            graph[i].getRandomVertex().name = "宿屋";

            this.worldGraph.addVertex({ name: areaName, areaGraph: graph[i] });

            if (i > 0) {
                const bridgeVertex = graph[i].getRandomVertex();
                const newBridgeVertex = { ...bridgeVertex };
                
                // 繋ぎ目になる頂点には繋ぎ先のエリア名を入れる
                bridgeVertex.name = this.worldGraph.vertices[i - 1].name;
                newBridgeVertex.name = areaName;
                
                graph[i - 1].addVertex(newBridgeVertex);
                graph[i - 1].connectGroups();

                this.worldGraph.addEdge(this.worldGraph.vertices[i - 1], this.worldGraph.vertices[i]);
            }
        }

    }

    draw() {
        this.worldGraph.vertices.forEach((worldVertex) => {
            worldVertex.areaGraph.vertices.forEach((vertex) => {
                this.drawer.circle(vertex.x, vertex.y, 10);
                this.drawer.text(vertex.name, vertex.x, vertex.y, {scalable: true});
                vertex.edges.forEach((edge) => {
                    this.drawer.line(vertex.x, vertex.y, edge.vertex.x, edge.vertex.y);
                });
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
        const nearestVertex = this.findNearestWorldVertex(currentPoint);
        
        const areaGraph = this.getAreaGraphByVertex(nearestVertex);
        const currentAreaName = areaGraph.name;
        const worldPath = this.worldGraph.shortestPathByName(currentAreaName, areaName);

        let crossAreaPath = [];
        
        worldPath.forEach((worldVertex, index) => {
            const areaGraph = worldVertex.areaGraph;

            let areaStartVertex = nearestVertex;
            if (index > 0) {
                areaStartVertex = areaGraph.getVertexByName( worldPath[index-1].name );
            }
            
            let areaEndVertex = null;
            if (index+1 < worldPath.length) {
                areaEndVertex = areaGraph.getVertexByName( worldPath[index+1].name );
            } else {
                areaEndVertex = areaGraph.getVertexByName( destinationName );
            }
            
            const areaPath = areaGraph.shortestPath(areaStartVertex, areaEndVertex);
            
            crossAreaPath.push(areaPath);
            
        });

        return [].concat(...crossAreaPath);
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
    constructor(vertex, weight = 1) {
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
            // Vertexクラスのdistanceメソッドを使用して距離を計算
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
        if (startVertex == endVertex) {
            return [startVertex];
        }

        const distances = new Map(); // 頂点ごとの最短距離を保持するマップ
        const visited = new Set(); // 訪れた頂点を記録するセット
        const previousVertices = new Map(); // 最短経路を保持するマップ

        this.vertices.forEach((vertex) => {
            distances.set(vertex, vertex === startVertex ? 0 : Infinity);
        });

        let whileCount = 0;
        while (visited.size < this.vertices.length && whileCount < 1000) {
            whileCount++;
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
        whileCount = 0;
        while (current !== startVertex && whileCount < 1000) {
            whileCount++;
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
