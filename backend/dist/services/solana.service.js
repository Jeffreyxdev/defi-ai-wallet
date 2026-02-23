"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SolanaService = void 0;
const web3_js_1 = require("@solana/web3.js");
const axios_1 = __importDefault(require("axios"));
class SolanaService {
    constructor() {
        const rpcUrl = process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com';
        this.connection = new web3_js_1.Connection(rpcUrl, 'confirmed');
        this.heliusApiKey = process.env.HELIUS_API_KEY || '';
    }
    async getWalletBalance(walletAddress) {
        try {
            const pubkey = new web3_js_1.PublicKey(walletAddress);
            const balance = await this.connection.getBalance(pubkey);
            return balance / web3_js_1.LAMPORTS_PER_SOL;
        }
        catch (error) {
            console.error('Error fetching wallet balance:', error);
            throw error;
        }
    }
    async getTokenAccounts(walletAddress) {
        try {
            const pubkey = new web3_js_1.PublicKey(walletAddress);
            const tokenAccounts = await this.connection.getParsedTokenAccountsByOwner(pubkey, {
                programId: new web3_js_1.PublicKey('TokenkegQFEZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
            });
            return tokenAccounts.value;
        }
        catch (error) {
            console.error('Error fetching token accounts:', error);
            throw error;
        }
    }
    async getTokenMetadata(mint) {
        try {
            if (!this.heliusApiKey) {
                return { symbol: 'UNKNOWN', decimals: 6, name: mint };
            }
            const response = await axios_1.default.post(`https://mainnet.helius-rpc.com/?api-key=${this.heliusApiKey}`, {
                jsonrpc: '2.0',
                id: '1',
                method: 'getAsset',
                params: {
                    id: mint
                }
            });
            if (response.data.result) {
                const asset = response.data.result;
                return {
                    symbol: asset.content?.metadata?.symbol || 'UNKNOWN',
                    decimals: asset.token_info?.decimals || 6,
                    name: asset.content?.metadata?.name || mint
                };
            }
            return { symbol: 'UNKNOWN', decimals: 6, name: mint };
        }
        catch (error) {
            console.error('Error fetching token metadata:', error);
            return { symbol: 'UNKNOWN', decimals: 6, name: mint };
        }
    }
    async getTokenPrice(mint) {
        try {
            // Mock price implementation - in production, use Jupiter or other price oracle
            if (mint === 'SOL')
                return 150; // Mock SOL price
            return 0; // Unknown token
        }
        catch (error) {
            console.error('Error fetching token price:', error);
            return 0;
        }
    }
}
exports.SolanaService = SolanaService;
//# sourceMappingURL=solana.service.js.map