import { useNavigate } from 'react-router-dom';
import { useUIStore } from '../store';

const DAYS = ['Mon','Tue','Wed','Thu','Fri','Sat'];
const SLOTS = ['8–9','9–10','10–11','11–12','12–1','2–3','3–4'];
const TT = {
  Mon:[{sub:'Maths I',room:'B32-101',color:'#3B82F6'},{sub:'',room:''},{sub:'Prog Lab',room:'B37-L2',color:'#22C55E'},{sub:'Prog Lab',room:'B37-L2',color:'#22C55E'},{sub:'',room:''},{sub:'Physics',room:'B32-201',color:'#F59E0B'},{sub:'',room:''}],
  Tue:[{sub:'',room:''},{sub:'Programming',room:'B38-102',color:'#EF4444'},{sub:'',room:''},{sub:'Maths I',room:'B32-101',color:'#3B82F6'},{sub:'',room:''},{sub:'DLD',room:'B34-301',color:'#A855F7'},{sub:'DLD Lab',room:'B37-L3',color:'#A855F7'}],
  Wed:[{sub:'Physics',room:'B32-201',color:'#F59E0B'},{sub:'',room:''},{sub:'Programming',room:'B38-102',color:'#EF4444'},{sub:'',room:''},{sub:'',room:''},{sub:'Maths I',room:'B32-101',color:'#3B82F6'},{sub:'',room:''}],
  Thu:[{sub:'DLD',room:'B34-301',color:'#A855F7'},{sub:'',room:''},{sub:'',room:''},{sub:'Physics Lab',room:'B36-L1',color:'#F59E0B'},{sub:'Physics Lab',room:'B36-L1',color:'#F59E0B'},{sub:'Programming',room:'B38-102',color:'#EF4444'},{sub:'',room:''}],
  Fri:[{sub:'Maths I',room:'B32-101',color:'#3B82F6'},{sub:'DLD',room:'B34-301',color:'#A855F7'},{sub:'',room:''},{sub:'',room:''},{sub:'',room:''},{sub:'',room:''},{sub:'',room:''}],
  Sat:[{sub:'',room:''},{sub:'Club Activity',room:'Block 37',color:'#FF4500'},{sub:'',room:''},{sub:'',room:''},{sub:'',room:''},{sub:'',room:''},{sub:'',room:''}],
};
const dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const todayKey = dayNames[new Date().getDay()];

export default function Timetable() {
  const navigate = useNavigate();
  const { showToast } = useUIStore();
  const todayClasses = (TT[todayKey] || []).filter(s => s.sub);

  return (
    <div className="max-w-5xl mx-auto px-5 py-7">
      <button className="text-sm text-white/40 mb-5 hover:text-white transition-colors" onClick={() => navigate('/dashboard')}>← Back</button>
      <h1 className="font-display text-3xl font-extrabold tracking-tight mb-1">📅 My Timetable</h1>
      <p className="text-sm text-white/40 mb-6">Your class schedule at a glance</p>

      {/* Today's classes */}
      <div className="bg-bg-2 border border-white/[0.06] rounded-2xl p-4 mb-6 flex items-center gap-4 flex-wrap">
        <span className="text-sm font-semibold shrink-0">Today ({todayKey || 'Sun'}):</span>
        {todayClasses.length > 0
          ? todayClasses.map((s, i) => (
            <span key={i} style={{ background: s.color+'18', color: s.color, borderColor: s.color+'30' }}
              className="text-xs font-medium px-3 py-1 rounded-full border">{s.sub}</span>
          ))
          : <span className="text-sm text-white/30">No classes today 🎉</span>
        }
      </div>

      {/* Timetable grid */}
      <div className="overflow-x-auto">
        <div className="min-w-[600px]">
          {/* Header */}
          <div className="grid gap-1 mb-1" style={{ gridTemplateColumns: '64px repeat(6, 1fr)' }}>
            <div />
            {DAYS.map(d => (
              <div key={d} className={`text-center text-xs font-semibold py-2 rounded-lg ${d === todayKey ? 'bg-brand/15 text-brand' : 'text-white/30'}`}>{d}</div>
            ))}
          </div>
          {/* Slots */}
          {SLOTS.map((slot, si) => (
            <div key={slot} className="grid gap-1 mb-1" style={{ gridTemplateColumns: '64px repeat(6, 1fr)' }}>
              <div className="text-[10px] text-white/25 flex items-center justify-center">{slot}</div>
              {DAYS.map(day => {
                const s = TT[day]?.[si];
                return s?.sub ? (
                  <div key={day}
                    onClick={() => showToast(`${s.sub} — ${s.room}`)}
                    style={{ background: s.color+'14', borderColor: s.color+'30' }}
                    className="rounded-xl border p-2 cursor-pointer hover:opacity-80 transition-opacity min-h-[52px] flex flex-col justify-center items-center text-center">
                    <div style={{ color: s.color }} className="text-[10px] font-bold leading-tight">{s.sub}</div>
                    <div className="text-[9px] text-white/30 mt-0.5">{s.room}</div>
                  </div>
                ) : (
                  <div key={day} className="rounded-xl border border-white/[0.04] min-h-[52px] bg-bg-2" />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
