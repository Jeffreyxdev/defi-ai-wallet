import { PublicKey } from '@solana/web3.js';
export declare class SolanaService {
    private connection;
    private heliusApiKey;
    constructor();
    getWalletBalance(walletAddress: string): Promise<number>;
    getTokenAccounts(walletAddress: string): Promise<{
        pubkey: PublicKey;
        account: import("@solana/web3.js").AccountInfo<import("@solana/web3.js").ParsedAccountData>;
    }[]>;
    getTokenMetadata(mint: string): Promise<{
        symbol: any;
        decimals: any;
        name: any;
    }>;
    getTokenPrice(mint: string): Promise<number>;
}
//# sourceMappingURL=solana.service.d.ts.map