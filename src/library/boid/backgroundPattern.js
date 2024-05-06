export class BackgroundPattern {
    constructor(option) {
        const system = option.systemList;
        system.render.submit(this);

        this.drawer = system.drawer;

        this.backgroundText = option.text || "";
    }

    draw() {
        this.drawer.text(
            this.backgroundText,
            this.drawer.gameSize.width / 2,
            this.drawer.gameSize.height / 2,
            {color: "white", fontSize: 50, alpha: 0.95, scalable: true}
        );
    }
}
