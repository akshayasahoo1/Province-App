// ============================================
// PAGE: Login
// ============================================
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../lib/api';
import { useAuthStore, useUIStore } from '../store';

export default function Login() {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const { showToast } = useUIStore();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await authAPI.login(form);
      setAuth(res.data.user, res.data.token);
      showToast('Welcome back! 👋');
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Check credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center px-5 py-16">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center gap-2 justify-center mb-10 cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-8 h-8 bg-brand rounded-xl flex items-center justify-center font-black text-white text-base">P</div>
          <span className="font-display font-extrabold text-xl tracking-tight">Province</span>
        </div>

        <h1 className="font-display text-2xl font-extrabold tracking-tight text-center mb-1">Welcome back</h1>
        <p className="text-sm text-white/40 text-center mb-8">Sign in to your campus account</p>

        <form onSubmit={handleSubmit} className="bg-bg-2 border border-white/[0.08] rounded-2xl p-6 flex flex-col gap-4">
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <div>
            <label className="text-xs text-white/40 block mb-1.5">Email</label>
            <input
              className="w-full bg-bg-3 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 outline-none focus:border-brand/50 focus:ring-2 focus:ring-brand/15 transition-all"
              type="email" placeholder="your@email.com" required
              value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div>
            <label className="text-xs text-white/40 block mb-1.5">Password</label>
            <input
              className="w-full bg-bg-3 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-white/25 outline-none focus:border-brand/50 focus:ring-2 focus:ring-brand/15 transition-all"
              type="password" placeholder="••••••••" required
              value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </div>

          <button
            type="submit" disabled={loading}
            className="w-full bg-brand text-white font-semibold rounded-xl py-3 text-sm transition-all hover:bg-brand-2 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed mt-1">
            {loading ? 'Signing in…' : 'Sign In →'}
          </button>
        </form>

        <p className="text-center text-sm text-white/30 mt-5">
          No account?{' '}
          <Link to="/register" className="text-brand hover:underline">Create one free</Link>
        </p>

        <div className="mt-4 bg-bg-2 border border-white/[0.06] rounded-2xl p-4 text-center">
          <p className="text-xs text-white/30 mb-3">Or continue as guest</p>
          <button
            className="w-full bg-bg-3 border border-white/10 text-white/60 rounded-xl py-2.5 text-sm font-medium hover:bg-bg-4 transition-all"
            onClick={() => navigate('/dashboard')}>
            Browse without login
          </button>
        </div>
      </div>
    </div>
  );
}
