import { GameObject2 } from "../../system/gameObject2";
import { ClickMover2 } from "./clickMover2";

export class Champion {
    constructor(option) {

        this.gameObject = new GameObject2({});
        this.clickMover = new ClickMover2({gameObject: this.gameObject});

        this.components = [
            this.gameObject,
            this.clickMover
        ];

    }

}
