import { SkillHitBox } from "./skillHitBox";

export class SkillCaster {
    constructor(option) {

        this.inputConfigs = [
            { eventName: "keydown", handler: this.keydownHandler.bind(this) }
        ];

        this.hitBoxies = [];

        this.components = [
        ];

        this.addComponentCallback = true;

        // this.hitBox = new SkillHitBox();
        // this.addHitBox(this.hitBox);
    }

    addHitBox(hitBox) {
        this.hitBoxies.push(hitBox);
        this.components.push(hitBox);
    }

    keydownHandler(ev) {
        if (ev.key === 'q') {
            this.area(ev.client);
        }
        
    }

    area(position) {
        const hitBox = new SkillHitBox({position});
        this.addHitBox(hitBox);
        this.addComponentCallback(hitBox);
    }
}
