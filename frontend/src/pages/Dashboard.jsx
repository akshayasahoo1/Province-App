// ============================================
// PAGE: Dashboard
// ============================================
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { announcementAPI } from '../lib/api';
import { useAuthStore } from '../store';

const MODULES = [
  { path: '/restaurants', icon: '🍽️', name: 'Food & Restaurants', sub: 'Order · Menu · Delivery', badge: 'hot' },
  { path: '/academics',   icon: '📚', name: 'Academics',          sub: 'Syllabus · PYQs · Videos', badge: 'new' },
  { path: '/faq',         icon: '❓', name: 'FAQ & Info',         sub: 'Exams · Grades · Policies' },
  { path: '/pg',          icon: '🏠', name: 'PG & Rooms',         sub: 'Phagwara · Law Gate' },
  { path: '/clubs',       icon: '🎮', name: 'Clubs & Community',  sub: 'CP · Gaming · Sports', badge: 'live' },
  { path: '/confession',  icon: '💭', name: 'Confession Wall',    sub: 'Anonymous · Campus tea' },
  { path: '/discussion',  icon: '💬', name: 'Discussions',        sub: 'Ask · Help · Debate' },
  { path: '/mocktest',    icon: '📝', name: 'Mock Tests',         sub: 'Practice · Analyze', badge: 'new' },
  { path: '/cgpa',        icon: '📊', name: 'CGPA Calculator',    sub: 'Instant · Accurate' },
  { path: '/timetable',   icon: '📅', name: 'Timetable',          sub: 'My class schedule' },
  { path: '/lostfound',   icon: '🔍', name: 'Lost & Found',       sub: 'Report · Claim' },
  { path: '/map',         icon: '🗺️', name: 'Campus Map',         sub: 'Blocks · Shops · ATMs' },
  { path: '/vendors',     icon: '🛍️', name: 'Campus Vendors',     sub: 'Shops · Services' },
  { path: '/feedback',    icon: '📢', name: 'Feedback & Issues',  sub: 'Report · Suggest' },
  { path: '/chat',        icon: '🔥', name: 'Live Chat',          sub: 'Campus community', badge: 'live' },
];

const QUICK = [
  { icon: '🍛', bg: 'bg-brand/10', title: 'Order Food', sub: 'Outlets open now →', path: '/restaurants' },
  { icon: '📊', bg: 'bg-green-500/10', title: 'CGPA Calculator', sub: 'Calculate instantly →', path: '/cgpa' },
  { icon: '🔍', bg: 'bg-yellow-500/10', title: 'Lost & Found', sub: 'Report · Claim →', path: '/lostfound' },
  { icon: '📅', bg: 'bg-red-500/10', title: 'My Timetable', sub: "Today's classes →", path: '/timetable' },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, institution } = useAuthStore();
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    announcementAPI.getAll(institution).then(r => setAnnouncements(r.data.announcements || [])).catch(() => {});
  }, [institution]);

  const tickerText = announcements.map(a => a.text).join('   ·   ') || 'Loading campus updates…';

  return (
    <div className="max-w-5xl mx-auto px-5 py-7">
      {/* Ticker */}
      <div className="flex items-center gap-3 bg-bg-2 border border-white/[0.06] rounded-xl px-4 py-3 mb-7 overflow-hidden">
        <span className="text-[10px] font-bold uppercase tracking-widest text-brand bg-brand/10 border border-brand/20 px-2.5 py-1 rounded-full shrink-0">📢 Live</span>
        <span className="text-xs text-white/40 whitespace-nowrap animate-ticker">{tickerText}</span>
      </div>

      {/* Welcome */}
      <div className="flex items-start justify-between mb-8 flex-wrap gap-4">
        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight mb-1">
            Hey, <span className="text-brand">{user?.name?.split(' ')[0] || 'Student'}</span> 👋
          </h1>
          <p className="text-sm text-white/40">LPU Campus · {new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
        </div>
        <div className="hidden sm:flex gap-2">
          {[['30K+','Students'],['20+','Outlets'],['400+','Courses']].map(([n,l]) => (
            <div key={l} className="bg-bg-3 border border-white/[0.06] rounded-xl px-4 py-3 text-center min-w-[72px]">
              <div className="font-display text-xl font-black text-brand leading-none">{n}</div>
              <div className="text-[11px] text-white/30 mt-0.5">{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Modules */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-display text-base font-bold">Explore</h2>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2.5 mb-8">
        {MODULES.map((m) => (
          <div key={m.path} onClick={() => navigate(m.path)}
            className="relative bg-bg-2 border border-white/[0.06] rounded-2xl p-4 cursor-pointer transition-all hover:border-white/10 hover:-translate-y-0.5 group">
            {m.badge && (
              <span className={`absolute top-2 right-2 text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-full ${
                m.badge === 'hot' ? 'bg-brand/10 text-brand border border-brand/20' :
                m.badge === 'new' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                'bg-blue-500/10 text-blue-400 border border-blue-500/20'}`}>
                {m.badge}
              </span>
            )}
            <div className="text-2xl mb-2.5 group-hover:scale-110 transition-transform">{m.icon}</div>
            <div className="text-[13px] font-medium leading-tight">{m.name}</div>
            <div className="text-[11px] text-white/30 mt-0.5">{m.sub}</div>
          </div>
        ))}
      </div>

      {/* Quick access */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-display text-base font-bold">Quick Access</h2>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {QUICK.map((q) => (
          <div key={q.path} onClick={() => navigate(q.path)}
            className="bg-bg-2 border border-white/[0.06] rounded-2xl p-4 cursor-pointer transition-all hover:border-white/10 hover:-translate-y-0.5 flex items-center gap-3">
            <div className={`w-10 h-10 ${q.bg} rounded-xl flex items-center justify-center text-xl shrink-0`}>{q.icon}</div>
            <div>
              <div className="text-[13px] font-medium">{q.title}</div>
              <div className="text-[11px] text-white/30">{q.sub}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
