import { AttachedContextManager } from "../module/attachedContext";

export class GoodsStore {
    constructor() {
        this.type = "武器屋";
        this.storeName = "武器屋";
        this.totalAssets = 0;
        this.goods = [];
    }

    addGoods(goodName, num) {
        // 商品がすでに存在するかどうかを確認
        const existingGoods = this.goods.find(good => good.name === goodName);
        
        if (existingGoods) {
            // 商品が存在する場合は数量を追加
            existingGoods.number += num;
        } else {
            // 商品が存在しない場合は新しい商品を追加
            this.goods.push({ name: goodName, number: num });
        }
    }

    buyGood(goodName, num) {
        // 商品がすでに存在するかどうかを確認
        const existingGoods = this.goods.find(good => good.name === goodName);
        
        if (existingGoods) {
            if (existingGoods.number > 0) {
                existingGoods.number -= Math.floor(num);
            } else {
                return "sellout";
            }
        } else {
            console.log("buyGood-debug : good not found", goodName);
        }
    }
}

export class InnStore {
    constructor() {
        this.type = "宿屋";
        this.storeName = "宿屋";
        this.totalAssets = 0;
        this.availableRoomNumber = 10; //name: ,number: 
    }

    checkIn() {
        if (this.availableRoomNumber > 0) {
            this.availableRoomNumber--;
        } else {
            return "full";
        }
    }

    checkOut() {
        this.availableRoomNumber++;
    }
}




export class PlaceManager {
    constructor(option) {
        option.system.render.submit(this);
        this.drawer = option.system.drawer;

        this.places = [];
        this.vertexAttachedPlaceContextManager = new AttachedContextManager({attachedContextArray: this.places});

        

        this.trails = [];

        this.init();
    }

    init() {

    }

    draw() {
        this.places.forEach((place) => {
            const placeVertex = place.identifier;
            place.context.facilities.forEach((facility) => {
                
                const {x, y} = placeVertex;
                if (facility.type === "武器屋") {
                    const stringArray = facility.goods.map(obj => JSON.stringify(obj));
                    const string = stringArray.join(',');
                    const text = facility.storeName + string;
                    this.drawer.text(text, x, y-40, {scalable: true});
                    this.drawer.image("store01", x-6, y-32, {width: 32});
                }

                if (facility.type === "宿屋") {
                    const text = facility.storeName + facility.availableRoomNumber;
                    this.drawer.text(text, x, y, {scalable: true});
                    this.drawer.image("store02", x-16, y-56, {width: 48});
                    
                }
                
            });
        });
    }

    addPlace(place) {
        this.places.push(place);
    }

    addPlaceByVertex(vertex, facilities=[]) {
        return this.vertexAttachedPlaceContextManager.add(vertex, {facilities: facilities});
        
    }

    getPlaceByVertex(vertex) {
        return this.places.find(place => {
            return place.identifier === vertex;
        });
    }

    getVertecesByFacilityType(facilityType) {
        const verteces = [];
        this.places.forEach(place => {
            const facilities = place.context.facilities;
            if (facilities) {
                facilities.forEach(facility => {
                    if (facility.type === facilityType) {
                        const placeVertex = place.identifier;
                        verteces.push(placeVertex);
                    }
                });
            }
        });
        return verteces;
    }

    getFacility(vertex, facilityType) {
        const place = this.getPlaceByVertex(vertex);
        const facilities = place.context.facilities;
        if (facilities) {
            return facilities.find(facility => facility.type === facilityType);
        }
        return null;
    }

}
