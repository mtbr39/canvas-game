import { Animal } from "../animal";
import { UniqueAppearance } from "./uniqueAppearance";

export class AnimalFactory {
    constructor(option) {
        this.systemList = option.systemList;
    }

    make(option) {
        const number = option.number;
        const speciesName = option.speciesName;

        const decorationValues = [];
        const decorationLength = 1 + Math.floor(Math.random() * 3);
        for (let i = 1; i < 1 + decorationLength; i++) {
            decorationValues.push(UniqueAppearance.generateDecoration());
        }
        for (let i = 0; i < number; i++) {
            new Animal({
                systemList: this.systemList,
                speciesName: speciesName,
                layers: option.layers,
                decorationValues: decorationValues,
                shapeColor: option.shapeColor,
            });
        }
    }
}
