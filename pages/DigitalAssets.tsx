
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const DigitalAssets: React.FC = () => {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVault = async () => {
      const { data } = await supabase.from('vault').select('*').order('created_at', { ascending: false });
      if (data) setItems(data);
      setLoading(false);
    };
    fetchVault();
  }, []);

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
            <div key={idx} className="group glass rounded-[3rem] p-4 flex flex-col hover:bg-white/[0.05] transition-all border border-white/5">
              <div className="aspect-[4/5] rounded-[2.2rem] overflow-hidden relative mb-8">
                <img src={asset.thumbnail_url} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-1000 scale-105 group-hover:scale-100" alt="" />
                <div className="absolute top-6 left-6 px-4 py-1.5 rounded-full text-[10px] font-bold bg-indigo-500 text-white shadow-xl">
                  {asset.type}
                </div>
              </div>
              <div className="px-6 pb-8">
                <h3 className="text-3xl font-bold mb-3 tracking-tight uppercase">{asset.title}</h3>
                <p className="text-zinc-500 mb-8 leading-relaxed h-20 overflow-hidden line-clamp-3">{asset.description}</p>
                <div className="flex justify-between items-center pt-6 border-t border-white/5">
                  <span className="text-3xl font-black font-mono tracking-tighter">{asset.price}</span>
                  <a
                    href={asset.buy_link || '#'}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`px-8 py-3 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform ${!asset.buy_link ? 'opacity-50 cursor-not-allowed' : ''}`}
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
    </div>
  );
};

export default DigitalAssets;
