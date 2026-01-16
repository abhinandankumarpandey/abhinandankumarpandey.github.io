
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const Services: React.FC = () => {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      const { data } = await supabase.from('services').select('*').order('created_at', { ascending: true });
      if (data) setServices(data);
      setLoading(false);
    };
    fetchServices();
  }, []);

  return (
    <div className="pt-32 px-6 max-w-7xl mx-auto pb-32">
      <div className="mb-24">
        <span className="text-zinc-600 font-mono text-xs uppercase tracking-widest block mb-4">What we do</span>
        <h1 className="text-6xl md:text-9xl font-bold tracking-tighter mb-10">CORE <span className="text-gradient">CAPABILITIES.</span></h1>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 gap-12">
          {[1,2,3].map(i => <div key={i} className="h-80 glass rounded-[4rem] animate-pulse"></div>)}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-12">
          {services.map((s, idx) => (
            <div key={idx} className="group glass p-8 md:p-16 rounded-[4rem] flex flex-col lg:flex-row gap-16 items-center hover:bg-white/[0.04] transition-all">
              <div className="flex-1 space-y-8">
                <div className="w-20 h-20 glass rounded-3xl flex items-center justify-center text-3xl group-hover:scale-110 transition-transform">
                  <i className={`fas ${s.icon || 'fa-bolt'}`}></i>
                </div>
                <h2 className="text-4xl md:text-6xl font-bold tracking-tight">{s.title}</h2>
                <p className="text-zinc-500 text-xl leading-relaxed max-w-xl">{s.description}</p>
                <div className="flex gap-4">
                  <Link to="/contact" className="px-8 py-4 bg-white text-black font-bold rounded-full">Request Quote</Link>
                </div>
              </div>

              <div className="flex-1 w-full aspect-video rounded-[2.5rem] overflow-hidden glass relative group/media">
                {s.is_video ? (
                  <video 
                    src={s.media_url} 
                    className="w-full h-full object-cover grayscale group-hover/media:grayscale-0 transition-all duration-1000"
                    muted loop playsInline
                    onMouseEnter={e => (e.target as HTMLVideoElement).play()}
                    onMouseLeave={e => { (e.target as HTMLVideoElement).pause(); (e.target as HTMLVideoElement).currentTime = 0; }}
                  />
                ) : (
                  <img src={s.media_url} className="w-full h-full object-cover grayscale group-hover/media:grayscale-0 transition-all duration-700" alt={s.title} />
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Services;
