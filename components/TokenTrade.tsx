
import React, { useState, useEffect } from 'react';
import { useReadContract, useWriteContract, useWaitForTransactionReceipt, useAccount, useBalance } from 'wagmi';
import { formatEther, parseEther } from 'viem';
import { SUB_TOKEN_ABI } from '../constants';

interface TokenTradeProps {
  tokenAddress: string;
  symbol: string;
  graduated: boolean;
  onTradeSuccess: () => void;
}

const TokenTrade: React.FC<TokenTradeProps> = ({ tokenAddress, symbol, graduated, onTradeSuccess }) => {
  const [mode, setMode] = useState<'BUY' | 'SELL'>('BUY');
  const [amount, setAmount] = useState('');
  const { address } = useAccount();
  const { data: ethBalance } = useBalance({ address });
  
  const { data: tokenBalance } = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: SUB_TOKEN_ABI,
    functionName: 'balanceOf',
    args: [address as `0x${string}`],
  });

  const { data: estimatedOut } = useReadContract({
    address: tokenAddress as `0x${string}`,
    abi: SUB_TOKEN_ABI,
    functionName: mode === 'BUY' ? 'getBuyAmount' : 'getSellAmount',
    args: [parseEther(amount || '0')],
  });

  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  useEffect(() => {
    if (isSuccess) {
      setAmount('');
      onTradeSuccess();
    }
  }, [isSuccess]);

  const handleTrade = () => {
    if (!amount || Number(amount) <= 0) return;

    if (mode === 'BUY') {
      writeContract({
        address: tokenAddress as `0x${string}`,
        abi: SUB_TOKEN_ABI,
        functionName: 'buy',
        value: parseEther(amount),
      });
    } else {
      writeContract({
        address: tokenAddress as `0x${string}`,
        abi: SUB_TOKEN_ABI,
        functionName: 'sell',
        args: [parseEther(amount)],
      });
    }
  };

  if (graduated) {
    return (
      <div className="glass-card rounded-3xl p-6 text-center border-green-500/20">
        <div className="text-4xl mb-2">🎓</div>
        <h3 className="text-xl font-black mb-2">GRADUATED</h3>
        <p className="text-sm text-gray-400">This token has graduated to Uniswap. Please trade on DEX.</p>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-3xl p-6 shadow-2xl">
      <div className="flex p-1 bg-white/5 rounded-2xl mb-6">
        <button 
          onClick={() => setMode('BUY')}
          className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${mode === 'BUY' ? 'bg-green-500 text-black' : 'text-gray-500 hover:text-white'}`}
        >
          BUY
        </button>
        <button 
          onClick={() => setMode('SELL')}
          className={`flex-1 py-2 rounded-xl text-sm font-bold transition-all ${mode === 'SELL' ? 'bg-red-500 text-black' : 'text-gray-500 hover:text-white'}`}
        >
          SELL
        </button>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-[10px] text-gray-500 uppercase font-bold tracking-widest px-1">
            <span>{mode === 'BUY' ? 'Amount CORE' : `Amount ${symbol}`}</span>
            <span>
              {mode === 'BUY' 
                ? `Balance: ${ethBalance ? Number(formatEther(ethBalance.value)).toFixed(4) : '0'}` 
                : `Balance: ${tokenBalance ? Number(formatEther(tokenBalance as bigint)).toFixed(2) : '0'}`}
            </span>
          </div>
          <div className="relative">
            <input 
              type="number"
              placeholder="0.0"
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-2xl font-mono focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-gray-600">
              {mode === 'BUY' ? 'CORE' : symbol}
            </div>
          </div>
        </div>

        {amount && (
          <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-2">
            <div className="flex justify-between text-xs text-gray-500">
              <span>Estimated Received:</span>
              <span className="text-white font-mono">
                {estimatedOut ? Number(formatEther(estimatedOut as bigint)).toFixed(4) : '0'} {mode === 'BUY' ? symbol : 'CORE'}
              </span>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>Trading Fee (0.5%):</span>
              <span className="text-white font-mono">
                {mode === 'BUY' ? (Number(amount) * 0.005).toFixed(4) : '...'} CORE
              </span>
            </div>
          </div>
        )}

        <button 
          onClick={handleTrade}
          disabled={isPending || isConfirming || !amount}
          className={`w-full py-4 rounded-2xl font-black text-lg transition-all shadow-lg active:scale-95 disabled:opacity-50 ${mode === 'BUY' ? 'bg-green-500 text-black shadow-green-500/20' : 'bg-red-500 text-black shadow-red-500/20'}`}
        >
          {isPending ? 'TRANSACTING...' : isConfirming ? 'CONFIRMING...' : `${mode} ${symbol}`}
        </button>
      </div>
    </div>
  );
};

export default TokenTrade;
