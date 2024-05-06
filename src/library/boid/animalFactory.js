import { UniqueAppearance } from "../appearance/uniqueAppearance";
import { Animal } from "./animal";

export class AnimalFactory {
    constructor(option) {
        this.systemList = option.systemList;

        this.hasElevation = option.hasElevation || false;
    }

    make(option) {
        const number = option.number;
        option.systemList = this.systemList;

        const decoInfo = UniqueAppearance.generateDecoInfo();
        option.decoInfo = decoInfo;

        option.hasElevation = this.hasElevation;

        let width = option.width || 10;
        for (let i = 0; i < number; i++) {
            option.width = width * (0.8 + Math.random()*0.4);
            new Animal(option);
        }
    }
}
