export class CollisionSystem {
    constructor(option) {
        this.objects = option.objects || [];
    }

    update() {

        for (let i = 0; i < this.objects.length; i++) {
            for (let j = 0; j < this.objects.length; j++) {
                if (i !== j) {
                    
                    const objectA = this.objects[i].gameObject;
                    const objectB = this.objects[j].gameObject;
                    if (CollisionSystem.areObjectsColliding(objectA, objectB)) {
                        this.objects[i].onCollision({ otherObject: this.objects[j] });
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
}