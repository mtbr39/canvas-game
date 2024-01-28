import { UIElement } from "./UIElement";

export class ItemBag {
    constructor(option) {
        const system = option.system;
        this.system = system;
        system.render.submit(this);

        this.drawer = system.drawer;
        this.items = option.items;

        this.size = {width: 100, height: 200};
        option.size = this.size;
        option.alignment = {typeX: "left", typeY:"top", top: 80, left: 20};
        this.uiElement = new UIElement(option);
        this.position = this.uiElement.position;
    }

    draw() {
        
        if (this.uiElement.isDisplay) {
            const cellWidth = 100;
            const cellHeight = 20;
            const marginX = 10;
            this.items.forEach((item, index) => {
                const positionX = this.position.x + (index % 2 === 0 ? 0 : cellWidth); // 偶数番目は左、奇数番目は右
                const positionY = this.position.y + Math.floor(index / 2) * cellHeight; // 2行ごとにY座標が変わる
    
                this.drawer.rect(positionX, positionY, cellWidth, cellHeight, { isUI: true, color: "white" });
                this.drawer.text(`${item.name}`, positionX + marginX, positionY+cellHeight/2, { isUI: true, color: "white", textAlign: "left" });
                this.drawer.text(`${item.num}個`, positionX + cellWidth - marginX, positionY+cellHeight/2, { isUI: true, color: "white", textAlign: "right" });
            });
        }
    }
    
}