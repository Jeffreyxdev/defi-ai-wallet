import { Connection, PublicKey } from '@solana/web3.js';

export const shortenAddress = (address: string) => {
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
};

export const getBalance = async (connection: Connection, publicKey: PublicKey) => {
    try {
        const balance = await connection.getBalance(publicKey);
        return balance / 1e9; // Convert lamports to SOL
    } catch (error) {
        console.error("Error fetching balance:", error);
        return 0;
    }
};