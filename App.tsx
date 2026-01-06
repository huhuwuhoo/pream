
import React, { useState, useEffect, useCallback } from 'react';
import { 
  createConfig, 
  WagmiProvider, 
  useAccount, 
  useConnect, 
  useDisconnect,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  useBalance
} from 'wagmi';
import { mainnet } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http } from 'viem';
import { AppView, TokenInfo } from './types';
import { CORE_CHAIN, CORE_PROTOCOL_ADDRESS, WALLET_CONNECT_PROJECT_ID } from './constants';
import Header from './components/Header';
import TokenList from './components/TokenList';
import LaunchForm from './components/LaunchForm';
import TokenDetail from './components/TokenDetail';

// Configure Wagmi
const config = createConfig({
  chains: [CORE_CHAIN, mainnet],
  transports: {
    [CORE_CHAIN.id]: http(),
    [mainnet.id]: http(),
  },
});

const queryClient = new QueryClient();

function AppContent() {
  const { address, isConnected } = useAccount();
  const [currentView, setCurrentView] = useState<AppView>(AppView.LIST);
  const [selectedTokenAddress, setSelectedTokenAddress] = useState<string | null>(null);

  const navigateToDetail = (tokenAddr: string) => {
    setSelectedTokenAddress(tokenAddr);
    setCurrentView(AppView.DETAIL);
  };

  const navigateHome = () => {
    setSelectedTokenAddress(null);
    setCurrentView(AppView.LIST);
  };

  return (
    <div className="min-h-screen bg-[#0c0c0e] text-gray-200">
      <Header onHomeClick={navigateHome} onLaunchClick={() => setCurrentView(AppView.LAUNCH)} />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {currentView === AppView.LIST && (
          <TokenList onTokenSelect={navigateToDetail} />
        )}
        
        {currentView === AppView.LAUNCH && (
          <LaunchForm onSuccess={navigateHome} />
        )}
        
        {currentView === AppView.DETAIL && selectedTokenAddress && (
          <TokenDetail tokenAddress={selectedTokenAddress} />
        )}
      </main>

      <footer className="border-t border-gray-800 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center opacity-50 text-sm">
          <p>© 2024 FairPraem Protocol. No venture capital, no pre-sale, no team tokens.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Twitter</a>
            <a href="#" className="hover:text-white transition-colors">Telegram</a>
            <a href="#" className="hover:text-white transition-colors">Docs</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <AppContent />
      </QueryClientProvider>
    </WagmiProvider>
  );
}
