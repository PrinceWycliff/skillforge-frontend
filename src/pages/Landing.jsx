import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Cpu, BookOpen, ArrowRight } from 'lucide-react';

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#0B1130] text-white">
      {/* Hero Section */}
      <section className="max-w-6xl mx-auto px-6 pt-20 pb-16 text-center">
        <span className="inline-block px-4 py-1.5 rounded-full bg-[#34E0D8]/10 text-[#34E0D8] text-xs font-semibold tracking-wider uppercase mb-6 border border-[#34E0D8]/20">
          Industry-Standard Tech Skills
        </span>
        <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight">
          Master Modern Tech with <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2546F0] to-[#34E0D8]">
            Interactive Hands-on Courses
          </span>
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto text-lg mb-8">
          Accelerate your development journey with short, structured technical tracks, real-time video streaming, and verified digital certificates.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            to="/catalog"
            className="px-8 py-3.5 rounded-xl bg-[#2546F0] hover:bg-[#2546F0]/90 font-semibold flex items-center gap-2 shadow-lg transition-all"
          >
            Explore Courses <ArrowRight className="w-5 h-5" />
          </Link>
          <Link
            to="/dashboard"
            className="px-8 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 font-semibold border border-white/10 transition-all"
          >
            Student Dashboard
          </Link>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
          <Shield className="w-8 h-8 text-[#34E0D8] mb-4" />
          <h3 className="text-xl font-bold mb-2">Network & Systems</h3>
          <p className="text-gray-400 text-sm">Deep dive into routing protocols, ACLs, NAT configurations, and infrastructure security.</p>
        </div>
        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
          <Cpu className="w-8 h-8 text-[#2546F0] mb-4" />
          <h3 className="text-xl font-bold mb-2">Full-Stack Web Dev</h3>
          <p className="text-gray-400 text-sm">Build dynamic web applications with modern Node.js, JavaScript, and database integration.</p>
        </div>
        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl">
          <BookOpen className="w-8 h-8 text-[#1FC98D] mb-4" />
          <h3 className="text-xl font-bold mb-2">80% Mastery Gating</h3>
          <p className="text-gray-400 text-sm">Validate your knowledge with timed module assessments to earn verifiable PDF credentials.</p>
        </div>
      </section>
    </div>
  );
}