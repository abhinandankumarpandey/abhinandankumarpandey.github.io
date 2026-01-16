
import React, { useState, useEffect } from 'react';

const Portfolio: React.FC = () => {
  const [bgIndex, setBgIndex] = useState(0);
  const bgImages = [
    "https://images.unsplash.com/photo-1614728263952-84ea256f9679?auto=format&fit=crop&q=80&w=1920",
    "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=1920",
    "https://images.unsplash.com/photo-1633167606207-d840b5070fc2?auto=format&fit=crop&q=80&w=1920"
  ];

  useEffect(() => {
    const timer = setInterval(() => setBgIndex(prev => (prev + 1) % bgImages.length), 5000);
    return () => clearInterval(timer);
  }, []);

  const profileImg = "https://github.com/abhinandankumarpandey/website-assets/blob/master/my-images/prompter-abhinandan_profile_picture.webp?raw=true";

  const timeline = [
    { year: "2020", title: "10th Grade Achievement", detail: "85% - Bal Vidya Mandir School", color: "from-blue-500 to-cyan-400" },
    { year: "2022", title: "12th Grade - Non-Medical", detail: "88.88% - Govt Sen Sec School Jawahar Nagar", color: "from-purple-500 to-pink-400" },
    { year: "2021-2022", title: "Computer Diploma", detail: "78% Proficiency - BMCC Institute", color: "from-green-500 to-emerald-400" },
    { year: "2025", title: "BCA Graduation", detail: "79.45% - SCD Govt College Ludhiana", color: "from-orange-500 to-yellow-400" }
  ];

  const skills = [
    "Prompt Engineering", "AI Coding", "Photoshop", "Communication Skills",
    "Office Softwares", "Hindi (Fluent)", "Punjabi (Native)", "English (Intermediate)"
  ];

  const galleryImages = [
    "https://github.com/abhinandankumarpandey/website-assets/blob/master/creatives/Whisk_b13fce596b2e7dbb08c458a9061d161edr_bloom_low_4x.webp?raw=true",
    "https://github.com/abhinandankumarpandey/website-assets/blob/master/creatives/creative_images.webp?raw=true",
    "https://github.com/abhinandankumarpandey/website-assets/blob/master/creatives/creatives_ai.webp?raw=true",
    "https://github.com/abhinandankumarpandey/website-assets/blob/master/creatives/illustrations_service.webp?raw=true",
    "https://github.com/abhinandankumarpandey/website-assets/blob/master/creatives/mine_craft_art_creation.webp?raw=true",
    "https://github.com/abhinandankumarpandey/website-assets/blob/master/creatives/unque_creatives_with_ai.webp?raw=true"
  ];

  return (
    <div className="relative min-h-screen">
      {/* Dynamic Background */}
      <div className="fixed inset-0 z-0 opacity-10">
        {bgImages.map((img, i) => (
          <div
            key={i}
            className={`absolute inset-0 bg-cover bg-center transition-opacity duration-[3000ms] ${bgIndex === i ? 'opacity-100' : 'opacity-0'}`}
            style={{ backgroundImage: `url(${img})` }}
          />
        ))}
      </div>

      <div className="relative z-10 pt-40 px-6 max-w-7xl mx-auto pb-40">
        {/* Main Profile Header */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-40 animate-reveal">
          <div className="relative">
            <div className="w-full max-w-md mx-auto rounded-[4rem] overflow-hidden glass border-4 border-white/5 relative z-10">
              <img src={profileImg} className="w-full h-auto shadow-2xl transition-all duration-700" alt="Profile" />
            </div>
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/20 blur-[80px] rounded-full"></div>
          </div>
          <div className="text-center lg:text-left">
            <h1 className="text-6xl md:text-8xl font-bold tracking-tighter mb-4 leading-none flex flex-wrap items-baseline gap-4 justify-center lg:justify-start">
              ABHINANDAN
              <span className="text-3xl md:text-5xl text-zinc-500 tracking-wide font-light">Pandey</span>
            </h1>
            <h2 className="text-3xl font-light text-zinc-400 mb-8 italic">"Blending raw automation with human creativity."</h2>
            <div className="space-y-4 text-zinc-500 text-lg max-w-xl">
              <p><strong>DoB:</strong> January 29, 2005 | <strong>Gender:</strong> Male</p>
              <p><strong>Address:</strong> New Janta Nagar , Ludhiana, Punjab - 141003</p>
              <p><strong>Objective:</strong> To leverage advanced AI and automation frameworks to create scalable digital solutions and high-fidelity visual content.</p>
            </div>
            <div className="mt-12 flex flex-wrap gap-4 justify-center lg:justify-start">
              <a href="https://drive.google.com/file/d/13ogPxuvGT3v4theTqcxBar1tW1-3UGj9/view?usp=sharing" target="_blank" rel="noopener noreferrer" className="px-10 py-4 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform flex items-center gap-3">
                <i className="fas fa-download"></i> DOWNLOAD RESUME
              </a>
              <div className="flex gap-4">
                {[
                  { icon: 'linkedin', url: 'https://www.linkedin.com/in/abhinandan-pandey-44764027b/' },
                  { icon: 'instagram', url: 'https://www.instagram.com/abhi_nan_dan_pandey/' },
                  { icon: 'x-twitter', url: 'https://twitter.com/IN_Abhinandan' }
                ].map(s => (
                  <a key={s.icon} href={s.url} target="_blank" rel="noopener noreferrer" className="w-14 h-14 glass rounded-full flex items-center justify-center text-xl hover:bg-white hover:text-black transition-all">
                    <i className={`fab fa-${s.icon}`}></i>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Academic Timeline */}
        <section className="mb-40">
          <h3 className="text-4xl font-bold mb-16 tracking-tighter border-b border-white/10 pb-6 flex items-center gap-4">
            <i className="fas fa-graduation-cap text-indigo-500"></i> ACADEMIC JOURNEY
          </h3>
          <div className="space-y-12">
            {timeline.map((item, idx) => (
              <div key={idx} className="glass p-10 rounded-[3rem] border-l-8 border-indigo-500 relative hover:translate-x-4 transition-transform group">
                <span className="text-sm font-mono text-zinc-500 uppercase tracking-widest">{item.year}</span>
                <h4 className="text-3xl font-bold mt-2 mb-2 group-hover:text-indigo-400 transition-colors">{item.title}</h4>
                <p className="text-xl text-zinc-400 font-light">{item.detail}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Skills & Experience */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-40">
          <div className="glass p-12 rounded-[4rem]">
            <h3 className="text-3xl font-bold mb-10 flex items-center gap-4">
              <i className="fas fa-bolt text-yellow-400"></i> CORE SKILLS
            </h3>
            <div className="flex flex-wrap gap-4">
              {skills.map(skill => (
                <span key={skill} className="px-6 py-3 glass rounded-full text-sm font-bold border border-white/5 hover:bg-indigo-500 hover:text-white transition-all cursor-default">
                  {skill}
                </span>
              ))}
            </div>
            <div className="mt-12 space-y-6">
              <h4 className="text-xl font-bold uppercase tracking-widest text-zinc-500">Experience</h4>
              <div className="border-l border-white/10 pl-6 py-2">
                <p className="font-bold">Amazon Associate</p>
                <p className="text-sm text-zinc-500">Dec 2024 - Jan 2025</p>
              </div>
              <div className="border-l border-white/10 pl-6 py-2">
                <p className="font-bold">Gogna Tele Shop</p>
                <p className="text-sm text-zinc-500">Dec 2025 - Jan 2026</p>
              </div>
            </div>
          </div>

          <div className="glass p-12 rounded-[4rem] bg-indigo-500/5">
            <h3 className="text-3xl font-bold mb-10 flex items-center gap-4">
              <i className="fas fa-heart text-pink-500"></i> HOBBIES & INTERESTS
            </h3>
            <div className="space-y-6 text-zinc-400">
              <p className="flex items-center gap-4"><i className="fas fa-wifi"></i> Surfing the internet for the latest automation trends.</p>
              <p className="flex items-center gap-4"><i className="fas fa-robot"></i> Planning expert-level prompts for high-fidelity outputs.</p>
              <p className="flex items-center gap-4"><i className="fas fa-book-open"></i> Reading self-help and financial independence books.</p>
              <div className="pt-6 border-t border-white/5">
                <h4 className="text-white font-bold mb-4">Certifications:</h4>
                <ul className="list-disc list-inside space-y-2 text-sm">
                  <li>Prompt Engineering (Deeplearning.Ai)</li>
                  <li>Python Certification (Guvi)</li>
                  <li>British Council English Speaking Certificate</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Academic & Personal Gallery */}
        <section>
          <h3 className="text-4xl font-bold mb-16 tracking-tighter border-b border-white/10 pb-6 flex items-center gap-4">
            <i className="fas fa-images text-emerald-500"></i> VISUAL ARCHIVE
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            {galleryImages.map((img, i) => (
              <div key={i} className="aspect-square glass rounded-[2.5rem] overflow-hidden group">
                <img src={img} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700" alt={`Archive ${i}`} />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Portfolio;
