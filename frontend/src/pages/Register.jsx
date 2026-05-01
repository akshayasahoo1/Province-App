// ============================================
// PAGE: Register
// ============================================
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../lib/api';
import { useAuthStore, useUIStore } from '../store';

export default function Register() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const { showToast } = useUIStore();
  const [form, setForm] = useState({ name: '', email: '', password: '', reg_no: '', course: 'cse', year: 1, inst_id: 'lpu' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setLoading(true);
    try {
      const res = await authAPI.register(form);
      setAuth(res.data.user, res.data.token);
      showToast('Account created! Welcome to Province 🎉');
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full bg-bg-3 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 outline-none focus:border-brand/50 focus:ring-2 focus:ring-brand/15 transition-all";

  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center px-5 py-16">
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 justify-center mb-10 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-8 h-8 bg-brand rounded-xl flex items-center justify-center font-black text-white text-base">P</div>
          <span className="font-display font-extrabold text-xl tracking-tight">Province</span>
        </div>

        <h1 className="font-display text-2xl font-extrabold tracking-tight text-center mb-1">Create account</h1>
        <p className="text-sm text-white/40 text-center mb-8">Join your campus community</p>

        <form onSubmit={handleSubmit} className="bg-bg-2 border border-white/[0.08] rounded-2xl p-6 flex flex-col gap-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl">{error}</div>
          )}

          <div>
            <label className="text-xs text-white/40 block mb-1.5">Full Name *</label>
            <input className={inputClass} type="text" placeholder="Your full name" required
              value={form.name} onChange={e => set('name', e.target.value)} />
          </div>

          <div>
            <label className="text-xs text-white/40 block mb-1.5">Email *</label>
            <input className={inputClass} type="email" placeholder="your@email.com" required
              value={form.email} onChange={e => set('email', e.target.value)} />
          </div>

          <div>
            <label className="text-xs text-white/40 block mb-1.5">Registration Number</label>
            <input className={inputClass} type="text" placeholder="e.g. 12207XXX"
              value={form.reg_no} onChange={e => set('reg_no', e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-white/40 block mb-1.5">Course</label>
              <select className={inputClass} value={form.course} onChange={e => set('course', e.target.value)}>
                <option value="cse">BTech CSE</option>
                <option value="mba">MBA</option>
                <option value="bca">BCA</option>
                <option value="bcom">BCom</option>
                <option value="agriculture">BSc Agriculture</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-white/40 block mb-1.5">Year</label>
              <select className={inputClass} value={form.year} onChange={e => set('year', parseInt(e.target.value))}>
                {[1,2,3,4,5].map(y => <option key={y} value={y}>Year {y}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs text-white/40 block mb-1.5">Password *</label>
            <input className={inputClass} type="password" placeholder="Min 6 characters" required
              value={form.password} onChange={e => set('password', e.target.value)} />
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-brand text-white font-semibold rounded-xl py-3 text-sm transition-all hover:bg-brand-2 hover:-translate-y-0.5 disabled:opacity-50 mt-1">
            {loading ? 'Creating account…' : 'Create Account →'}
          </button>
        </form>

        <p className="text-center text-sm text-white/30 mt-5">
          Already have an account?{' '}
          <Link to="/login" className="text-brand hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
