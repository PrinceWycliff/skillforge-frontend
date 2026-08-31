import React from 'react';
import StaticPage from './StaticPage';

export default function TermsOfService() {
  return (
    <StaticPage title="Terms of Service">
      <p>Welcome to SkillForge. By accessing our platform, you agree to comply with the following terms.</p>
      
      <h3 style={{ color: '#fff', marginTop: '1.5rem' }}>1. Academic Integrity</h3>
      <p>Learners agree to complete course assessments independently and adhere to fair learning standards.</p>
      
      <h3 style={{ color: '#fff', marginTop: '1.5rem' }}>2. Content Ownership</h3>
      <p>All video materials, slideshows, and quiz content remain the intellectual property of SkillForge and its respective course instructors.</p>
    </StaticPage>
  );
}