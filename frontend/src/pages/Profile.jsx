import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store';
import { useUIStore } from '../store';
const MENU = [
  ['📚','Saved Notes','8 items','/academics'],
  ['📝','Mock Test History','12 tests','/mocktest'],
  ['🏠','Saved PG Listings','3 saved','/pg'],
  ['📅','My Timetable','','/timetable'],
  ['📊','CGPA Calculator','','/cgpa'],
  ['🔔','Notification Settings','','/notifications'],
  ['🚪','Sign Out','',null],
];
export default function Profile() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { showToast } = useUIStore();
  const handleMenu = (path) => {
    if (!path) { logout(); navigate('/'); showToast('Signed out'); return; }
    navigate(path);
  };
  return (
    <div className="max-w-lg mx-auto px-5 py-7">
      <button className="text-sm text-white/40 mb-5 hover:text-white transition-colors" onClick={() => navigate('/dashboard')}>← Back</button>
      <div className="text-center py-7">
        <div className="w-18 h-18 bg-gradient-to-br from-brand to-brand-2 rounded-full flex items-center justify-center text-3xl font-black text-white mx-auto mb-4" style={{width:72,height:72}}>
          {user?.name?.charAt(0)?.toUpperCase() || 'G'}
        </div>
        <div className="font-display text-xl font-extrabold mb-1">{user?.name || 'Guest User'}</div>
        <div className="text-sm text-white/35">LPU · {user?.course?.toUpperCase() || 'BTech CSE'} · Year {user?.year || 3}</div>
      </div>
      <div className="flex gap-2 mb-6">
        {[['8.2','CGPA'],['87%','Attendance'],['Sem 6','Current']].map(([n,l]) => (
          <div key={l} className="flex-1 bg-bg-2 border border-white/[0.06] rounded-xl py-3 text-center">
            <div className="font-display text-xl font-black text-brand">{n}</div>
            <div className="text-[11px] text-white/30 mt-0.5">{l}</div>
          </div>
        ))}
      </div>
      <div className="bg-bg-2 border border-white/[0.06] rounded-2xl overflow-hidden">
        {MENU.map(([icon, label, sub, path]) => (
          <div key={label} onClick={() => handleMenu(path)}
            className="flex items-center gap-3 px-4 py-4 border-b border-white/[0.05] last:border-0 cursor-pointer hover:bg-bg-3 transition-colors">
            <span className="text-lg">{icon}</span>
            <div className="flex-1">
              <div className="text-sm font-medium">{label}</div>
              {sub && <div className="text-xs text-white/30">{sub}</div>}
            </div>
            <span className="text-white/20 text-sm">›</span>
          </div>
        ))}
      </div>
    </div>
  );
}
