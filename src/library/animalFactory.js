import { Animal } from "../animal";
import { UniqueAppearance } from "./uniqueAppearance";

export class AnimalFactory {
    constructor(option) {
        this.systemList = option.systemList;
    }

    make(option) {
        const number = option.number;
        option.systemList = this.systemList;

        const decoInfo = UniqueAppearance.generateDecoInfo();
        option.decoInfo = decoInfo;
        
        for (let i = 0; i < number; i++) {
            new Animal(option);
        }
    }
}
