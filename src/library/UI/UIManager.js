import { SingleButton } from "./singleButton";

export class UIManager {
    constructor(option) {
        const system = option.system;
        this.drawer = system.drawer;

        this.itemBag = option.itemBag;

        this.UIObject = {
            open: {
                UIList: [
                    new SingleButton({
                        system: system,
                        text: "Shop",
                        alignment: {typeX: "right", typeY: "top", top: 20, right: 20},
                        size: { width: 100, height: 32 },
                        isDisplay: true,
                        handler: () => { this.switchDisplayPage('shopHome', 'open') },
                    }),
                ],
            },
            shopHome: {
                UIList: [
                    new SingleButton({
                        system: system,
                        text: "Buy",
                        alignment: {typeX: "right", typeY: "top", top: 20, right: 20},
                        size: { width: 100, height: 32 },
                        handler: () => {},
                    }),
                    new SingleButton({
                        system: system,
                        text: "Sell",
                        alignment: {typeX: "right", typeY: "top", top: 60, right: 20},
                        size: { width: 100, height: 32 },
                        handler: () => {},
                    }),
                    new SingleButton({
                        system: system,
                        text: "Back",
                        alignment: {typeX: "right", typeY: "top", top: 100, right: 20},
                        size: { width: 100, height: 32 },
                        handler: () => { this.switchDisplayPage('open', 'shopHome') },
                    }),
                ],
            },
        };

        

        const bagButton = new SingleButton({
            system: system,
            text: "ItemBag",
            alignment: {typeX: "left", typeY: "top", top: 20, left: 20},
            size: { width: 100, height: 32 },
            handler: () => {this.switchDisplayPage('bagContent', 'bagOpen')},
            isDisplay: true
        });
        const bagCloseButton = new SingleButton({
            system: system,
            text: "Close ItemBag",
            alignment: {typeX: "left", typeY: "top", top: 20, left: 20},
            size: { width: 100, height: 32 },
            handler: () => {this.switchDisplayPage('bagOpen', 'bagContent')},
        });
        bagCloseButton.handler = () => {this.switchDisplayPage('bagOpen', 'bagContent')};
        this.UIObject['bagOpen'] = {UIList: []};
        this.UIObject['bagOpen'].UIList.push(bagButton);
        this.UIObject['bagContent'] = {UIList: [bagCloseButton, this.itemBag]};
    }

    switchDisplayPage(nextPage, presentPage) {
        this.switchDisplayUIList(this.UIObject[nextPage].UIList, this.UIObject[presentPage].UIList);
    }

    switchDisplayUIList(nextUIList, presentUIList) {
        this.setDisplayUIList(presentUIList, false);
        this.setDisplayUIList(nextUIList, true);
    }

    setDisplayUIList(UIList, isDisplay) {
        UIList.forEach((ui) => {
            ui.uiElement.isDisplay = isDisplay;
        });
    }
}
