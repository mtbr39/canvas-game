import { UIElement } from "./UIElement";

export class ItemBag {
    constructor(option) {
        const system = option.system;
        this.system = system;
        system.render.submit(this);

        this.drawer = system.drawer;
        this.items = option.items;

        // this.isDisplay = false;

        this.size = {width: 100, height: 200};
        option.size = this.size;
        option.alignment = {typeX: "center", typeY:"center", top: -100, left: 60};
        this.uiElement = new UIElement(option);
        this.position = this.uiElement.position;
        console.log("pos-debug", this.position);
    }

    draw() {
        if(this.uiElement.isDisplay) {
            this.items.forEach((item, index) => {
                const positionX = this.position.x;  // 適切なX座標を指定
                const positionY = this.position.y + index * 20;  // 適切なY座標を指定

                // 適切なテキスト描画関数を呼び出してアイテムの内容を表示
                this.drawer.text(`${item.name} : ${item.num}`, positionX, positionY, {isUI: true, color: "white"});
            });
        }
    }

    // toggleDisplay() {
        
    //     this.isDisplay = !this.isDisplay;
    // }
}