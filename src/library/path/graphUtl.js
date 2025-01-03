import { Graph, Vertex, Edge } from './graph'; // Graph, Vertex, Edgeクラスをインポート

/**
 * ランダムなグラフを生成
 * @param {number} vertexCount 頂点の数
 * @param {number} maxEdgesPerVertex 各頂点が持つ最大の辺の数
 * @param {number} width 頂点を配置する領域の幅
 * @param {number} height 頂点を配置する領域の高さ
 * @param {typeof Vertex} VertexClass 頂点のクラス(デフォルトは Vertex), カスタムクラスを使用する場合に指定
 * @returns {Graph} 生成されたランダムグラフ
 */
export function generateRandomGraph(vertexCount, maxEdgesPerVertex, width, height, VertexClass = Vertex) {
    const graph = new Graph();

    // 頂点をランダムに配置
    for (let i = 0; i < vertexCount; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;

        // 指定されたクラスで頂点を生成
        const vertex = new VertexClass({ x, y });
        graph.addVertex(vertex);
    }

    // 辺をランダムに追加（交差しないようにするロジック）
    graph.vertices.forEach(vertex => {
        let edgesAdded = 0;
        let attempts = 0; // 試行回数

        while (edgesAdded < maxEdgesPerVertex && attempts < 1000) { // 1000回の試行で停止
            const randomIndex = Math.floor(Math.random() * graph.vertices.length);
            const targetVertex = graph.vertices[randomIndex];

            if (vertex === targetVertex) continue; // 自分自身を対象にしない
            if (vertex.edges.some(edge => edge.vertex === targetVertex)) continue; // 既存のエッジを避ける

            // 辺が交差するかを確認（関数 `edgesIntersect` を使用）
            const doesIntersect = graph.vertices.some(otherVertex =>
                otherVertex.edges.some(existingEdge =>
                    edgesIntersect(vertex, targetVertex, otherVertex, existingEdge.vertex)
                )
            );

            if (doesIntersect) continue;

            // エッジを追加
            graph.addEdge(vertex, targetVertex);
            edgesAdded++;
            attempts = 0; // 成功したので試行回数リセット
        }

        if (attempts >= 1000) {
            console.warn(`Vertex at (${vertex.x}, ${vertex.y}) could not connect to ${maxEdgesPerVertex} vertices after 1000 attempts.`);
        }
    });

    return graph;
}



/**
 * 辺が交差するかをチェック
 * @param {Vertex} v1 辺の始点1
 * @param {Vertex} v2 辺の終点1
 * @param {Vertex} u1 辺の始点2
 * @param {Vertex} u2 辺の終点2
 * @returns {boolean} 辺が交差している場合はtrue
 */
function edgesIntersect(v1, v2, u1, u2) {
    const det = (p1, p2, p3) => (p2.x - p1.x) * (p3.y - p1.y) - (p3.x - p1.x) * (p2.y - p1.y);

    const d1 = det(v1, v2, u1);
    const d2 = det(v1, v2, u2);
    const d3 = det(u1, u2, v1);
    const d4 = det(u1, u2, v2);

    if (d1 * d2 < 0 && d3 * d4 < 0) return true; // 線分が交差する

    return false; // 交差しない
}
