import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Lock, Mail, User, ArrowRight } from 'lucide-react';

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '' });
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || '/dashboard';

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login';

    fetch(`http://localhost:5000${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          localStorage.setItem('sf_token', data.token);
          localStorage.setItem('sf_user', JSON.stringify(data.user));

          // Role-based smart navigation
          if (data.user.role === 'admin') {
            navigate('/admin/dashboard', { replace: true });
          } else if (data.user.role === 'instructor') {
            navigate('/instructor/studio', { replace: true });
          } else {
            navigate(from, { replace: true });
          }
        } else {
          setError(data.message || 'Authentication failed');
        }
      })
      .catch(() => {
        // Fallback for local testing
        const role = formData.email.includes('admin')
          ? 'admin'
          : formData.email.includes('instructor')
          ? 'instructor'
          : 'student';

        const demoUser = {
          id: 101,
          fullName: formData.fullName || 'Demo User',
          email: formData.email,
          role: role
        };

        localStorage.setItem('sf_token', 'demo_token_skillforge');
        localStorage.setItem('sf_user', JSON.stringify(demoUser));

        if (demoUser.role === 'admin') {
          navigate('/admin/dashboard', { replace: true });
        } else if (demoUser.role === 'instructor') {
          navigate('/instructor/studio', { replace: true });
        } else {
          navigate(from, { replace: true });
        }
      });
  };

  return (
    <div className="min-h-screen bg-[#0B1130] text-white flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
        
        {/* Glow Accent */}
        <div className="absolute -top-12 -left-12 w-32 h-32 bg-[#2546F0]/30 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-[#34E0D8]/20 rounded-full blur-2xl pointer-events-none" />

        <div className="text-center mb-8 relative z-10">
          <Link to="/" className="inline-block text-3xl font-extrabold text-[#34E0D8] tracking-wider mb-2 hover:opacity-90 transition-opacity">
            SKILLFORGE.
          </Link>
          <p className="text-gray-400 text-sm">
            {location.state?.from 
              ? 'Please sign in to enroll and start learning.' 
              : isRegister 
                ? 'Create your account to start forging skills.' 
                : 'Sign in to access your dashboard & courses.'}
          </p>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs p-3 rounded-xl mb-6 relative z-10">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
          {isRegister && (
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#34E0D8] transition-colors"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                placeholder="user@skillforge.dev"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
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
                value={formData.password}
                onChange={e => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-[#34E0D8] transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-[#2546F0] hover:bg-[#2546F0]/90 font-bold text-white text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#2546F0]/30 mt-6"
          >
            {isRegister ? 'Create Account & Enroll' : 'Sign In & Proceed'} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center mt-6 border-t border-white/10 pt-6 relative z-10 flex flex-col gap-3">
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="text-xs text-[#34E0D8] hover:underline"
          >
            {isRegister ? 'Already have an account? Sign in' : "Don't have an account? Register"}
          </button>

          <Link
            to="/admin/login"
            className="text-xs text-gray-500 hover:text-gray-300 font-mono transition-colors"
          >
            🔒 System Admin Portal
          </Link>
        </div>

      </div>
    </div>
  );
}