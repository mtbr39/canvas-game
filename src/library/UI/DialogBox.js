export class DialogBox {
    constructor(option) {
        const system = option.system;
        this.system = system;
        system.render.submit(this);

        const Talks = [
            {
                text: "",
                sprite: "",
                handler: "()=>{}",
                selections: [{text:"", nextTalks: "Talks"},{}],

            },
        ];

    }
}
