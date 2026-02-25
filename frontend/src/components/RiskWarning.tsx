'use client';

import { AlertTriangle, AlertCircle, CheckCircle2 } from 'lucide-react';

interface RiskWarningProps {
  rugRiskScore: number;
  riskLevel: 'Safe' | 'Caution' | 'HighRisk';
  liquidity: number;
  mintAuthority: string | null;
  topHolderPercent: number;
  explanation: string;
  onAcknowledge: () => void;
  loading?: boolean;
}

export default function RiskWarning({
  rugRiskScore,
  riskLevel,
  liquidity,
  mintAuthority,
  topHolderPercent,
  explanation,
  onAcknowledge,
  loading = false,
}: RiskWarningProps) {
  const getRiskConfig = () => {
    switch (riskLevel) {
      case 'Safe':
        return {
          icon: CheckCircle2,
          color: 'text-green-400',
          bgColor: 'bg-green-500/10',
          borderColor: 'border-green-500/30',
          titleColor: 'text-green-400',
          title: 'Token Risk Assessment: Safe',
        };
      case 'Caution':
        return {
          icon: AlertCircle,
          color: 'text-yellow-400',
          bgColor: 'bg-yellow-500/10',
          borderColor: 'border-yellow-500/30',
          titleColor: 'text-yellow-400',
          title: 'Token Risk Assessment: Caution',
        };
      case 'HighRisk':
        return {
          icon: AlertTriangle,
          color: 'text-orange-400',
          bgColor: 'bg-orange-500/10',
          borderColor: 'border-orange-500/30',
          titleColor: 'text-orange-400',
          title: 'Token Risk Assessment: High Risk',
        };
    }
  };

  const config = getRiskConfig();
  const Icon = config.icon;

  return (
    <div className={`${config.bgColor} border ${config.borderColor} rounded-lg p-4 space-y-4`}>
      {/* Header */}
      <div className="flex gap-3 items-start">
        <Icon className={`w-5 h-5 ${config.color} flex-shrink-0 mt-0.5`} />
        <div>
          <h3 className={`font-bold ${config.titleColor}`}>{config.title}</h3>
          <p className="text-sm text-slate-300 mt-1">{explanation}</p>
        </div>
      </div>

      {/* Risk Score */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-slate-400">Rug Risk Score</span>
          <span className={`font-bold ${
            rugRiskScore <= 25 ? 'text-green-400' :
            rugRiskScore <= 50 ? 'text-yellow-400' :
            rugRiskScore <= 75 ? 'text-orange-400' :
            'text-red-400'
          }`}>
            {rugRiskScore}/100
          </span>
        </div>
        <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
          <div
            className={`h-full transition-all ${
              rugRiskScore <= 25 ? 'bg-green-500' :
              rugRiskScore <= 50 ? 'bg-yellow-500' :
              rugRiskScore <= 75 ? 'bg-orange-500' :
              'bg-red-500'
            }`}
            style={{ width: `${rugRiskScore}%` }}
          />
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div className="bg-slate-900/50 rounded p-2">
          <span className="text-slate-400 block text-xs mb-1">Liquidity</span>
          <span className="text-white font-mono">${(liquidity / 1000).toFixed(1)}K</span>
        </div>
        <div className="bg-slate-900/50 rounded p-2">
          <span className="text-slate-400 block text-xs mb-1">Top Holder</span>
          <span className={`font-mono ${topHolderPercent > 20 ? 'text-orange-400' : 'text-white'}`}>
            {topHolderPercent.toFixed(1)}%
          </span>
        </div>
        <div className="col-span-2 bg-slate-900/50 rounded p-2">
          <span className="text-slate-400 block text-xs mb-1">Mint Authority</span>
          <span className="text-white font-mono text-xs">
            {mintAuthority ? '⚠️ Enabled' : '✓ Disabled'}
          </span>
        </div>
      </div>

      {/* Risk Factors */}
      <div className="space-y-2">
        <span className="text-xs text-slate-400 block">Risk Factors:</span>
        <div className="space-y-1.5">
          {liquidity < 50000 && (
            <div className="flex gap-2 items-start text-xs">
              <span className="text-orange-400 font-bold">⚠</span>
              <span className="text-slate-300">Low liquidity - large trades may slippage heavily</span>
            </div>
          )}
          {topHolderPercent > 20 && (
            <div className="flex gap-2 items-start text-xs">
              <span className="text-orange-400 font-bold">⚠</span>
              <span className="text-slate-300">High holder concentration - potential dump risk</span>
            </div>
          )}
          {mintAuthority && (
            <div className="flex gap-2 items-start text-xs">
              <span className="text-orange-400 font-bold">⚠</span>
              <span className="text-slate-300">Mint authority active - supply can be increased</span>
            </div>
          )}
          {rugRiskScore <= 25 && (
            <div className="flex gap-2 items-start text-xs">
              <span className="text-green-400 font-bold">✓</span>
              <span className="text-slate-300">Token appears safe based on on-chain analysis</span>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 pt-2">
        <button
          onClick={onAcknowledge}
          disabled={loading}
          className={`flex-1 font-bold py-2 px-3 rounded-lg transition ${
            riskLevel === 'Safe'
              ? 'bg-green-600 hover:bg-green-700 text-white disabled:opacity-50'
              : riskLevel === 'Caution'
              ? 'bg-yellow-600 hover:bg-yellow-700 text-white disabled:opacity-50'
              : 'bg-orange-600 hover:bg-orange-700 text-white disabled:opacity-50'
          }`}
        >
          {loading ? 'Processing...' : 'I Understand, Continue'}
        </button>
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-slate-500 text-center pt-2 border-t border-slate-700">
        This is an on-chain risk assessment. Always do your own research before trading.
      </p>
    </div>
  );
}
