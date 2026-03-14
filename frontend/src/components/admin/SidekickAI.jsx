import React, { useState } from 'react';
import { Sparkles, X, MessageSquare, RefreshCw, Layers, AlignLeft, Search } from 'lucide-react';

const SidekickAI = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activePrompt, setActivePrompt] = useState(null);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState('');

  const features = [
    { id: 'seo', icon: Search, label: 'Optimize SEO', prompt: 'Generating meta titles and descriptions...' },
    { id: 'copy', icon: AlignLeft, label: 'Improve Copy', prompt: 'Rewriting product descriptions for higher conversions...' },
    { id: 'layout', icon: Layers, label: 'Section Layout', prompt: 'Analyzing store layout and suggesting sections...' },
  ];

  const handleAction = (feature) => {
    setActivePrompt(feature.label);
    setLoading(true);
    setResponse('');
    
    // Simulate AI processing time
    setTimeout(() => {
      setLoading(false);
      if (feature.id === 'seo') {
        setResponse('✨ SEO Optimization Complete!\n\nSuggested Meta Title:\n"Ethereal Skincare | Premium Glow Serum"\n\nSuggested Meta Description:\n"Achieve radiant skin with Ethereal Skincare. Our natural, cruelty-free serums deeply hydrate and brighten your complexion. Free shipping over $50."');
      } else if (feature.id === 'copy') {
        setResponse('✨ Copy Improved!\n\n"Unleash your natural radiance with our lightweight, fast-absorbing serum. Formulated with potent botanicals, it locks in moisture for 24 hours while visibly reducing fine lines. Experience the ethereal glow you deserve."');
      } else if (feature.id === 'layout') {
        setResponse('✨ Layout Suggestions:\n\n1. Move the "Customer Reviews" section higher on the product page to build immediate trust.\n2. Add a "Benefits Icons" row under the Add to Cart button (e.g., Cruelty-Free, Vegan).\n3. Feature your "Bestsellers" collection immediately below the hero banner on the Homepage.');
      }
    }, 2000);
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-8 right-8 z-[9999] bg-slate text-cream px-6 py-4 rounded-full shadow-2xl hover:bg-earth hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 border-2 border-white/20 ${isOpen ? 'opacity-0 scale-90 pointer-events-none' : 'opacity-100'}`}
        style={{ boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.4)' }}
      >
        <Sparkles size={24} className="text-earth" />
        <span className="font-semibold uppercase tracking-widest text-sm">Sidekick AI</span>
      </button>

      {/* Sidekick Panel */}
      <div 
        className={`fixed bottom-6 right-6 z-50 w-80 md:w-96 bg-white border border-sage/30 shadow-2xl rounded-lg overflow-hidden flex flex-col transition-all duration-300 transform origin-bottom-right ${isOpen ? 'scale-100 opacity-100' : 'scale-90 opacity-0 pointer-events-none'}`}
        style={{ maxHeight: 'calc(100vh - 100px)' }}
      >
        {/* Header */}
        <div className="bg-slate text-cream p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles size={20} className="text-earth" />
            <h3 className="font-medium tracking-wide">Sidekick AI</h3>
          </div>
          <button onClick={() => setIsOpen(false)} className="text-cream/70 hover:text-cream transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 flex-1 overflow-y-auto bg-cream/30">
          <p className="text-sm font-light text-slate/80 mb-6">
            Hi! I'm your Ethereal Store Sidekick. I can help you optimize your store for higher conversions. What would you like to do?
          </p>

          {!activePrompt ? (
            <div className="space-y-3">
              {features.map((feature) => (
                <button
                  key={feature.id}
                  onClick={() => handleAction(feature)}
                  className="w-full flex items-center gap-3 p-3 bg-white border border-sage/20 rounded hover:border-earth hover:shadow-sm transition-all text-left group"
                >
                  <div className="bg-sage/10 p-2 rounded text-slate group-hover:text-earth group-hover:bg-earth/10 transition-colors">
                    <feature.icon size={18} />
                  </div>
                  <div>
                    <span className="block text-sm font-medium text-slate group-hover:text-primary transition-colors">{feature.label}</span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="flex flex-col h-full">
              <button 
                onClick={() => { setActivePrompt(null); setResponse(''); }}
                className="text-xs text-slate/50 hover:text-earth flex items-center gap-1 mb-4 uppercase tracking-widest"
              >
                ← Back to options
              </button>
              
              <div className="bg-white p-4 border border-sage/20 rounded-lg shadow-sm">
                <div className="flex items-center gap-2 mb-3 pb-3 border-b border-sage/10">
                  <Sparkles size={16} className="text-earth" />
                  <span className="text-sm font-medium text-slate">{activePrompt}</span>
                </div>
                
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-6 text-slate/60 gap-3">
                    <RefreshCw size={24} className="animate-spin text-earth" />
                    <p className="text-sm font-light">Analyzing store data...</p>
                  </div>
                ) : (
                  <div className="text-sm text-slate/80 whitespace-pre-wrap font-light leading-relaxed">
                    {response}
                  </div>
                )}
              </div>
              
              {!loading && (
                <div className="mt-4 flex justify-end gap-2">
                  <button className="px-3 py-1.5 text-xs uppercase tracking-widest bg-slate text-cream rounded hover:bg-earth transition-colors">
                    Apply Changes
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SidekickAI;
