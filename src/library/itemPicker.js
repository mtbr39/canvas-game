export class ItemPicker {
    constructor(option) {
        const system = option.system;
        this.system = system;
        system.collision.submit(this);

        this.gameObject = option.gameObject;

        this.items = []; // {name:,num:}[]
    }

    onCollision(collisionData = {}) {
        const other = collisionData.otherObject;
        const otherGameObject = other.gameObject;
        const otherLayers = otherGameObject.layers;
        if (otherLayers.includes("dropItem")) {
            const dropItem = other;
            this.pick(dropItem);
            dropItem.picked();
        }
    }

    pick(item) {
        const existingItem = this.items.find(i => i.name === item.name);
        if (existingItem) {
            existingItem.num += 1;
        } else {
            this.items.push({ name: item.name, num: 1 });
        }
    }
}