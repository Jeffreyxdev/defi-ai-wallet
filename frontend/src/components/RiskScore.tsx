'use client';

import React from 'react';
import { Shield, AlertTriangle, CheckCircle, Zap } from 'lucide-react';

interface RiskLevel {
  level: 'low' | 'medium' | 'high' | 'critical';
  score: number;
  factors: string[];
}

interface RiskScoreProps {
  riskLevel: RiskLevel;
}

export const RiskScore: React.FC<RiskScoreProps> = ({ riskLevel }) => {
  const getRiskColor = () => {
    switch (riskLevel.level) {
      case 'low':
        return 'from-[#39ff14] to-[#00ff99]';
      case 'medium':
        return 'from-yellow-400 to-yellow-600';
      case 'high':
        return 'from-orange-400 to-orange-600';
      case 'critical':
        return 'from-red-500 to-red-700';
      default:
        return 'from-white/40 to-white/20';
    }
  };

  const getRiskIcon = () => {
    switch (riskLevel.level) {
      case 'low':
        return <CheckCircle className="w-6 h-6" />;
      case 'medium':
        return <AlertTriangle className="w-6 h-6" />;
      case 'high':
        return <AlertTriangle className="w-6 h-6" />;
      case 'critical':
        return <Shield className="w-6 h-6" />;
      default:
        return <Zap className="w-6 h-6" />;
    }
  };

  return (
    <div className="bg-gradient-to-br from-white/5 to-white/[0.02] border border-white/10 rounded-xl p-6 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-semibold text-white/60 uppercase">
          Risk Assessment
        </h3>
        <Zap className="w-5 h-5 text-[#39ff14]" />
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div
          className={`relative w-20 h-20 rounded-full bg-gradient-to-br ${getRiskColor()} flex items-center justify-center shadow-lg`}
        >
          <div className="absolute inset-1 bg-[#0a0a0a] rounded-full flex items-center justify-center">
            <span className="text-2xl font-bold text-white">
              {riskLevel.score}
            </span>
          </div>
        </div>
        <div>
          <p className="text-sm text-white/60">Risk Level</p>
          <p className="text-2xl font-bold capitalize text-white">
            {riskLevel.level}
          </p>
        </div>
      </div>

      {riskLevel.factors.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-white/40 uppercase">
            Risk Factors
          </p>
          <div className="space-y-1">
            {riskLevel.factors.map((factor, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2 p-2 bg-white/5 rounded hover:bg-white/10 transition-colors"
              >
                <AlertTriangle className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-white/70 leading-tight">{factor}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
