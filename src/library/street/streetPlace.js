export class StreetPlace {
    constructor(option = {}) {
        this.vertex = option.vertex || {};

        this.facilities = option.facilities || [];;
        

    }

    addFacility(facility) {
        this.facilities.push(facility);
    }

}

export class GoodsStore {
    constructor() {
        this.type = "武器屋";
        this.storeName = "マールの武器屋";
        this.totalAssets = 0;
        this.goods = [];
    }

    addGoods(goodName, num) {
        // 商品がすでに存在するかどうかを確認
        const existingGoods = this.goods.find(good => good.name === goodName);
        1
        if (existingGoods) {
            // 商品が存在する場合は数量を追加
            existingGoods.number += num;
        } else {
            // 商品が存在しない場合は新しい商品を追加
            this.goods.push({ name: goodName, number: num });
        }
    }
}

export class PlaceManager {
    constructor(option) {
        option.system.render.submit(this);
        this.drawer = option.system.drawer;

        this.places = [];

        this.init();
    }

    init() {

    }

    draw() {
        this.places.forEach((place) => {
            
            place.facilities.forEach((facility) => {
                const {x, y} = place.vertex;
                if (facility.type === "武器屋") {
                    const stringArray = facility.goods.map(obj => JSON.stringify(obj));
                    const string = stringArray.join(',');
                    const text = facility.storeName + string;
                    this.drawer.text(text, x, y, {scalable: true});
                }
                
            });
        });
    }

    addPlace(place) {
        this.places.push(place);
    }

    addPlaceByVertex(vertex, facilities=[]) {
        const place = new StreetPlace({vertex: vertex, facilities: facilities});
        this.places.push(place);
        return place;
    }

    getPlaceByVertex(vertex) {
        return this.places.find(place => {
            return place.vertex === vertex;
        });
    }
}