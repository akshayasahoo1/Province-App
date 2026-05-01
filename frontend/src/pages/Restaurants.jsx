// ============================================
// PAGE: Restaurants
// ============================================
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { restaurantAPI } from '../lib/api';
import { useAuthStore } from '../store';

const FILTERS = [
  { label: 'All', value: 'all' },
  { label: 'Open Now', value: 'open' },
  { label: 'Veg Only', value: 'veg' },
  { label: 'Delivery', value: 'delivery' },
];

// Fallback static data when API not connected yet
const STATIC = [
  { id:'punjabi-dhaba', name:'Punjabi Dhaba', tagline:'Real Punjabi food, real fast', emoji:'🍛', cover_color:'#1C0A00', rating:4.3, rating_count:892, time:'15–25 min', open:true, delivery:true, veg:false, location:'Block 34, Ground Floor' },
  { id:'pizza-point', name:'Pizza Point', tagline:'Crispy, cheesy, no excuses', emoji:'🍕', cover_color:'#120018', rating:4.1, rating_count:534, time:'20–35 min', open:true, delivery:true, veg:false, location:'Main Market, Block 38' },
  { id:'south-bites', name:'South Bites', tagline:'Authentic south, every bite', emoji:'🥞', cover_color:'#00130A', rating:4.5, rating_count:1243, time:'10–20 min', open:true, delivery:true, veg:true, location:'Block 32 Food Court' },
  { id:'campus-cafe', name:'Campus Café', tagline:'Fuel for your next all-nighter', emoji:'☕', cover_color:'#100800', rating:4.2, rating_count:678, time:'5–10 min', open:true, delivery:false, veg:true, location:'Library Block, Ground Floor' },
  { id:'chole-king', name:'Chole Bhature King', tagline:'Gate 2 legend since 2009', emoji:'🫓', cover_color:'#0F0800', rating:4.7, rating_count:2341, time:'5–15 min', open:true, delivery:false, veg:true, location:'Law Gate, Opp. Gate 2' },
  { id:'burger-barn', name:'Burger Barn', tagline:'Fast, filling, under ₹150', emoji:'🍔', cover_color:'#001215', rating:3.9, rating_count:312, time:'15–30 min', open:false, delivery:true, veg:false, location:'Student Activity Centre' },
];

export default function Restaurants() {
  const navigate = useNavigate();
  const { institution } = useAuthStore();
  const [restaurants, setRestaurants] = useState(STATIC);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    restaurantAPI.getAll({ inst_id: institution })
      .then(r => { if (r.data.restaurants?.length) setRestaurants(r.data.restaurants); })
      .catch(() => {}) // falls back to STATIC
      .finally(() => setLoading(false));
  }, [institution]);

  const filtered = restaurants.filter(r => {
    if (filter === 'open') return r.open;
    if (filter === 'veg') return r.veg;
    if (filter === 'delivery') return r.delivery;
    return true;
  });

  return (
    <div className="max-w-5xl mx-auto px-5 py-7">
      <button className="text-sm text-white/40 mb-5 hover:text-white transition-colors flex items-center gap-1.5"
        onClick={() => navigate('/dashboard')}>← Back</button>

      <h1 className="font-display text-3xl font-extrabold tracking-tight mb-1">🍽️ Food & Restaurants</h1>
      <p className="text-sm text-white/40 mb-6">20+ outlets across LPU campus · Order or walk-in</p>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap mb-6">
        {FILTERS.map(f => (
          <button key={f.value} onClick={() => setFilter(f.value)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all ${
              filter === f.value
                ? 'bg-brand border-brand text-white'
                : 'bg-bg-3 border-white/10 text-white/50 hover:text-white'}`}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(r => (
          <div key={r.id} onClick={() => navigate(`/restaurants/${r.id}`)}
            className="bg-bg-2 border border-white/[0.06] rounded-2xl overflow-hidden cursor-pointer transition-all hover:border-white/10 hover:-translate-y-1 hover:shadow-xl">
            {/* Cover */}
            <div className="h-36 flex items-center justify-center relative" style={{ background: r.cover_color || '#111' }}>
              <span style={{ fontSize: 70 }}>{r.emoji}</span>
              <div className="absolute top-3 left-3 flex gap-2">
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${r.open ? 'bg-green-500/15 text-green-400' : 'bg-red-500/15 text-red-400'}`}>
                  ● {r.open ? 'Open' : 'Closed'}
                </span>
              </div>
              {r.delivery && (
                <span className="absolute top-3 right-3 text-[10px] bg-black/40 text-white/60 px-2 py-0.5 rounded-full">🛵 Delivery</span>
              )}
            </div>
            {/* Info */}
            <div className="p-4">
              <div className="font-display text-base font-bold mb-0.5">{r.name}</div>
              <div className="text-xs text-white/35 mb-2.5">{r.tagline}</div>
              <div className="flex items-center gap-3 text-xs text-white/35">
                <span className="text-yellow-400 font-semibold">★ {r.rating}</span>
                <span>({r.rating_count})</span>
                <span>⏱ {r.time || '15–25 min'}</span>
              </div>
              <div className="text-xs text-white/25 mt-1">📍 {r.location}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
