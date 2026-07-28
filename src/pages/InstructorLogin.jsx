import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function InstructorLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // Default instructor credentials (you can adjust these)
    if (email === 'instructor@skillforge.com' && password === 'admin123') {
      localStorage.setItem('instructor_token', 'authenticated_session_token');
      navigate('/instructor/studio');
    } else {
      setError('Invalid instructor credentials.');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', padding: '1rem' }}>
      <div style={{ backgroundColor: '#1e293b', padding: '2.5rem', borderRadius: '10px', border: '1px solid #334155', width: '100%', maxWidth: '400px', color: '#fff' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '0.5rem' }}>Instructor Portal</h2>
        <p style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Sign in to manage courses and studio content</p>

        {error && (
          <div style={{ backgroundColor: '#7f1d1d', color: '#fca5a5', padding: '0.6rem', borderRadius: '6px', marginBottom: '1rem', fontSize: '0.85rem', textAlign: 'center' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '0.3rem' }}>Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="instructor@skillforge.com"
              style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#fff', outline: 'none' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '0.3rem' }}>Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #475569', backgroundColor: '#0f172a', color: '#fff', outline: 'none' }}
            />
          </div>

          <button
            type="submit"
            style={{ marginTop: '0.5rem', padding: '0.7rem', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            Authenticate & Access Studio
          </button>
        </form>
      </div>
    </div>
  );
}