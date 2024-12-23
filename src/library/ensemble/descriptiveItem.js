import { Collider } from "../../system/collider";
import { GameObject2 } from "../../system/gameObject2";
import LLMApi from "../module/llmApi";

export class DescriptiveItem {
    constructor(option) {
        this.gameObject = new GameObject2({
            layers: ["descriptiveItem"]
        });

        this.collider = new Collider({isKinetic: true});

        this.name = "";
        this.description = "";

        this.palette = {
            red: "#FF3B3F",
            orange: "#FF7A1F",
            yellow: "#FFD400",
            green: "#2FD756",
            sky: "#1FD4FF",
            blue: "#005DFF",
            purple: "#7B30FF",
            pink: "#FF299D",
        }

        const randomColor = Object.values(this.palette)[Math.floor(Math.random() * Object.values(this.palette).length)];

        this.drawShapes = [
            {
                type: 'circle', positionObject: this.gameObject, radius: 2, lineWidth: 4, color: randomColor
            },
        ];

        this.api = new LLMApi();

        this.initialize();
    }

    async initialize() {
        try {
            const apiResponse = await this.fetchNameAndDescription();
            this.name = apiResponse.name;
            this.description = apiResponse.description;

            console.log("api-debug", apiResponse);
        } catch (error) {
            console.error("Failed to initialize DescriptiveItem:", error);
        }
    }

    async fetchNameAndDescription() {
        const prompt = `
            ゲームアイテムの名前と説明を日本語で考えてください。
            例です。過度この例に似せる必要はなく、自由に考えてください。
            名前: エターナルグレイブ
            説明: 古代の戦士が愛用した剣。光を集めることで闇を切り裂く力を持つ。

            以下がフォーマット。フォーマット以外は回答に含めないでください。
            
            名前: ユニークな名前
            説明: 2~3行の短い説明文で、そのアイテムの背景や用途を簡単に説明

        `;

        const chatResponse = await this.api.sendMessage(prompt);
        
        // 応答から名前と説明を抽出
        const [nameLine, descriptionLine] = chatResponse.split("\n").filter(line => line.trim());
        const name = nameLine.replace("名前:", "").trim();
        const description = descriptionLine.replace("説明:", "").trim();

        return { name, description };
    }
}