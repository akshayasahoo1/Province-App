import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { pgAPI } from '../lib/api';
import { useUIStore } from '../store';

const STATIC = [
  { id:'p1', name:'Sunrise Boys PG', type:'boys', location:'Law Gate, Phagwara', distance:'500m from Main Gate', price:5500, amenities:['WiFi','Meals (3x)','Laundry','24x7 Security','Hot Water'], verified:true, rating:4.2 },
  { id:'p2', name:'Green Valley Girls Hostel', type:'girls', location:'Near Block 32 Gate', distance:'800m from campus', price:7000, amenities:['WiFi','AC Room','Meals (3x)','Lady Security','Study Room'], verified:true, rating:4.5 },
  { id:'p3', name:'Shubham Residency', type:'coed', location:'Phagwara City Centre', distance:'2km from LPU', price:4200, amenities:['WiFi','Shared Kitchen','Common Room','RO Water'], verified:false, rating:3.8 },
  { id:'p4', name:'LPU Official Boys Hostel', type:'boys', location:'On Campus, Block 55', distance:'On campus', price:9500, amenities:['WiFi','Meals (3x)','Gym','Laundry','Medical'], verified:true, rating:4.0 },
  { id:'p5', name:'Metro PG Phagwara', type:'boys', location:'GT Road, Phagwara', distance:'1.2km', price:4800, amenities:['WiFi','Meals (2x)','Laundry'], verified:false, rating:3.9 },
  { id:'p6', name:"Rajan's Girls PG", type:'girls', location:'Near Gate 3', distance:'600m', price:6000, amenities:['WiFi','Meals (2x)','Security','Study Room','CCTV'], verified:true, rating:4.3 },
];

const FILTERS = [{ label:'All', value:'all' },{ label:'Boys', value:'boys' },{ label:'Girls', value:'girls' },{ label:'Co-Ed', value:'coed' },{ label:'Under ₹5K', value:'budget' },{ label:'Verified', value:'verified' }];

export default function PGListings() {
  const navigate = useNavigate();
  const { showToast } = useUIStore();
  const [listings, setListings] = useState(STATIC);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    pgAPI.getAll({ inst_id: 'lpu' }).then(r => { if (r.data.listings?.length) setListings(r.data.listings); }).catch(() => {});
  }, []);

  const filtered = listings.filter(p => {
    if (filter === 'boys') return p.type === 'boys';
    if (filter === 'girls') return p.type === 'girls';
    if (filter === 'coed') return p.type === 'coed';
    if (filter === 'budget') return p.price <= 5000;
    if (filter === 'verified') return p.verified;
    return true;
  });

  return (
    <div className="max-w-4xl mx-auto px-5 py-7">
      <button className="text-sm text-white/40 mb-5 hover:text-white transition-colors" onClick={() => navigate('/dashboard')}>← Back</button>
      <h1 className="font-display text-3xl font-extrabold tracking-tight mb-1">🏠 PG & Rooms Near LPU</h1>
      <p className="text-sm text-white/40 mb-6">Verified listings · Phagwara · Law Gate · Jalandhar</p>
      <div className="flex gap-2 flex-wrap mb-6">
        {FILTERS.map(f => (
          <button key={f.value} onClick={() => setFilter(f.value)}
            className={`px-4 py-1.5 rounded-full text-xs font-medium border transition-all ${filter === f.value ? 'bg-brand border-brand text-white' : 'bg-bg-3 border-white/10 text-white/50 hover:text-white'}`}>
            {f.label}
          </button>
        ))}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(p => (
          <div key={p.id} className="bg-bg-2 border border-white/[0.06] rounded-2xl p-5 hover:border-white/10 hover:-translate-y-0.5 transition-all">
            <div className="flex justify-between items-start mb-2">
              <div className="font-display text-base font-bold">{p.name}</div>
              <div className="text-right"><div className="text-brand font-bold">₹{p.price.toLocaleString()}</div><div className="text-[11px] text-white/30">/month</div></div>
            </div>
            {p.verified && <div className="inline-flex items-center gap-1 text-green-400 text-[11px] bg-green-500/8 px-2 py-0.5 rounded-full mb-2">✓ Verified</div>}
            <div className="text-yellow-400 text-xs font-semibold mb-1">★ {p.rating}</div>
            <div className="text-xs text-white/35 mb-3">📍 {p.location} · {p.distance}</div>
            <div className="flex flex-wrap gap-1 mb-4">
              {p.amenities.map(a => <span key={a} className="text-[11px] px-2 py-0.5 rounded-full bg-bg-4 border border-white/[0.06] text-white/40">{a}</span>)}
            </div>
            <div className="flex gap-2">
              <button onClick={() => showToast('Opening call…')} className="flex-1 bg-brand text-white text-xs font-semibold rounded-xl py-2.5 hover:bg-brand-2 transition-all">📞 Call</button>
              <button onClick={() => showToast('Opening WhatsApp…')} className="flex-1 bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-semibold rounded-xl py-2.5 hover:bg-green-500/20 transition-all">💬 WhatsApp</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
