'use client';

import { useState } from 'react';
import { X, CheckCircle2, AlertCircle, Loader } from 'lucide-react';
import { SwapData } from './SwapPanel';
import { TokenRisk } from '@/hooks/useSwap';

interface TradeConfirmationProps {
  swapData: SwapData;
  tokenRisk?: TokenRisk | null;
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function TradeConfirmation({
  swapData,
  tokenRisk,
  onConfirm,
  onCancel,
  loading = false,
}: TradeConfirmationProps) {
  const [agreeRisk, setAgreeRisk] = useState(false);

  const riskLevel = tokenRisk?.riskLevel || 'Safe';
  const estimatedOutput = swapData.estimatedOutput || swapData.fromAmount * 0.95;
  const minOutput = estimatedOutput * (1 - swapData.slippageBps / 10000);
  const priceImpact = ((estimatedOutput - (swapData.fromAmount * 0.95)) / (swapData.fromAmount * 0.95)) * 100;

  // Map token mints to symbols for display
  const getTokenSymbol = (mint: string) => {
    const symbols: { [key: string]: string } = {
      'So11111111111111111111111111111111111111112': 'SOL',
      'EPjFWaLb3odccccccccPb8d5OqHmbqWuL5vdZjJsJu': 'USDC',
      'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenEst': 'USDT',
      'DezXAZ8z7PnrnRJjV3FFpDr8ByRARrzn8KcqmeYqLMK': 'BONK',
      '8HGyAAB1yoM1ttS7pnqw1KOBS6JBdu1BJzzpzG5V34K': 'COPE',
    };
    return symbols[mint] || mint.slice(0, 6).toUpperCase();
  };

  const fromSymbol = getTokenSymbol(swapData.fromMint);
  const toSymbol = getTokenSymbol(swapData.toMint);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#111] border border-white/5 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 flex justify-between items-center p-6 border-b border-white/5 bg-[#111]/95 backdrop-blur">
          <h2 className="text-xl font-bold text-white">Confirm Trade</h2>
          <button
            onClick={onCancel}
            disabled={loading}
            className="text-white/60 hover:text-white disabled:opacity-50 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Trade Summary */}
          <div className="space-y-3">
            <div>
              <p className="text-sm text-white/60 mb-2">You send</p>
              <div className="bg-white/5 border border-white/5 rounded-lg p-4">
                <div className="text-3xl font-bold text-white">{swapData.fromAmount.toFixed(4)}</div>
                <div className="text-white/60 text-sm">{fromSymbol}</div>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="bg-[#39ff14]/10 p-2 rounded-full border border-[#39ff14]/30">
                <svg className="w-5 h-5 text-[#39ff14]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m0 0l4 4m10-4v12m0 0l4-4m0 0l-4-4" />
                </svg>
              </div>
            </div>

            <div>
              <p className="text-sm text-white/60 mb-2">You receive (estimated)</p>
              <div className="bg-white/5 border border-white/5 rounded-lg p-4">
                <div className="text-3xl font-bold text-white">{estimatedOutput.toFixed(4)}</div>
                <div className="text-white/60 text-sm">{toSymbol}</div>
              </div>
            </div>
          </div>

          {/* Trade Details */}
          <div className="bg-white/5 border border-white/5 rounded-lg p-4 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Price Impact</span>
              <span className={`font-medium ${Math.abs(priceImpact) > 5 ? 'text-orange-400' : 'text-[#39ff14]'}`}>
                {priceImpact.toFixed(2)}%
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Minimum Received</span>
              <span className="text-white font-mono">{minOutput.toFixed(4)} {toSymbol}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Slippage Tolerance</span>
              <span className="text-white">{(swapData.slippageBps / 100).toFixed(2)}%</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-white/60">Network Fee</span>
              <span className="text-white">~0.00025 SOL</span>
            </div>
          </div>

          {/* Risk Level */}
          {tokenRisk && (
            <div className={`rounded-lg p-4 border ${
              riskLevel === 'Safe' ? 'bg-green-500/10 border-green-500/30' :
              riskLevel === 'Caution' ? 'bg-yellow-500/10 border-yellow-500/30' :
              'bg-orange-500/10 border-orange-500/30'
            }`}>
              <div className="flex gap-3 items-start">
                {riskLevel === 'Safe' ? (
                  <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-orange-400 flex-shrink-0 mt-0.5" />
                )}
                <div>
                  <p className={`font-bold ${
                    riskLevel === 'Safe' ? 'text-green-400' :
                    riskLevel === 'Caution' ? 'text-yellow-400' :
                    'text-orange-400'
                  }`}>
                    {toSymbol} Risk: {riskLevel}
                  </p>
                  <p className="text-xs text-white/60 mt-1">
                    Score: {tokenRisk.rugRiskScore}/100 • Liquidity: ${(tokenRisk.liquidity / 1000).toFixed(1)}K
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Acknowledgment */}
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={agreeRisk}
              onChange={(e) => setAgreeRisk(e.target.checked)}
              disabled={loading}
              className="mt-1 w-4 h-4 accent-[#39ff14] disabled:opacity-50 cursor-pointer"
            />
            <span className="text-xs text-white/60">
              I understand the risks and agree to proceed with this trade. I acknowledge that crypto trading carries risk and I may lose funds.
            </span>
          </label>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={onCancel}
              disabled={loading}
              className="flex-1 bg-white/5 hover:bg-white/10 text-white font-bold py-3 px-4 rounded-lg transition disabled:opacity-50 border border-white/5"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={!agreeRisk || loading}
              className="flex-1 bg-[#39ff14] hover:bg-[#39ff14]/90 text-black font-bold py-3 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(57,255,20,0.3)]"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Confirming...
                </>
              ) : (
                'Confirm Trade'
              )}
            </button>
          </div>

          <p className="text-xs text-white/40 text-center">
            Sign the transaction in your wallet to complete the trade.
          </p>
        </div>
      </div>
    </div>
  );
}
