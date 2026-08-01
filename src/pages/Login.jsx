import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Clean raw base URL to prevent double slashes (//)
  const RAW_API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://skillforge-backend-4wd6.onrender.com';
  const API_BASE = RAW_API_BASE.replace(/\/$/, '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Try main auth route
      let response = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      // Fallback to /api/login if /api/auth/login returned 404
      if (response.status === 404) {
        response = await fetch(`${API_BASE}/api/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
      }

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || 'Login failed. Please check your credentials.');
      }

      // Save user session
      localStorage.setItem('token', data.token || 'user-logged-in');
      localStorage.setItem('user', JSON.stringify(data.user || { email }));

      // Redirect student to catalog or dashboard
      navigate('/catalog', { replace: true });

    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Unable to log in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1130] text-white flex items-center justify-center px-4 font-sans">
      <div className="max-w-md w-full bg-[#111936] p-8 rounded-xl border border-gray-800 shadow-2xl">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold tracking-tight">Sign in to Skillforge</h2>
          <p className="text-gray-400 text-sm mt-1">Welcome back! Access your courses</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-xs text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-[#0B1130] border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-[#0B1130] border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-semibold text-sm rounded-lg transition shadow-md"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-gray-400">
          Don't have an account? <Link to="/register" className="text-blue-400 hover:underline">Create one</Link>
        </div>
      </div>
    </div>
  );
}