import { useNavigate } from 'react-router-dom';
const LOCS = [
  { icon:'🏥', bg:'bg-red-500/10', name:'LPU Hospital', sub:'Block 17 · Emergency 24x7' },
  { icon:'🏧', bg:'bg-blue-500/10', name:'ATMs on Campus', sub:'SBI, PNB, HDFC — 5 locations' },
  { icon:'📚', bg:'bg-purple-500/10', name:'Central Library', sub:'Block 37 · 7 AM – 11 PM' },
  { icon:'🏃', bg:'bg-green-500/10', name:'Sports Complex', sub:'Block 1 · Football, Cricket, Gym' },
  { icon:'📦', bg:'bg-yellow-500/10', name:'Post Office', sub:'Block 32, Ground Floor' },
  { icon:'🚌', bg:'bg-brand/10', name:'Bus Stand', sub:'Main Gate · Connects Phagwara' },
  { icon:'🍽️', bg:'bg-orange-500/10', name:'Food Court', sub:'Block 34 & 38 · 8 AM – 10 PM' },
  { icon:'💊', bg:'bg-pink-500/10', name:'Medical Store', sub:'Block 17 · 24x7' },
];
export default function CampusMap() {
  const navigate = useNavigate();
  return (
    <div className="max-w-4xl mx-auto px-5 py-7">
      <button className="text-sm text-white/40 mb-5 hover:text-white transition-colors" onClick={() => navigate('/dashboard')}>← Back</button>
      <h1 className="font-display text-3xl font-extrabold tracking-tight mb-1">🗺️ LPU Campus Map</h1>
      <p className="text-sm text-white/40 mb-6">Buildings, blocks, ATMs, hospitals, labs, hostels & more</p>
      <div className="bg-bg-2 border border-white/[0.06] rounded-2xl h-80 mb-6 flex flex-col items-center justify-center gap-4 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage:'linear-gradient(rgba(255,255,255,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.05) 1px,transparent 1px)', backgroundSize:'40px 40px' }} />
        <div className="relative z-10 text-center">
          <div className="text-5xl mb-3">🗺️</div>
          <div className="font-display text-lg font-bold mb-2">Interactive Campus Map</div>
          <p className="text-sm text-white/35 max-w-xs mx-auto mb-4">Google Maps integration with LPU overlays — coming in Phase 2</p>
          <button onClick={() => window.open('https://maps.google.com/?q=Lovely+Professional+University+Phagwara')}
            className="bg-brand text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-brand-2 transition-all">
            Open in Google Maps ↗
          </button>
        </div>
      </div>
      <h2 className="font-display text-base font-bold mb-4">Key Locations</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {LOCS.map(l => (
          <div key={l.name} className="bg-bg-2 border border-white/[0.06] rounded-xl p-4 flex items-center gap-3">
            <div className={`w-10 h-10 ${l.bg} rounded-xl flex items-center justify-center text-xl shrink-0`}>{l.icon}</div>
            <div><div className="text-[13px] font-medium">{l.name}</div><div className="text-[11px] text-white/30">{l.sub}</div></div>
          </div>
        ))}
      </div>
    </div>
  );
}
