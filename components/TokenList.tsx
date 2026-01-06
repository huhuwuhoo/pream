
import React, { useState, useEffect } from 'react';
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
  const publicClient = usePublicClient();

  useEffect(() => {
    const fetchTokensFromContract = async () => {
      if (!publicClient) return;
      try {
        setLoading(true);
        const discoveredTokens: Token[] = [];
        
        // Scan for tokens using indices since there's no length helper
        // We'll scan the first 15 for the demo/test
        for (let i = 0; i < 15; i++) {
          try {
            const tokenAddr = await publicClient.readContract({
              address: CORE_ADDRESS as `0x${string}`,
              abi: CORE_ABI,
              functionName: 'allSubTokens',
              args: [BigInt(i)]
            }) as string;

            if (tokenAddr && tokenAddr !== '0x0000000000000000000000000000000000000000') {
              const [name, symbol, supply] = await Promise.all([
                publicClient.readContract({ address: tokenAddr as `0x${string}`, abi: ERC20_ABI, functionName: 'name' }),
                publicClient.readContract({ address: tokenAddr as `0x${string}`, abi: ERC20_ABI, functionName: 'symbol' }),
                publicClient.readContract({ address: tokenAddr as `0x${string}`, abi: ERC20_ABI, functionName: 'totalSupply' }),
              ]);

              discoveredTokens.push({
                id: i.toString(),
                address: tokenAddr,
                name: name as string,
                symbol: symbol as string,
                creator: 'Contract',
                totalSupply: formatEther(supply as bigint),
                price: 'N/A',
                marketCap: 'Calculating...',
                description: `A custom token launched via the BaseLaunch Factory.`
              });
            }
          } catch (e) {
            // Reached end of list
            break;
          }
        }
        setTokens(discoveredTokens);
      } catch (err) {
        console.error("Error scanning tokens:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTokensFromContract();
  }, [publicClient]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-64 glass rounded-2xl border border-white/10" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black mb-2 tracking-tight">Launched Tokens</h1>
          <p className="text-white/60">Verified organizations on Base Sepolia.</p>
        </div>
      </div>

      {tokens.length === 0 ? (
        <div className="text-center py-20 glass rounded-3xl border border-white/5">
          <p className="text-white/40 mb-4">No tokens launched yet on this factory.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tokens.map((token) => (
            <div 
              key={token.address} 
              className="group glass rounded-2xl border border-white/10 p-6 hover:border-blue-500/50 transition-all cursor-pointer relative overflow-hidden"
              onClick={() => onTrade(token)}
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center font-bold text-xl shadow-lg">
                  {token.symbol[0]}
                </div>
                <div>
                  <h3 className="text-xl font-bold truncate max-w-[150px]">{token.name}</h3>
                  <p className="text-blue-400 font-mono text-sm">${token.symbol}</p>
                </div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-xs">
                  <span className="text-white/40 uppercase font-bold tracking-widest">Address</span>
                  <span className="font-mono text-blue-300 truncate ml-4">{token.address.slice(0, 6)}...{token.address.slice(-4)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-white/40 uppercase font-bold tracking-widest">Total Supply</span>
                  <span className="font-mono">{parseFloat(token.totalSupply).toLocaleString()}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5">
                <button className="w-full bg-white/5 group-hover:bg-blue-600 py-2 rounded-lg text-sm font-bold transition-all">
                  View Management
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
