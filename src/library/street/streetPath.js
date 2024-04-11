export class StreetPath {
    constructor(option) {
        const system = option.system;
        this.drawer = system.drawer;
        system.render.submit(this);

        // x: option.x || Math.random() * this.drawer.gameSize.width,
        // y: option.y || Math.random() * this.drawer.gameSize.height,

        this.pointDetails = [];
        this.edges = [];

        this.path1 = [];

        this.initPath();
    }

    initPath() {
        let pathMap = {
            array: [
                {
                    id: 0, 
                    placeName: "hospital",
                    isArea: false,
                    area: {},
                    point: {}, 
                    connectedPoint:{}, 
                    routeInfo:[
                        {
                            destination: "dest-name01", 
                            nextPointId: 13, 
                        },
                        {
                            destination: "dest-name01", 
                            nextPointId: 13, 
                        },
                    ]
                }
            ]
        }

        const placePointOnGrid = () => {
            // 格子の間隔
            const gridSpacing = 30;
            // 格子内での位置のランダム範囲
            const randomRange = 10;

            for (let i = 0; i < 100; i++) {
                const offsetX = 200;
                const offsetY = 200;
                const gridX = Math.floor((i % 10)) * gridSpacing; // 格子上のX座標
                const gridY = Math.floor((i / 10)) * gridSpacing; // 格子上のY座標
                const minX = offsetX + gridX - randomRange; // X座標の最小値
                const maxX = offsetX + gridX + randomRange; // X座標の最大値
                const minY = offsetY + gridY - randomRange; // Y座標の最小値
                const maxY = offsetY + gridY + randomRange; // Y座標の最大値
                const point = {
                    id: i,
                    placeName: "",
                    connectedPoints: [],
                    point: new Point(
                        Math.floor(Math.random() * (maxX - minX + 1)) + minX,
                        Math.floor(Math.random() * (maxY - minY + 1)) + minY
                    ),
                };
                this.pointDetails.push(point);
            }
        }

        // placePointOnGrid();


        for (let i = 0; i < 100; i++) {
            const offsetX = 100;
            const offsetY = 100;
            const minX = offsetX - 500; // ランダムなX座標の最小値
            const maxX = offsetX + 500; // ランダムなX座標の最大値
            const minY = offsetY - 500; // ランダムなY座標の最小値
            const maxY = offsetY + 500; // ランダムなY座標の最大値
            const point = {
                id: i,
                placeName: "",
                connectedPoints: [],
                point: new Point(
                    Math.floor(Math.random() * (maxX - minX + 1)) + minX,
                    Math.floor(Math.random() * (maxY - minY + 1)) + minY
                ),
            };
            this.pointDetails.push(point);
        }

        this.removeClosePoints(this.pointDetails, 20);
        this.addClosestPoints(this.pointDetails);
        // this.addClosestGroups(this.pointDetails);
        console.log("details-init-debug", this.pointDetails);
    }


    draw() {
        this.pointDetails.forEach((detail) => {
            const point = detail.point;
            this.drawer.circle(point.x, point.y, 4);

            const connectedPoints = detail.connectedPoints;
            connectedPoints.forEach((connectedPointId) => {
                const connectedPoint = this.pointDetails[connectedPointId].point;
                this.drawer.line(point.x, point.y, connectedPoint.x, connectedPoint.y);
            });
        });
    }

    // 2つの点の距離を計算する関数
    calculateDistance(point1, point2) {
        const dx = point1.point.x - point2.point.x;
        const dy = point1.point.y - point2.point.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    // 一定の距離以下の点を削除する関数
    removeClosePoints(points, minDistance) {
        for (let i = 0; i < points.length; i++) {
            for (let j = i + 1; j < points.length; j++) {
                const distance = this.calculateDistance(points[i], points[j]);
                if (distance < minDistance) {
                    // 点が近すぎる場合は削除する
                    points.splice(j, 1);
                    j--; // 削除した分、インデックスを調整する
                }
            }
        }
    }

    addClosestPoints2(points) {
        const groups = [];
        points.forEach((point)=>{
            groups.push([point]);
        });

        groups.forEach((group) => {
            let closestDistance = Infinity;
            group.forEach((point1) => {
                points.forEach((point2) => {
                    if (!group.include(point2)) {
                        const distance = this.calculateDistance(point1, point2);
                        if (distance < closestDistance) {
                            closestPoint = point2;
                            closestDistance = distance;
                        }
                    }
                });
            });

            point1.connectedPoints = point2.id

            closestGroup = null;
            groups.forEach((group) => {
                if (group.include(point2)) {
                    closestGroup = group;
                }
            });

        });
    }

    addClosestPoints(points) {

        for (let i = 0; i < points.length; i++) {
            // 各点の最も近い点のインデックスを保持する変数
            let closestPointIndex = null;
            // 最も近い距離を初期化
            let closestDistance = Infinity;
    
            for (let j = 0; j < points.length; j++) {
                // 同じ点はスキップ
                if (i === j) continue;
    
                const distance = this.calculateDistance(points[i], points[j]);
                if (distance < closestDistance) {
                    // より近い点が見つかった場合、最も近い点のインデックスと距離を更新する
                    closestPointIndex = j;
                    closestDistance = distance;
                }
            }
    
            if (closestPointIndex !== null) {
                // 最も近い点のインデックスをconnectedPointsに追加する
                points[i].connectedPoints.push(closestPointIndex);
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

