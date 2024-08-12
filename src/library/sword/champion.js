import { GameObject2 } from "../../system/gameObject2";
import { ClickMover } from "./clickMover";
import { HealthBar } from "./healthBar";

export class Champion {
    constructor(option) {

        const gameObject = new GameObject2({});
        this.gameObject = gameObject;

        this.clickMover = new ClickMover({gameObject});

        this.healthBar = new HealthBar({gameObject});

        this.components = [
            this.gameObject,
            this.clickMover,
            this.healthBar
        ];

    }

}
