export class UIElement {
    constructor(option) {
        const system = option.system;

        this.drawer = system.drawer;

        this.isDisplay = option.isDisplay || false;
        this.alignment = option.alignment || { typeX: "top", typeY:"left", top: 0, right: 0, bottom: 0, left: 0 };
        this.size = option.size; // {width, height}
        this.position = option.position || this.getPositionFromAlignment();
    }

    getPositionFromAlignment() {
        const al = this.alignment;
        const size = this.size;
        const gameSize = this.drawer.gameSize;

        let position = { x: 0, y: 0 };

        switch (al.typeX) {
            default:
            case 'left':
                position.x = al.left || 0;
                break;
            case 'right':
                position.x = gameSize.width - size.width - (al.right || 0);
                break;
            case 'center':
                position.x = (gameSize.width - size.width) / 2 + (al.left || 0) - (al.right || 0);
                break;
        }
        
        switch (al.typeY) {
            default:
            case 'top':
                position.y = al.top || 0;
                break;
            case 'bottom':
                position.y = gameSize.height - size.height - (al.bottom || 0);
                break;
            case 'center':
                position.y = (gameSize.height - size.height) / 2 + (al.top || 0) - (al.bottom || 0);
                break;
        }
        

        return position;
    }
}
