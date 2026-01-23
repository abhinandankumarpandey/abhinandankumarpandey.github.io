
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const DigitalAssets: React.FC = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  /* New state for automated effect */
  const [highlightIndex, setHighlightIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchVault = async () => {
      const { data } = await supabase.from('vault').select('*').order('created_at', { ascending: false });
      if (data) setItems(data);
      setLoading(false);
    };
    fetchVault();
  }, []);

  useEffect(() => {
    // Automated spotlight effect every 3.5 seconds
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * items.length);
      setHighlightIndex(randomIndex);
      // Remove highlight after 2 seconds
      setTimeout(() => setHighlightIndex(null), 2000);
    }, 3500);
    return () => clearInterval(interval);
  }, [items]);

  return (
    <div className="pt-40 px-6 max-w-7xl mx-auto pb-40">
      <div className="mb-24 text-center">
        <h1 className="text-7xl md:text-[10rem] font-bold tracking-tighter mb-8">THE <span className="text-gradient">VAULT.</span></h1>
        <p className="text-zinc-400 text-xl max-w-2xl mx-auto font-light">Unlock the tools of Abhinandan. Premium assets to elevate your creative output.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {[1, 2, 3].map(i => <div key={i} className="h-96 glass rounded-[3rem] animate-pulse"></div>)}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {items.map((asset, idx) => (
            <div
              key={idx}
              className={`group glass rounded-[3rem] p-4 flex flex-col transition-all duration-500 border relative overflow-hidden ${highlightIndex === idx
                ? 'border-indigo-500/50 bg-indigo-500/5 shadow-[0_0_50px_rgba(99,102,241,0.2)] scale-[1.02]'
                : 'border-white/5 hover:bg-white/[0.05] hover:border-white/20'
                }`}
            >
              <div className="aspect-[4/5] rounded-[2.2rem] overflow-hidden relative mb-8">
                <img
                  src={asset.thumbnail_url}
                  className={`w-full h-full object-cover transition-all duration-1000 scale-105 group-hover:scale-100 ${highlightIndex === idx ? 'brightness-110' : ''}`}
                  alt={asset.title}
                  loading="lazy"
                />
                <div className={`absolute top-6 left-6 px-4 py-1.5 rounded-full text-[10px] font-bold shadow-xl transition-all duration-500 ${highlightIndex === idx ? 'bg-white text-black scale-110' : 'bg-indigo-500 text-white'}`}>
                  {asset.type}
                </div>
                {/* Shine effect */}
                {highlightIndex === idx && (
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent skew-x-12 translate-x-[-200%] animate-[shine_1.5s_ease-in-out_infinite]" />
                )}
              </div>
              <div className="px-6 pb-8">
                <h3 className="text-3xl font-bold mb-3 tracking-tight uppercase group-hover:text-indigo-400 transition-colors">{asset.title}</h3>
                <p className="text-zinc-500 mb-8 leading-relaxed h-20 overflow-hidden line-clamp-3">{asset.description}</p>
                <div className="flex justify-between items-center pt-6 border-t border-white/5">
                  <span className={`text-3xl font-black font-mono tracking-tighter transition-colors ${highlightIndex === idx ? 'text-white' : 'text-zinc-300'}`}>{asset.price}</span>
                  <a
                    href={asset.buy_link || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`px-8 py-3 font-bold rounded-full hover:scale-105 transition-all duration-300 ${!asset.buy_link ? 'opacity-50 cursor-not-allowed bg-zinc-800 text-zinc-500' :
                      highlightIndex === idx ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30' : 'bg-white text-black'
                      }`}
                    onClick={(e) => !asset.buy_link && e.preventDefault()}
                  >
                    BUY NOW
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <style>{`
        @keyframes shine {
            from { transform: translateX(-200%) skewX(-12deg); }
            to { transform: translateX(200%) skewX(-12deg); }
        }
      `}</style>
    </div>
  );
};

export default DigitalAssets;
