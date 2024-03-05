export class StreetPath {
    constructor(option) {
        const system = option.system;
        this.drawer = system.drawer;
        system.render.submit(this);

        // x: option.x || Math.random() * this.drawer.gameSize.width,
        // y: option.y || Math.random() * this.drawer.gameSize.height,

        this.points = [];
        this.edges = [];

        this.path1 = [];

        this.initPath();
    }

    initPath() {
        const pointNum = 200;
        for (let i = 0; i < pointNum; i++) {
            this.points.push(new Point(Math.random() * this.drawer.gameSize.width, Math.random() * this.drawer.gameSize.height));
        }

        const edgeNum = 10000;
        for (let i = 0; i < edgeNum; i++) {
            const startPointIndex = Math.floor(Math.random() * pointNum);
            const endPointIndex = Math.floor(Math.random() * pointNum);
            const startPoint = this.points[startPointIndex];
            const endPoint = this.points[endPointIndex];
            const distance = startPoint.distance(endPoint);
            const threshold = 0.1;

            // 同じエッジが既に存在しないか確認
            const edgeExists = this.edges.some(([start, end]) => {
                return (start === startPointIndex && end === endPointIndex) || (start === endPointIndex && end === startPointIndex);
            });

            if (distance < this.drawer.gameSize.width * threshold) {
                this.edges.push([startPointIndex, endPointIndex]);
            }
        }

        this.path1 = this.findPath(this.edges,  0, 1);
    }

    pointFrom(edge, index) {
        return this.points[edge[index]];
    }

    draw() {
        this.points.forEach((point, index) => {
            this.drawer.circle(point.x, point.y, 5, { color: "white" });
            if (index <= 1) {
                this.drawer.circle(point.x, point.y, 5, { color: "red" });
            }
        });

        this.edges.forEach((edge) => {
            const startPoint = this.pointFrom(edge, 0);
            const endPoint = this.pointFrom(edge, 1);
            this.drawer.line(startPoint.x, startPoint.y, endPoint.x, endPoint.y, { color: "white" });
        });

        this.path1.forEach((pointIndex, index) => {
            if (index < this.path1.length - 1) {
                const startPoint = this.points[pointIndex];
                const endPoint = this.points[this.path1[index + 1]];
                this.drawer.line(startPoint.x, startPoint.y, endPoint.x, endPoint.y, { color: "red" });
            }
        });
    }

    findPath(edges, startPoint, endPoint) {
        let path = [];
        let visited = new Set();

        // 深さ優先探索（DFS）を行う再帰関数
        function dfs(currentPoint) {
            visited.add(currentPoint);

            // 現在のポイントがエンドポイントと一致する場合、パスを見つけたとして終了
            if (currentPoint === endPoint) {
                path.push(currentPoint);
                return true;
            }

            // 現在のポイントから始まるエッジを探索
            for (let edge of edges) {
                if (edge.includes(currentPoint)) {
                    let nextPoint = edge[0] === currentPoint ? edge[1] : edge[0];
                    if (!visited.has(nextPoint)) {
                        path.push(currentPoint);
                        if (dfs(nextPoint)) {
                            return true;
                        }
                        path.pop();
                    }
                }
            }

            return false;
        }

        // 探索を開始
        dfs(startPoint);

        // パスが見つかった場合はパスを返し、見つからなかった場合は空の配列を返す
        return path.length > 0 ? path : [];
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
