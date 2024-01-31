import { talkData } from "../../talkData";
import { UIElement } from "./UIElement";
import { SingleButton } from "./singleButton";

export class DialogBox {
    constructor(option) {
        const system = option.system;
        this.system = system;
        system.render.submit(this);
        system.update.submit(this);
        system.input.submitHandler({
            eventName: "pointerdown",
            handler: this.pointerdownHandler.bind(this),
            primeNumber: 110,
        });

        this.drawer = system.drawer;

        this.talkData = talkData;

        this.size = {
            width: Math.min(this.drawer.gameSize.width, 300),
            height: this.drawer.gameSize.height * 0.2,
        };
        option.size = this.size;
        option.alignment = { typeX: "center", typeY: "bottom", bottom: 20 };
        this.uiElement = new UIElement(option);
        this.position = this.uiElement.position;

        this.currentTalkArray = [];
        this.currentTalkIndex = 0;
        this.talkArrayStack = [];

        this.selectButtonArray = [];
        this.inSelection = false;
    }

    update() {}

    draw() {
        if (!this.uiElement.isDisplay) {
            return;
        }

        const currentTalk = this.currentTalkArray[this.currentTalkIndex];
        this.drawWindow();
        this.drawText(currentTalk);
    }

    drawWindow() {
        this.drawer.rect(this.position.x, this.position.y, this.size.width, this.size.height, {
            isUI: true,
            lineWidth: 2,
            color: "white",
        });
    }

    drawText(currentTalk) {
        if (currentTalk.text) {
            this.drawer.text(
                currentTalk.text,
                this.position.x + this.size.width * 0.35,
                this.position.y + this.size.height * 0.3,
                { isUI: true, color: "white", fontSize: 16, textAlign: "left" }
            );
        }
    }

    startTalk(_talkID) {
        const talkID = _talkID;
        this.currentTalkArray = talkData[talkID];
        this.currentTalkIndex = 0;

        this.uiElement.isDisplay = true;
    }

    pointerdownHandler(ev) {
        if (!this.uiElement.isDisplay) return;
        

        let preventOtherHandlers = false;

        const screenPoint = ev.screenPoint;
        if (this.containsPoint(screenPoint)) {
            preventOtherHandlers = true;
            if (!this.inSelection) {
                this.incrementTalk();
            }
        }

        return preventOtherHandlers;
    }

    incrementTalk() {
        // 最後のTalk
        if (this.currentTalkIndex >= this.currentTalkArray.length - 1) {
            if (this.talkArrayStack.length > 0) {
                this.setupNextTalks(this.talkArrayStack.pop());
            } else {
                this.uiElement.isDisplay = false;
            }
        }

        if (this.currentTalkIndex + 1 < this.currentTalkArray.length) {
            this.currentTalkIndex++;

            this.checkSelections();
        }
    }

    checkSelections() {
        const currentTalk = this.currentTalkArray[this.currentTalkIndex];
        if (currentTalk.selections && currentTalk.selections.length > 0) {
            this.makeMultipleSelectButton(currentTalk.selections);
            this.inSelection = true;
        }
    }

    // selections: {text:"", nextTalks:[]}
    makeMultipleSelectButton(selections) {
        const alignGap = 40;
        const alignArray = this.generateSpreadArray(alignGap, selections.length);

        let selectButtonsMade = [];
        for (let i = 0; i < selections.length; i++) {
            selectButtonsMade.push( this.makeSelectButton({selection: selections[i], offset: alignArray[i]}) );
        }
        selectButtonsMade.forEach((selectButton, index) => {
            selectButton.handler = () => { this.stepIntoSelection(selections[index].nextTalks, selectButtonsMade) };
        })
        
    }

    makeSelectButton(option) {
        const offset = option.offset;
        const selection = option.selection;
        const text = selection.text;
        const nextTalks = selection.nextTalks;

        let filteredButtons = [];
        if (this.selectButtonArray) {
            filteredButtons = this.selectButtonArray.filter(
                (button) => !button.selectButton.isDisplay
            );
        }

        let selectButton = [];
        if (filteredButtons.length > 0) {
            selectButton = filteredButtons[0];
        } else {
            selectButton = new SingleButton({
                system: this.system,
                text: text,
                alignment: { typeX: "center", typeY: "center", top: offset, left: 0 },
                size: { width: 200, height: 32 },
                // handler: () => { this.stepIntoSelection(nextTalks, selectButton) },
                isDisplay: true,
            });
        }
        return selectButton;
    }

    setupNextTalks(nextTalks) {
        this.currentTalkArray = nextTalks;
        this.currentTalkIndex = 0;
    }

    stepIntoSelection(nextTalks, selectButtons) {
        selectButtons.forEach((selectButton) => {
            selectButton.uiElement.isDisplay = false;
        });
        this.inSelection = false;

        // 現在のTalksをStack
        const restTalkArray = [...this.currentTalkArray];
        restTalkArray.splice(0, this.currentTalkIndex+1);
        if (restTalkArray.length > 0) {
            this.talkArrayStack.push(restTalkArray);
        }

        // 次のTalksをセット
        this.setupNextTalks(nextTalks);

        // 選択肢があるかチェック
        this.checkSelections();
    }

    containsPoint(point) {
        if (
            this.position.x <= point.x &&
            point.x <= this.position.x + this.size.width &&
            this.position.y <= point.y &&
            point.y <= this.position.y + this.size.height
        ) {
            return true;
        } else {
            return false;
        }
    }

    generateSpreadArray(gap, num) {
        const result = [];

        for (let i = -Math.floor(num / 2); i <= Math.floor(num / 2); i++) {
            result.push(gap * i);
        }

        return result;
    }
}
