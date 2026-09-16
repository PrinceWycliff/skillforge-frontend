import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [statusMessage, setStatusMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const getApiUrl = () => {
    let envUrl = import.meta.env.VITE_API_URL || 'https://skillforge-backend-4wd6.onrender.com';
    envUrl = envUrl.trim().replace(/\/+$/, '');
    if (envUrl.endsWith('/api')) envUrl = envUrl.replace(/\/api$/, '');
    return envUrl;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatusMessage({ type: '', text: '' });

    try {
      const baseUrl = getApiUrl();
      const res = await fetch(`${baseUrl}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Registration failed. Please check your credentials.');
      }

      setStatusMessage({
        type: 'success',
        text: 'Account created successfully! Check your email inbox to verify your account.'
      });

      setTimeout(() => navigate('/login'), 3500);
    } catch (err) {
      setStatusMessage({ type: 'error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-sans">

      {/* LEFT PANEL — brand, dark gradient (matches Login.jsx) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#0B1130] via-[#141a6b] to-[#2546F0] flex-col justify-between p-12 relative overflow-hidden">
        <Link to="/" className="flex items-center gap-2.5 relative z-10">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#2546F0] to-[#34E0D8] flex items-center justify-center font-bold text-lg text-white shadow-lg shadow-blue-500/20">
            S
          </div>
          <span className="text-xl font-bold text-white tracking-tight">Skillforge</span>
        </Link>

        <div className="relative z-10">
          <h2 className="text-3xl font-extrabold text-white leading-tight mb-4">
            Start building real, job-ready skills today.
          </h2>
          <p className="text-gray-300 text-base max-w-md">
            Join a growing community learning Web Development, Networking, Cyber Security, and more — hands-on, at your own pace.
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

          <h1 className="text-3xl font-extrabold text-[#0B1130] mb-2">Create your account</h1>
          <p className="text-gray-500 text-sm mb-8">Start learning practical tech skills today, for free.</p>

          {statusMessage.text && (
            <div className={`p-3 rounded-lg mb-6 text-sm text-center font-medium ${
              statusMessage.type === 'success'
                ? 'bg-green-50 border border-green-200 text-green-700'
                : 'bg-red-50 border border-red-200 text-red-600'
            }`}>
              {statusMessage.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Full Name</label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Jane Banda"
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-[#0B1130] text-sm focus:outline-none focus:border-[#2546F0] focus:ring-1 focus:ring-[#2546F0] transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Email Address</label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-[#0B1130] text-sm focus:outline-none focus:border-[#2546F0] focus:ring-1 focus:ring-[#2546F0] transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Password</label>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-[#0B1130] text-sm focus:outline-none focus:border-[#2546F0] focus:ring-1 focus:ring-[#2546F0] transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-[#2546F0] to-[#1d3ac9] hover:shadow-lg hover:shadow-blue-500/30 disabled:opacity-60 text-white font-semibold text-sm rounded-lg transition shadow-md mt-2"
            >
              {loading ? 'Creating Account...' : 'Create Free Account'}
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="text-[#2546F0] hover:underline font-semibold">
              Log In
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}