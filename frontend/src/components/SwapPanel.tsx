'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { ArrowDownUp, AlertCircle, Loader } from 'lucide-react';

interface SwapPanelProps {
  onSwapInitiate?: (data: SwapData) => void;
  disabled?: boolean;
}

export interface SwapData {
  fromMint: string;
  toMint: string;
  fromAmount: number;
  slippageBps: number;
  estimatedOutput?: number;
}

const POPULAR_TOKENS = [
  { symbol: 'SOL', mint: 'So11111111111111111111111111111111111111112', logo: '◎' },
  { symbol: 'USDC', mint: 'EPjFWaLb3odccccccccPb8d5OqHmbqWuL5vdZjJsJu', logo: 'U' },
  { symbol: 'USDT', mint: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenEst', logo: 'T' },
  { symbol: 'BONK', mint: 'DezXAZ8z7PnrnRJjV3FFpDr8ByRARrzn8KcqmeYqLMK', logo: 'B' },
  { symbol: 'COPE', mint: '8HGyAAB1yoM1ttS7pnqw1KOBS6JBdu1BJzzpzG5V34K', logo: 'C' },
];

export default function SwapPanel({ onSwapInitiate, disabled = false }: SwapPanelProps) {
  const { publicKey, connected } = useWallet();
  
  const [fromToken, setFromToken] = useState(POPULAR_TOKENS[0]);
  const [toToken, setToToken] = useState(POPULAR_TOKENS[1]);
  const [fromAmount, setFromAmount] = useState('');
  const [estimatedOutput, setEstimatedOutput] = useState('');
  const [slippage, setSlippage] = useState(50); // basis points (0.5%)
  const [loading, setLoading] = useState(false);
  const [priceImpact, setPriceImpact] = useState(0);
  const [showFromTokens, setShowFromTokens] = useState(false);
  const [showToTokens, setShowToTokens] = useState(false);

  // Swap tokens (from ↔ to)
  const handleSwapTokens = () => {
    const temp = fromToken;
    setFromToken(toToken);
    setToToken(temp);
    setFromAmount('');
    setEstimatedOutput('');
  };

  // Fetch quote from Jupiter when amount changes
  useEffect(() => {
    if (!fromAmount || parseFloat(fromAmount) === 0) {
      setEstimatedOutput('');
      return;
    }

    const fetchQuote = async () => {
      setLoading(true);
      try {
        // In a real app, this would call the backend /api/get-swap-quote
        // For now, using mock calculation
        const mockRate = 0.95; // 95% of input (simplified)
        const output = parseFloat(fromAmount) * mockRate;
        setEstimatedOutput(output.toFixed(4));
        setPriceImpact(5); // Mock 5% impact
      } catch (error) {
        console.error('Failed to fetch quote:', error);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchQuote, 500);
    return () => clearTimeout(timer);
  }, [fromAmount, fromToken, toToken, slippage]);

  const handleSwap = () => {
    if (!connected || !fromAmount || !estimatedOutput) return;

    onSwapInitiate?.({
      fromMint: fromToken.mint,
      toMint: toToken.mint,
      fromAmount: parseFloat(fromAmount),
      slippageBps: slippage,
      estimatedOutput: parseFloat(estimatedOutput),
    });
  };

  const isReady = connected && fromAmount && estimatedOutput && !loading && !disabled;

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white mb-1">Swap Tokens</h2>
        <p className="text-slate-400 text-sm">Trade between tokens on Solana</p>
      </div>

      {/* From Token */}
      <div className="bg-slate-900 rounded-xl p-4 mb-2 border border-slate-800">
        <div className="flex justify-between items-center mb-3">
          <label className="text-sm text-slate-400">From</label>
          <button
            onClick={() => setShowFromTokens(!showFromTokens)}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg transition"
          >
            <span className="text-xl">{fromToken.logo}</span>
            <span className="font-medium text-white">{fromToken.symbol}</span>
          </button>
        </div>

        {showFromTokens && (
          <div className="mb-3 bg-slate-800 rounded-lg p-2 max-h-40 overflow-y-auto">
            {POPULAR_TOKENS.map((token) => (
              <button
                key={token.mint}
                onClick={() => {
                  setFromToken(token);
                  setShowFromTokens(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 hover:bg-slate-700 rounded transition text-left"
              >
                <span className="text-lg">{token.logo}</span>
                <span className="font-medium text-white">{token.symbol}</span>
              </button>
            ))}
          </div>
        )}

        <input
          type="number"
          placeholder="0.00"
          value={fromAmount}
          onChange={(e) => setFromAmount(e.target.value)}
          disabled={!connected || disabled}
          className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white text-xl font-semibold placeholder-slate-500 focus:outline-none focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        />
      </div>

      {/* Swap Button */}
      <div className="flex justify-center -my-2 relative z-10">
        <button
          onClick={handleSwapTokens}
          disabled={!connected}
          className="bg-slate-800 hover:bg-slate-700 border border-slate-700 p-2 rounded-full transition disabled:opacity-50"
        >
          <ArrowDownUp className="w-5 h-5 text-blue-400" />
        </button>
      </div>

      {/* To Token */}
      <div className="bg-slate-900 rounded-xl p-4 mb-4 border border-slate-800">
        <div className="flex justify-between items-center mb-3">
          <label className="text-sm text-slate-400">To</label>
          <button
            onClick={() => setShowToTokens(!showToTokens)}
            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg transition"
          >
            <span className="text-xl">{toToken.logo}</span>
            <span className="font-medium text-white">{toToken.symbol}</span>
          </button>
        </div>

        {showToTokens && (
          <div className="mb-3 bg-slate-800 rounded-lg p-2 max-h-40 overflow-y-auto">
            {POPULAR_TOKENS.map((token) => (
              <button
                key={token.mint}
                onClick={() => {
                  setToToken(token);
                  setShowToTokens(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 hover:bg-slate-700 rounded transition text-left"
              >
                <span className="text-lg">{token.logo}</span>
                <span className="font-medium text-white">{token.symbol}</span>
              </button>
            ))}
          </div>
        )}

        <div className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-3 text-white text-xl font-semibold">
          {loading ? (
            <div className="flex items-center gap-2">
              <Loader className="w-5 h-5 animate-spin text-blue-400" />
              <span className="text-slate-400">Calculating...</span>
            </div>
          ) : estimatedOutput ? (
            estimatedOutput
          ) : (
            <span className="text-slate-500">0.00</span>
          )}
        </div>
      </div>

      {/* Details */}
      <div className="bg-slate-900 rounded-xl p-4 mb-4 border border-slate-800 space-y-3">
        {/* Price Impact */}
        <div className="flex justify-between items-center">
          <span className="text-sm text-slate-400">Price Impact</span>
          <span className={`text-sm font-medium ${priceImpact > 5 ? 'text-orange-400' : 'text-green-400'}`}>
            {priceImpact.toFixed(2)}%
          </span>
        </div>

        {/* Slippage */}
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-400">Slippage Tolerance</span>
            <span className="text-sm font-medium text-white">{(slippage / 100).toFixed(2)}%</span>
          </div>
          <div className="flex gap-2">
            {[25, 50, 100].map((bps) => (
              <button
                key={bps}
                onClick={() => setSlippage(bps)}
                className={`flex-1 py-1.5 rounded transition text-sm font-medium ${
                  slippage === bps
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {(bps / 100).toFixed(2)}%
              </button>
            ))}
            <input
              type="number"
              min="0"
              max="50"
              value={slippage / 100}
              onChange={(e) => setSlippage(Math.max(0, Math.min(50, parseFloat(e.target.value) * 100)))}
              placeholder="Custom"
              className="w-20 bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-white text-sm focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Warnings */}
      {priceImpact > 5 && (
        <div className="flex gap-2 items-start mb-4 p-3 bg-orange-500/10 border border-orange-500/30 rounded-lg">
          <AlertCircle className="w-5 h-5 text-orange-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-orange-400">High Price Impact</p>
            <p className="text-xs text-orange-300">This swap may experience significant slippage</p>
          </div>
        </div>
      )}

      {!connected && (
        <div className="flex gap-2 items-start mb-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
          <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-blue-400">Wallet Not Connected</p>
            <p className="text-xs text-blue-300">Connect your wallet to enable trading</p>
          </div>
        </div>
      )}

      {/* Swap Button */}
      <button
        onClick={handleSwap}
        disabled={!isReady}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {!connected ? 'Connect Wallet' : loading ? 'Calculating...' : 'Review Trade'}
      </button>

      <p className="text-xs text-slate-500 text-center mt-3">
        Powered by Jupiter • Gas required to confirm trade
      </p>
    </div>
  );
}
