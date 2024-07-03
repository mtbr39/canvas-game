import { SingleButton } from "./singleButton";

export class UIManager {
    constructor(option) {
        const system = option.system;
        this.drawer = system.drawer;

        this.UIObject = option.UIObject || {};

        const UIObjectSample = {
            page01: {
                UIList:["<UIComponent>", "<UIComponent>"], // UIComponentはisDisplayプロパティを持つ
            },
            page02: {
                UIList:["<UIComponent>"],
            },
        }

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
