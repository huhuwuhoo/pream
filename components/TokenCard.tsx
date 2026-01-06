
import React from 'react';
import { useReadContracts } from 'wagmi';
import { formatEther } from 'viem';
import { SUB_TOKEN_ABI } from '../constants';

interface TokenCardProps {
  address: string;
  onClick: () => void;
}

const TokenCard: React.FC<TokenCardProps> = ({ address, onClick }) => {
  const { data, isLoading } = useReadContracts({
    contracts: [
      { address: address as `0x${string}`, abi: SUB_TOKEN_ABI, functionName: 'name' },
      { address: address as `0x${string}`, abi: SUB_TOKEN_ABI, functionName: 'symbol' },
      { address: address as `0x${string}`, abi: SUB_TOKEN_ABI, functionName: 'getProgress' },
      { address: address as `0x${string}`, abi: SUB_TOKEN_ABI, functionName: 'getCurrentPrice' },
      { address: address as `0x${string}`, abi: SUB_TOKEN_ABI, functionName: 'isGraduated' },
    ],
  });

  if (isLoading || !data) return null;

  const [name, symbol, progress, price, graduated] = data.map(d => d.result);
  const progressPercent = Number(progress || 0n);

  return (
    <div 
      onClick={onClick}
      className="glass-card rounded-2xl p-4 cursor-pointer hover:border-orange-500/50 hover:bg-white/[0.08] transition-all group"
    >
      <div className="aspect-square w-full rounded-xl overflow-hidden bg-gray-800 relative mb-4">
        <img 
          src={`https://picsum.photos/seed/${address}/400`} 
          alt="Token" 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        {graduated && (
          <div className="absolute top-2 right-2 px-2 py-1 bg-green-500 text-black text-[10px] font-black rounded uppercase">
            GRADUATED
          </div>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-start">
          <h3 className="font-bold text-lg truncate pr-2">{name as string}</h3>
          <span className="text-orange-500 font-mono text-sm">${symbol as string}</span>
        </div>
        
        <div className="flex justify-between text-xs text-gray-500 font-mono">
          <span>Price:</span>
          <span className="text-gray-300">
            {price ? Number(formatEther(price as bigint)).toFixed(10) : '0'} CORE
          </span>
        </div>

        <div className="pt-2">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Bonding Curve Progress</span>
            <span className="text-xs font-mono text-orange-400">{progressPercent}%</span>
          </div>
          <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
            <div 
              className="h-full pump-gradient progress-bar-fill" 
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TokenCard;
