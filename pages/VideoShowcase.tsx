
import React from 'react';

const videos = [
  { title: "FUTURE_BRAND_REEL", desc: "AI-Generated conceptual brand ad.", src: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" },
  { title: "CYBERPUNK_PROD", desc: "Automated product showcase.", src: "https://www.w3schools.com/html/mov_bbb.mp4" },
  { title: "NATURE_MORPH", desc: "Fluid AI transition experimental piece.", src: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" }
];

const VideoShowcase: React.FC = () => {
  return (
    <div className="pt-32 px-6 max-w-7xl mx-auto pb-32">
      <h1 className="text-6xl md:text-9xl font-bold tracking-tighter mb-24">MOTION <span className="text-gradient">GEN.</span></h1>
      
      <div className="grid grid-cols-1 gap-12">
        {videos.map((vid, idx) => (
          <div key={idx} className="group glass rounded-[4rem] overflow-hidden relative aspect-video flex items-center justify-center">
             <video 
                src={vid.src} 
                className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 opacity-40 group-hover:opacity-100 transition-all duration-1000"
                muted 
                loop 
                playsInline
                onMouseOver={async (e) => {
                  try {
                    await (e.target as HTMLVideoElement).play();
                  } catch (err) {}
                }}
                onMouseOut={e => {
                  (e.target as HTMLVideoElement).pause();
                  (e.target as HTMLVideoElement).currentTime = 0;
                }}
             />
             <div className="relative z-10 text-center pointer-events-none group-hover:translate-y-4 group-hover:opacity-0 transition-all duration-500">
                <h3 className="text-5xl md:text-7xl font-bold uppercase tracking-widest">{vid.title}</h3>
                <p className="text-zinc-400 mt-4 tracking-tighter uppercase font-mono">{vid.desc}</p>
                <div className="mt-10 w-20 h-20 glass rounded-full flex items-center justify-center mx-auto animate-pulse">
                  <i className="fas fa-play"></i>
                </div>
             </div>
             <div className="absolute top-10 left-10 text-[10px] font-mono tracking-widest opacity-40 group-hover:opacity-100">
               STREAMING_MP4_ID_{idx}
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VideoShowcase;
