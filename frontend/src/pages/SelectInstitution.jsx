// ============================================
// PAGE: Select Institution
// ============================================
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store';

const INSTITUTIONS = [
  {
    id: 'lpu', label: 'LPU', color: 'text-brand bg-brand/10',
    name: 'Lovely Professional University',
    meta: 'Phagwara, Punjab · Est. 2005 · 30,000+ students',
    tags: ['🍽️ 20+ Outlets','📚 All Courses','🏠 PG/Hostels','🎮 10+ Clubs'],
    live: true,
  },
  {
    id: 'cu', label: 'CU', color: 'text-blue-400 bg-blue-500/10',
    name: 'Chandigarh University',
    meta: 'Mohali, Punjab · Coming Soon',
    tags: ['🔜 Coming Soon'],
    live: false,
  },
];

export default function SelectInstitution() {
  const navigate = useNavigate();
  const { setInstitution } = useAuthStore();

  const select = (inst) => {
    if (!inst.live) return;
    setInstitution(inst.id);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center px-5 py-16 relative overflow-hidden">
      {/* Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-brand/8 rounded-full blur-3xl pointer-events-none" />

      <span className="text-[11px] font-semibold tracking-[2px] uppercase text-brand bg-brand/8 border border-brand/20 rounded-full px-4 py-1.5 mb-8">
        ✦ Campus Intelligence Platform
      </span>

      <h1 className="font-display text-center font-black tracking-tight leading-[0.92] mb-5"
        style={{ fontSize: 'clamp(44px,9vw,88px)', letterSpacing: '-3px' }}>
        Your Campus.<br /><span className="text-brand">Everything.</span>
      </h1>

      <p className="text-center text-white/40 text-base max-w-md mb-12 leading-relaxed font-light">
        Food, academics, housing, community — every student need, one platform. Pick your institution.
      </p>

      <div className="grid gap-4 w-full max-w-2xl" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
        {INSTITUTIONS.map((inst) => (
          <div key={inst.id}
            onClick={() => select(inst)}
            className={`relative bg-bg-2 border border-white/[0.09] rounded-3xl p-7 transition-all duration-300 ${
              inst.live
                ? 'cursor-pointer hover:border-brand/40 hover:-translate-y-1 hover:shadow-[0_12px_40px_rgba(255,69,0,0.1)]'
                : 'opacity-40 cursor-not-allowed'
            }`}>

            {/* Top row */}
            <div className="flex items-start justify-between mb-5">
              <span className={`font-display text-sm font-black px-3.5 py-2 rounded-xl ${inst.color}`}>
                {inst.label}
              </span>
              <div className="w-8 h-8 bg-bg-4 border border-white/[0.09] rounded-full flex items-center justify-center text-sm transition-all group-hover:bg-brand">
                →
              </div>
            </div>

            <div className="font-display text-lg font-bold mb-1.5">{inst.name}</div>
            <div className="text-sm text-white/35 mb-4">{inst.meta}</div>

            <div className="flex flex-wrap gap-1.5">
              {inst.tags.map((t) => (
                <span key={t} className="text-[11px] px-2.5 py-1 rounded-full bg-bg-4 border border-white/[0.06] text-white/40">
                  {t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-white/20 mt-10">
        Expanding across Punjab & India 🇮🇳 · provinceapp.in
      </p>
    </div>
  );
}
