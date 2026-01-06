
import React from 'react';
import { useAccount, useConnect, useDisconnect, useBalance } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { formatEther } from 'viem';

interface HeaderProps {
  onHomeClick: () => void;
  onLaunchClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onHomeClick, onLaunchClick }) => {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const { data: balance } = useBalance({ address });

  return (
    <nav className="border-b border-white/5 bg-black/40 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-8">
            <div 
              onClick={onHomeClick}
              className="flex items-center gap-2 cursor-pointer group"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-600 rounded-lg flex items-center justify-center shadow-lg shadow-orange-500/20 group-hover:scale-105 transition-transform">
                <span className="text-black font-black text-xl">FP</span>
              </div>
              <span className="text-xl font-bold tracking-tighter hidden sm:block">
                FAIR<span className="text-orange-500">PRAEM</span>
              </span>
            </div>

            <button 
              onClick={onLaunchClick}
              className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 transition-all text-sm font-medium"
            >
              🚀 Launch Token
            </button>
          </div>

          <div className="flex items-center gap-4">
            {isConnected ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex flex-col items-end">
                  <span className="text-xs text-gray-500 font-mono">
                    {balance ? `${Number(formatEther(balance.value)).toFixed(4)} ${balance.symbol}` : '...'}
                  </span>
                  <span className="text-xs font-mono text-orange-400">
                    {address?.slice(0, 6)}...{address?.slice(-4)}
                  </span>
                </div>
                <button 
                  onClick={() => disconnect()}
                  className="px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-full border border-red-500/20 text-sm font-medium transition-all"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button 
                onClick={() => connect({ connector: injected() })}
                className="px-6 py-2 bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600 text-black rounded-full font-bold text-sm shadow-lg shadow-orange-500/20 transition-all hover:scale-105 active:scale-95"
              >
                Connect Wallet
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
