import { StreetPath } from "./streetPath";
import { GoodsStore, InnStore, PlaceManager, StreetPlace } from "./streetPlace";

export class StreetGenerator {
    constructor(option = {}) {
        const system = option.system;
        this.streetPath = option.streetPath;
        this.placeManager = option.placeManager;

        this.init();
    }

    init() {
        const goodsStore = new GoodsStore();
        goodsStore.addGoods("銅の剣", 100);
        goodsStore.addGoods("鉄の剣", 100);
        goodsStore.addGoods("鉄の剣", 100);
        this.placeManager.addPlaceByVertex(this.streetPath.getWorldRandomVertex(), [goodsStore]);

        const innStore = new InnStore();
        [1,2,3].forEach(()=>{
            this.placeManager.addPlaceByVertex(this.streetPath.getWorldRandomVertex(), [innStore]);
        });


    }

}