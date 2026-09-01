import React from 'react';
import StaticPage from './StaticPage';
import Sidebar from '../components/Sidebar';

export default function PrivacyPolicy() {
  return (
    <StaticPage title="Privacy Policy">
      <p>At SkillForge, we value your privacy. This document outlines how we collect and manage user data.</p>
      
      <h3 style={{ color: '#fff', marginTop: '1.5rem' }}>1. Data Collection</h3>
      <p>We collect account information such as your name and email address to manage course access and track assessment progress.</p>
      
      <h3 style={{ color: '#fff', marginTop: '1.5rem' }}>2. Data Use</h3>
      <p>Your personal data is used exclusively for platform authentication, certificate generation, and core service delivery. We do not sell your personal data to third parties.</p>
          {/* Footer Link */}
                <div className="mt-8 pt-6 border-t border-gray-800 text-center text-xs text-gray-500">
                  <Link to="/" className="hover:text-gray-300 transition">
                    ← Return to Main Homepage
                  </Link>
                </div>
    </StaticPage>
  );
}