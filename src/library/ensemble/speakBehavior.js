import LLMApi from "../module/llmApi";

export class SpeakBehavior {
    constructor(option) {
        this.gameObject = option.gameObject
        // this.aroundView = option.aroundView;

        this.name = option.name;

        this.api = new LLMApi();

        this.count = 0;

        this.speechText = "";

        this.conversationHistory = []; // {string}[]

        this.drawShapes = [
            {type: 'text', text: "test11", positionObject: this.gameObject, fontSize: 6}
        ];

        // //EventSystem
        // this.sendEvent = true;
        // this.eventConfigs = [
        //     {eventName: 'onConversation', callback: this.onConversation.bind(this)},
        // ];

        this.vision = option.vision;
        this.vision.submitHandler(this.visionBehavior.bind(this));

        this.objectList = []; //{layers, distance, angle, otherEntity}[]
        this.objectListStack = []; //{layers, distance, angle, otherEntity}[]

        

    }

    visionBehavior(layers, distance, angle, otherEntity) {

        const otherGameObject = otherEntity.gameObject;

        if (otherGameObject.layers.includes('human')) {
            // this.objectListStack.push({info: `${otherEntity.name}という名前の人物が、次のように言っています。:「${otherEntity.speakBehavior.speechText}」`});

            this.addConversation(otherEntity.name, otherEntity.speakBehavior.speechText);
        }
        if (otherGameObject.layers.includes('descriptiveItem')) {
            this.objectListStack.push({近くにあるアイテム: otherEntity.name, description: otherEntity.description});
        }
    }

    addConversation(name, speechText) {
        const speakString = `${name}:${speechText}`;
        if(!this.conversationHistory.includes(speakString)) {
            this.conversationHistory.push(speakString);
        }
    }

    update() {
        this.objectList = this.objectListStack;
        this.objectListStack = [];

        this.count--;
        if (this.count < 0) {
            this.count = 300 + Math.random() * 600;

            this.speak();
        }

    }

    // startConversation(companion, text) {
    //     const conversationData = {
    //         to: 1,
    //         from: 1,
    //         text: 1,
    //     }
    //     this.sendEvent('onConversation', conversationData);
    // }

    // onConversation() {

    // }

    async speak() {
        const text = await this.fetchSpeakText();
        this.drawShapes[0].text = text;
        this.speechText = text;

        this.addConversation(this.name, text);
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
            ${JSON.stringify(this.objectList, null, 2)}
            です。

            会話履歴は、
            ${JSON.stringify(this.conversationHistory, null, 2)}
            です。

            回答には会話内容だけを含めてください。
            日本語で20文字以内で会話してください。
        `;

        const chatResponse = await this.api.sendMessage(prompt);

        console.log("prompt-info", chatResponse, prompt);
        
        return chatResponse;
    }
}