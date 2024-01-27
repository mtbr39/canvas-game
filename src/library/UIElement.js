export class UIElement {
    constructor(option) {
        const system = option.system;
        
        this.drawer = system.drawer;

        this.isDisplay = option.isDisplay || false;
        this.alignment = option.alignment || {type: 'top', top: 0, right: 0, bottom: 0, left: 0};
        this.size = option.size;
        this.position = option.position || this.getPositionFromAlignment();
        
    }

    getPositionFromAlignment() {
        const al = this.alignment;
        const size = this.size;
        const gameSize = this.drawer.gameSize;

        let position = { x: 0, y: 0 };

        switch (al.type) {
            case 'top':
                if (al.left) {
                    position.x = al.left;
                } else if (al.right) {
                    position.x = gameSize.width - size.width - al.right;
                }
                position.y = al.top;
                break;
            case 'right':
                position.x = gameSize.width - size.width - al.right;
                if (al.top) {
                    position.y = al.top;
                } else if (al.bottom) {
                    position.y = gameSize.height - size.height - al.bottom;
                }
                break;
            case 'bottom':
                if (al.left) {
                    position.x = al.left;
                } else if (al.right) {
                    position.x = gameSize.width - size.width - al.right;
                }
                position.y = gameSize.height - size.height - al.bottom;
                break;
                
            case 'left':
                position.x = ai.left;
                if (al.top) {
                    position.y = al.top;
                } else if (al.bottom) {
                    position.y = gameSize.height - size.height - al.bottom;
                }
                break;
            default:
                break;
        }
    
        return position;

    }
}