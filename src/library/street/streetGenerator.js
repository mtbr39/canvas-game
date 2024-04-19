import { StreetPath } from "./streetPath";
import { GoodsStore, PlaceManager, StreetPlace } from "./streetPlace";

export class StreetGenerator {
    constructor(option = {}) {
        const system = option.system;
        this.streetPath = option.streetPath;
        this.placeManager = option.placeManager;

        this.init();
    }

    init() {
        const randomVertex = this.streetPath.getWorldRandomVertex();
        const goodsStore = new GoodsStore();
        goodsStore.addGoods("銅の剣", 100);
        goodsStore.addGoods("鉄の剣", 100);
        goodsStore.addGoods("鉄の剣", 100);
        this.placeManager.addPlaceByVertex(randomVertex, [goodsStore]);
    }

}