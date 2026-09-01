import React from 'react';
import Sidebar from '../components/Sidebar';

export default function Blog() {
  const posts = [
    { title: "Building Full-Stack Web Applications with React & Node", date: "August 2026", desc: "A practical guide on building clean component architecture and RESTful APIs." },
    { title: "Understanding OSI Layer Routing & Network Access Control", date: "July 2026", desc: "Demystifying Network Address Translation (NAT) and configuring Access Control Lists." },
    { title: "Numerical Methods for Software Engineers", date: "June 2026", desc: "Exploring numerical integration techniques and algorithms for technical applications." }
  ];

  return (
    <div className="min-h-screen bg-[#0B1130] text-white py-12 px-6 font-sans">
      <div className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-extrabold text-white mb-3">SkillForge Tech Blog</h1>
        <p className="text-[#94a3b8] text-base">Tutorials, engineering insights, and tech education guides.</p>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {posts.map((post, idx) => (
          <div key={idx} className="bg-[#131b4d] border border-[#1e293b] rounded-xl p-6 hover:border-[#34E0D8]/50 transition">
            <span className="text-xs text-[#34E0D8] font-bold">{post.date}</span>
            <h3 className="text-xl font-bold text-white mt-1 mb-2">{post.title}</h3>
            <p className="text-sm text-[#94a3b8] leading-relaxed">{post.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}