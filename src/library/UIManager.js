import { SingleButton } from "./singleButton";

export class UIManager {
    constructor(option) {
        const system = option.system;
        this.drawer = system.drawer;

        this.UIObject = {
            open: {
                UIList: [
                    new SingleButton({
                        system: system,
                        text: "Shop",
                        alignment: {type: "right", top: 20, right: 20},
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
                        alignment: {type: "right", top: 20, right: 20},
                        size: { width: 100, height: 32 },
                        handler: () => {},
                    }),
                    new SingleButton({
                        system: system,
                        text: "Sell",
                        alignment: {type: "right", top: 60, right: 20},
                        size: { width: 100, height: 32 },
                        handler: () => {},
                    }),
                    new SingleButton({
                        system: system,
                        text: "Back",
                        alignment: {type: "right", top: 100, right: 20},
                        size: { width: 100, height: 32 },
                        handler: () => { this.switchDisplayPage('open', 'shopHome') },
                    }),
                ],
            },
        };
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
            ui.isDisplay = isDisplay;
        });
    }
}
