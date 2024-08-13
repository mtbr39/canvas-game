import { SkillHitBox } from "./skillHitBox";

export class SkillCaster {
    constructor(option) {

        this.id = option.id || null;

        this.selfObject = option.gameObject;

        this.inputConfigs = [
            { eventName: "keydown", handler: this.keydownHandler.bind(this) }
        ];

        this.hitBoxies = [];

        this.components = [
        ];

        this.addComponentCallback = true;

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
            this.bullet(shotAngle);
        }
        
    }

    fireHitBox(hitBoxOption) {

        hitBoxOption.callbackOnKill = this.callbackOnKill;
        hitBoxOption.sourceID = this.id;
        
        const hitBox = new SkillHitBox(hitBoxOption);
        this.addHitBox(hitBox);
    }

    area(position) {
        const hitBox = new SkillHitBox({position});
        this.addHitBox(hitBox);
        
    }

    bullet(angle) {
        this.fireHitBox({position: this.selfObject, speed: 6, direction: angle});
    }
}
