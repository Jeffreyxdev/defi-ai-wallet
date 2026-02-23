import axios from 'axios';

export class AIService {
    private apiKey: string;
    private apiUrl: string = 'https://api.x.ai/v1/chat/completions';

    constructor() {
        this.apiKey = process.env.XAI_GROK_API_KEY || '';
    }

    async analyzeIntent(intent: string, portfolioData: any) {
        if (!this.apiKey) {
            return this.getMockAnalysis(intent);
        }

        try {
            const response = await axios.post(
                this.apiUrl,
                {
                    model: "grok-beta",
                    messages: [
                        {
                            role: "system",
                            content: `You are Scentree AI, a risk-first Solana wallet assistant. 
                            Analyze user intent and portfolio. 
                            Provide: Risk Score (1-100), Suggestion, Reasoning, and Confidence %. 
                            Be concise and retail-friendly.`
                        },
                        {
                            role: "user",
                            content: `Intent: ${intent}\nPortfolio: ${JSON.stringify(portfolioData)}`
                        }
                    ]
                },
                {
                    headers: {
                        'Authorization': `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            return response.data;
        } catch (error) {
            console.error("AI Analysis Error:", error);
            return this.getMockAnalysis(intent);
        }
    }

    private getMockAnalysis(intent: string) {
        return {
            suggestion: "Rebalance towards SOL/USDC LP on Devnet.",
            confidence: 0.85,
            riskRating: 25,
            reasoning: "Your intent for 'Low Risk' matches the current Devnet stability analysis.",
        };
    }
}
