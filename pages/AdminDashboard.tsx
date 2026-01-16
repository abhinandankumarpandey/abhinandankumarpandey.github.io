
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Routes, Route, Link, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';

// Reusable Media Upload Component
const MediaUpload: React.FC<{ onUpload: (url: string) => void }> = ({ onUpload }) => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!event.target.files || event.target.files.length === 0) return;

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload to 'media' bucket
      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('media').getPublicUrl(filePath);
      onUpload(data.publicUrl);
      alert('Asset uploaded to cloud storage.');
    } catch (error: any) {
      alert('Storage Error: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mt-2 flex items-center gap-4">
      <input type="file" ref={fileInputRef} onChange={handleUpload} className="hidden" accept="image/*,video/*" />
      <button
        type="button"
        disabled={uploading}
        onClick={() => fileInputRef.current?.click()}
        className="px-6 py-2 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all border border-indigo-500/20"
      >
        {uploading ? 'PROCESSING...' : 'UPLOAD NEW ASSET'}
      </button>
      <span className="text-[9px] text-zinc-600 uppercase font-mono">Max 50MB</span>
    </div>
  );
};

const AdminDashboard: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) navigate('/login');
      setSession(session);
    });
  }, [navigate]);

  if (!session) return null;

  const menuItems = [
    { name: 'Analytics', path: '/admin', icon: 'fa-chart-pie' },
    { name: 'Services', path: '/admin/services', icon: 'fa-concierge-bell' },
    { name: 'Gallery', path: '/admin/gallery', icon: 'fa-images' },
    { name: 'Trail FX', path: '/admin/trail', icon: 'fa-magic' },
    { name: 'Vault/Store', path: '/admin/vault', icon: 'fa-vault' },
    { name: 'Properties', path: '/admin/properties', icon: 'fa-home' },
    { name: 'Inquiries', path: '/admin/inquiries', icon: 'fa-envelope-open' },
    { name: 'Private Notes', path: '/admin/personal-notes', icon: 'fa-sticky-note' }
  ];

  return (
    <div className="pt-32 px-6 max-w-7xl mx-auto pb-40">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-8">
        <div>
          <h1 className="text-5xl font-bold tracking-tighter uppercase">ADMIN <span className="text-gradient">CONSOLE.</span></h1>
          <div className="flex items-center gap-3 mt-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <p className="text-zinc-500 uppercase tracking-widest text-[10px]">Active Terminal: {session.user.email}</p>
          </div>
        </div>
        <button
          onClick={() => supabase.auth.signOut().then(() => navigate('/'))}
          className="px-8 py-3 glass rounded-full text-xs font-bold hover:bg-red-500 hover:text-white transition-all uppercase tracking-widest border-white/5"
        >
          LOGOUT
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        <aside className="lg:col-span-1 space-y-2">
          {menuItems.map(item => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-4 w-full text-left px-8 py-5 glass border-white/5 rounded-3xl text-xs uppercase tracking-widest transition-all ${location.pathname === item.path ? 'border-indigo-500 bg-white/10 text-white' : 'hover:border-white/20 text-zinc-500'
                }`}
            >
              <i className={`fas ${item.icon} w-5`}></i>
              {item.name}
            </Link>
          ))}
        </aside>

        <main className="lg:col-span-3 glass p-12 rounded-[4rem] border-white/5 min-h-[70vh] shadow-2xl">
          <Routes>
            <Route path="/" element={<Summary />} />
            <Route path="services" element={<ManageItems table="services" schema={['title', 'description', 'icon', 'media_url', 'priority', 'is_video']} mediaField="media_url" />} />
            <Route path="gallery" element={<ManageItems table="gallery" schema={['url', 'type', 'ratio', 'is_video', 'is_trail']} mediaField="url" />} />
            <Route path="trail" element={<ManageItems table="gallery" schema={['url', 'type', 'ratio', 'is_video', 'is_trail']} mediaField="url" filter={{ is_trail: true }} />} />
            <Route path="vault" element={<ManageItems table="vault" schema={['title', 'type', 'price', 'description', 'thumbnail_url', 'buy_link']} mediaField="thumbnail_url" />} />
            <Route path="properties" element={<ManageItems table="properties" schema={['name', 'location', 'price', 'image_url']} mediaField="image_url" />} />
            <Route path="inquiries" element={<Inquiries />} />
            <Route path="personal-notes" element={<PersonalNotes />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

const Summary = () => {
  const [stats, setStats] = useState({ inq: 0, items: 0, services: 0 });
  const [notePreview, setNotePreview] = useState('');

  useEffect(() => {
    const fetch = async () => {
      const { count: c1 } = await supabase.from('enquiries').select('*', { count: 'exact', head: true });
      const { count: c2 } = await supabase.from('gallery').select('*', { count: 'exact', head: true });
      const { count: c3 } = await supabase.from('services').select('*', { count: 'exact', head: true });
      setStats({ inq: c1 || 0, items: c2 || 0, services: c3 || 0 });

      const { data: note } = await supabase.from('personal_notes').select('content').eq('id', 'main-admin-note').single();
      if (note) setNotePreview(note.content);
    };
    fetch();
  }, []);

  return (
    <div className="space-y-12 animate-reveal">
      <h2 className="text-4xl font-black uppercase tracking-tighter">System Health.</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link to="/admin/inquiries" className="p-8 glass rounded-[2.5rem] border-white/5 hover:border-indigo-500/50 transition-all group shadow-xl">
          <span className="text-[10px] text-zinc-500 uppercase tracking-widest group-hover:text-indigo-400 transition-colors">Client Leads</span>
          <p className="text-6xl font-black mt-3 text-gradient">{stats.inq}</p>
        </Link>
        <Link to="/admin/gallery" className="p-8 glass rounded-[2.5rem] border-white/5 hover:border-purple-500/50 transition-all group shadow-xl">
          <span className="text-[10px] text-zinc-500 uppercase tracking-widest group-hover:text-purple-400 transition-colors">Cloud Assets</span>
          <p className="text-6xl font-black mt-3 text-gradient">{stats.items}</p>
        </Link>
        <Link to="/admin/services" className="p-8 glass rounded-[2.5rem] border-white/5 hover:border-pink-500/50 transition-all group shadow-xl">
          <span className="text-[10px] text-zinc-500 uppercase tracking-widest group-hover:text-pink-400 transition-colors">Services</span>
          <p className="text-6xl font-black mt-3 text-gradient">{stats.services}</p>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="p-10 glass rounded-[3rem] border-white/5 bg-white/[0.01] shadow-xl">
          <div className="flex justify-between items-center mb-6">
            <h4 className="font-bold uppercase tracking-widest text-xs text-indigo-400">Private Scratchpad</h4>
            <Link to="/admin/personal-notes" className="text-[9px] uppercase tracking-widest text-zinc-600 hover:text-white transition-colors">Open Editor</Link>
          </div>
          <div className="text-zinc-500 text-sm leading-relaxed line-clamp-6 font-mono bg-black/40 p-6 rounded-2xl italic border border-white/5">
            {notePreview || "No active data stored in scratchpad..."}
          </div>
        </div>

        <div className="p-10 glass rounded-[3rem] bg-indigo-500/5 border-dashed border-indigo-500/20 shadow-xl flex flex-col justify-center">
          <h4 className="font-bold uppercase tracking-widest text-xs mb-4 text-indigo-300">Quick Operations</h4>
          <p className="text-zinc-500 text-sm leading-relaxed mb-6">
            Update your Gallery with the "is_trail" flag to instantly change the landing page mouse-hover background effects.
          </p>
          <div className="flex gap-4">
            <Link to="/admin/trail" className="px-6 py-2 glass rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all">Update Trail</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const ManageItems = ({ table, schema, mediaField, filter }: { table: string, schema: string[], mediaField: string, filter?: any }) => {
  const [items, setItems] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const fetchItems = async () => {
    const sortCol = table === 'services' ? 'priority' : 'created_at';
    let query = supabase.from(table).select('*').order(sortCol, { ascending: table === 'services' });

    if (filter) {
      Object.entries(filter).forEach(([key, value]) => {
        query = query.eq(key, value);
      });
    }

    const { data } = await query;
    if (data) setItems(data);
  };

  useEffect(() => {
    fetchItems();
  }, [table, filter]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Explicit Type Casting
    const payload = { ...formData };
    if (table === 'services' && payload.priority) payload.priority = parseInt(payload.priority);
    // Auto-apply filter values if creating new item
    if (filter && !editingItem) {
      Object.assign(payload, filter);
    }

    schema.forEach(field => {
      if (field.startsWith('is_')) {
        payload[field] = payload[field] === true || payload[field] === 'true';
      }
    });

    const { error } = editingItem
      ? await supabase.from(table).update(payload).eq('id', editingItem.id)
      : await supabase.from(table).insert([payload]);

    if (!error) {
      setIsModalOpen(false);
      setEditingItem(null);
      setFormData({});
      fetchItems();
    } else {
      alert('Sync Error: ' + error.message);
    }
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this record permanently?')) {
      const { error } = await supabase.from(table).delete().eq('id', id);
      if (!error) fetchItems();
    }
  };

  return (
    <div className="space-y-8 animate-reveal">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold uppercase tracking-tight">{table}</h2>
        <button
          onClick={() => { setEditingItem(null); setFormData({}); setIsModalOpen(true); }}
          className="px-8 py-3 bg-white text-black rounded-full text-[10px] font-bold tracking-widest hover:scale-105 transition-all uppercase"
        >
          Add Record
        </button>
      </div>

      <div className="space-y-4">
        {items.map(item => (
          <div key={item.id} className="flex justify-between items-center p-6 glass rounded-[2.5rem] border-white/5 group hover:border-white/20 transition-all shadow-lg">
            <div className="flex items-center gap-6">
              {(item[mediaField]) && (
                <div className="w-20 h-20 rounded-2xl overflow-hidden glass border border-white/5 bg-black/40">
                  {item.is_video ? (
                    <div className="w-full h-full flex items-center justify-center text-[10px] text-indigo-400 font-bold uppercase">MP4</div>
                  ) : (
                    <img src={item[mediaField]} className="w-full h-full object-cover" alt="" />
                  )}
                </div>
              )}
              <div>
                <p className="font-bold text-xl uppercase tracking-tighter">{item.title || item.name || 'Untitled'}</p>
                <div className="flex gap-2 mt-1">
                  {item.type && <span className="text-[8px] bg-white/10 px-2 py-0.5 rounded text-zinc-400 uppercase tracking-widest">#{item.type}</span>}
                  {item.priority !== undefined && <span className="text-[8px] bg-indigo-500/20 px-2 py-0.5 rounded text-indigo-400 uppercase tracking-widest font-bold">Prio: {item.priority}</span>}
                  {item.is_trail && <span className="text-[8px] bg-emerald-500/20 px-2 py-0.5 rounded text-emerald-400 uppercase tracking-widest font-bold">LIVE_TRAIL</span>}
                </div>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => { setEditingItem(item); setFormData(item); setIsModalOpen(true); }} className="w-12 h-12 glass rounded-full flex items-center justify-center text-zinc-400 hover:text-indigo-400 transition-all"><i className="fas fa-edit"></i></button>
              <button onClick={() => handleDelete(item.id)} className="w-12 h-12 glass rounded-full flex items-center justify-center text-zinc-400 hover:text-red-500 transition-all"><i className="fas fa-trash-alt"></i></button>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] bg-black/98 backdrop-blur-3xl flex items-center justify-center p-6">
          <div className="bg-zinc-950 p-12 rounded-[4rem] max-w-3xl w-full border border-white/10 relative shadow-2xl overflow-y-auto max-h-[90vh]">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-10 right-10 text-2xl text-zinc-600 hover:text-white transition-colors"><i className="fas fa-times"></i></button>
            <h3 className="text-4xl font-bold mb-10 uppercase tracking-tighter">Modify Record</h3>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {schema.map(field => (
                  <div key={field} className={`${field === 'description' ? 'md:col-span-2' : ''} space-y-3`}>
                    <label className="text-[10px] uppercase tracking-widest text-zinc-500 ml-2">{field.replace('_', ' ')}</label>

                    {field === mediaField ? (
                      <div className="space-y-4">
                        <input type="text" className="w-full bg-zinc-900 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-indigo-500 text-sm" placeholder="URL Address..." value={formData[field] || ''} onChange={(e) => setFormData({ ...formData, [field]: e.target.value })} />
                        <MediaUpload onUpload={(url) => setFormData({ ...formData, [field]: url })} />
                      </div>
                    ) : field === 'ratio' ? (
                      <select className="w-full bg-zinc-900 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-indigo-500 text-sm appearance-none cursor-pointer" value={formData[field] || ''} onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}>
                        <option value="" className="bg-zinc-950">Default Square</option>
                        <option value="aspect-square" className="bg-zinc-950">Square (1:1)</option>
                        <option value="aspect-video" className="bg-zinc-950">Landscape (16:9)</option>
                        <option value="aspect-[3/4]" className="bg-zinc-950">Tall (3:4)</option>
                        <option value="aspect-[4/3]" className="bg-zinc-950">Classic Photo (4:3)</option>
                      </select>
                    ) : field.startsWith('is_') ? (
                      <select className="w-full bg-zinc-900 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-indigo-500 text-sm appearance-none cursor-pointer" value={formData[field]?.toString() || 'false'} onChange={(e) => setFormData({ ...formData, [field]: e.target.value === 'true' })}>
                        <option value="false" className="bg-zinc-950">FALSE / OFF</option>
                        <option value="true" className="bg-zinc-950">TRUE / ON</option>
                      </select>
                    ) : field === 'icon' ? (
                      <div className="space-y-3">
                        <input
                          type="text"
                          className="w-full bg-zinc-900 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-indigo-500 text-sm font-mono"
                          placeholder="e.g. fa-bolt, fa-camera (FontAwesome)..."
                          value={formData[field] || ''}
                          onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                        />
                        <div className="flex flex-wrap gap-2 items-center text-[10px]">
                          <span className="text-zinc-500 uppercase tracking-widest">Presets:</span>
                          {['fa-bolt', 'fa-camera', 'fa-pen-nib', 'fa-video', 'fa-code', 'fa-robot', 'fa-layer-group', 'fa-chart-line'].map((ic) => (
                            <button
                              key={ic}
                              type="button"
                              onClick={() => setFormData({ ...formData, [field]: ic })}
                              className="px-2 py-1 glass rounded-md hover:bg-white hover:text-black transition-all"
                            >
                              {ic}
                            </button>
                          ))}
                          <a href="https://fontawesome.com/search?o=r&m=free" target="_blank" rel="noreferrer" className="ml-auto text-indigo-400 hover:underline">Find More &rarr;</a>
                        </div>
                      </div>
                    ) : field === 'description' ? (
                      <textarea className="w-full bg-zinc-900 border border-white/10 rounded-3xl px-6 py-5 outline-none focus:border-indigo-500 text-sm h-32 resize-none" placeholder="Provide full context..." value={formData[field] || ''} onChange={(e) => setFormData({ ...formData, [field]: e.target.value })} />
                    ) : (
                      <input type={field === 'priority' ? 'number' : 'text'} className="w-full bg-zinc-900 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-indigo-500 text-sm" placeholder={`Input ${field}...`} value={formData[field] || ''} onChange={(e) => setFormData({ ...formData, [field]: e.target.value })} />
                    )}
                  </div>
                ))}
              </div>
              <button disabled={loading} className="w-full py-6 bg-white text-black font-black rounded-3xl hover:scale-[0.98] transition-all uppercase tracking-[0.2em] shadow-2xl">
                {loading ? 'SYNCHRONIZING...' : 'COMMIT CHANGES'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const Inquiries = () => {
  const [inquiries, setInquiries] = useState<any[]>([]);

  const fetch = async () => {
    const { data } = await supabase.from('enquiries').select('*').order('created_at', { ascending: false });
    if (data) setInquiries(data);
  };

  useEffect(() => { fetch(); }, []);

  const deleteInq = async (id: string) => {
    if (window.confirm('Erase this lead record?')) {
      await supabase.from('enquiries').delete().eq('id', id);
      fetch();
    }
  };

  return (
    <div className="space-y-8 animate-reveal">
      <h2 className="text-3xl font-bold uppercase tracking-tight">Leads Inbox</h2>
      <div className="grid gap-6">
        {inquiries.length > 0 ? inquiries.map(inq => (
          <div key={inq.id} className="p-10 glass rounded-[3rem] border-white/5 relative group shadow-xl">
            <button onClick={() => deleteInq(inq.id)} className="absolute top-8 right-8 text-zinc-600 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"><i className="fas fa-trash"></i></button>
            <div className="flex justify-between items-start mb-6">
              <div>
                <h4 className="text-2xl font-bold">{inq.name}</h4>
                <p className="text-indigo-400 text-sm font-mono lowercase tracking-tight">{inq.email}</p>
              </div>
              <span className="text-[10px] text-zinc-600 font-mono uppercase bg-black/40 px-3 py-1 rounded-full">{new Date(inq.created_at).toLocaleString()}</span>
            </div>
            <p className="text-zinc-500 font-bold uppercase text-xs mb-4 tracking-widest">{inq.subject}</p>
            <div className="p-8 bg-black/40 rounded-3xl border border-white/5 text-zinc-300 leading-relaxed italic">
              "{inq.message}"
            </div>
          </div>
        )) : <div className="py-20 text-center text-zinc-600 font-mono uppercase tracking-widest italic">Lead queue empty.</div>}
      </div>
    </div>
  );
};

const PersonalNotes = () => {
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from('personal_notes').select('*').eq('id', 'main-admin-note').single();
      if (data) setNote(data.content);
    };
    fetch();
  }, []);

  const saveNote = async () => {
    setLoading(true);
    const { data: { session } } = await supabase.auth.getSession();
    const { error } = await supabase.from('personal_notes').upsert({
      id: 'main-admin-note',
      user_id: session?.user.id,
      content: note,
      updated_at: new Date().toISOString()
    });
    if (!error) alert('Neural scratchpad synchronized.');
    else alert(error.message);
    setLoading(false);
  };

  const deleteNote = async () => {
    if (window.confirm('Are you sure you want to permanently delete this note?')) {
      setLoading(true);
      const { error } = await supabase.from('personal_notes').delete().eq('id', 'main-admin-note');
      if (!error) {
        setNote('');
        alert('Note deleted permanently.');
      }
      else alert(error.message);
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-reveal">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold uppercase tracking-tight">Private Scratchpad</h2>
          <p className="text-[10px] text-zinc-500 mt-1 uppercase tracking-widest font-mono">Encrypted Store // Persistent State</p>
        </div>
        <div className="flex gap-4">
          <button onClick={deleteNote} disabled={loading} className="px-6 py-4 bg-red-500/10 text-red-500 font-bold rounded-2xl hover:bg-red-500 hover:text-white transition-all uppercase tracking-widest text-[10px] border border-red-500/20">
            DELETE
          </button>
          <button onClick={saveNote} disabled={loading} className="px-10 py-4 bg-indigo-500 text-white font-bold rounded-2xl hover:bg-indigo-400 transition-all uppercase tracking-widest text-[10px] shadow-lg">
            {loading ? 'SYNCING...' : 'SAVE TO CLOUD'}
          </button>
        </div>
      </div>
      <textarea
        className="w-full h-[50vh] bg-zinc-900 border border-white/10 rounded-[3rem] p-12 outline-none focus:border-indigo-500 transition-all resize-none font-mono text-zinc-300 text-lg leading-relaxed shadow-inner"
        placeholder="Store confidential data, hex codes, or project timelines..."
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />
    </div>
  )
}

export default AdminDashboard;
