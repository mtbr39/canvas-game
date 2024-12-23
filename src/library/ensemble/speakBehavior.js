import LLMApi from "../module/llmApi";

export class SpeakBehavior {
    constructor(option) {
        this.gameObject = option.gameObject
        this.aroundView = option.aroundView;

        this.api = new LLMApi();

        this.count = 0;

        this.drawShapes = [
            {type: 'text', text: "test11", positionObject: this.gameObject}
        ];
    }

    update() {
        this.count++;
        if (this.count == 600) {
            this.count = 0;

            this.speak();
        }

    }

    async speak() {
        const text = await this.fetchSpeakText();
        this.drawShapes[0].text = text;
    }

    walkTo(position) {
        this.gameObject.moveTowardsPosition(position);
    }

    getDescriptiveList(objectList) {
        return objectList.map(item => ({
            layers: item.layers,
            distance: item.distance,
            angle: item.angle,
            name: item.otherEntity.name,
            desc: item.otherEntity.description
        }));
    }

    async fetchSpeakText() {

        const list = this.getDescriptiveList(this.aroundView.objectList);

        const prompt = `
            あなたはゲームの中の人物です。
            適当な発言を日本語で考えてください。
            
            あなたの得ている情報は、
            ${JSON.stringify(list, null, 2)}
            です。
            
            発言内容以外は回答に含めないでください。
        `;

        const chatResponse = await this.api.sendMessage(prompt);

        console.log("text-debug", chatResponse, prompt, this.aroundView.objectList, this.aroundView);
        
        return chatResponse;
    }
}