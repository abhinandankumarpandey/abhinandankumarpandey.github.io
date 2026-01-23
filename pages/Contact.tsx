
import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

const Contact: React.FC = () => {
  const [bgIndex, setBgIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const bgImages = [
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1920",
    "https://images.unsplash.com/photo-1633167606207-d840b5070fc2?w=1920"
  ];

  useEffect(() => {
    const timer = setInterval(() => setBgIndex(prev => 1 - prev), 5000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from('enquiries').insert([formData]);
    if (!error) {
      setSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }
    setLoading(false);
  };

  return (
    <div className="relative min-h-screen">
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          <div className="animate-reveal">
            <h1 className="text-6xl md:text-9xl font-bold mb-8 leading-none">LET'S <br /><span className="text-gradient">TALK.</span></h1>
            <p className="text-zinc-400 text-2xl font-light mb-12 max-w-md leading-relaxed">
              Have a project in mind? Looking for AI-driven creative solutions? Drop a message.
            </p>

            <div className="space-y-10">
              <div className="flex items-center gap-8 group">
                <div className="w-16 h-16 glass rounded-2xl flex items-center justify-center text-2xl group-hover:bg-indigo-500 group-hover:text-white transition-all shadow-lg">
                  <i className="fas fa-phone"></i>
                </div>
                <div>
                  <p className="text-zinc-500 text-xs uppercase tracking-widest mb-1">Inquiry Line (WhatsApp Priority)</p>
                  <p className="text-2xl font-bold mb-3">+91 77107 95036</p>
                  <a href="https://wa.me/917710795036" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-4 py-2 bg-[#25D366] text-black font-bold rounded-full hover:bg-[#128C7E] hover:text-white transition-colors text-sm">
                    <i className="fab fa-whatsapp text-lg"></i>
                    Chat on WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>

          <div className="glass p-12 rounded-[4rem] border border-white/10 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[100px] rounded-full -mr-32 -mt-32"></div>
            {success ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
                <div className="w-24 h-24 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center text-4xl">
                  <i className="fas fa-check"></i>
                </div>
                <h3 className="text-3xl font-bold uppercase tracking-widest">Sent Successfully</h3>
                <p className="text-zinc-500">Our neural engine has received your message.</p>
                <button onClick={() => setSuccess(false)} className="px-8 py-3 glass rounded-full text-xs uppercase font-bold">Send Another</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="relative z-10 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-sm font-bold uppercase text-zinc-300 tracking-widest ml-1">Name</label>
                    <input
                      required
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      type="text" className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-zinc-600" placeholder="e.g. Rahul Sharma"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-sm font-bold uppercase text-zinc-300 tracking-widest ml-1">Email</label>
                    <input
                      required
                      value={formData.email}
                      onChange={e => setFormData({ ...formData, email: e.target.value })}
                      type="email" className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-zinc-600" placeholder="e.g. rahul@example.com"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-bold uppercase text-zinc-300 tracking-widest ml-1">Subject</label>
                  <input
                    required
                    value={formData.subject}
                    onChange={e => setFormData({ ...formData, subject: e.target.value })}
                    type="text" className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-zinc-600" placeholder="e.g. Project Inquiry - Website Redesign"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-bold uppercase text-zinc-300 tracking-widest ml-1">Message</label>
                  <textarea
                    required
                    value={formData.message}
                    onChange={e => setFormData({ ...formData, message: e.target.value })}
                    rows={5} className="w-full bg-white/5 border border-white/10 rounded-2xl px-8 py-5 focus:outline-none focus:border-indigo-500 transition-colors resize-none placeholder:text-zinc-600" placeholder="Hi Abhinandan, I would like to discuss a project... (Please include your phone number: +91 XXXXXXXXXX)"
                  ></textarea>
                </div>
                <button
                  disabled={loading}
                  type="submit" className="w-full py-6 bg-white text-black font-black rounded-3xl hover:scale-[0.98] active:scale-95 transition-all tracking-[0.2em] shadow-xl disabled:opacity-50"
                >
                  {loading ? 'TRANSMITTING...' : 'SEND MESSAGE'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
