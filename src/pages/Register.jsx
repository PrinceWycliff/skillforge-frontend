import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerWithEmail, sendVerificationCode } from '../config/firebase';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      // 1. Create User
      const result = await registerWithEmail(email, password);
      const user = result.user;

      // 2. Send Email Verification Token/Link
      await sendVerificationCode(user);

      // 3. Show Verification Window/Modal (Do NOT redirect to catalog or set session)
      setShowVerificationModal(true);
    } catch (err) {
      console.error('Registration Error:', err);
      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already registered. Try logging in.');
      } else if (err.code === 'auth/weak-password') {
        setError('Password should be at least 6 characters.');
      } else {
        setError(err.message || 'Failed to create account.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleModalProceedToLogin = () => {
    setShowVerificationModal(false);
    // Redirect to login page after successful registration setup
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-[#0B1130] text-white flex items-center justify-center px-4 font-sans relative">
      <div className="max-w-md w-full bg-[#111936] p-8 rounded-xl border border-gray-800 shadow-2xl">
        
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold tracking-tight">Create a Skillforge Account</h2>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-500/20 border border-red-500/40 rounded-lg text-red-300 text-xs text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@example.com"
              className="w-full px-4 py-2.5 bg-[#0B1130] border border-gray-800 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 bg-[#0B1130] border border-gray-800 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
              Confirm Password
            </label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 bg-[#0B1130] border border-gray-800 rounded-lg text-white text-sm focus:outline-none focus:border-blue-500 transition"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-semibold text-sm rounded-lg transition shadow-md mt-2 cursor-pointer"
          >
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-6 text-center text-xs text-gray-400">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-400 hover:underline font-semibold text-sm inline-block ml-1">
            Sign in
          </Link>
        </div>
      </div>

      {/* Verification Code/Email Modal */}
      {showVerificationModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#111936] border border-gray-800 p-6 rounded-xl max-w-sm w-full text-center shadow-2xl">
            <div className="w-12 h-12 bg-blue-600/20 text-blue-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 002-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Verify Your Email</h3>
            <p className="text-xs text-gray-300 mb-6">
              We have sent an authentication link/code to <span className="text-blue-400 font-semibold">{email}</span>. Please check your inbox and confirm your email.
            </p>
            <button
              onClick={handleModalProceedToLogin}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-lg transition"
            >
              Proceed to Login
            </button>
          </div>
        </div>
      )}
    </div>
  );
}   