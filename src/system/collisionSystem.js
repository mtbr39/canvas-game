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
        if (object.gameObject.isStatic) {
            this.staticObjects.push(object);
        } else {
            this.objects.push(object);
        }

        if (object.gameObject.isKinetic) {
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
        for (let i = 0; i < this.kineticObjects.length; i++) {
            for (let j = 0; j < this.staticObjects.length; j++) {
                const objectA = this.kineticObjects[i].gameObject;
                const staticObject = this.staticObjects[j].gameObject;
                if (CollisionSystem.areObjectsColliding(objectA, staticObject)) {
                    this.resolveCollisionWithoutPenetration(objectA, staticObject);
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

        if ( bT < aT && aT < bB  ) {
            if ( bL < aL && aR < bR ) {
                objectA.y = bB;
            }
        }

        if ( bT < aB && aB < bB  ) {
            if ( bL < aL && aR < bR ) {
                objectA.y = bT - objectA.height;
            }
        }

        if ( bL < aL && aL < bR  ) {
            if ( bT < aT && aB < bB ) {
                objectA.x = bR;
            }
        }

        if ( bL < aR && aR < bR  ) {
            if ( bT < aT && aB < bB ) {
                objectA.x = bL - objectA.width;
            }
        }


    }
    
    
    
}
