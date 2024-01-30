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
        
        let width = option.width || 10;
        for (let i = 0; i < number; i++) {
            option.width = width * (0.8 + Math.random()*0.4);
            new Animal(option);
        }
    }
}
