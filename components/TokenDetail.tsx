
import React, { useState } from 'react';
import { useReadContracts, useAccount } from 'wagmi';
import { formatEther, parseEther } from 'viem';
import { SUB_TOKEN_ABI } from '../constants';
import PriceChart from './PriceChart';
import TokenTrade from './TokenTrade';

interface TokenDetailProps {
  tokenAddress: string;
}

const TokenDetail: React.FC<TokenDetailProps> = ({ tokenAddress }) => {
  const { data, refetch } = useReadContracts({
    contracts: [
      { address: tokenAddress as `0x${string}`, abi: SUB_TOKEN_ABI, functionName: 'name' },
      { address: tokenAddress as `0x${string}`, abi: SUB_TOKEN_ABI, functionName: 'symbol' },
      { address: tokenAddress as `0x${string}`, abi: SUB_TOKEN_ABI, functionName: 'totalMinted' },
      { address: tokenAddress as `0x${string}`, abi: SUB_TOKEN_ABI, functionName: 'getProgress' },
      { address: tokenAddress as `0x${string}`, abi: SUB_TOKEN_ABI, functionName: 'isGraduated' },
      { address: tokenAddress as `0x${string}`, abi: SUB_TOKEN_ABI, functionName: 'virtualEthReserves' },
    ],
  });

  if (!data) return <div className="animate-pulse py-20 text-center">Loading token data...</div>;

  const [name, symbol, minted, progress, graduated, ethReserves] = data.map(d => d.result);
  const progressVal = Number(progress || 0n);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left: Chart and Info */}
      <div className="lg:col-span-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-black italic tracking-tighter">{name as string}</h1>
              <span className="px-3 py-1 bg-white/5 rounded-full text-orange-500 font-mono text-sm border border-white/10">
                ${symbol as string}
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm text-gray-500 font-mono">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500"></span>
                Bonding Curve Active
              </span>
              <span className="truncate max-w-[150px]">{tokenAddress}</span>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-xs uppercase text-gray-500 font-bold mb-1">Market Cap</div>
            <div className="text-2xl font-black text-white">
              {ethReserves ? Number(formatEther(ethReserves as bigint)).toFixed(2) : '0'} CORE
            </div>
          </div>
        </div>

        <div className="glass-card rounded-3xl p-1 h-[400px] overflow-hidden border-white/5">
          <PriceChart tokenAddress={tokenAddress} />
        </div>

        <div className="glass-card rounded-3xl p-6">
          <h3 className="text-lg font-bold mb-4">Token Info</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <div className="text-xs text-gray-500 uppercase font-bold mb-1">Supply</div>
              <div className="font-mono text-sm">1,000,000,000</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 uppercase font-bold mb-1">Curve Progress</div>
              <div className="font-mono text-sm text-orange-400">{progressVal}%</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 uppercase font-bold mb-1">Graduated</div>
              <div className="font-mono text-sm">{graduated ? 'YES' : 'NO'}</div>
            </div>
            <div>
              <div className="text-xs text-gray-500 uppercase font-bold mb-1">Trading Fee</div>
              <div className="font-mono text-sm">0.5%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right: Trade Panel */}
      <div className="lg:col-span-4">
        <div className="sticky top-24 space-y-6">
          <TokenTrade 
            tokenAddress={tokenAddress} 
            symbol={symbol as string} 
            graduated={graduated as boolean}
            onTradeSuccess={() => refetch()}
          />
          
          <div className="glass-card rounded-3xl p-6 border-blue-500/20">
            <h4 className="font-bold flex items-center gap-2 mb-3">
              👑 King of the Hill
            </h4>
            <p className="text-sm text-gray-400 leading-relaxed">
              When this token reaches 100% on the bonding curve, 20.69% of the supply is paired with the accumulated ETH and seeded to Uniswap V2 LP. The LP is then burned forever.
            </p>
            <div className="mt-4 pt-4 border-t border-white/5">
              <div className="flex justify-between text-xs mb-2">
                <span className="text-gray-500">Progress to Graduation</span>
                <span className="text-white font-mono">{progressVal}%</span>
              </div>
              <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 progress-bar-fill shadow-[0_0_10px_rgba(59,130,246,0.5)]" 
                  style={{ width: `${progressVal}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenDetail;
