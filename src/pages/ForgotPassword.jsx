import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const RAW_API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://skillforge-backend-4wd6.onrender.com';
  const API_BASE = RAW_API_BASE.replace(/\/$/, '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const res = await fetch(`${API_BASE}/api/auth/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      setMessage(data.message || 'Reset link request submitted.');
    } catch (err) {
      setMessage('Failed to send request. Check your network.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1130] text-white flex items-center justify-center px-4 font-sans">
      <div className="max-w-md w-full bg-[#111936] p-8 rounded-xl border border-gray-800 shadow-2xl">
        <h2 className="text-xl font-bold mb-2 text-center">Reset Password</h2>
        <p className="text-xs text-gray-400 mb-6 text-center">
          Enter your registered email address and we will send you a link to reset your password.
        </p>

        {message && (
          <div className="mb-4 p-3 bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs rounded text-center">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your account email"
            className="w-full px-4 py-3 bg-[#0B1130] border border-gray-700 rounded-lg text-white text-sm"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-lg text-sm font-semibold transition"
          >
            {loading ? 'Sending link...' : 'Send Reset Link'}
          </button>
        </form>

        <div className="mt-6 text-center text-xs">
          <Link to="/instructor/login" className="text-gray-400 hover:text-white">
            ← Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}