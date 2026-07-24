import React, { useState } from 'react';
import { loginWithGoogle, loginWithEmail, registerWithEmail } from '../config/firebase';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  // 1. Backend Sync Helper
  const syncWithBackend = async (idToken) => {
    const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/sync-user`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken }),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Backend synchronization failed');

    // Store verified backend user session
    localStorage.setItem('user', JSON.stringify(data.user));
    window.location.href = '/dashboard';
  };

  // 2. Google Sign-In Handler
  const handleGoogleLogin = async () => {
    try {
      setError('');
      const { token } = await loginWithGoogle();
      await syncWithBackend(token);
    } catch (err) {
      setError(err.message);
    }
  };

  // 3. Email & Password Form Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    try {
      if (isRegistering) {
        await registerWithEmail(email, password);
        setMessage('Verification email sent! Please check your inbox before logging in.');
        setIsRegistering(false);
      } else {
        const { token } = await loginWithEmail(email, password);
        await syncWithBackend(token);
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
      <div className="max-w-md w-full bg-gray-800 rounded-lg p-8 shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-center">
          {isRegistering ? 'Create Skillforge Account' : 'Sign in to Skillforge'}
        </h2>

        {error && <div className="mb-4 text-sm bg-red-500/20 text-red-400 p-3 rounded">{error}</div>}
        {message && <div className="mb-4 text-sm bg-green-500/20 text-green-400 p-3 rounded">{message}</div>}

        {/* Google Login Button */}
        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-2 bg-white text-gray-900 py-2.5 rounded font-semibold hover:bg-gray-100 transition mb-4"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
          Continue with Google
        </button>

        <div className="flex items-center my-4">
          <div className="flex-1 border-t border-gray-700"></div>
          <span className="px-3 text-xs text-gray-400 uppercase">Or with email</span>
          <div className="flex-1 border-t border-gray-700"></div>
        </div>

        {/* Form Login / Register */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              required
              className="w-full bg-gray-700 rounded p-2.5 border border-gray-600 focus:outline-none focus:border-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Password</label>
            <input
              type="password"
              required
              className="w-full bg-gray-700 rounded p-2.5 border border-gray-600 focus:outline-none focus:border-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 py-2.5 rounded font-semibold hover:bg-blue-500 transition"
          >
            {isRegistering ? 'Register Account' : 'Sign In'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          {isRegistering ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-blue-400 hover:underline font-semibold ml-1"
          >
            {isRegistering ? 'Sign In' : 'Create one'}
          </button>
        </p>
      </div>
    </div>
  );
}