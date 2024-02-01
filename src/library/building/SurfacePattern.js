export class SurfacePattern {
    constructor(option) {
        const system = option.system;
        system.render.submit(this);
        this.drawer = system.drawer;

        this.gameObject = option.gameObject;

        this.pattern = option.pattern || "solid";
        this.baseColor = option.baseColor || "#2e2e2e";
        this.secondColor = option.secondColor || "#3d3d3d";
        // 878787
        // 6e6e6e
        // 545454
        // 3d3d3d
        // 2e2e2e
        // 262626
    }

    draw() {
        switch (this.pattern) {
            case "solid":
                this.drawSolid();
                break;
            case "step":
                this.drawStep();
                break;
            default:
                break;
        }
    }

    drawSolid() {
        const {x, y, width, height} = this.gameObject;
        this.drawer.rect(x, y, width, height, {color: this.baseColor, isFill: true});
    }

    drawStep() {
        const { x, y, width, height } = this.gameObject;
        const stepHeight = 4; // 階段1段の高さ（調整可能）
        const stepCount = Math.floor(height / stepHeight);
    
        for (let i = 0; i < stepCount; i++) {
            const stepY = y + i * stepHeight;
    
            // 交互に色が変わるように
            const fillColor = (i % 2 === 0) ? this.baseColor : this.secondColor;
    
            this.drawer.rect(x, stepY, width, stepHeight, { color: fillColor, isFill: true });
        }
    }
    
    
}