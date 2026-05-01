import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { discussionAPI } from '../lib/api';
import { useUIStore } from '../store';

const STATIC = [
  { id:1, title:'Which companies visiting campus for placements this month?', votes:234, comments:45, category:'Placements', created_at:new Date(Date.now()-3600000).toISOString(), users:{name:'CSE 2021'}, pinned:true },
  { id:2, title:'Branch change from ECE to CSE after 1st year — is it actually possible?', votes:189, comments:67, category:'Academic', created_at:new Date(Date.now()-10800000).toISOString(), users:{name:'ECE Student'} },
  { id:3, title:'Best coaching for GATE 2026 — online or offline?', votes:156, comments:89, category:'Academic', created_at:new Date(Date.now()-18000000).toISOString(), users:{name:'CSE 3rd Year'} },
  { id:4, title:'PG near Gate 2 that allows late entry after 10 PM?', votes:98, comments:34, category:'Housing', created_at:new Date(Date.now()-28800000).toISOString(), users:{name:'Anonymous'} },
  { id:5, title:'Mess food quality has seriously degraded — who do we contact?', votes:445, comments:123, category:'Campus', created_at:new Date(Date.now()-86400000).toISOString(), users:{name:'Block 55'} },
  { id:6, title:'LeetCode DSA vs Striver A2Z — which for LPU placements?', votes:312, comments:78, category:'Placements', created_at:new Date(Date.now()-172800000).toISOString(), users:{name:'CSE Final Year'} },
];

const CATS = ['All','Placements','Academic','Campus','Housing'];
const timeAgo = (iso) => { const d = Date.now()-new Date(iso).getTime(); if(d<3600000) return `${Math.floor(d/60000)}m ago`; if(d<86400000) return `${Math.floor(d/3600000)}h ago`; return `${Math.floor(d/86400000)}d ago`; };

export default function Discussion() {
  const navigate = useNavigate();
  const { showToast } = useUIStore();
  const [posts, setPosts] = useState(STATIC);
  const [filter, setFilter] = useState('All');
  const [newPost, setNewPost] = useState('');
  const [votes, setVotes] = useState({});

  useEffect(() => {
    discussionAPI.getAll({ inst_id:'lpu' }).then(r => { if(r.data.discussions?.length) setPosts(r.data.discussions); }).catch(() => {});
  }, []);

  const filtered = filter === 'All' ? posts : posts.filter(p => p.category === filter);

  const vote = async (id, delta) => {
    setVotes(v => ({ ...v, [id]: (v[id]||0)+delta }));
    try { await discussionAPI.vote(id, delta); } catch {}
  };

  const postNew = async () => {
    if (!newPost.trim()) return;
    try {
      const res = await discussionAPI.post({ title:newPost.trim(), inst_id:'lpu', category:'General' });
      setPosts(p => [{ ...res.data.discussion, votes:1, comments:0, users:{name:'You'} }, ...p]);
    } catch {
      setPosts(p => [{ id:Date.now(), title:newPost.trim(), votes:1, comments:0, category:'General', created_at:new Date().toISOString(), users:{name:'You'} }, ...p]);
    }
    setNewPost('');
    showToast('Discussion posted!');
  };

  return (
    <div className="max-w-3xl mx-auto px-5 py-7">
      <button className="text-sm text-white/40 mb-5 hover:text-white transition-colors" onClick={() => navigate('/dashboard')}>← Back</button>
      <h1 className="font-display text-3xl font-extrabold tracking-tight mb-1">💬 Discussion Forums</h1>
      <p className="text-sm text-white/40 mb-6">Ask questions, share knowledge, get answers</p>
      <div className="flex gap-2 mb-5">
        <input className="flex-1 bg-bg-2 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/25 outline-none focus:border-brand/50 transition-all"
          placeholder="Start a new discussion…" value={newPost} onChange={e => setNewPost(e.target.value)} onKeyDown={e => e.key === 'Enter' && postNew()} />
        <button onClick={postNew} className="bg-brand text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-brand-2 transition-all">Post</button>
      </div>
      <div className="flex gap-2 flex-wrap mb-5">
        {CATS.map(c => (
          <button key={c} onClick={() => setFilter(c)} className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all ${filter===c?'bg-brand border-brand text-white':'bg-bg-3 border-white/10 text-white/50 hover:text-white'}`}>{c}</button>
        ))}
      </div>
      <div className="flex flex-col gap-2">
        {filtered.map(p => (
          <div key={p.id} className="bg-bg-2 border border-white/[0.06] rounded-xl px-4 py-4 flex gap-4 hover:bg-bg-3 hover:border-white/10 transition-all cursor-pointer">
            <div className="flex flex-col items-center gap-1 shrink-0 min-w-[40px]">
              <button onClick={() => vote(p.id, 1)} className="text-white/30 hover:text-brand text-sm transition-colors">▲</button>
              <span className="text-sm font-semibold">{(p.votes||0)+(votes[p.id]||0)}</span>
              <button onClick={() => vote(p.id, -1)} className="text-white/30 hover:text-blue-400 text-sm transition-colors">▼</button>
            </div>
            <div className="flex-1 min-w-0">
              {p.pinned && <div className="flex items-center gap-1 text-yellow-400 text-xs mb-1.5">📌 Pinned</div>}
              <div className="text-sm font-medium mb-2 leading-snug">{p.title}</div>
              <div className="flex gap-3 text-xs text-white/30 flex-wrap">
                <span>💬 {p.comments}</span>
                <span>🏷 {p.category}</span>
                <span>⏰ {timeAgo(p.created_at)}</span>
                <span>by {p.users?.name || 'Anonymous'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
