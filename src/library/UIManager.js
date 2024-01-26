export class UIManager {
    constructor() {
        this.Button = new SingleButton({
            system: system,
            text: "Item Bag",
            position: { x: this.drawer.gameSize.width * 0.02, y: this.drawer.gameSize.height * 0.4 },
            size: { width: 100, height: 32 },
            handler: this.itemBag.toggleDisplay.bind(this.itemBag),
        });

    }
}