export class BackgroundPattern {
    constructor(option) {
        const system = option.systemList;
        system.render.submit(this);

        this.drawer = system.drawer;
    }

    draw() {
        this.drawer.text(
            "群れ : mtbr39",
            this.drawer.gameSize.width / 2,
            this.drawer.gameSize.height / 2,
            {color: "white", fontSize: 50, alpha: 0.95, scalable: true}
        );
    }
}
