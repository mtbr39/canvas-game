import { GameObject2 } from "../../system/gameObject2";
import { ClickMover } from "./clickMover";

export class Champion {
    constructor(option) {

        this.gameObject = new GameObject2({});
        this.clickMover = new ClickMover({gameObject: this.gameObject});

        this.components = [
            this.gameObject,
            this.clickMover
        ];

    }

}
