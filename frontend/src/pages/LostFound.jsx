import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { lostFoundAPI } from '../lib/api';
import { useUIStore } from '../store';

const STATIC = [
  { id:'lf1', type:'lost', title:'Samsung Galaxy Buds Pro', location:'Library, Block 37, 4th floor', created_at:new Date(Date.now()-7200000).toISOString(), description:'Black case, last seen near window seats' },
  { id:'lf2', type:'found', title:'Student ID Card — Ravi Kumar', location:'Block 34 Canteen', created_at:new Date(Date.now()-10800000).toISOString(), description:'Found near entrance. Contact to claim.' },
  { id:'lf3', type:'lost', title:'Maths textbook + Notes', location:'Block 32, Room 204', created_at:new Date(Date.now()-86400000).toISOString(), description:'Blue cover, has my name inside' },
  { id:'lf4', type:'found', title:'Blue Water Bottle (Milton)', location:'Sports Complex', created_at:new Date(Date.now()-86400000).toISOString(), description:'Handed to reception at Block 1' },
  { id:'lf5', type:'lost', title:'Calculator (Casio FX-991)', location:'Block 38, Exam Hall', created_at:new Date(Date.now()-172800000).toISOString(), description:'Black, has sticker on back' },
  { id:'lf6', type:'found', title:'Grey Hoodie — LPU printed', location:'Block 55 Hostel Common Room', created_at:new Date(Date.now()-172800000).toISOString(), description:'Large size. Claim from hostel warden.' },
];

const timeAgo = (iso) => { const d=Date.now()-new Date(iso).getTime(); if(d<3600000) return `${Math.floor(d/60000)}m ago`; if(d<86400000) return `${Math.floor(d/3600000)}h ago`; return `${Math.floor(d/86400000)}d ago`; };

export default function LostFound() {
  const navigate = useNavigate();
  const { showToast } = useUIStore();
  const [items, setItems] = useState(STATIC);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    lostFoundAPI.getAll({ inst_id:'lpu' }).then(r => { if(r.data.items?.length) setItems(r.data.items); }).catch(() => {});
  }, []);

  const filtered = filter === 'all' ? items : items.filter(i => i.type === filter);

  const postItem = async (type) => {
    const title = prompt(`Describe the ${type} item:`);
    if (!title) return;
    const location = prompt('Where? (e.g. Block 34, Library)') || 'Campus';
    const newItem = { id: Date.now(), type, title, location, description:'Recently posted', created_at:new Date().toISOString() };
    try {
      const res = await lostFoundAPI.post({ type, title, location, inst_id:'lpu' });
      setItems(i => [res.data.item, ...i]);
    } catch {
      setItems(i => [newItem, ...i]);
    }
    showToast(`${type === 'lost' ? 'Lost item' : 'Found item'} reported!`);
  };

  return (
    <div className="max-w-4xl mx-auto px-5 py-7">
      <button className="text-sm text-white/40 mb-5 hover:text-white transition-colors" onClick={() => navigate('/dashboard')}>← Back</button>
      <h1 className="font-display text-3xl font-extrabold tracking-tight mb-1">🔍 Lost & Found</h1>
      <p className="text-sm text-white/40 mb-6">Report lost items or claim found ones — campus-wide board</p>
      <div className="flex gap-2 flex-wrap mb-5">
        <button onClick={() => postItem('lost')} className="bg-brand text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-brand-2 transition-all">📍 Report Lost Item</button>
        <button onClick={() => postItem('found')} className="bg-bg-3 border border-white/10 text-white/70 text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-bg-4 transition-all">✅ I Found Something</button>
      </div>
      <div className="flex gap-2 mb-5">
        {['all','lost','found'].map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-4 py-1.5 rounded-full text-xs font-medium border capitalize transition-all ${filter===f?'bg-brand border-brand text-white':'bg-bg-3 border-white/10 text-white/50 hover:text-white'}`}>{f}</button>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(item => (
          <div key={item.id} className="bg-bg-2 border border-white/[0.06] rounded-2xl p-5 hover:border-white/10 hover:-translate-y-0.5 transition-all">
            <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-1 rounded-full border mb-3 ${item.type==='lost'?'bg-red-500/10 text-red-400 border-red-500/20':'bg-green-500/10 text-green-400 border-green-500/20'}`}>
              {item.type==='lost'?'🔴 Lost':'🟢 Found'}
            </span>
            <div className="text-sm font-semibold mb-1">{item.title}</div>
            <div className="text-xs text-white/35 mb-2">📍 {item.location}</div>
            <div className="text-xs text-white/30 leading-relaxed mb-4">{item.description}</div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-white/20">{timeAgo(item.created_at)}</span>
              <button onClick={() => showToast('Contact info shared!')} className="text-xs bg-bg-4 border border-white/10 px-3 py-1.5 rounded-lg hover:bg-bg-5 transition-colors">Contact →</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
