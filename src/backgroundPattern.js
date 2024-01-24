export class BackgroundPattern {
    constructor(option) {
        const system = option.systemList;
        system.render.submit(this);

        this.drawer = system.drawer;
    }

    draw() {
        this.drawer.text(
            "人工生命 / 群れ",
            this.drawer.gameSize.width / 2,
            this.drawer.gameSize.height / 2,
            {color: "white", fontSize: 40, alpha: 0.8, scalable: true}
        );
    }
}
