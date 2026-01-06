
import React, { useState, useEffect, useCallback } from 'react';
import { usePublicClient } from 'wagmi';
import { CORE_ADDRESS, CORE_ABI, ERC20_ABI } from '../constants';
import { Token } from '../types';
import { formatEther } from 'viem';

interface TokenListProps {
  onTrade: (token: Token) => void;
}

const TokenList: React.FC<TokenListProps> = ({ onTrade }) => {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const publicClient = usePublicClient();

  const fetchTokensFromContract = useCallback(async () => {
    if (!publicClient) return;
    
    try {
      setLoading(true);
      setError(null);
      const discoveredTokens: Token[] = [];
      
      // 并行扫描前 30 个索引位（提高发现几率）
      const scanIndices = Array.from({ length: 30 }, (_, i) => i);
      
      const addresses = await Promise.all(
        scanIndices.map(async (index) => {
          try {
            return await publicClient.readContract({
              address: CORE_ADDRESS as `0x${string}`,
              abi: CORE_ABI,
              functionName: 'allSubTokens',
              args: [BigInt(index)]
            }) as string;
          } catch (e) {
            return null;
          }
        })
      );

      const validAddresses = addresses.filter(addr => addr && addr !== '0x0000000000000000000000000000000000000000') as `0x${string}`[];

      // 获取每个代币的详细信息
      const details = await Promise.all(
        validAddresses.map(async (tokenAddr, idx) => {
          try {
            const [name, symbol, supply] = await Promise.all([
              publicClient.readContract({ address: tokenAddr, abi: ERC20_ABI, functionName: 'name' }),
              publicClient.readContract({ address: tokenAddr, abi: ERC20_ABI, functionName: 'symbol' }),
              publicClient.readContract({ address: tokenAddr, abi: ERC20_ABI, functionName: 'totalSupply' }),
            ]);

            return {
              id: idx.toString(),
              address: tokenAddr,
              name: name as string,
              symbol: symbol as string,
              creator: 'Contract',
              totalSupply: formatEther(supply as bigint),
              price: 'N/A',
              marketCap: 'Live',
              description: `Successfully discovered token at ${tokenAddr.slice(0, 8)}...`
            };
          } catch (e) {
            console.error(`Error loading details for ${tokenAddr}`, e);
            return null;
          }
        })
      );

      setTokens(details.filter(t => t !== null) as Token[]);
    } catch (err) {
      console.error("Token discovery failed:", err);
      setError("Failed to sync with Base Sepolia. Check your connection.");
    } finally {
      setLoading(false);
    }
  }, [publicClient]);

  useEffect(() => {
    fetchTokensFromContract();
    // 每 30 秒自动刷新一次，确保持续发现新部署的代币
    const interval = setInterval(fetchTokensFromContract, 30000);
    return () => clearInterval(interval);
  }, [fetchTokensFromContract]);

  if (loading && tokens.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-64 glass rounded-2xl border border-white/10 animate-pulse bg-white/5" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black mb-2 tracking-tight flex items-center gap-3">
            Exploration
            {loading && <span className="text-sm font-normal text-blue-400 animate-pulse">Syncing...</span>}
          </h1>
          <p className="text-white/60 text-sm">Real-time token discovery on Base Sepolia Factory.</p>
        </div>
        <button 
          onClick={() => fetchTokensFromContract()}
          className="text-xs font-bold text-blue-400 hover:text-blue-300 uppercase tracking-widest border border-blue-400/30 px-4 py-2 rounded-lg transition-all"
        >
          Force Refresh
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm">
          {error}
        </div>
      )}

      {tokens.length === 0 ? (
        <div className="text-center py-24 glass rounded-3xl border border-white/5 bg-white/[0.02]">
          <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-8 h-8 border-2 border-white/20 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
          <p className="text-white/40 mb-2 font-medium">Scanning Base Sepolia blockchain...</p>
          <p className="text-white/20 text-xs">If you just deployed, it may take a few blocks to appear.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tokens.map((token) => (
            <div 
              key={token.address} 
              className="group glass rounded-2xl border border-white/10 p-6 hover:border-blue-500/50 transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between"
              onClick={() => onTrade(token)}
            >
              <div className="absolute top-0 right-0 p-3">
                <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.6)]"></div>
              </div>

              <div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center font-black text-lg shadow-lg group-hover:scale-110 transition-transform">
                    {token.symbol[0]}
                  </div>
                  <div className="overflow-hidden">
                    <h3 className="text-lg font-bold truncate text-white group-hover:text-blue-400 transition-colors">{token.name}</h3>
                    <p className="text-blue-400/80 font-mono text-xs uppercase tracking-tighter">${token.symbol}</p>
                  </div>
                </div>

                <div className="space-y-2 py-4">
                  <div className="flex justify-between items-center bg-black/30 p-2 rounded-lg">
                    <span className="text-[10px] text-white/40 font-bold uppercase">Supply</span>
                    <span className="text-xs font-mono text-white/80">{parseFloat(token.totalSupply).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center bg-black/30 p-2 rounded-lg">
                    <span className="text-[10px] text-white/40 font-bold uppercase">Contract</span>
                    <span className="text-[10px] font-mono text-blue-300">{token.address.slice(0, 10)}...</span>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <button className="w-full bg-blue-600/10 border border-blue-600/30 group-hover:bg-blue-600 group-hover:text-white text-blue-400 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all">
                  Manage Token
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TokenList;
