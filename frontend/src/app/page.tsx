'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { Shield, TrendingUp, AlertTriangle, Zap, Wallet, BarChart3, Settings } from 'lucide-react';
import { useState, useEffect } from 'react';
import { usePortfolio } from '@/hooks/usePortfolio';
import { useRiskAssessment } from '@/hooks/useRiskAssessment';
import { PortfolioCard } from '@/components/PortfolioCard';
import { RiskScore } from '@/components/RiskScore';
import { AIAnalysis } from '@/components/AIAnalysis';
import { shortenAddress } from '@/lib/solana/utils';

export default function Home() {
  const { connected, publicKey } = useWallet();
  const { solBalance, tokens, totalValue, loading } = usePortfolio();
  const { riskLevel, assessRisk } = useRiskAssessment();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Assess risk when portfolio data changes
  useEffect(() => {
    if (connected && tokens) {
      assessRisk(tokens, solBalance);
    }
  }, [connected, tokens, solBalance, assessRisk]);

  if (!mounted) return null;

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white selection:bg-[#39ff14] selection:text-black">
      {/* Navigation */}
      <nav className="border-b border-white/10 px-6 py-4 flex items-center justify-between backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-linear-to-br from-[#39ff14] to-[#00ffcc] rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(57,255,20,0.3)]">
            <Shield className="text-black w-6 h-6" />
          </div>
          <span className="text-xl font-bold tracking-tight">SCENTREE <span className="text-[#39ff14]">AI</span></span>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-white/60">
            <a href="#" className="hover:text-white transition-colors">Dashboard</a>
            <a href="#" className="hover:text-white transition-colors">AI Analysis</a>
            <a href="#" className="hover:text-white transition-colors">Trade</a>
            <a href="#" className="hover:text-white transition-colors">Risk Check</a>
          </div>
          <WalletMultiButton className="bg-[#39ff14]! text-black! font-bold! rounded-lg! hover:opacity-90! transition-all h-10! px-4!" />
        </div>
      </nav>

      {/* Hero / Dashboard Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {!connected ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-linear-to-r from-white to-white/40 bg-clip-text text-transparent">
              SECURE YOUR <br /> <span className="text-[#39ff14]">SOLANA</span> JOURNEY
            </h1>
            <p className="text-white/60 max-w-2xl text-lg mb-10 leading-relaxed">
              The AI-native wallet that smells the rugs before they happen. 
              Intelligent analysis, guarded automation, and capital allocation guidance.
            </p>
            <div className="flex items-center gap-4">
              <WalletMultiButton className="bg-[#39ff14]! text-black! font-bold! rounded-xl! h-14! px-8! text-lg shadow-[0_0_30px_rgba(57,255,20,0.4)]" />
              <button className="h-14 px-8 rounded-xl border border-white/10 bg-white/5 font-bold hover:bg-white/10 transition-all">
                View Documentation
              </button>
            </div>

            {/* Features Preview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24 w-full">
              <FeatureCard 
                icon={<Shield className="text-[#39ff14]" />}
                title="Anti-Rug Intelligence"
                description="Real-time scanning of liquidity locks, ownership, and holder concentration."
              />
              <FeatureCard 
                icon={<Zap className="text-[#00ffcc]" />}
                title="AI Intent Engine"
                description="Explainable capital allocation based on your risk appetite."
              />
              <FeatureCard 
                icon={<TrendingUp className="text-[#39ff14]" />}
                title="Guarded Auto-Trade"
                description="Automated execution with strict stop-losses and risk-first guardrails."
              />
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Details */}
            <div className="lg:col-span-1 space-y-6">
              <PortfolioCard 
                solBalance={solBalance}
                tokens={tokens}
                totalValue={totalValue}
                loading={loading}
              />
              <RiskScore riskLevel={riskLevel} />
            </div>

            {/* Main Dashboard Area */}
            <div className="lg:col-span-3 space-y-8">
              <AIAnalysis isLoading={loading} />
              {tokens.length > 0 && (
                <div className="bg-[#111] border border-white/5 rounded-2xl overflow-hidden">
                  <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between">
                    <h2 className="text-xl font-bold">Assets</h2>
                    <button className="text-sm text-[#39ff14] hover:underline">View All</button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="text-xs text-white/40 uppercase tracking-wider border-b border-white/5">
                          <th className="px-8 py-4 font-medium">Asset</th>
                          <th className="px-8 py-4 font-medium">Balance</th>
                          <th className="px-8 py-4 font-medium">Price</th>
                          <th className="px-8 py-4 font-medium">Value</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        <tr className="hover:bg-white/2 transition-colors">
                          <td className="px-8 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center font-bold text-[10px]">SOL</div>
                              <div>
                                <p className="font-bold">Solana</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-4 font-mono">{solBalance.toFixed(4)}</td>
                          <td className="px-8 py-4">$20.00</td>
                          <td className="px-8 py-4 font-bold">${(solBalance * 20).toFixed(2)}</td>
                        </tr>
                        {tokens.map((token) => (
                          <tr key={token.mint} className="hover:bg-white/[0.02] transition-colors">
                            <td className="px-8 py-4">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center font-bold text-[10px] uppercase">{token.symbol.slice(0, 3)}</div>
                                <div>
                                  <p className="font-bold">{token.symbol}</p>
                                  <p className="text-xs text-white/40 font-mono">{shortenAddress(token.mint)}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-8 py-4 font-mono">{token.balance.toFixed(2)}</td>
                            <td className="px-8 py-4">${token.price.toFixed(2)}</td>
                            <td className="px-8 py-4 font-bold">${token.valueUsd.toFixed(2)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* AI Insight Bar */}
              <div className="bg-gradient-to-r from-[#111] to-[#151515] border border-white/5 rounded-2xl p-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#39ff14] rounded-full flex items-center justify-center animate-pulse shadow-[0_0_20px_rgba(57,255,20,0.2)]">
                    <Shield className="text-black w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold">Scentree AI Insight</p>
                    <p className="text-sm text-white/60 italic">"I've scanned your wallet. You're safe to proceed with a Low Risk strategy."</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs text-white/40 uppercase tracking-wider">Confidence Score</p>
                  <p className="text-xl font-bold text-[#39ff14]">98%</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-[#111] border border-white/5 rounded-2xl p-8 hover:border-[#39ff14]/30 transition-all group">
      <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-6 group-hover:bg-[#39ff14]/10 transition-all">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-white/60 leading-relaxed text-sm">
        {description}
      </p>
    </div>
  );
}
