'use client';

import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { PublicKey } from '@solana/web3.js';
import { useState, useEffect, useCallback } from 'react';
import { getBalance } from '../lib/solana/utils';

export interface TokenAsset {
    mint: string;
    symbol: string;
    balance: number;
    valueUsd: number;
    price: number;
    logo?: string;
}

export const usePortfolio = () => {
    const { connection } = useConnection();
    const { publicKey } = useWallet();
    const [loading, setLoading] = useState(false);
    const [solBalance, setSolBalance] = useState(0);
    const [tokens, setTokens] = useState<TokenAsset[]>([]);
    const [totalValue, setTotalValue] = useState(0);

    const fetchPortfolio = useCallback(async () => {
        if (!publicKey) return;

        setLoading(true);
        try {
            // 1. Fetch SOL Balance
            const sol = await getBalance(connection, publicKey);
            setSolBalance(sol);

            // 2. Fetch Token Accounts (Simplified for MVP)
            // In a real app, we'd use Helius or a similar service to get metadata/prices
            // For now, we'll mock the token list if it's empty on devnet
            const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
                programId: new PublicKey("TokenkegQFEZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
            });

            const parsedTokens: TokenAsset[] = tokenAccounts.value.map((account) => {
                const info = account.account.data.parsed.info;
                return {
                    mint: info.mint,
                    symbol: "UNKNOWN", // Need metadata service
                    balance: info.tokenAmount.uiAmount,
                    price: 0,
                    valueUsd: 0,
                };
            });

            // Mock some data if on Devnet and empty
            if (parsedTokens.length === 0 && sol > 0) {
                setTokens([
                    {
                        mint: "DezXAZ8z7Pnrn9kvJdVyX6VK3Akl6ji9fPTPafRPeLoL", // Mock Bonk or similar
                        symbol: "DEV-USDC",
                        balance: 100,
                        price: 1,
                        valueUsd: 100,
                    }
                ]);
            } else {
                setTokens(parsedTokens);
            }

            // Calculate total (Simplified: only counting mock USDC)
            setTotalValue(sol * 20 + (parsedTokens.length === 0 ? 100 : 0)); // Assume SOL = $20 for mock

        } catch (error) {
            console.error("Failed to fetch portfolio:", error);
        } finally {
            setLoading(false);
        }
    }, [connection, publicKey]);

    useEffect(() => {
        if (publicKey) {
            fetchPortfolio();
        } else {
            setSolBalance(0);
            setTokens([]);
            setTotalValue(0);
        }
    }, [publicKey, fetchPortfolio]);

    return {
        loading,
        solBalance,
        tokens,
        totalValue,
        refresh: fetchPortfolio
    };
};
