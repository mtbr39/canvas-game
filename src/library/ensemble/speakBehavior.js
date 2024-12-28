import LLMApi from "../module/llmApi";

export class SpeakBehavior {
    constructor(option) {
        this.gameObject = option.gameObject
        this.aroundView = option.aroundView;

        this.name = option.name;

        this.api = new LLMApi();

        this.count = 0;

        this.speechText = "";

        this.conversationHistory = [];

        this.drawShapes = [
            {type: 'text', text: "test11", positionObject: this.gameObject, fontSize: 6}
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
            あなたは${this.name}という名前のゲームの中の人物です。
            
            周辺情報は、
            ${JSON.stringify(this.aroundView.objectList, null, 2)}
            です。
            
            日本語で20文字以内で会話してください。
        `;

        const chatResponse = await this.api.sendMessage(prompt);

        console.log("prompt-info", chatResponse, prompt);
        
        return chatResponse;
    }
}