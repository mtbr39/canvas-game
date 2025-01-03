// Vertexクラス
// edges, x, yプロパティとaddEdgeメソッドを持っていれば交換可能。
export class Vertex {
    constructor(option = {}) {
        this.edges = []; // この頂点に接続されたエッジ
        this.x = option.x || 0; // 頂点のX座標
        this.y = option.y || 0; // 頂点のY座標
    }

    addEdge(edge) {
        this.edges.push(edge);
    }
}

// Edgeクラス
export class Edge {
    constructor(fromVertex, toVertex) {
        this.vertex = toVertex; // 接続先の頂点
        this.weight = Edge.calculateDistance(fromVertex, toVertex); // 距離を自動計算
    }

    static calculateDistance(vertex1, vertex2) {
        const dx = vertex1.x - vertex2.x;
        const dy = vertex1.y - vertex2.y;
        return Math.sqrt(dx * dx + dy * dy); // 距離を計算
    }
}

export class Graph {
    constructor() {
        this.vertices = []; // グラフ全体の頂点リスト
    }

    addVertex(vertex) {
        this.vertices.push(vertex);
    }

    addEdge(fromVertex, toVertex) {
        const edge = new Edge(fromVertex, toVertex); // 距離を自動計算してエッジを作成
        fromVertex.addEdge(edge);
    }

    findVertex(predicate) {
        return this.vertices.find(predicate);
    }

    // 連結かどうかをチェックする
    isConnected() {
        if (this.vertices.length === 0) return true;

        const visited = new Set();
        const stack = [this.vertices[0]];

        // 深さ優先探索で訪問
        while (stack.length > 0) {
            const vertex = stack.pop();
            if (!visited.has(vertex)) {
                visited.add(vertex);
                vertex.edges.forEach(edge => {
                    if (!visited.has(edge.vertex)) {
                        stack.push(edge.vertex);
                    }
                });
            }
        }

        // 全ての頂点が訪問済みであれば連結
        return visited.size === this.vertices.length;
    }

    // 連結でなければ最も近い頂点を連結する
    connectClosest() {
        if (this.isConnected()) return;

        let minDistance = Infinity;
        let closestPair = null;

        // すべての頂点間で距離を計算
        for (let i = 0; i < this.vertices.length; i++) {
            for (let j = 0; j < this.vertices.length; j++) {
                if (i !== j) {
                    const vertexA = this.vertices[i];
                    const vertexB = this.vertices[j];

                    // すでに連結している場合はスキップ
                    if (vertexA.edges.some(edge => edge.vertex === vertexB)) continue;

                    // 距離を計算
                    const distance = Edge.calculateDistance(vertexA, vertexB);
                    if (distance < minDistance) {
                        minDistance = distance;
                        closestPair = [vertexA, vertexB];
                    }
                }
            }
        }

        // 最も近い頂点同士を連結
        if (closestPair) {
            const [fromVertex, toVertex] = closestPair;
            this.addEdge(fromVertex, toVertex);
        }
    }

    // 最短経路を探索 (ダイクストラ法)
    // 到達不可の場合:
    //  distances.get(endVertex) が Infinity のままになります。
    //  経路再構築時に path が空リストまたは開始頂点だけのリストになるため、path: null を返します。
    findShortestPath(startVertex, endVertex) {
        const distances = new Map(); // 各頂点への最短距離
        const previous = new Map(); // 各頂点への直前の頂点
        const unvisited = new Set(this.vertices); // 未訪問の頂点

        // 初期化
        this.vertices.forEach(vertex => {
            distances.set(vertex, Infinity); // 初期距離を無限大に設定
            previous.set(vertex, null); // 直前の頂点は未定義
        });
        distances.set(startVertex, 0); // 開始点の距離は0

        // 探索
        while (unvisited.size > 0) {
            // 未訪問の頂点の中から最短距離の頂点を選ぶ
            let current = [...unvisited].reduce((minVertex, vertex) =>
                distances.get(vertex) < distances.get(minVertex) ? vertex : minVertex
            );

            // 終了条件: 現在の頂点が終点なら終了
            if (current === endVertex) break;

            unvisited.delete(current);

            // 隣接する頂点の距離を更新
            current.edges.forEach(edge => {
                const neighbor = edge.vertex;
                if (!unvisited.has(neighbor)) return;

                const newDistance = distances.get(current) + edge.weight;
                if (newDistance < distances.get(neighbor)) {
                    distances.set(neighbor, newDistance);
                    previous.set(neighbor, current);
                }
            });
        }

        // 経路の再構築
        const path = [];
        let current = endVertex;

        while (current) {
            path.unshift(current); // 経路を逆順に挿入
            current = previous.get(current);
        }

        return {
            distance: distances.get(endVertex),
            path: path.length > 1 ? path : null, // 経路が存在しない場合はnullを返す
        };
    }
}

