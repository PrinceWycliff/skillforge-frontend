// src/pages/StaticPage.jsx
import React from 'react';

export default function StaticPage({ title, children }) {
  return (
    <div style={{
      backgroundColor: '#0B1130',
      minHeight: '80vh',
      color: '#ffffff',
      padding: '4rem 1.5rem',
      fontFamily: 'sans-serif'
    }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{
          fontSize: '2.25rem',
          fontWeight: 'bold',
          marginBottom: '1.5rem',
          borderBottom: '1px solid #1e293b',
          paddingBottom: '1rem',
          color: '#34E0D8'
        }}>
          {title}
        </h1>
        <div style={{ color: '#94a3b8', lineHeight: '1.7', fontSize: '1rem' }}>
          {children}
        </div>
      </div>
    </div>
  );
}