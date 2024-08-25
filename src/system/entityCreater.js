import { Champion } from "../library/sword/champion";
import { Minion } from "../library/sword/minion";


export class EntityCreater {
    constructor() {

    }

    static create(className, option) {

        if (className === 'champion') {
            return new Champion(option);
        }
        
        if (className === 'minion') {
            option.layers = ["unit", "team02"];
            option.speciesName = "minionA";
            return new Minion(option);
        }

        return null;

    }
}