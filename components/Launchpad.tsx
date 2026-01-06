
import React, { useState } from 'react';
import { useWriteContract, useAccount } from 'wagmi';
import { CORE_ADDRESS, CORE_ABI } from '../constants';
import { generateTokenIdeas } from '../services/geminiService';

interface LaunchpadProps {
  onLaunched: () => void;
}

const Launchpad: React.FC<LaunchpadProps> = ({ onLaunched }) => {
  const { isConnected } = useAccount();
  const { writeContractAsync } = useWriteContract();
  
  const [formData, setFormData] = useState({
    name: '',
    symbol: '',
  });
  
  const [aiTheme, setAiTheme] = useState('');
  const [aiSuggestions, setAiSuggestions] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);

  const handleAiAssist = async () => {
    if (!aiTheme) return;
    setIsGenerating(true);
    try {
      const ideas = await generateTokenIdeas(aiTheme);
      setAiSuggestions(ideas);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const selectSuggestion = (sug: any) => {
    setFormData({ name: sug.name, symbol: sug.symbol });
    setAiSuggestions([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected) {
      alert("Please connect your wallet first");
      return;
    }

    try {
      setIsDeploying(true);
      await writeContractAsync({
        address: CORE_ADDRESS as `0x${string}`,
        abi: CORE_ABI,
        functionName: 'launchToken',
        args: [formData.name, formData.symbol],
      });
      alert("Organization launched successfully!");
      onLaunched();
    } catch (err) {
      console.error(err);
      alert("Launch failed. Check your wallet balance and network.");
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-12 text-center">
        <h1 className="text-4xl font-black mb-4 tracking-tight">Launch Organization</h1>
        <p className="text-white/60">Create your tokenized ecosystem on Base Sepolia.</p>
      </div>

      <div className="glass rounded-3xl border border-white/10 p-8 space-y-8 shadow-2xl">
        <div className="bg-blue-600/10 rounded-2xl p-6 border border-blue-500/20">
          <label className="block text-sm font-bold text-blue-400 uppercase tracking-widest mb-3 italic">AI Branding Specialist</label>
          <div className="flex gap-2">
            <input 
              value={aiTheme}
              onChange={(e) => setAiTheme(e.target.value)}
              placeholder="Enter a concept (e.g. 'Future of Energy')"
              className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
            <button 
              onClick={handleAiAssist}
              disabled={isGenerating}
              className="bg-blue-600 hover:bg-blue-700 px-5 py-3 rounded-xl font-bold disabled:opacity-50 transition-all text-sm"
            >
              {isGenerating ? 'Thinking...' : 'Generate'}
            </button>
          </div>
          
          {aiSuggestions.length > 0 && (
            <div className="mt-4 grid grid-cols-1 gap-2">
              {aiSuggestions.map((sug, i) => (
                <div 
                  key={i} 
                  onClick={() => selectSuggestion(sug)}
                  className="bg-white/5 hover:bg-white/10 p-3 rounded-lg cursor-pointer border border-white/5 hover:border-blue-500/30 transition-all"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-white text-sm">{sug.name}</span>
                    <span className="text-blue-400 font-mono text-[10px] bg-blue-900/30 px-2 py-1 rounded">${sug.symbol}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-black text-white/60 uppercase tracking-widest">Legal Name</label>
            <input 
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              placeholder="e.g. Global Tech DAO"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-black text-white/60 uppercase tracking-widest">Stock Ticker</label>
            <input 
              required
              value={formData.symbol}
              onChange={(e) => setFormData({...formData, symbol: e.target.value.toUpperCase()})}
              placeholder="e.g. GTD"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
            />
          </div>

          <button 
            type="submit"
            disabled={isDeploying}
            className="w-full bg-blue-600 hover:bg-blue-500 py-4 rounded-2xl font-black text-lg shadow-lg shadow-blue-600/20 transition-all disabled:opacity-50 mt-4"
          >
            {isDeploying ? 'Deploying...' : 'Launch On-Chain'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Launchpad;
