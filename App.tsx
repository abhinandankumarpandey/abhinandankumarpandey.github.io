
import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Services from './pages/Services';
import Portfolio from './pages/Portfolio';
import Contact from './pages/Contact';
import DigitalAssets from './pages/DigitalAssets';
import VideoShowcase from './pages/VideoShowcase';
import ImageGallery from './pages/ImageGallery';
import AdminDashboard from './pages/AdminDashboard';
import Login from './pages/Login';

const App: React.FC = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    setIsMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/services', label: 'Services' },
    { path: '/portfolio', label: 'Portfolio' },
    { path: '/gallery', label: 'Gallery' },
    { path: '/assets', label: 'Store' },
    { path: '/contact', label: 'Contact' },
  ];

  return (
    <div className="relative min-h-screen">
      <nav className="fixed top-0 left-0 w-full z-50 p-6 md:px-12 flex justify-between items-center pointer-events-none">
        <Link to="/" className="font-bold tracking-tighter pointer-events-auto mix-blend-difference flex flex-col leading-none group">
          <span className="text-2xl">ABHINANDAN</span>
          <span className="text-[0.6rem] tracking-[0.2em] text-zinc-500 group-hover:text-white transition-colors">PROMPTS · GRAPHICS · AI</span>
        </Link>

        <div className="hidden md:flex items-center space-x-8 pointer-events-auto glass px-8 py-3 rounded-full">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-[10px] uppercase tracking-[0.2em] hover:text-white transition-colors ${location.pathname === link.path ? 'text-white' : 'text-zinc-500'}`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden pointer-events-auto text-white p-3 glass rounded-full"
        >
          <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'} w-5`}></i>
        </button>
      </nav>

      {isMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center space-y-8 text-4xl font-bold animate-reveal">
          {navLinks.map((link) => (
            <Link key={link.path} to={link.path} onClick={() => setIsMenuOpen(false)}>{link.label}</Link>
          ))}
        </div>
      )}

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/assets" element={<DigitalAssets />} />
          <Route path="/video-showcase" element={<VideoShowcase />} />
          <Route path="/gallery" element={<ImageGallery />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin/*" element={<AdminDashboard />} />
        </Routes>
      </main>

      <footer className="p-20 bg-zinc-950 border-t border-white/5">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-2">
            <div className="mb-6">
              <h2 className="text-3xl font-bold tracking-tighter leading-none">ABHINANDAN.</h2>
              <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-500">Prompts · Graphics · AI</p>
            </div>
            <p className="text-zinc-500 max-w-sm mb-8 leading-relaxed">Pushing the boundaries of digital aesthetics through the fusion of human intuition and artificial intelligence.</p>
            <div className="flex space-x-4">
              {[
                { icon: 'instagram', url: 'https://www.instagram.com/abhi_nan_dan_pandey/' },
                { icon: 'x-twitter', url: 'https://twitter.com/IN_Abhinandan' },
                { icon: 'linkedin', url: 'https://www.linkedin.com/in/abhinandan-pandey-44764027b/' },
                { icon: 'whatsapp', url: 'https://wa.me/917710795036' }
              ].map(s => (
                <a key={s.icon} href={s.url} target="_blank" rel="noopener noreferrer" className="w-10 h-10 glass rounded-full flex items-center justify-center text-zinc-400 hover:text-white hover:border-white transition-all">
                  <i className={`fab fa-${s.icon}`}></i>
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-widest text-white mb-6">Explore</h4>
            <ul className="space-y-4 text-zinc-500 text-sm">
              <li><Link to="/services">All Services</Link></li>
              <li><Link to="/gallery">Work Gallery</Link></li>
              <li><Link to="/assets">Digital Assets</Link></li>
              <li><Link to="/portfolio">About Me</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-xs uppercase tracking-widest text-white mb-6">Contact</h4>
            <ul className="space-y-4 text-zinc-500 text-sm">
              <li>Ludhiana, Punjab</li>
              <li>abhinandanpandey540@gmail.com</li>
              <li><Link to="/login" className="text-[8px] opacity-20 hover:opacity-100 transition-opacity">ADMIN</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-20 pt-10 border-t border-white/5 text-center text-zinc-600 text-[10px] uppercase tracking-widest">
          &copy; 2025 Abhinandan Prompts · Graphics · AI. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default App;
