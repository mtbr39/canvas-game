import { Animal } from "../animal";
import { UniqueAppearance } from "./uniqueAppearance";

export class AnimalFactory {
    constructor(option) {
        this.systemList = option.systemList;
    }

    make(option) {
        const number = option.number;
        option.systemList = this.systemList;

        const decorationValues = [];
        const decorationLength = 1 + Math.floor(Math.random() * 3);
        for (let i = 1; i < 1 + decorationLength; i++) {
            decorationValues.push(UniqueAppearance.generateDecoration());
        }
        option.decorationValues = decorationValues;
        
        for (let i = 0; i < number; i++) {
            new Animal(option);
        }
    }
}
