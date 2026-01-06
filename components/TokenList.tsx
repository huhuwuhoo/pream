
import React, { useState, useEffect } from 'react';
import { useReadContract, useReadContracts } from 'wagmi';
import { formatEther } from 'viem';
import { CORE_PROTOCOL_ADDRESS, CORE_PROTOCOL_ABI, SUB_TOKEN_ABI } from '../constants';
import TokenCard from './TokenCard';

interface TokenListProps {
  onTokenSelect: (address: string) => void;
}

const TokenList: React.FC<TokenListProps> = ({ onTokenSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  // For simplicity in MVP, we might hardcode or fetch the last N tokens
  // A real pump app would use an indexer or event listener
  const subTokens = [
    '0x2649fD00705fB02C45b7365C87E2596957c8585e', // Example or mock
    // Add more from the protocol contract
  ];

  // In a real implementation, you'd use getSubTokensCount and loop through
  // Here we show a placeholder list
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black italic tracking-tighter">THE LATEST TRENDS</h1>
          <p className="text-gray-500 mt-1">Discover tokens before they graduate to Uniswap.</p>
        </div>
        
        <div className="relative w-full md:w-80">
          <input 
            type="text"
            placeholder="Search by name or symbol..."
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
            🔍
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {subTokens.map((addr) => (
          <TokenCard 
            key={addr} 
            address={addr} 
            onClick={() => onTokenSelect(addr)} 
          />
        ))}
        {/* Fillers for UI testing */}
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="animate-pulse glass-card rounded-2xl h-80 opacity-20"></div>
        ))}
      </div>
    </div>
  );
};

export default TokenList;
