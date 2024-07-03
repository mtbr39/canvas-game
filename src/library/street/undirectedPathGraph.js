
export class PathVertex {
    constructor(option = {}) {
        this.edges = [];

        this.x = option.x || 0;
        this.y = option.y || 0;
        this.name = option.name || "";
        this.areaGraph = option.areaGraph || "";
        this.belongingArea = option.belongingArea || "";
    }

    distance(vertex2) {
        return Math.sqrt(Math.pow(vertex2.x - this.x, 2) + Math.pow(vertex2.y - this.y, 2));
    }
}

export class Edge {
    constructor(vertex, weight = 1) {
        this.vertex = vertex;
        this.weight = weight;
    }
}

export class UndirectedPathGraph {
    constructor() {
        this.vertices = [];

        this.debugDraw = false;
    }

    draw() {
        if (this.debugDraw) {
            this.vertices.forEach((vertex) => {
                this.drawer.circle(vertex.x, vertex.y, 10);
                this.drawer.text(vertex.name, vertex.x, vertex.y, { scalable: true });
                vertex.edges.forEach((edge) => {
                    this.drawer.line(vertex.x, vertex.y, edge.vertex.x, edge.vertex.y);
                });
            });
        }
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

    removeVerticesInsideRects(rects) {
        for (let i = 0; i < this.vertices.length; i++) {
            const vertex = this.vertices[i];
            for (let j = 0; j < rects.length; j++) {
                const rect = rects[j];
                if (vertex.x >= rect.x && vertex.x <= rect.x + rect.w &&
                    vertex.y >= rect.y && vertex.y <= rect.y + rect.h) {
                    this.removeVertex(vertex);
                    i--; // 頂点が1つ減ったため、再度同じインデックスをチェックする必要がある
                    break; // 矩形内の頂点を削除したら、次の頂点を検証する
                }
            }
        }
    }
    

    getRandomVertex() {
        const randomIndex = Math.floor(Math.random() * this.vertices.length);
        return this.vertices[randomIndex];
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

    linkOtherGraphClosest(vertices2) {
        let minDistance = Infinity;
        let closestVertex1 = null;
        let closestVertex2 = null;

        // 各グループ内の各頂点と他のグループの各頂点の距離を計算し、最も近い頂点同士を見つける
        this.vertices.forEach((vertex1) => {
            vertices2.forEach((vertex2) => {
                const distance = vertex1.distance(vertex2);
                if (distance < minDistance) {
                    minDistance = distance;
                    closestVertex1 = vertex1;
                    closestVertex2 = vertex2;
                }
            });
        });

        
        if (closestVertex1 && closestVertex2) {
            const bridgeVertex = closestVertex1;
            const newBridgeVertex = { ...closestVertex2 };

            const currentAreaName = bridgeVertex.belongingArea;
            const nextAreaName = newBridgeVertex.belongingArea;

            // 繋ぎ目になる頂点には繋ぎ先のエリア名を入れる
            // FIXME: Vertex.nameの役割が単一でない。「繋ぎ先のエリア」ならそういう名前のプロパティをAttatchしたい
            closestVertex2.name = currentAreaName;
            newBridgeVertex.name = nextAreaName;
            newBridgeVertex.belongingArea = currentAreaName;

            this.addVertex(newBridgeVertex);
            this.connectGroups();
        }
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

        // 開始地点が目的地なら、そのまま返す
        if (startVertex == endVertex) {
            return [startVertex];
        }

        // グラフが非連結なら経路探索を失敗する, TODO: 開始地点から目的地までが連結なら経路探索する
        if(!this.isConnected()) {
            return [];
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

        if (shortestPath.includes(undefined)) {
            console.warn("最短経路の計算結果にundefinedが含まれています", startVertex, endVertex);
        }

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
