
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const defaultTrail = [
  { url: "https://github.com/abhinandankumarpandey/website-assets/blob/master/banners/posters_service.webp?raw=true", ratio: "aspect-[3/4]" },
  { url: "https://github.com/abhinandankumarpandey/website-assets/blob/master/banners/flyers_service.webp?raw=true", ratio: "aspect-video" },
  { url: "https://github.com/abhinandankumarpandey/website-assets/blob/master/banners/infographic_explainer.webp?raw=true", ratio: "aspect-square" }
];

const impactImages = [
  "https://github.com/abhinandankumarpandey/website-assets/blob/master/website_backgrounds/ai_visual_thumbnail.webp?raw=true",
  "https://github.com/abhinandankumarpandey/website-assets/blob/master/banners/ads_listing_images+calculator.webp?raw=true",
  "https://github.com/abhinandankumarpandey/website-assets/blob/master/website_backgrounds/character_creation_dna.webp?raw=true",
  "https://github.com/abhinandankumarpandey/website-assets/blob/master/banners/movie_poster_design_sahil_pandey.webp?raw=true"
];

const sectionBgImages = [
  "https://github.com/abhinandankumarpandey/website-assets/blob/master/website_backgrounds/background_texture.webp?raw=true",
  "https://github.com/abhinandankumarpandey/website-assets/blob/master/website_backgrounds/cta_ready_to_ascend.webp?raw=true",
  "https://github.com/abhinandankumarpandey/website-assets/blob/master/website_backgrounds/hero_landing.webp?raw=true"
];

const Home: React.FC = () => {
  const [trail, setTrail] = useState<{ x: number, y: number, id: number, img: string, ratio: string, rotate: number }[]>([]);
  const [dbTrailImages, setDbTrailImages] = useState<any[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [scrollY, setScrollY] = useState(0);
  const [isHoveringText, setIsHoveringText] = useState(false);
  const [impactIndex, setImpactIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setImpactIndex(prev => (prev + 1) % impactImages.length);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  const [sectionBgIndex, setSectionBgIndex] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setSectionBgIndex(prev => (prev + 1) % sectionBgImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch Trail Images
      const { data: trailData } = await supabase.from('gallery').select('*').eq('is_trail', true);
      setDbTrailImages(trailData && trailData.length > 0 ? trailData : defaultTrail);

      // Fetch Properties
      const { data: propData } = await supabase.from('properties').select('*').limit(6);
      if (propData) setProperties(propData);
    };
    fetchData();

    const handleMove = (e: MouseEvent | TouchEvent) => {
      const target = e.target as HTMLElement;
      const isText = ['P', 'H1', 'H2', 'H3', 'H4', 'SPAN', 'A', 'BUTTON', 'LI', 'IMG'].includes(target.tagName) || target.closest('.no-trail');
      setIsHoveringText(!!isText);
      if (isText) return;

      const x = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const y = 'touches' in e ? e.touches[0].clientY : e.clientY;

      if (Date.now() % 8 === 0) {
        const id = Date.now();
        const pool = dbTrailImages.length > 0 ? dbTrailImages : defaultTrail;
        const selection = pool[Math.floor(Math.random() * pool.length)];
        setTrail(prev => [...prev.slice(-10), { x, y, id, img: selection.url, ratio: selection.ratio || 'aspect-square', rotate: (Math.random() - 0.5) * 20 }]);
        setTimeout(() => setTrail(prev => prev.filter(t => t.id !== id)), 1000);
      }
    };

    window.addEventListener('mousemove', handleMove);
    window.addEventListener('touchmove', handleMove);
    window.addEventListener('touchstart', handleMove);
    window.addEventListener('scroll', () => setScrollY(window.scrollY));
    return () => {
      window.removeEventListener('mousemove', handleMove);
      window.removeEventListener('touchmove', handleMove);
      window.removeEventListener('touchstart', handleMove);
    };
  }, [dbTrailImages]);

  return (
    <div className="relative bg-[#050505] overflow-x-hidden">
      {!isHoveringText && trail.map(t => (
        <div key={t.id} className={`fixed pointer-events-none z-[60] w-64 md:w-80 rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10 animate-image-float ${t.ratio}`}
          style={{ left: t.x - 160, top: t.y - 120, transform: `rotate(${t.rotate}deg)` }}>
          <img src={t.img} className="w-full h-full object-cover" alt="" />
        </div>
      ))}

      <section className="h-[120vh] relative flex items-center justify-center sticky top-0">
        <div className="absolute inset-0" style={{ transform: `scale(${1 + scrollY * 0.0003}) translateY(${scrollY * 0.1}px)` }}>
          <div className="absolute inset-0 bg-cover bg-center opacity-50" style={{ backgroundImage: `url('https://github.com/abhinandankumarpandey/website-assets/blob/master/website_backgrounds/hero_landing.webp?raw=true')` }} />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/10 to-[#050505]"></div>
        </div>
        <div className="relative z-10 text-center px-4 max-w-7xl mx-auto flex flex-col items-center">
          <h1 className="flex flex-col items-center justify-center mb-12 mix-blend-difference">
            <span className="block text-[12vw] md:text-[10rem] font-black tracking-tighter leading-[0.8] animate-reveal-up bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400">
              ABHINANDAN
            </span>
            <span className="block text:[4vw] md:text-[2.5rem] font-light tracking-[0.5em] uppercase mt-6 text-white/80 animate-reveal-up animation-delay-200">
              Prompts <span className="text-indigo-500">·</span> Graphics <span className="text-purple-500">·</span> AI
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 max-w-2xl mx-auto mb-12 font-light tracking-wide leading-relaxed animate-fade-in-up delay-300">
            Designing the future with pixel-perfect precision and neural network intelligence.
          </p>
          <div className="flex flex-col md:flex-row gap-6 mt-8">
            <Link to="/services" className="group relative px-12 py-5 bg-white text-black rounded-full overflow-hidden hover:scale-105 transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.3)] animate-fade-in-up delay-300">
              <span className="relative z-10 font-bold uppercase tracking-widest text-sm md:text-base">Enter Experience</span>
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
            </Link>
            <Link to="/contact" className="px-12 py-5 glass rounded-full font-bold uppercase tracking-widest text-sm md:text-base hover:bg-white/10 transition-all duration-300 animate-fade-in-up delay-[400ms]">
              Contact Studio
            </Link>
          </div>
        </div>
      </section>

      <div className="relative z-20 bg-[#050505] pt-20 overflow-hidden group">
        <div className="absolute inset-0 z-0 pointer-events-none animate-hue-rotate">
          {sectionBgImages.map((img, i) => (
            <div key={i} className={`absolute inset-0 bg-cover bg-center transition-opacity duration-[3000ms] ${i === sectionBgIndex ? 'opacity-70' : 'opacity-0'}`} style={{ backgroundImage: `url(${img})` }} />
          ))}
          <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-indigo-500/10 to-[#050505] mix-blend-overlay"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/80"></div>
        </div>
        <div className="relative z-10">
          {/* New Modern Slideshow Section */}
          <section className="py-20 overflow-hidden relative no-trail">
            <div className="mb-12 text-center">
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-indigo-400">Creative Horizon</span>
              <h3 className="text-3xl md:text-5xl font-bold mt-4">Infinite Possibilities</h3>
            </div>
            <div className="flex space-x-6 animate-scroll-left w-max hover:pause">
              {[...defaultTrail, ...impactImages, ...sectionBgImages, ...defaultTrail].map((img, idx) => (
                <div key={idx} className={`relative flex-none rounded-3xl overflow-hidden group w-[20rem] md:w-[30rem] ${idx % 2 === 0 ? 'aspect-video' : 'aspect-[3/4]'} border border-white/10 glass`}>
                  <img
                    src={typeof img === 'string' ? img : img.url}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    alt="Showcase"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-8">
                    <p className="font-mono text-xs text-white/80">AI GENERATED ASSET #0{idx}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Properties Section for Visitors */}
          <section className="py-40 px-6">
            <div className="max-w-7xl mx-auto">
              <h2 className="text-5xl md:text-8xl font-bold tracking-tighter uppercase mb-20">Featured <br /> <span className="text-zinc-600">Properties.</span></h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                {properties.length > 0 ? properties.map((p, i) => (
                  <div key={i} className="group glass rounded-[3rem] overflow-hidden hover:-translate-y-4 transition-all duration-700">
                    <div className="aspect-[4/3] overflow-hidden">
                      <img src={p.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" alt={p.name} />
                    </div>
                    <div className="p-10">
                      <span className="text-[10px] uppercase tracking-widest text-indigo-400">{p.location}</span>
                      <h3 className="text-2xl font-bold mt-2">{p.name}</h3>
                      <p className="text-zinc-500 mt-4 font-mono text-xl">{p.price}</p>
                    </div>
                  </div>
                )) : (
                  <div className="col-span-full py-20 text-center glass rounded-[4rem] border-dashed border-white/10">
                    <p className="text-zinc-600 italic">Browse our upcoming elite property listings.</p>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* Impact Section */}
          <section className="py-40 px-6 relative overflow-hidden">
            <div className="absolute -right-40 top-40 w-96 h-96 bg-purple-600/20 rounded-full blur-[100px] pointer-events-none"></div>
            <div className="absolute -left-40 bottom-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-[100px] pointer-events-none"></div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-32 items-center relative z-10">
              <div className="space-y-16">
                <div>
                  <span className="text-purple-400 font-mono tracking-widest text-sm uppercase mb-4 block">Visual Engineering</span>
                  <h3 className="text-5xl md:text-7xl font-bold tracking-tighter uppercase leading-none drop-shadow-2xl mb-8">
                    Visuals that <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 animate-pulse-slow">Convert.</span>
                  </h3>
                </div>
                <p className="text-white/80 text-xl md:text-2xl font-light leading-relaxed text-shadow-glow">
                  We don't just design; we engineer assets that define brands, command attention, and elevate digital presence through the power of generative AI and human creativity.
                </p>
                <div className="flex gap-8 text-sm font-mono text-gray-400">
                  <div>
                    <span className="block text-3xl text-white font-bold mb-2">98%</span>
                    Client Satisfaction
                  </div>
                  <div>
                    <span className="block text-3xl text-white font-bold mb-2">500+</span>
                    Projects Delivered
                  </div>
                </div>
              </div>
              <div className="aspect-square rounded-[5rem] overflow-hidden glass border-white/10 group relative">
                {impactImages.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 group-hover:scale-110 ${i === impactIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
                    alt="Visual impact"
                  />
                ))}
              </div>
            </div>
          </section>

          <section className="py-40 px-6 text-center">
            <div className="max-w-4xl mx-auto glass p-24 rounded-[5rem] border-white/10 group">
              <h2 className="text-6xl md:text-8xl font-bold tracking-tighter uppercase mb-12">Ready to <br /> <span className="text-gradient">Ascend?</span></h2>
              <Link to="/contact" className="inline-block px-16 py-6 bg-white text-black font-black uppercase tracking-widest rounded-full hover:scale-110 transition-transform">Contact Studio</Link>
            </div>
          </section>
        </div>
      </div>

      <style>{`
        @keyframes image-float {
          0% { transform: scale(0.4) translateY(60px) rotate(-15deg); opacity: 0; filter: blur(20px); }
          20% { transform: scale(1.05) translateY(-20px) rotate(5deg); opacity: 1; filter: blur(0px); }
          80% { transform: scale(1) translateY(0px) rotate(0deg); opacity: 1; }
          100% { transform: scale(0.7) translateY(-80px) rotate(-5deg); opacity: 0; filter: blur(20px); }
        }
        .animate-image-float { animation: image-float 1.2s cubic-bezier(0.23, 1, 0.32, 1) forwards; }
        .animate-reveal-up { animation: reveal-up 1.5s cubic-bezier(0.19, 1, 0.22, 1) forwards; opacity: 0; transform: translateY(120px); }
        @keyframes reveal-up { to { transform: translateY(0); opacity: 1; } }
        @keyframes hue-rotate { 0% { filter: hue-rotate(0deg); } 100% { filter: hue-rotate(360deg); } }
        .animate-hue-rotate { animation: hue-rotate 20s linear infinite; }
        .text-shadow-glow { text-shadow: 0 0 20px rgba(255,255,255,0.5), 0 0 40px rgba(255,255,255,0.2); }
        
        @keyframes scroll-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-scroll-left { animation: scroll-left 40s linear infinite; }
        
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fade-in-up 1s ease-out forwards; }
        
        .animation-delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        
        .hover\:pause:hover { animation-play-state: paused; }
      `}</style>
    </div>
  );
};

export default Home;
