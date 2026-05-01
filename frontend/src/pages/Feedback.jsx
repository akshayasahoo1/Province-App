import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { feedbackAPI } from '../lib/api';
import { useUIStore } from '../store';
export default function Feedback() {
  const navigate = useNavigate();
  const { showToast } = useUIStore();
  const [form, setForm] = useState({ category:'', title:'', description:'', location:'', anonymous:false });
  const [loading, setLoading] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  const cls = "w-full bg-bg-3 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 outline-none focus:border-brand/50 transition-all";
  const submit = async () => {
    if (!form.category || !form.title) { showToast('Please fill category and title'); return; }
    setLoading(true);
    try {
      await feedbackAPI.submit({ ...form, inst_id:'lpu' });
    } catch {}
    setLoading(false);
    showToast('Feedback submitted! We will escalate to LPU admin ✅');
    setForm({ category:'', title:'', description:'', location:'', anonymous:false });
  };
  return (
    <div className="max-w-xl mx-auto px-5 py-7">
      <button className="text-sm text-white/40 mb-5 hover:text-white transition-colors" onClick={() => navigate('/dashboard')}>← Back</button>
      <h1 className="font-display text-3xl font-extrabold tracking-tight mb-1">📢 Feedback & Issues</h1>
      <p className="text-sm text-white/40 mb-6">Report campus problems or suggest improvements — we escalate to LPU admin</p>
      <div className="flex flex-col gap-4">
        <div><label className="text-xs text-white/30 block mb-1.5">Category *</label>
          <select className={cls} value={form.category} onChange={e => set('category',e.target.value)}>
            <option value="">Select category</option>
            {['Academic Issue','Hostel/PG Problem','Food Quality','Campus Infrastructure','Safety Concern','Wi-Fi / Internet','Faculty Complaint','Mess Quality','Cleanliness','Suggestion'].map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
        <div><label className="text-xs text-white/30 block mb-1.5">Issue Title *</label><input className={cls} placeholder="Short, clear title…" value={form.title} onChange={e => set('title',e.target.value)} /></div>
        <div><label className="text-xs text-white/30 block mb-1.5">Description</label><textarea className={cls} rows={4} placeholder="Describe in detail…" value={form.description} onChange={e => set('description',e.target.value)} /></div>
        <div><label className="text-xs text-white/30 block mb-1.5">Location (optional)</label><input className={cls} placeholder="e.g. Block 34, Canteen" value={form.location} onChange={e => set('location',e.target.value)} /></div>
        <label className="flex items-center gap-2.5 text-sm text-white/50 cursor-pointer">
          <input type="checkbox" checked={form.anonymous} onChange={e => set('anonymous',e.target.checked)} className="accent-brand" /> Submit anonymously
        </label>
        <button onClick={submit} disabled={loading} className="w-full bg-brand text-white font-semibold rounded-xl py-3 text-sm hover:bg-brand-2 transition-all disabled:opacity-50">
          {loading ? 'Submitting…' : 'Submit Feedback →'}
        </button>
      </div>
    </div>
  );
}
