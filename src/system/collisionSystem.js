export class CollisionSystem {
    constructor(option) {
        this.objects = [];
        this.staticObjects = [];
        this.kineticObjects = [];
    }

    // submitted object must have : GameObject
    submit(object) {
        if (!object.hasOwnProperty("gameObject")) {
            console.error(
                `CollisionSystem: オブジェクト ${object} に 'gameObject' プロパティが存在しません。`
            );
        }
        if (object.collider && object.collider.isStatic) {
            this.staticObjects.push(object);
        } else {
            this.objects.push(object);
        }

        if (object.collider && object.collider.isKinetic) {
            this.kineticObjects.push(object);
        } 
    }

    unsubmit(object) {
        const index = this.objects.indexOf(object);
        if (index !== -1) {
            this.objects.splice(index, 1);
        }
    }

    update() {
        for (let i = 0; i < this.objects.length; i++) {
            for (let j = 0; j < this.objects.length; j++) {
                if (i !== j) {
                    const objectA = this.objects[i].gameObject;
                    const objectB = this.objects[j].gameObject;
                    if (objectA.name === objectB.name) continue;
                    if (CollisionSystem.areObjectsColliding(objectA, objectB)) {
                        if (CollisionSystem.hasMethod(this.objects[i], "onCollision")) {
                            this.objects[i].onCollision({ otherObject: this.objects[j] });
                        }
                    }
                }
            }
        }

        // TODO : 最終的にresolveCollisionWithoutPenetrationしか呼び出さない。//PillarとFrontWall専用の処理になっている
        for (let i = 0; i < this.kineticObjects.length; i++) {
            for (let j = 0; j < this.staticObjects.length; j++) {
                const objectA = this.kineticObjects[i].gameObject;
                const staticObject = this.staticObjects[j].gameObject;
                if (CollisionSystem.areObjectsColliding(objectA, staticObject)) {
                    
                    //Pillar
                    if (CollisionSystem.areCollidingPillar(this.kineticObjects[i], this.staticObjects[j])) {
                        this.resolveCollisionWithoutPenetration(objectA, staticObject);
                    }

                    //FrontWall
                    if (CollisionSystem.areCollidingFrontWall(this.kineticObjects[i], this.staticObjects[j])) {
                        const cutFrontWallGameObject = CollisionSystem.getCutFrontWall(this.kineticObjects[i], this.staticObjects[j]);
                        if (cutFrontWallGameObject) {
                            this.resolveCollisionWithoutPenetration(objectA, cutFrontWallGameObject);
                        }
                        
                    }

                }
            }
        }
    }

    static areObjectsColliding(objectA, objectB) {
        return (
            objectA.x < objectB.x + objectB.width &&
            objectA.x + objectA.width > objectB.x &&
            objectA.y < objectB.y + objectB.height &&
            objectA.y + objectA.height > objectB.y
        );
    }

    static areCollidingPillar(objectA, pillarObject) {
        if (objectA.elevation && pillarObject.pillarHeight) {
            const highA = objectA.elevation.high;
            const bottomHeight = pillarObject.bottomHeight;
            const pillarHeight = pillarObject.pillarHeight;
            const topHeight = bottomHeight + pillarHeight;

            return bottomHeight <= highA && highA <= topHeight;
        }
        return false;
    }

    static areCollidingFrontWall(objectA, staticObject) {
        if (objectA.elevation && staticObject.gameObject.layers.includes("frontWall") ) {
            const frontWall = staticObject;
            const frontWallHigh = frontWall.getHighAtPoint(objectA.gameObject.y);
            const highA = objectA.elevation.high;
            return CollisionSystem.inRange(highA, frontWallHigh, 4);
        }
        return false;
    }

    static getCutFrontWall(objectA, staticObject) {
        if (objectA.elevation && staticObject.gameObject.layers.includes("frontWall") ) {
            const frontWall = staticObject;
            const frontWallHigh = frontWall.getOffset(objectA.elevation.high);
            const highA = objectA.elevation.high;
            const newObj = { ...staticObject.gameObject };
            newObj.height -= frontWallHigh;
            return newObj;
        }
        return false;
    }

    static hasMethod(obj, methodName) {
        return typeof obj[methodName] === "function";
    }

    resolveCollisionWithoutPenetration(objectA, objectB) {
        // top right bottom left
        const aT = objectA.y;
        const aB = objectA.y + objectA.height;
        const aL = objectA.x;
        const aR = objectA.x + objectA.width;
        const bT = objectB.y;
        const bB = objectB.y + objectB.height;
        const bL = objectB.x;
        const bR = objectB.x + objectB.width;

        if (bT < aT && aT < bB) {
            if (bL < aL && aR < bR) {
                objectA.y = bB;
            }
        }

        if (bT < aB && aB < bB) {
            if (bL < aL && aR < bR) {
                objectA.y = bT - objectA.height;
            }
        }

        if (bL < aL && aL < bR) {
            if (bT < aT && aB < bB) {
                objectA.x = bR;
            }
        }

        if (bL < aR && aR < bR) {
            if (bT < aT && aB < bB) {
                objectA.x = bL - objectA.width;
            }
        }
    }

    static inRange(value1, value2, range) {
        return Math.abs(value1 - value2) < range;
    }
}
