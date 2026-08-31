import React from 'react';
import StaticPage from './StaticPage';

export default function HelpCenter() {
  return (
    <StaticPage title="Help Center & Support">
      <p>Need assistance with your account or course progress? Here is how to get help:</p>
      
      <div style={{ backgroundColor: '#131b4d', padding: '1.25rem', borderRadius: '8px', margin: '1.5rem 0', border: '1px solid #1e293b' }}>
        <h4 style={{ color: '#ffffff', margin: '0 0 0.5rem 0' }}>Technical Support</h4>
        <p style={{ margin: 0 }}>Reach out directly via email at <a href="mailto:support@skillforge.com" style={{ color: '#34E0D8' }}>support@skillforge.com</a>.</p>
      </div>
    </StaticPage>
  );
}