import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { loginWithGoogle } from '../config/firebase';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const RAW_API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://skillforge-backend-4wd6.onrender.com';
  const API_BASE = RAW_API_BASE.replace(/\/$/, '');

  // Smart Redirection Target: Default to Home ('/') unless coming specifically from Catalog trigger
  const targetDestination = location.state?.from === 'catalog' ? '/catalog' : '/';

  // Google Authentication Handler (unchanged — still Firebase + google-sync)
  const handleGoogleAuth = async () => {
    setError('');
    setLoading(true);

    try {
      const result = await loginWithGoogle();
      const user = result.user;

      const syncRes = await fetch(`${API_BASE}/api/auth/google-sync`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, name: user.displayName }),
      });
      const syncData = await syncRes.json().catch(() => ({}));

      if (!syncRes.ok || !syncData.success) {
        throw new Error(syncData.message || 'Failed to sync Google account.');
      }

      localStorage.setItem('token', syncData.token);
      localStorage.setItem(
        'user',
        JSON.stringify({
          ...syncData.user,
          photo: user.photoURL,
          uid: user.uid,
        })
      );

      navigate(targetDestination, { replace: true });
    } catch (err) {
      console.error('Google Auth Error:', err);
      setError('Google sign-in failed. Please try again or check browser popup settings.');
    } finally {
      setLoading(false);
    }
  };

  // Email/Password Authentication Handler (unchanged — backend-based)
  const handleEmailLogin = async (e) => {
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

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      navigate(targetDestination, { replace: true });
    } catch (err) {
      console.error('Email Login Error:', err);
      setError(err.message || 'Unable to log in. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-sans">

      {/* LEFT PANEL — brand, dark gradient */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#0B1130] via-[#141a6b] to-[#2546F0] flex-col justify-between p-12 relative overflow-hidden">
        <Link to="/" className="flex items-center gap-2.5 relative z-10">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#2546F0] to-[#34E0D8] flex items-center justify-center font-bold text-lg text-white shadow-lg shadow-blue-500/20">
            S
          </div>
          <span className="text-xl font-bold text-white tracking-tight">Skillforge</span>
        </Link>

        <div className="relative z-10">
          <h2 className="text-3xl font-extrabold text-white leading-tight mb-4">
            Practical skills, built one hands-on course at a time.
          </h2>
          <p className="text-gray-300 text-base max-w-md">
            Every track pairs real projects with a verified certificate — pick up exactly where you left off, on any device.
          </p>
        </div>

        <div className="relative z-10 flex flex-wrap gap-x-8 gap-y-3">
          <div>
            <p className="text-xl font-extrabold text-white">5 Tracks</p>
            <p className="text-gray-400 text-xs">Web Dev, Networking, Security &amp; more</p>
          </div>
          <div>
            <p className="text-xl font-extrabold text-white">100% Hands-On</p>
            <p className="text-gray-400 text-xs">Real projects, not just theory</p>
          </div>
          <div>
            <p className="text-xl font-extrabold text-white">Free to Start</p>
            <p className="text-gray-400 text-xs">No payment required today</p>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL — form */}
      <div className="w-full lg:w-1/2 bg-white flex items-center justify-center px-6 py-12">
        <div className="max-w-md w-full">

          {/* Mobile-only logo */}
          <Link to="/" className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#2546F0] to-[#34E0D8] flex items-center justify-center font-bold text-lg text-white">
              S
            </div>
            <span className="text-xl font-bold text-[#0B1130] tracking-tight">Skillforge</span>
          </Link>

          <h1 className="text-3xl font-extrabold text-[#0B1130] mb-2">Welcome back</h1>
          <p className="text-gray-500 text-sm mb-8">Log in to pick up your courses right where you left off.</p>

          {error && (
            <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm text-center font-medium">
              {error}
            </div>
          )}

          {/* Google Sign-In */}
          <button
            type="button"
            onClick={handleGoogleAuth}
            disabled={loading}
            className="w-full py-3 px-4 bg-white hover:bg-gray-50 border border-gray-300 text-gray-800 font-semibold text-sm rounded-lg flex items-center justify-center gap-3 transition shadow-sm mb-6 cursor-pointer disabled:opacity-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            Continue with Google
          </button>

          <div className="relative flex items-center justify-center mb-6">
            <div className="border-t border-gray-200 w-full"></div>
            <span className="bg-white px-3 text-[10px] font-semibold text-gray-400 uppercase tracking-widest absolute">
              or continue with email
            </span>
          </div>

          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Email address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-[#0B1130] text-sm focus:outline-none focus:border-[#2546F0] focus:ring-1 focus:ring-[#2546F0] transition"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-gray-700">Password</label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-[#2546F0] hover:underline font-medium transition"
                >
                  Forgot password?
                </Link>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-[#0B1130] text-sm focus:outline-none focus:border-[#2546F0] focus:ring-1 focus:ring-[#2546F0] transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-[#2546F0] to-[#1d3ac9] hover:shadow-lg hover:shadow-blue-500/30 disabled:opacity-60 text-white font-semibold text-sm rounded-lg transition shadow-md mt-2"
            >
              {loading ? 'Logging in...' : 'Log in to Skillforge'}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-500">
            New to Skillforge?{' '}
            <Link to="/register" className="text-[#2546F0] hover:underline font-semibold">
              Create a free account
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}