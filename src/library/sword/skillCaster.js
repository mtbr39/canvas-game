import { SkillHitBox } from "./skillHitBox";

export class SkillCaster {
    constructor(option) {

        this.selfObject = option.gameObject;

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
        this.addComponentCallback(hitBox);
    }

    keydownHandler(ev) {
        if (ev.key === 'q') {
            const {x, y} = ev.client;
            const shotAngle = this.selfObject.angleTo(x, y);
            this.bullet({position: this.selfObject, speed: 10, direction: shotAngle});
        }
        
    }

    area(position) {
        const hitBox = new SkillHitBox({position});
        this.addHitBox(hitBox);
        
    }

    bullet(skillOption) {
        const hitBox = new SkillHitBox(skillOption);
        this.addHitBox(hitBox);
    }
}
