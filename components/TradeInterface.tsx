
import React, { useState } from 'react';
import { useWriteContract, useAccount, useReadContract, usePublicClient } from 'wagmi';
import { CORE_ADDRESS, CORE_ABI, ERC20_ABI } from '../constants';
import { Token } from '../types';
import { parseEther, formatEther } from 'viem';

interface TradeInterfaceProps {
  token: Token;
}

const TradeInterface: React.FC<TradeInterfaceProps> = ({ token }) => {
  const { address, isConnected } = useAccount();
  const [liqAmount, setLiqAmount] = useState('0.01');
  const [isProcessing, setIsProcessing] = useState(false);
  const publicClient = usePublicClient();

  const { writeContractAsync } = useWriteContract();

  // Fetch token specific stats
  const { data: userBalance } = useReadContract({
    address: token.address as `0x${string}`,
    abi: ERC20_ABI,
    functionName: 'balanceOf',
    args: [address],
  });

  const { data: coreBalance } = useReadContract({
    address: CORE_ADDRESS as `0x${string}`,
    abi: CORE_ABI,
    functionName: 'balanceOf',
    args: [address],
  });

  const handleAddLiquidity = async () => {
    if (!isConnected) return;
    setIsProcessing(true);
    try {
      await writeContractAsync({
        address: CORE_ADDRESS as `0x${string}`,
        abi: CORE_ABI,
        functionName: 'addInitialLiquidityAndBurnLP',
        value: parseEther(liqAmount)
      });
      alert("Liquidity added and LP burned!");
    } catch (err) {
      console.error(err);
      alert("Action failed. Check ETH balance.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleBuyback = async () => {
    if (!isConnected) return;
    setIsProcessing(true);
    try {
      await writeContractAsync({
        address: CORE_ADDRESS as `0x${string}`,
        abi: CORE_ABI,
        functionName: 'manualBuyback',
        args: [BigInt(0)] // minAmountOut
      });
      alert("Buyback executed successfully!");
    } catch (err) {
      console.error(err);
      alert("Buyback failed.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl flex items-center justify-center font-bold text-3xl shadow-2xl">
            {token.symbol[0]}
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-tight">{token.name}</h1>
            <div className="flex gap-2 items-center mt-1">
              <span className="text-blue-400 font-mono font-bold">${token.symbol}</span>
              <span className="text-white/20">|</span>
              <span className="text-xs font-mono text-white/40">{token.address}</span>
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs font-bold text-white/40 uppercase tracking-widest mb-1">Factory Asset Balance</p>
          <p className="text-2xl font-mono text-blue-400">
            {coreBalance ? parseFloat(formatEther(coreBalance as bigint)).toFixed(2) : '0.00'} PRM
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Statistics Card */}
        <div className="lg:col-span-2 glass rounded-3xl border border-white/10 p-8 space-y-8">
          <h2 className="text-xl font-bold border-b border-white/5 pb-4">On-Chain Analytics</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Total Supply</p>
              <p className="text-lg font-mono">{parseFloat(token.totalSupply).toLocaleString()}</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Holders</p>
              <p className="text-lg font-mono">Scanning...</p>
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Your Holdings</p>
              <p className="text-lg font-mono text-green-400">
                {userBalance ? parseFloat(formatEther(userBalance as bigint)).toLocaleString() : '0'}
              </p>
            </div>
          </div>
          
          <div className="h-48 bg-black/40 rounded-2xl border border-white/5 flex items-center justify-center text-white/20 text-sm italic">
            Visual data stream loading...
          </div>
        </div>

        {/* Action Card */}
        <div className="glass rounded-3xl border border-blue-500/20 p-8 flex flex-col gap-6 bg-blue-900/5">
          <h2 className="text-xl font-bold text-blue-400">Management</h2>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-white/40 uppercase tracking-widest">Initial Liquidity (ETH)</label>
              <input 
                type="number"
                value={liqAmount}
                onChange={(e) => setLiqAmount(e.target.value)}
                className="w-full bg-black/60 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
              />
            </div>
            <button 
              onClick={handleAddLiquidity}
              disabled={isProcessing}
              className="w-full bg-blue-600 hover:bg-blue-500 py-4 rounded-xl font-bold shadow-lg shadow-blue-600/20 transition-all text-sm disabled:opacity-50"
            >
              Initialize Liquidity & Burn LP
            </button>
          </div>

          <div className="pt-6 border-t border-white/10 space-y-4">
            <p className="text-xs text-white/40">Manual Buyback uses contract reserves to support price action.</p>
            <button 
              onClick={handleBuyback}
              disabled={isProcessing}
              className="w-full border border-blue-500/50 hover:bg-blue-500/10 py-4 rounded-xl font-bold transition-all text-sm disabled:opacity-50"
            >
              Execute Manual Buyback
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradeInterface;
