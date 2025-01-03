import { Vertex } from "./graph";

export class CustomVertex {
    constructor(option = {}) {
        this.edges = []; // この頂点に接続されたエッジ
        this.x = option.x || 0; // 頂点のX座標
        this.y = option.y || 0; // 頂点のY座標

        // 追加のプロパティ
        this.customValue = "qwe";

        this.drawShapes = [
            {
                type: 'rect', positionObject: this, w: 2, h: 2, lineWidth: 1
            }
        ];
    }

    addEdge(edge) {
        this.edges.push(edge);
    }
}