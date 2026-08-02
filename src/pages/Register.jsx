import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerWithEmail, sendVerificationCode, verifyEmailCode } from '../config/firebase';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);

  // --- Code verification state ---
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [codeError, setCodeError] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resending, setResending] = useState(false);
  const [pendingUser, setPendingUser] = useState(null);
  const inputRefs = useRef([]);

  const navigate = useNavigate();

  // Countdown for resend cooldown
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      // 1. Create User (unchanged)
      const result = await registerWithEmail(email, password);
      const user = result.user;
      setPendingUser(user);

      // 2. Send verification code to the user's email
      await sendVerificationCode(user);

      // 3. Show code entry modal (do NOT redirect or set session yet)
      setShowVerificationModal(true);
      setResendCooldown(60);
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

  const handleCodeChange = (index, value) => {
    // Only allow single digits
    if (value && !/^\d$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    setCodeError('');

    // Auto-advance to next box
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleCodeKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleCodePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (!pasted) return;
    const newCode = [...code];
    for (let i = 0; i < 6; i++) {
      newCode[i] = pasted[i] || '';
    }
    setCode(newCode);
    const nextEmptyIndex = newCode.findIndex((d) => !d);
    inputRefs.current[nextEmptyIndex === -1 ? 5 : nextEmptyIndex]?.focus();
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setCodeError('');

    const fullCode = code.join('');
    if (fullCode.length !== 6) {
      setCodeError('Please enter the full 6-digit code.');
      return;
    }

    setVerifying(true);
    try {
      // Backend checks the code against what was generated/emailed for this user
      const response = await verifyEmailCode(email, fullCode);

      if (response?.success) {
        // Success -> redirect to Login only now
        setShowVerificationModal(false);
        navigate('/login', {
          replace: true,
          state: { verified: true, email },
        });
      } else {
        setCodeError(response?.message || 'Invalid or expired code. Please try again.');
      }
    } catch (err) {
      console.error('Verification Error:', err);
      setCodeError(err.message || 'Invalid or expired code. Please try again.');
    } finally {
      setVerifying(false);
    }
  };

  const handleResendCode = async () => {
    if (resendCooldown > 0 || resending) return;
    setResending(true);
    setCodeError('');
    try {
      await sendVerificationCode(pendingUser || { email });
      setResendCooldown(60);
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (err) {
      console.error('Resend Error:', err);
      setCodeError(err.message || 'Failed to resend code. Please try again.');
    } finally {
      setResending(false);
    }
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

      {/* Verification Code Modal */}
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
              We sent a 6-digit code to <span className="text-blue-400 font-semibold">{email}</span>. Enter it below to confirm your email.
            </p>

            <form onSubmit={handleVerifyCode}>
              <div className="flex justify-center gap-2 mb-4" onPaste={handleCodePaste}>
                {code.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleCodeChange(index, e.target.value)}
                    onKeyDown={(e) => handleCodeKeyDown(index, e)}
                    className="w-10 h-12 text-center text-lg font-semibold bg-[#0B1130] border border-gray-800 rounded-lg text-white focus:outline-none focus:border-blue-500 transition"
                  />
                ))}
              </div>

              {codeError && (
                <div className="mb-4 p-2.5 bg-red-500/20 border border-red-500/40 rounded-lg text-red-300 text-xs text-center font-medium">
                  {codeError}
                </div>
              )}

              <button
                type="submit"
                disabled={verifying}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white text-sm font-semibold rounded-lg transition cursor-pointer"
              >
                {verifying ? 'Verifying...' : 'Verify & Continue'}
              </button>
            </form>

            <button
              onClick={handleResendCode}
              disabled={resendCooldown > 0 || resending}
              className="mt-4 text-xs text-gray-400 hover:text-blue-400 disabled:text-gray-600 transition cursor-pointer"
            >
              {resending
                ? 'Resending...'
                : resendCooldown > 0
                ? `Resend code in ${resendCooldown}s`
                : 'Didn\'t get a code? Resend'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}