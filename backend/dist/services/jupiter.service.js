"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.JupiterService = void 0;
const axios_1 = __importDefault(require("axios"));
class JupiterService {
    constructor() {
        this.baseUrl = 'https://quote-api.jup.ag/v6';
    }
    async getQuote(inputMint, outputMint, amount, slippageBps = 50) {
        try {
            const response = await axios_1.default.get(`${this.baseUrl}/quote`, {
                params: {
                    inputMint,
                    outputMint,
                    amount,
                    slippageBps,
                    swapMode: 'ExactIn',
                    onlyDirectRoutes: false,
                    asLegacyTransaction: false,
                }
            });
            return response.data;
        }
        catch (error) {
            console.error('Error fetching Jupiter quote:', error);
            throw error;
        }
    }
    async getSwapTransaction(userPublicKey, quote, feeAccount) {
        try {
            const response = await axios_1.default.post(`${this.baseUrl}/swap`, {
                quoteResponse: quote,
                userPublicKey,
                feeAccount,
                programId: 'JupMh7v2Z3BPrXEDA6ArjT1S6snFZol4vqUvango3MDi',
            });
            return response.data;
        }
        catch (error) {
            console.error('Error creating swap transaction:', error);
            throw error;
        }
    }
    async simulateSwap(quote) {
        try {
            // Simulate the swap outcome
            const inputAmount = BigInt(quote.inputAmount);
            const outputAmount = BigInt(quote.outputAmount);
            const priceImpact = parseFloat(quote.priceImpactPct);
            return {
                expectedOutput: outputAmount.toString(),
                minOutput: (outputAmount * BigInt(10000 - (quote.slippageBps * 100)) / BigInt(10000)).toString(),
                priceImpact,
                routes: quote.routePlan.length,
            };
        }
        catch (error) {
            console.error('Error simulating swap:', error);
            throw error;
        }
    }
    async getTokens() {
        try {
            const response = await axios_1.default.get(`${this.baseUrl}/tokens`);
            return response.data;
        }
        catch (error) {
            console.error('Error fetching tokens:', error);
            throw error;
        }
    }
}
exports.JupiterService = JupiterService;
//# sourceMappingURL=jupiter.service.js.map