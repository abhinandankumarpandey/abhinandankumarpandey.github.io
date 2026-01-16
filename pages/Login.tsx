
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const { error } = isSignUp 
      ? await supabase.auth.signUp({ email, password })
      : await supabase.auth.signInWithPassword({ email, password });
    
    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      if (isSignUp) {
        setError('Signup successful! You can now log in.');
        setIsSignUp(false);
        setLoading(false);
      } else {
        navigate('/admin');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="glass p-12 rounded-[4rem] max-w-md w-full border border-white/10">
        <h1 className="text-4xl font-bold mb-8 tracking-tighter text-center uppercase">
          ADMIN <span className="text-gradient">{isSignUp ? 'REGISTER' : 'ACCESS'}.</span>
        </h1>
        {error && <p className={`${error.includes('successful') ? 'text-green-400' : 'text-red-500'} text-xs mb-6 text-center`}>{error}</p>}
        <form onSubmit={handleAuth} className="space-y-6">
          <div>
            <label className="text-[10px] uppercase tracking-widest text-zinc-500 ml-2">Identity (Email)</label>
            <input 
              type="email" 
              required
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 mt-2 focus:border-indigo-500 outline-none transition-colors"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="text-[10px] uppercase tracking-widest text-zinc-500 ml-2">Secure Key (Password)</label>
            <input 
              type="password" 
              required
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 mt-2 focus:border-indigo-500 outline-none transition-colors"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button 
            disabled={loading}
            className="w-full py-5 bg-white text-black font-bold rounded-2xl hover:scale-95 transition-transform disabled:opacity-50 uppercase tracking-widest"
          >
            {loading ? 'PROCESSING...' : isSignUp ? 'CREATE ACCOUNT' : 'INITIATE SESSION'}
          </button>
        </form>
        <button 
          onClick={() => setIsSignUp(!isSignUp)}
          className="w-full mt-6 text-[10px] text-zinc-500 hover:text-white transition-colors uppercase tracking-[0.2em]"
        >
          {isSignUp ? 'Already have an account? Login' : 'Need an account? Register'}
        </button>
      </div>
    </div>
  );
};

export default Login;
