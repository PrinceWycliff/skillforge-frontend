import React from 'react';
import StaticPage from './StaticPage';
import Sidebar from '../components/Sidebar';

export default function Community() {
  return (
    <StaticPage title="SkillForge Community">
      <p>Connect with other developers, ask questions, and share project feedback across our official channels.</p>
      <ul>
        <li><strong>GitHub:</strong> Share open-source projects and code reviews.</li>
        <li><strong>Discord:</strong> Join real-time discussions on Web Development, Networking, and Data Science.</li>
      </ul>
        {/* Footer Link */}
              <div className="mt-8 pt-6 border-t border-gray-800 text-center text-xs text-gray-500">
                <Link to="/" className="hover:text-gray-300 transition">
                  ← Return to Main Homepage
                </Link>
              </div>
    </StaticPage>
  );
}