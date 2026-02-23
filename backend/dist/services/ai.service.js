"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIService = void 0;
const axios_1 = __importDefault(require("axios"));
class AIService {
    constructor() {
        this.apiUrl = 'https://api.x.ai/v1/chat/completions';
        this.apiKey = process.env.XAI_GROK_API_KEY || '';
    }
    async analyzeIntent(intent, portfolioData) {
        if (!this.apiKey) {
            return this.getMockAnalysis(intent);
        }
        try {
            const response = await axios_1.default.post(this.apiUrl, {
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
            }, {
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        }
        catch (error) {
            console.error("AI Analysis Error:", error);
            return this.getMockAnalysis(intent);
        }
    }
    getMockAnalysis(intent) {
        return {
            suggestion: "Rebalance towards SOL/USDC LP on Devnet.",
            confidence: 0.85,
            riskRating: 25,
            reasoning: "Your intent for 'Low Risk' matches the current Devnet stability analysis.",
        };
    }
}
exports.AIService = AIService;
//# sourceMappingURL=ai.service.js.map