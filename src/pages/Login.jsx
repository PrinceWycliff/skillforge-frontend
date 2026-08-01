import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth, googleProvider } from '../firebaseConfig';
import { signInWithPopup, signInWithRedirect, sendSignInLinkToEmail } from 'firebase/auth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [useMagicLink, setUseMagicLink] = useState(false);
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const RAW_API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://skillforge-backend-4wd6.onrender.com';
  const API_BASE = RAW_API_BASE.replace(/\/$/, '');

  // 1. Google Authentication with Popup Fallback
  const handleGoogleAuth = async () => {
    setError('');
    setInfo('');
    setLoading(true);

    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const idToken = await user.getIdToken();

      localStorage.setItem('token', idToken);
      localStorage.setItem(
        'user',
        JSON.stringify({
          email: user.email,
          name: user.displayName,
          photo: user.photoURL,
        })
      );

      navigate('/catalog', { replace: true });
    } catch (err) {
      console.error('Google Popup Auth Error:', err);

      // If popup is blocked by browser or closed by user, try redirect mode
      if (err.code === 'auth/popup-blocked' || err.code === 'auth/popup-closed-by-user') {
        try {
          await signInWithRedirect(auth, googleProvider);
          return;
        } catch (redirectErr) {
          console.error('Google Redirect Auth Error:', redirectErr);
        }
      }

      setError('Google sign-in failed. Please try again or check browser popup permissions.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Email Magic Link Handler
  const handleSendMagicLink = async (e) => {
    e.preventDefault();
    setError('');
    setInfo('');

    if (!email) {
      setError('Please enter your email address.');
      return;
    }

    setLoading(true);

    const actionCodeSettings = {
      url: `${window.location.origin}/login`,
      handleCodeInApp: true,
    };

    try {
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem('emailForSignIn', email);
      setInfo(`Sign-in link sent! Check ${email} to complete your login.`);
    } catch (err) {
      console.error('Magic Link Error:', err);
      setError(err.message || 'Failed to send login link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // 3. Standard Password Auth Handler
  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setError('');
    setInfo('');
    setLoading(true);

    try {
      let response = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (response.status === 404) {
        response = await fetch(`${API_BASE}/api/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
      }

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || 'Invalid login credentials.');
      }

      localStorage.setItem('token', data.token || 'user-logged-in');
      localStorage.setItem('user', JSON.stringify(data.user || { email }));

      navigate('/catalog', { replace: true });
    } catch (err) {
      console.error('Password Login Error:', err);
      setError(err.message || 'Unable to log in. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1130] text-white flex items-center justify-center px-4 font-sans">
      <div className="max-w-md w-full bg-[#111936] p-8 rounded-xl border border-gray-800 shadow-2xl">
        
        {/* Title */}
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold tracking-tight">Sign in to Skillforge</h2>
        </div>

        {/* Error / Success Alerts */}
        {error && (
          <div className="mb-6 p-3 bg-red-500/20 border border-red-500/40 rounded-lg text-red-300 text-xs text-center font-medium">
            {error}
          </div>
        )}
        {info && (
          <div className="mb-6 p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-lg text-emerald-300 text-xs text-center font-medium">
            {info}
          </div>
        )}

        {/* Google Sign-In Button */}
        <button
          type="button"
          onClick={handleGoogleAuth}
          disabled={loading}
          className="w-full py-2.5 px-4 bg-white hover:bg-gray-100 text-gray-900 font-semibold text-sm rounded-lg flex items-center justify-center gap-3 transition shadow-sm mb-6 cursor-pointer disabled:opacity-50"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
          Continue with Google
        </button>

        {/* Divider */}
        <div className="relative flex items-center justify-center mb-6">
          <div className="border-t border-gray-800 w-full"></div>
          <span className="bg-[#111936] px-3 text-[10px] font-semibold text-gray-500 uppercase tracking-widest absolute">
            OR WITH EMAIL
          </span>
        </div>

        {/* Auth Mode Toggle */}
        <div className="flex justify-between items-center mb-4 text-xs">
          <span className="text-gray-400 font-medium">Authentication Method:</span>
          <button
            type="button"
            onClick={() => setUseMagicLink(!useMagicLink)}
            className="text-blue-400 hover:underline focus:outline-none"
          >
            {useMagicLink ? 'Use Password' : 'Send Email Link (Passwordless)'}
          </button>
        </div>

        {/* Login Form */}
        <form onSubmit={useMagicLink ? handleSendMagicLink : handlePasswordLogin} className="space-y-4">
          <div>
            <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
              Email
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

          {!useMagicLink && (
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
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-semibold text-sm rounded-lg transition shadow-md mt-2 cursor-pointer"
          >
            {loading ? 'Processing...' : useMagicLink ? 'Send Login Link to Email' : 'Sign In'}
          </button>
        </form>

        {/* Working Register Link */}
        <div className="mt-6 text-center text-xs text-gray-400">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-400 hover:underline font-semibold text-sm inline-block ml-1">
            Create one
          </Link>
        </div>

      </div>
    </div>
  );
}