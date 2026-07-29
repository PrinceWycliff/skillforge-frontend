import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function InstructorLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Use environment variable or default to your live Render backend URL
  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://skillforge-backend-4wd6.onrender.com';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Direct API call to backend database
      const response = await fetch(`${API_BASE}/api/instructor/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || 'Invalid instructor credentials.');
      }

      // Store JWT token & instructor info returned from the server
      if (data.token) {
        localStorage.setItem('instructor_token', data.token);
      }
      if (data.user) {
        localStorage.setItem('instructor_user', JSON.stringify(data.user));
      }

      // Redirect directly to Instructor Studio
      navigate('/instructor/studio', { replace: true });

    } catch (err) {
      console.error('Login Error:', err);
      setError(err.message || 'Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1130] text-white flex items-center justify-center px-4 font-sans">
      <div className="max-w-md w-full bg-[#111936] p-8 rounded-xl border border-gray-800 shadow-2xl">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-blue-600 font-bold text-xl mb-3 shadow-md">
            S
          </div>
          <h2 className="text-2xl font-bold tracking-tight">Instructor Portal</h2>
          <p className="text-gray-400 text-sm mt-1">Sign in to manage courses and studio content</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="instructor@domain.com"
              className="w-full px-4 py-3 bg-[#0B1130] border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-[#0B1130] border border-gray-700 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-lg transition shadow-md hover:shadow-blue-500/20"
          >
            {loading ? 'Authenticating...' : 'Authenticate & Access Studio'}
          </button>
        </form>

        {/* Footer Navigation */}
        <div className="mt-8 pt-6 border-t border-gray-800 text-center text-xs text-gray-500">
          <Link to="/" className="hover:text-gray-300 transition">
            ← Return to Main Homepage
          </Link>
        </div>

      </div>
    </div>
  );
}