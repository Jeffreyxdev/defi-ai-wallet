'use client';

import React from 'react';
import { Bot, Zap, Lock, TrendingUp } from 'lucide-react';

interface AIAnalysisProps {
  isLoading: boolean;
  analysis?: {
    sentiment: 'bullish' | 'neutral' | 'bearish';
    confidence: number;
    recommendation: string;
    keyPoints: string[];
  };
}

export const AIAnalysis: React.FC<AIAnalysisProps> = ({ isLoading, analysis }) => {
  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'bullish':
        return 'from-[#39ff14] to-[#00ff99]';
      case 'bearish':
        return 'from-red-500 to-red-700';
      default:
        return 'from-yellow-400 to-yellow-600';
    }
  };

  return (
    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#39ff14]/10 rounded-lg">
            <Bot className="w-5 h-5 text-[#39ff14]" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-white/60">AI Analysis</h3>
            <p className="text-xs text-white/40">Powered by xAI Grok</p>
          </div>
        </div>
        <Zap className="w-5 h-5 text-[#39ff14]" />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border border-[#39ff14]/30 border-t-[#39ff14] mx-auto mb-2" />
            <p className="text-xs text-white/60">Analyzing your portfolio...</p>
          </div>
        </div>
      ) : analysis ? (
        <>
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-white/60">Market Sentiment</p>
              <div
                className={`px-3 py-1 rounded-full bg-gradient-to-r ${getSentimentColor(analysis.sentiment)} text-black text-xs font-bold capitalize`}
              >
                {analysis.sentiment}
              </div>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2 overflow-hidden">
              <div
                className="bg-[#39ff14] h-full transition-all duration-500"
                style={{ width: `${analysis.confidence}%` }}
              />
            </div>
            <p className="text-xs text-white/40 mt-2">
              {analysis.confidence}% confidence
            </p>
          </div>

          <div className="mb-6 pb-6 border-b border-white/10">
            <p className="text-sm font-semibold text-white mb-2">Recommendation</p>
            <p className="text-sm text-white/70 leading-relaxed">
              {analysis.recommendation}
            </p>
          </div>

          {analysis.keyPoints.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-white/40 uppercase mb-3">
                Key Points
              </p>
              <div className="space-y-2">
                {analysis.keyPoints.map((point, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <TrendingUp className="w-4 h-4 text-[#39ff14] flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-white/70 leading-tight">{point}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 pt-6 border-t border-white/10 flex items-center gap-2 text-xs text-white/50">
            <Lock className="w-3 h-3" />
            <p>Analysis is for informational purposes only. Always DYOR.</p>
          </div>
        </>
      ) : (
        <div className="py-8 text-center">
          <p className="text-sm text-white/60">
            Connect your wallet to get AI analysis of your portfolio
          </p>
        </div>
      )}
    </div>
  );
};
