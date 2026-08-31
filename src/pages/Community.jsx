import React from 'react';
import StaticPage from './StaticPage';

export default function Community() {
  return (
    <StaticPage title="SkillForge Community">
      <p>Connect with other developers, ask questions, and share project feedback across our official channels.</p>
      <ul>
        <li><strong>GitHub:</strong> Share open-source projects and code reviews.</li>
        <li><strong>Discord:</strong> Join real-time discussions on Web Development, Networking, and Data Science.</li>
      </ul>
    </StaticPage>
  );
}