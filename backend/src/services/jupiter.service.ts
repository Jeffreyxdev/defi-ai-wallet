import axios from 'axios';

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

export class JupiterService {
    private baseUrl: string = 'https://quote-api.jup.ag/v6';

    async getQuote(
        inputMint: string,
        outputMint: string,
        amount: string,
        slippageBps: number = 50
    ): Promise<JupiterQuote> {
        try {
            const response = await axios.get(`${this.baseUrl}/quote`, {
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
        } catch (error) {
            console.error('Error fetching Jupiter quote:', error);
            throw error;
        }
    }

    async getSwapTransaction(
        userPublicKey: string,
        quote: JupiterQuote,
        feeAccount?: string
    ) {
        try {
            const response = await axios.post(`${this.baseUrl}/swap`, {
                quoteResponse: quote,
                userPublicKey,
                feeAccount,
                programId: 'JupMh7v2Z3BPrXEDA6ArjT1S6snFZol4vqUvango3MDi',
            });

            return response.data;
        } catch (error) {
            console.error('Error creating swap transaction:', error);
            throw error;
        }
    }

    async simulateSwap(quote: JupiterQuote) {
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
        } catch (error) {
            console.error('Error simulating swap:', error);
            throw error;
        }
    }

    async getTokens() {
        try {
            const response = await axios.get(`${this.baseUrl}/tokens`);
            return response.data;
        } catch (error) {
            console.error('Error fetching tokens:', error);
            throw error;
        }
    }
}
