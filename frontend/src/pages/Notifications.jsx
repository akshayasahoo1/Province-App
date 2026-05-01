import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const NOTIFS = [
  { id:1, icon:'📢', title:'Mid-term exam schedule released', body:'Check UMS for exact dates. Exams start Nov 18.', time:'2h ago', unread:true },
  { id:2, icon:'🎓', title:'HCL Technologies campus drive', body:'Placement cell: HCL visiting Dec 2nd. Register by Nov 28.', time:'5h ago', unread:true },
  { id:3, icon:'📚', title:'New PYQs uploaded', body:'End-term 2024 papers for CSE Sem 5 are now available.', time:'2 days ago', unread:false },
  { id:4, icon:'🏠', title:'Hostel fee deadline', body:'Semester 2 hostel fee due Dec 15. Avoid ₹500/day penalty.', time:'3 days ago', unread:false },
  { id:5, icon:'🎮', title:'Province CodeForces Contest', body:'Weekly CP contest starts Saturday 8 PM. Register now!', time:'4 days ago', unread:false },
];
export default function Notifications() {
  const navigate = useNavigate();
  const [read, setRead] = useState({});
  return (
    <div className="max-w-xl mx-auto px-5 py-7">
      <button className="text-sm text-white/40 mb-5 hover:text-white transition-colors" onClick={() => navigate('/dashboard')}>← Back</button>
      <h1 className="font-display text-3xl font-extrabold tracking-tight mb-1">🔔 Notifications</h1>
      <p className="text-sm text-white/40 mb-6">Campus alerts, academic updates & activity</p>
      <div className="flex flex-col gap-2">
        {NOTIFS.map(n => (
          <div key={n.id} onClick={() => setRead(r => ({ ...r, [n.id]:true }))}
            className={`flex gap-3 p-4 rounded-2xl border cursor-pointer transition-all hover:bg-bg-3 ${n.unread && !read[n.id] ? 'bg-brand/[0.03] border-brand/20' : 'bg-bg-2 border-white/[0.06]'}`}>
            <span className="text-2xl shrink-0">{n.icon}</span>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium mb-0.5">{n.title}</div>
              <div className="text-xs text-white/40 leading-relaxed">{n.body}</div>
              <div className="text-xs text-white/20 mt-1.5">{n.time}</div>
            </div>
            {n.unread && !read[n.id] && <div className="w-2 h-2 bg-brand rounded-full shrink-0 mt-1" />}
          </div>
        ))}
      </div>
    </div>
  );
}
