
import React, { useState } from 'react';
import { WagmiProvider } from 'wagmi';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { wagmiAdapter } from './web3Config';
import Navbar from './components/Navbar';
import TokenList from './components/TokenList';
import Launchpad from './components/Launchpad';
import TradeInterface from './components/TradeInterface';
import { AppSection, Token } from './types';

const queryClient = new QueryClient();

const App: React.FC = () => {
  const [activeSection, setActiveSection] = useState<AppSection>(AppSection.LIST);
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);

  const navigateToTrade = (token: Token) => {
    setSelectedToken(token);
    setActiveSection(AppSection.TRADE);
  };

  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <div className="min-h-screen bg-black text-white selection:bg-blue-500 selection:text-white">
          <Navbar 
            activeSection={activeSection} 
            onNavigate={(section) => setActiveSection(section)} 
          />
          
          <main className="max-w-7xl mx-auto px-4 py-8">
            {activeSection === AppSection.LIST && (
              <TokenList onTrade={navigateToTrade} />
            )}
            
            {activeSection === AppSection.LAUNCH && (
              <Launchpad onLaunched={() => setActiveSection(AppSection.LIST)} />
            )}
            
            {activeSection === AppSection.TRADE && selectedToken && (
              <TradeInterface token={selectedToken} />
            )}

            {activeSection === AppSection.TRADE && !selectedToken && (
              <div className="text-center py-20">
                <h2 className="text-2xl font-bold mb-4">No token selected</h2>
                <button 
                  onClick={() => setActiveSection(AppSection.LIST)}
                  className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-full font-bold transition-all"
                >
                  Browse Tokens
                </button>
              </div>
            )}
          </main>

          <footer className="border-t border-white/10 py-12 text-center text-white/40 text-sm">
            <p>© 2024 BaseLaunch Protocol. Deploy responsibly on Base Sepolia.</p>
          </footer>
        </div>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

export default App;
