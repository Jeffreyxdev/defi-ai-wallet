'use client';

import React from 'react';
import { Wallet, TrendingUp, AlertTriangle } from 'lucide-react';
import { TokenAsset } from '@/hooks/usePortfolio';

interface PortfolioCardProps {
  solBalance: number;
  tokens: TokenAsset[];
  totalValue: number;
  loading: boolean;
}

export const PortfolioCard: React.FC<PortfolioCardProps> = ({
  solBalance,
  tokens,
  totalValue,
  loading,
}) => {
  return (
    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#39ff14]/10 rounded-lg">
            <Wallet className="w-5 h-5 text-[#39ff14]" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-white/60">Total Portfolio</h3>
            <p className="text-2xl font-bold text-white">
              ${totalValue.toFixed(2)}
            </p>
          </div>
        </div>
        <TrendingUp className="w-5 h-5 text-[#39ff14]" />
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border border-[#39ff14]/30 border-t-[#39ff14]" />
        </div>
      ) : (
        <>
          {/* SOL Balance */}
          <div className="mb-4 pb-4 border-b border-white/10">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm text-white/60">SOL Balance</p>
                <p className="text-lg font-semibold text-white">
                  {solBalance.toFixed(4)} SOL
                </p>
              </div>
              <p className="text-[#39ff14] font-semibold">
                ${(solBalance * 150).toFixed(2)}
              </p>
            </div>
          </div>

          {/* Token Holdings */}
          {tokens.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-white/40 uppercase mb-3">
                Token Holdings ({tokens.length})
              </p>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {tokens.map((token) => (
                  <div
                    key={token.mint}
                    className="flex justify-between items-center p-2 bg-white/5 rounded hover:bg-white/10 transition-colors"
                  >
                    <div>
                      <p className="text-sm font-medium text-white">
                        {token.symbol || 'Unknown'}
                      </p>
                      <p className="text-xs text-white/40">
                        {token.balance.toFixed(2)}
                      </p>
                    </div>
                    <p className="text-sm text-[#39ff14] font-semibold">
                      ${token.valueUsd.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tokens.length === 0 && solBalance > 0 && (
            <div className="flex items-center gap-2 p-3 bg-white/5 rounded-lg border border-white/10">
              <AlertTriangle className="w-4 h-4 text-yellow-500" />
              <p className="text-xs text-white/60">
                No token holdings detected. Add tokens to your wallet to analyze them.
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};
