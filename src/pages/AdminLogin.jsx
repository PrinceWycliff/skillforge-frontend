import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Lock, Mail, ArrowRight } from 'lucide-react';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const API_BASE = 'https://skillforge-backend-4wd6.onrender.com';

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Invalid email or password.');
      }

      if (data.user?.role !== 'admin') {
        throw new Error('This account does not have admin access.');
      }

      // Store under the same keys the rest of the app reads (token/user),
      // so AdminDashboard's Authorization header actually carries a valid token.
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      navigate('/admin/dashboard', { replace: true });
    } catch (err) {
      console.error('Admin Login Error:', err);
      setError(err.message || 'Failed to authenticate.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1130] text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white/5 border border-[#34E0D8]/30 rounded-2xl p-8 backdrop-blur-xl shadow-2xl relative">
        <div className="text-center mb-8">
          <div className="inline-flex p-3 rounded-2xl bg-[#2546F0]/20 text-[#34E0D8] mb-4 border border-[#34E0D8]/20">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-extrabold text-[#34E0D8] tracking-wider mb-1">SKILLFORGE ADMIN</h1>
          <p className="text-gray-400 text-xs">System Administration Control Center</p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs p-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleAdminLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Admin Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                placeholder="admin@skillforge.dev"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#34E0D8] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#34E0D8] transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-[#2546F0] hover:bg-[#2546F0]/90 disabled:opacity-50 font-bold text-white text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#2546F0]/30 mt-6"
          >
            {loading ? 'Authenticating...' : 'Authenticate Admin Portal'} <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}