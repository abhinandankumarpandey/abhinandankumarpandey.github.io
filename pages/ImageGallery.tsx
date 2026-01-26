
import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';

const GalleryItem = ({ item, isFocused, onClick }: { item: any; isFocused: boolean; onClick: (item: any) => void }) => {
  const [isHovered, setIsHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const isActive = isFocused || isHovered;

  useEffect(() => {
    if (item.is_video && videoRef.current) {
      if (isActive) {
        videoRef.current.play().catch(() => { });
      } else {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }
  }, [isActive, item.is_video]);

  return (
    <div
      className={`group relative overflow-hidden rounded-[2.5rem] glass cursor-zoom-in transition-all duration-700 break-inside-avoid shadow-lg ${item.ratio || 'aspect-square'
        } ${isActive ? 'scale-[1.02] z-10 ring-1 ring-white/30 shadow-[0_0_60px_rgba(168,85,247,0.4)]' : 'hover:scale-[1.01] opacity-90'}`}
      onClick={() => onClick(item)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        boxShadow: isActive ? '0 0 40px rgba(139, 92, 246, 0.3)' : 'none',
      }}
    >
      <div
        className={`absolute top-6 right-6 z-20 px-3 py-1 glass rounded-full text-[10px] font-bold uppercase tracking-widest text-indigo-200 border border-white/10 transition-opacity ${isActive ? 'opacity-100' : 'opacity-0'
          }`}
      >
        {item.type}
      </div>

      {item.is_video ? (
        <video
          ref={videoRef}
          src={item.url}
          className="w-full h-full object-cover"
          muted
          loop
          playsInline
        />
      ) : (
        <img src={item.url} className="w-full h-full object-cover" alt="" />
      )}

      {/* Modern Gradient Overlay */}
      <div
        className={`absolute inset-0 bg-gradient-to-t from-fuchsia-900/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 flex items-end p-8 ${isActive ? 'opacity-100' : 'group-hover:opacity-100'
          }`}
      >
        <span className="text-[10px] uppercase tracking-[0.3em] font-mono text-white/90 drop-shadow-md">
          Asset_Ref_{item.id ? item.id.slice(0, 4) : '0000'}
        </span>
      </div>
    </div>
  );
};

const ModalVideo = ({ url }: { url: string }) => {
  const [isMuted, setIsMuted] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div ref={contentRef} className="relative inline-block max-h-full max-w-full">
      <video
        src={url}
        className="max-h-[85vh] max-w-full rounded-[3rem] shadow-[0_0_100px_rgba(168,85,247,0.3)] border border-white/10"
        autoPlay
        loop
        muted={isMuted}
        playsInline
        controlsList="nodownload"
        onClick={(e) => e.stopPropagation()}
      />
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsMuted(!isMuted);
        }}
        className="absolute bottom-8 right-8 w-14 h-14 glass rounded-full flex items-center justify-center text-xl text-white hover:bg-white hover:text-black transition-all z-50 shadow-2xl backdrop-blur-xl border border-white/20 cursor-pointer"
        title={isMuted ? 'Unmute' : 'Mute'}
      >
        <i className={`fas fa-volume-${isMuted ? 'mute' : 'up'}`}></i>
      </button>
    </div>
  );
};

const ImageGallery: React.FC = () => {
  const [items, setItems] = useState<any[]>([]);
  const [filter, setFilter] = useState<string>('all');
  const [selectedMedia, setSelectedMedia] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);

  useEffect(() => {
    const fetchGallery = async () => {
      const { data } = await supabase
        .from('gallery')
        .select('*')
        .order('created_at', { ascending: false });
      if (data) setItems(data);
      setLoading(false);
    };
    fetchGallery();
  }, []);

  const dynamicTags = Array.from(new Set(items.map((i) => i.type))).filter(
    (t) => t && t.trim() !== ''
  );

  const filteredItems = items.filter((item) => {
    if (filter === 'all') return true;
    if (filter === 'video') return item.is_video;
    return item.type === filter;
  });

  useEffect(() => {
    if (loading || filteredItems.length === 0) return;

    let timeoutId: NodeJS.Timeout;
    const cycleFocus = () => {
      const count = filteredItems.length;
      if (count > 0) {
        const nextIndex = Math.floor(Math.random() * count);
        setFocusedIndex(nextIndex);
        const isVideo = filteredItems[nextIndex]?.is_video;
        const delay = isVideo ? 4000 : 2500;
        timeoutId = setTimeout(cycleFocus, delay);
      }
    };
    cycleFocus();
    return () => clearTimeout(timeoutId);
  }, [loading, filteredItems]);

  return (
    <div className="relative min-h-screen bg-[#050505] overflow-hidden">
      {/* Background Blobs for Color */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse-slow"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-fuchsia-600/20 rounded-full blur-[120px] animate-pulse-slow delay-1000"></div>
        <div className="absolute top-[40%] left-[30%] w-[30vw] h-[30vw] bg-purple-600/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="relative pt-40 px-6 max-w-7xl mx-auto pb-40">
        <div className="flex flex-col md:flex-row justify-between items-end mb-24 gap-8 animate-reveal">
          <div>
            <h1 className="text-7xl md:text-[10rem] font-black tracking-tighter leading-none text-gradient-liquid">
              GALLERY.
            </h1>
            <p className="text-indigo-300 font-mono text-[10px] uppercase tracking-[0.3em] mt-6 ml-2">
              A curated collection of neural-powered digital assets
            </p>
          </div>
          <div className="flex flex-wrap gap-2 justify-end max-w-xl">
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-2 glass rounded-full text-[10px] uppercase tracking-[0.2em] transition-all border ${filter === 'all'
                ? 'bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.3)]'
                : 'border-white/10 hover:bg-white/10 text-zinc-400'
                }`}
            >
              #All
            </button>
            {dynamicTags.map((t) => (
              <button
                key={t}
                onClick={() => setFilter(t)}
                className={`px-6 py-2 glass rounded-full text-[10px] uppercase tracking-[0.2em] transition-all border ${filter === t
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-transparent shadow-[0_0_20px_rgba(168,85,247,0.4)]'
                  : 'border-white/10 hover:bg-white/10 text-zinc-400'
                  }`}
              >
                #{t}
              </button>
            ))}
            <button
              onClick={() => setFilter('video')}
              className={`px-6 py-2 glass rounded-full text-[10px] uppercase tracking-[0.2em] transition-all border ${filter === 'video'
                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white border-transparent shadow-[0_0_20px_rgba(168,85,247,0.4)]'
                : 'border-white/10 hover:bg-white/10 text-zinc-400'
                }`}
            >
              #Video
            </button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="aspect-square glass rounded-[3rem] animate-pulse bg-white/5"
              ></div>
            ))}
          </div>
        ) : (
          <div className="columns-1 md:columns-2 lg:columns-3 gap-8 space-y-8">
            {filteredItems.map((item, idx) => (
              <GalleryItem
                key={item.id}
                item={item}
                isFocused={focusedIndex === idx}
                onClick={setSelectedMedia}
              />
            ))}
          </div>
        )}

        {selectedMedia && (
          <div
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-6 md:p-12 animate-reveal"
            onClick={() => setSelectedMedia(null)}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedMedia(null);
              }}
              className="absolute top-10 right-10 w-16 h-16 glass rounded-full flex items-center justify-center text-3xl hover:bg-white hover:text-black z-[110] transition-all"
            >
              <i className="fas fa-times"></i>
            </button>
            <div className="max-w-6xl w-full h-full flex items-center justify-center pointer-events-none">
              <div className="pointer-events-auto">
                {selectedMedia.is_video ? (
                  <ModalVideo url={selectedMedia.url} />
                ) : (
                  <img
                    src={selectedMedia.url}
                    className="max-h-[85vh] rounded-[3rem] shadow-[0_0_100px_rgba(168,85,247,0.3)] border border-white/10"
                    onClick={(e) => e.stopPropagation()}
                    alt="Expanded view"
                  />
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageGallery;
