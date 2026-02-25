export interface JupiterQuote {
    inputMint: string;
    outputMint: string;
    inputAmount: string;
    outputAmount: string;
    otherAmountThreshold: string;
    swapMode: 'ExactIn' | 'ExactOut';
    priceImpactPct: string;
    slippageBps: number;
    routePlan: Array<{
        swapInfo: {
            ammKey: string;
            label: string;
            inputMint: string;
            outputMint: string;
            inAmount: string;
            outAmount: string;
            feeAmount: string;
            feeMint: string;
        };
        percent: number;
    }>;
}
export declare class JupiterService {
    private baseUrl;
    getQuote(inputMint: string, outputMint: string, amount: string, slippageBps?: number): Promise<JupiterQuote>;
    getSwapTransaction(userPublicKey: string, quote: JupiterQuote, feeAccount?: string): Promise<any>;
    simulateSwap(quote: JupiterQuote): Promise<{
        expectedOutput: string;
        minOutput: string;
        priceImpact: number;
        routes: number;
    }>;
    getTokens(): Promise<any>;
}
//# sourceMappingURL=jupiter.service.d.ts.map