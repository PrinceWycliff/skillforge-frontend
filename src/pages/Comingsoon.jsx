import React from 'react';
import { Link } from 'react-router-dom';

export default function ComingSoon({ title = 'Coming Soon', description = "We're building this right now — check back soon." }) {
  return (
    <div className="min-h-screen bg-[#0B1130] text-white flex flex-col items-center justify-center px-6 font-sans text-center">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#2546F0] to-[#34E0D8] flex items-center justify-center font-bold text-2xl text-white shadow-lg shadow-blue-500/20 mb-6">
        S
      </div>
      <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#0f1e4d] border border-[#2546F0] text-[#34E0D8] text-sm font-semibold mb-6">
        🚧 In Progress
      </div>
      <h1 className="text-3xl md:text-4xl font-extrabold mb-3">{title}</h1>
      <p className="text-gray-400 max-w-md mb-8">{description}</p>
      <Link
        to="/"
        className="bg-gradient-to-r from-[#2546F0] to-[#34E0D8] text-[#0B1130] px-6 py-3 rounded-lg font-bold transition hover:shadow-lg hover:shadow-cyan-400/20"
      >
        ← Back to Home
      </Link>
    </div>
  );
}