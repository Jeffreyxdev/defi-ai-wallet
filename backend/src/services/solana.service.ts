import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';
import axios from 'axios';

export class SolanaService {
    private connection: Connection;
    private heliusApiKey: string;

    constructor() {
        const rpcUrl = process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com';
        this.connection = new Connection(rpcUrl, 'confirmed');
        this.heliusApiKey = process.env.HELIUS_API_KEY || '';
    }

    async getWalletBalance(walletAddress: string): Promise<number> {
        try {
            const pubkey = new PublicKey(walletAddress);
            const balance = await this.connection.getBalance(pubkey);
            return balance / LAMPORTS_PER_SOL;
        } catch (error) {
            console.error('Error fetching wallet balance:', error);
            throw error;
        }
    }

    async getTokenAccounts(walletAddress: string) {
        try {
            const pubkey = new PublicKey(walletAddress);
            const tokenAccounts = await this.connection.getParsedTokenAccountsByOwner(pubkey, {
                programId: new PublicKey('TokenkegQFEZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
            });
            return tokenAccounts.value;
        } catch (error) {
            console.error('Error fetching token accounts:', error);
            throw error;
        }
    }

    async getTokenMetadata(mint: string) {
        try {
            if (!this.heliusApiKey) {
                return { symbol: 'UNKNOWN', decimals: 6, name: mint };
            }

            const response = await axios.post(
                `https://mainnet.helius-rpc.com/?api-key=${this.heliusApiKey}`,
                {
                    jsonrpc: '2.0',
                    id: '1',
                    method: 'getAsset',
                    params: {
                        id: mint
                    }
                }
            );

            if (response.data.result) {
                const asset = response.data.result;
                return {
                    symbol: asset.content?.metadata?.symbol || 'UNKNOWN',
                    decimals: asset.token_info?.decimals || 6,
                    name: asset.content?.metadata?.name || mint
                };
            }
            return { symbol: 'UNKNOWN', decimals: 6, name: mint };
        } catch (error) {
            console.error('Error fetching token metadata:', error);
            return { symbol: 'UNKNOWN', decimals: 6, name: mint };
        }
    }

    async getTokenPrice(mint: string): Promise<number> {
        try {
            // Mock price implementation - in production, use Jupiter or other price oracle
            if (mint === 'SOL') return 150; // Mock SOL price
            return 0; // Unknown token
        } catch (error) {
            console.error('Error fetching token price:', error);
            return 0;
        }
    }
}
