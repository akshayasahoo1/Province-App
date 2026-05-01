// ============================================
// ProvinceApp — Layout (Nav + Bottom Nav)
// ============================================
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useAuthStore, useCartStore } from '../store';
import { restaurantAPI, pgAPI, clubsAPI } from '../lib/api';

export default function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, institution, logout } = useAuthStore();
  const cartCount = useCartStore((s) => s.count());
  const [search, setSearch] = useState('');
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);

  const handleSearch = (val) => {
    setSearch(val);
    if (!val.trim()) { setResults([]); setShowResults(false); return; }
    // Static quick results — in Phase 3 use full-text search API
    const quickRoutes = [
      { label: 'Restaurants', icon: '🍽️', path: '/restaurants' },
      { label: 'Academics & Syllabus', icon: '📚', path: '/academics' },
      { label: 'PG & Rooms', icon: '🏠', path: '/pg' },
      { label: 'Clubs', icon: '🎮', path: '/clubs' },
      { label: 'CGPA Calculator', icon: '📊', path: '/cgpa' },
      { label: 'Lost & Found', icon: '🔍', path: '/lostfound' },
      { label: 'Mock Tests', icon: '📝', path: '/mocktest' },
      { label: 'FAQ & Info', icon: '❓', path: '/faq' },
      { label: 'Confession Wall', icon: '💭', path: '/confession' },
      { label: 'Discussion Forum', icon: '💬', path: '/discussion' },
      { label: 'Campus Map', icon: '🗺️', path: '/map' },
      { label: 'Live Chat', icon: '🔥', path: '/chat' },
      { label: 'Timetable', icon: '📅', path: '/timetable' },
    ].filter(r => r.label.toLowerCase().includes(val.toLowerCase()));
    setResults(quickRoutes.slice(0, 5));
    setShowResults(true);
  };

  const navItems = [
    { path: '/dashboard', icon: '🏠', label: 'Home' },
    { path: '/restaurants', icon: '🍽️', label: 'Food' },
    { path: '/academics', icon: '📚', label: 'Study' },
    { path: '/clubs', icon: '🎮', label: 'Clubs' },
    { path: '/chat', icon: '💬', label: 'Chat' },
  ];

  return (
    <div className="min-h-screen bg-bg">
      {/* TOP NAV */}
      <nav className="sticky top-0 z-50 h-[58px] flex items-center px-5 gap-4 bg-bg/80 backdrop-blur-2xl border-b border-white/[0.055]">
        {/* Logo */}
        <div className="flex items-center gap-2 cursor-pointer shrink-0" onClick={() => navigate('/dashboard')}>
          <div className="w-7 h-7 bg-brand rounded-lg flex items-center justify-center text-sm font-black text-white">P</div>
          <span className="font-display font-extrabold text-lg tracking-tight">Province</span>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-sm relative hidden sm:block">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30 text-sm">🔍</span>
          <input
            className="w-full bg-bg-3 border border-white/10 rounded-full pl-9 pr-4 py-2 text-sm text-white placeholder-white/30 outline-none focus:border-brand/50 transition-all"
            placeholder="Search anything…"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            onFocus={() => search && setShowResults(true)}
            onBlur={() => setTimeout(() => setShowResults(false), 200)}
          />
          {showResults && results.length > 0 && (
            <div className="absolute top-full mt-2 left-0 right-0 bg-bg-3 border border-white/10 rounded-2xl overflow-hidden shadow-2xl z-50">
              {results.map((r) => (
                <div key={r.path} className="flex items-center gap-3 px-4 py-3 hover:bg-bg-4 cursor-pointer text-sm transition-colors"
                  onClick={() => { navigate(r.path); setSearch(''); setShowResults(false); }}>
                  <span>{r.icon}</span><span>{r.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 ml-auto">
          {/* Institution chip */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-white/40 bg-bg-3 border border-white/[0.09] rounded-full px-3 py-1.5">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
            <span>{institution?.toUpperCase()}</span>
          </div>

          {/* Notifications */}
          <button className="relative w-8 h-8 bg-bg-3 border border-white/[0.09] rounded-full flex items-center justify-center text-sm"
            onClick={() => navigate('/notifications')}>
            🔔
            <span className="absolute top-0 right-0 w-2 h-2 bg-brand rounded-full border-2 border-bg"></span>
          </button>

          {/* Cart */}
          {cartCount > 0 && (
            <button className="relative w-8 h-8 bg-brand rounded-full flex items-center justify-center text-sm"
              onClick={() => navigate('/restaurants')}>
              🛒
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-white text-brand text-[10px] font-bold rounded-full flex items-center justify-center">{cartCount}</span>
            </button>
          )}

          {/* Avatar */}
          <div className="w-8 h-8 bg-gradient-to-br from-brand to-brand-2 rounded-full flex items-center justify-center text-sm font-bold text-white cursor-pointer"
            onClick={() => navigate(user ? '/profile' : '/login')}>
            {user ? user.name?.charAt(0).toUpperCase() : 'G'}
          </div>
        </div>
      </nav>

      {/* PAGE CONTENT */}
      <main className="pb-20">
        <Outlet />
      </main>

      {/* BOTTOM NAV */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-bg/90 backdrop-blur-2xl border-t border-white/[0.055] flex justify-around px-2 py-2 pb-safe">
        {navItems.map((item) => {
          const active = location.pathname.startsWith(item.path);
          return (
            <button key={item.path} onClick={() => navigate(item.path)}
              className={`flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-colors ${active ? 'text-brand' : 'text-white/30 hover:text-white/60'}`}>
              <span className="text-xl">{item.icon}</span>
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
