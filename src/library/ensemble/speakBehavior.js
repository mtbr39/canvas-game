import LLMApi from "../module/llmApi";

export class SpeakBehavior {
    constructor(option) {
        this.gameObject = option.gameObject
        this.aroundView = option.aroundView;

        this.api = new LLMApi();

        this.count = 0;

        this.speechText = "";

        this.drawShapes = [
            {type: 'text', text: "test11", positionObject: this.gameObject, fontSize: 8}
        ];
    }

    update() {
        this.count--;
        if (this.count < 0) {
            this.count = 300 + Math.random() * 600;

            this.speak();
        }

    }

    async speak() {
        const text = await this.fetchSpeakText();
        this.drawShapes[0].text = text;
        this.speechText = text;
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

        const prompt = `
            あなたはゲームの中の人物です。
            
            あなたの得ている周辺情報は、
            ${JSON.stringify(this.aroundView.objectList, null, 2)}
            です。
            
            speechTextというのはその人の発言内容で、それに対しての返事をしてください。
            
            発言内容以外は回答に含めないでください。
            日本語で回答してください。
        `;

        const chatResponse = await this.api.sendMessage(prompt);

        console.log("text-debug", chatResponse, prompt, this.aroundView.objectList, this.aroundView);
        
        return chatResponse;
    }
}