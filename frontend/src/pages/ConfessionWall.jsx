import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { confessionAPI } from '../lib/api';
import { useUIStore } from '../store';

const STATIC = [
  { id:1, emoji:'😅', created_at: new Date(Date.now()-7200000).toISOString(), text:"I've been paying mess fees but eating from Chole Bhature King at gate 2 everyday for 3 months. No regrets. The mess is undefeated at being inedible.", hearts:234, laughs:89 },
  { id:2, emoji:'🤣', created_at: new Date(Date.now()-18000000).toISOString(), text:"My professor asked 'who can explain this algorithm?' and I said 'sir network problem' from 2 rows away in an offline class. We both knew. Legendary.", hearts:456, laughs:201 },
  { id:3, emoji:'💙', created_at: new Date(Date.now()-86400000).toISOString(), text:"The library 4th floor at 7 AM is the most peaceful place on campus. Zero people. Perfect silence. Found my study spot. Please nobody ruin this.", hearts:312, laughs:45 },
  { id:4, emoji:'😭', created_at: new Date(Date.now()-86400000).toISOString(), text:"Scored 9.2 CGPA last semester and my relatives still asked when I'm getting a government job. I'm in BTech CSE. This is fine.", hearts:891, laughs:334 },
  { id:5, emoji:'🙂', created_at: new Date(Date.now()-172800000).toISOString(), text:"Shoutout to the canteen uncle at Block 34 who always gives extra dal without asking. You deserve a raise and a statue on campus.", hearts:567, laughs:178 },
];

const timeAgo = (iso) => {
  const diff = Date.now() - new Date(iso).getTime();
  if (diff < 3600000) return `${Math.floor(diff/60000)}m ago`;
  if (diff < 86400000) return `${Math.floor(diff/3600000)}h ago`;
  return `${Math.floor(diff/86400000)}d ago`;
};

export default function ConfessionWall() {
  const navigate = useNavigate();
  const { showToast } = useUIStore();
  const [confessions, setConfessions] = useState(STATIC);
  const [text, setText] = useState('');
  const [posting, setPosting] = useState(false);
  const [liked, setLiked] = useState({});

  useEffect(() => {
    confessionAPI.getAll('lpu').then(r => { if (r.data.confessions?.length) setConfessions(r.data.confessions); }).catch(() => {});
  }, []);

  const post = async () => {
    if (!text.trim()) return;
    setPosting(true);
    try {
      const res = await confessionAPI.post(text.trim());
      setConfessions(c => [{ ...res.data.confession, emoji:'🙈', hearts:0, laughs:0 }, ...c]);
    } catch {
      setConfessions(c => [{ id:Date.now(), emoji:'🙈', created_at:new Date().toISOString(), text:text.trim(), hearts:0, laughs:0 }, ...c]);
    }
    setText('');
    setPosting(false);
    showToast('Posted anonymously! 🔒');
  };

  const react = (id, type) => {
    setLiked(l => ({ ...l, [`${id}-${type}`]: !l[`${id}-${type}`] }));
    setConfessions(cs => cs.map(c => c.id === id ? { ...c, [type]: c[type] + (liked[`${id}-${type}`] ? -1 : 1) } : c));
  };

  return (
    <div className="max-w-2xl mx-auto px-5 py-7">
      <button className="text-sm text-white/40 mb-5 hover:text-white transition-colors" onClick={() => navigate('/dashboard')}>← Back</button>
      <h1 className="font-display text-3xl font-extrabold tracking-tight mb-1">💭 Confession Wall</h1>
      <p className="text-sm text-white/40 mb-6">Anonymous confessions from LPU students · Your identity is always hidden</p>

      <div className="bg-bg-2 border border-white/[0.06] rounded-2xl p-5 mb-6">
        <div className="flex items-center gap-2 text-xs text-white/30 mb-3">🔒 Post anonymously — no one will know it's you</div>
        <textarea className="w-full bg-bg-3 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 outline-none focus:border-brand/50 transition-all resize-none h-24"
          placeholder="What's on your mind? Share freely…" value={text} onChange={e => setText(e.target.value)} />
        <div className="flex justify-end mt-3">
          <button onClick={post} disabled={posting || !text.trim()}
            className="bg-brand text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-brand-2 transition-all disabled:opacity-40">
            {posting ? 'Posting…' : 'Post Anonymously'}
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {confessions.map(c => (
          <div key={c.id} className="bg-bg-2 border border-white/[0.06] rounded-2xl p-5 hover:border-white/10 transition-colors">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-9 h-9 bg-bg-4 border border-white/[0.06] rounded-full flex items-center justify-center text-base">{c.emoji || '🙈'}</div>
              <div>
                <div className="text-sm font-medium">Anonymous LPU Student</div>
                <div className="text-xs text-white/30">{timeAgo(c.created_at)}</div>
              </div>
            </div>
            <p className="text-sm text-white/60 leading-relaxed mb-4">{c.text}</p>
            <div className="flex gap-2">
              {[['hearts','❤️'],['laughs','😂']].map(([type, emoji]) => (
                <button key={type} onClick={() => react(c.id, type)}
                  className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border transition-all ${liked[`${c.id}-${type}`] ? 'bg-brand/10 border-brand/25 text-brand' : 'bg-bg-3 border-white/[0.06] text-white/40 hover:text-white'}`}>
                  {emoji} {c[type]}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
