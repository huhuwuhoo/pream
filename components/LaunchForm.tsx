
import React, { useState } from 'react';
import { useWriteContract, useWaitForTransactionReceipt, useAccount } from 'wagmi';
import { CORE_PROTOCOL_ADDRESS, CORE_PROTOCOL_ABI } from '../constants';

interface LaunchFormProps {
  onSuccess: () => void;
}

const LaunchForm: React.FC<LaunchFormProps> = ({ onSuccess }) => {
  const [name, setName] = useState('');
  const [symbol, setSymbol] = useState('');
  const { isConnected } = useAccount();

  const { writeContract, data: hash, isPending, error } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });

  const handleLaunch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected) return alert('Connect wallet first');
    
    writeContract({
      address: CORE_PROTOCOL_ADDRESS as `0x${string}`,
      abi: CORE_PROTOCOL_ABI,
      functionName: 'launchToken',
      args: [name, symbol],
    });
  };

  React.useEffect(() => {
    if (isSuccess) onSuccess();
  }, [isSuccess, onSuccess]);

  return (
    <div className="max-w-xl mx-auto">
      <div className="glass-card rounded-3xl p-8 border-orange-500/20">
        <div className="mb-8 text-center">
          <span className="text-6xl mb-4 block">🧪</span>
          <h2 className="text-3xl font-black italic tracking-tighter">START A NEW ORGANISM</h2>
          <p className="text-gray-500 mt-2">Deploy your own bonding curve token on Core instantly.</p>
        </div>

        <form onSubmit={handleLaunch} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Token Name</label>
            <input 
              required
              type="text" 
              placeholder="e.g. Core Doge"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-gray-400">Symbol</label>
            <input 
              required
              type="text" 
              placeholder="e.g. CDOGE"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:ring-2 focus:ring-orange-500 outline-none transition-all"
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
            />
          </div>

          <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4 text-xs text-orange-200 leading-relaxed">
            <p className="font-bold mb-1">💡 Pro-tip:</p>
            Memorable names and catchy symbols perform better. Once launched, tokens are listed immediately for trading on the bonding curve.
          </div>

          {error && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm">
              Error: {error.message.slice(0, 100)}...
            </div>
          )}

          <button 
            type="submit"
            disabled={isPending || isConfirming}
            className="w-full py-4 bg-gradient-to-r from-orange-500 to-yellow-500 text-black font-black text-lg rounded-xl shadow-xl shadow-orange-500/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
          >
            {isPending ? 'DEPLOYING...' : isConfirming ? 'CONFIRMING...' : 'LAUNCH TOKEN'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LaunchForm;
