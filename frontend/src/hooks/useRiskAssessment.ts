'use client';

import { useCallback, useState } from 'react';

export interface RiskLevel {
  level: 'low' | 'medium' | 'high' | 'critical';
  score: number;
  factors: string[];
}

export const useRiskAssessment = () => {
  const [riskLevel, setRiskLevel] = useState<RiskLevel>({
    level: 'medium',
    score: 50,
    factors: [],
  });
  const [loading, setLoading] = useState(false);

  const assessRisk = useCallback(
    async (tokens: any[], solBalance: number) => {
      setLoading(true);
      try {
        // Simplified risk assessment logic
        // In production, this would call the backend API
        
        let score = 50;
        const factors: string[] = [];

        // Check for concentration risk
        if (tokens.length === 0 && solBalance > 0) {
          score += 10;
          factors.push('Low diversification - concentrated in SOL');
        }

        // Check for single large position
        if (tokens.length === 1) {
          score += 15;
          factors.push('Single token concentration');
        }

        // Assess based on number of tokens
        if (tokens.length > 5) {
          score -= 10;
        }

        // Cap score
        score = Math.min(100, Math.max(0, score));

        let level: 'low' | 'medium' | 'high' | 'critical';
        if (score < 25) level = 'low';
        else if (score < 50) level = 'medium';
        else if (score < 75) level = 'high';
        else level = 'critical';

        setRiskLevel({
          level,
          score,
          factors,
        });
      } catch (error) {
        console.error('Risk assessment error:', error);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return { riskLevel, loading, assessRisk };
};
