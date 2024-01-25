export class ItemBag {
    constructor(option) {
        const system = option.system;
        this.system = system;
        system.render.submit(this);

        this.drawer = system.drawer;
        this.items = option.items;

        this.isDisplay = false;
    }

    draw() {
        if(this.isDisplay) {
            this.items.forEach((item, index) => {
                const positionX = this.drawer.gameSize.width - 100;  // 適切なX座標を指定
                const positionY = 20 + index * 20;  // 適切なY座標を指定

                // 適切なテキスト描画関数を呼び出してアイテムの内容を表示
                this.drawer.text(`${item.name} : ${item.num}`, positionX, positionY, {isUI: true, color: "white"});
            });
        }
    }

    toggleDisplay() {
        
        this.isDisplay = !this.isDisplay;
    }
}