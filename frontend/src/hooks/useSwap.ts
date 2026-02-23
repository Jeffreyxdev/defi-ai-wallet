'use client';

import { useState } from 'react';
import { useAPI } from './useAPI';

export interface SwapQuote {
  routePlan: Array<{
    swapInfo: {
      ammKey: string;
      label: string;
      inputMint: string;
      outputMint: string;
      inAmount: string;
      outAmount: string;
    };
  }>;
  priceImpactPct: string;
  outputAmount: string;
  minOutputAmount: string;
}

export interface TokenRisk {
  rugRiskScore: number;
  riskLevel: 'Safe' | 'Caution' | 'HighRisk';
  liquidity: number;
  mintAuthority: string | null;
  topHolderPercent: number;
  explanation: string;
}

interface UseSwapState {
  quote: SwapQuote | null;
  tokenRisk: TokenRisk | null;
  loading: boolean;
  error: string | null;
  riskAcknowledged: boolean;
}

export function useSwap() {
  const api = useAPI();
  const [state, setState] = useState<UseSwapState>({
    quote: null,
    tokenRisk: null,
    loading: false,
    error: null,
    riskAcknowledged: false,
  });

  const getSwapQuote = async (
    inputMint: string,
    outputMint: string,
    amount: number,
    slippageBps: number = 50
  ) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      // This would call the backend endpoint
      // For now, we're using a mock response
      const mockQuote: SwapQuote = {
        routePlan: [
          {
            swapInfo: {
              ammKey: 'ORCA',
              label: 'Orca',
              inputMint,
              outputMint,
              inAmount: (amount * Math.pow(10, 9)).toString(),
              outAmount: (amount * 0.95 * Math.pow(10, 6)).toString(),
            },
          },
        ],
        priceImpactPct: '0.5',
        outputAmount: (amount * 0.95).toString(),
        minOutputAmount: (amount * 0.95 * (1 - slippageBps / 10000)).toString(),
      };

      setState(prev => ({
        ...prev,
        quote: mockQuote,
        loading: false,
      }));

      return mockQuote;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to get swap quote';
      setState(prev => ({ ...prev, error: errorMessage, loading: false }));
      throw error;
    }
  };

  const scanTokenRisk = async (mint: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      // This calls the backend /api/scan-token/:mint endpoint
      const riskData = await api.scanToken(mint);
      
      if (!riskData) {
        throw new Error('No risk data returned');
      }

      // Map TokenRiskResult to TokenRisk interface
      const risk: TokenRisk = {
        rugRiskScore: riskData.rugRiskScore || 0,
        riskLevel: (riskData.riskLevel as any) || 'Safe',
        liquidity: (riskData as any).liquidity || 0,
        mintAuthority: (riskData as any).mintAuthority || null,
        topHolderPercent: (riskData as any).topHolderPercent || 0,
        explanation: riskData.explanation || 'Unable to get token analysis',
      };

      setState(prev => ({
        ...prev,
        tokenRisk: risk,
        loading: false,
        riskAcknowledged: false,
      }));

      return risk;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to scan token';
      setState(prev => ({ ...prev, error: errorMessage, loading: false }));
      throw error;
    }
  };

  const acknowledgeRisk = () => {
    setState(prev => ({ ...prev, riskAcknowledged: true }));
  };

  const resetSwap = () => {
    setState({
      quote: null,
      tokenRisk: null,
      loading: false,
      error: null,
      riskAcknowledged: false,
    });
  };

  return {
    ...state,
    getSwapQuote,
    scanTokenRisk,
    acknowledgeRisk,
    resetSwap,
  };
}
