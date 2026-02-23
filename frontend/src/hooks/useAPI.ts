'use client';

import { useCallback, useState } from 'react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

interface AIAnalysisResult {
    suggestion: string;
    confidence: number;
    riskRating: number;
    reasoning: string;
}

interface TokenRiskResult {
    mintAddress: string;
    rugRiskScore: number;
    riskLevel: string;
    explanation: string;
}

export const useAPI = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const analyzeIntent = useCallback(
        async (intent: string, walletAddress: string, portfolioData: any): Promise<AIAnalysisResult | null> => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`${API_BASE_URL}/api/analyze-intent`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ intent, walletAddress, portfolioData }),
                });

                if (!response.ok) throw new Error('Failed to analyze intent');
                return await response.json();
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Unknown error';
                setError(message);
                return null;
            } finally {
                setLoading(false);
            }
        },
        []
    );

    const scanToken = useCallback(
        async (mint: string): Promise<TokenRiskResult | null> => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`${API_BASE_URL}/api/scan-token/${mint}`);
                if (!response.ok) throw new Error('Failed to scan token');
                return await response.json();
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Unknown error';
                setError(message);
                return null;
            } finally {
                setLoading(false);
            }
        },
        []
    );

    const getRiskProfile = useCallback(
        async (walletAddress: string) => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`${API_BASE_URL}/api/risk-profile/${walletAddress}`);
                if (!response.ok) throw new Error('Failed to fetch risk profile');
                return await response.json();
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Unknown error';
                setError(message);
                return null;
            } finally {
                setLoading(false);
            }
        },
        []
    );

    const updateRiskProfile = useCallback(
        async (walletAddress: string, riskScore: number, riskLevel: string) => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`${API_BASE_URL}/api/risk-profile/${walletAddress}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ riskScore, riskLevel }),
                });

                if (!response.ok) throw new Error('Failed to update risk profile');
                return await response.json();
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Unknown error';
                setError(message);
                return null;
            } finally {
                setLoading(false);
            }
        },
        []
    );

    const getTradeHistory = useCallback(
        async (walletAddress: string) => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`${API_BASE_URL}/api/trade-history/${walletAddress}`);
                if (!response.ok) throw new Error('Failed to fetch trade history');
                return await response.json();
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Unknown error';
                setError(message);
                return null;
            } finally {
                setLoading(false);
            }
        },
        []
    );

    return {
        loading,
        error,
        analyzeIntent,
        scanToken,
        getRiskProfile,
        updateRiskProfile,
        getTradeHistory,
    };
};
