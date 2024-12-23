import axios from "axios";
import { config } from "../../../config-env";

class LLMApi {
    constructor() {
        this.apiKey = config.LLMApiKey;
        this.apiUrl = "https://api.groq.com/openai/v1/chat/completions";

        
    }

    async sendMessage(prompt, model = "llama3-8b-8192", maxTokens = 100, temperature = 0.7) {
        try {
            const response = await axios.post(
                this.apiUrl,
                {
                    model: model,
                    messages: [{ role: "user", content: prompt }],
                    max_tokens: maxTokens,
                    temperature: temperature,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${this.apiKey}`,
                    },
                }
            );

            return response.data.choices[0].message.content;
        } catch (error) {
            console.error("API request failed:", error);
            throw new Error("Failed to communicate with API");
        }
    }
}

export default LLMApi;
