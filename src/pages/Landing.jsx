import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBolt, FaPlay } from 'react-icons/fa';
import TrustedSection from '../components/TrustedSection';
import Footer from '../components/Footer';
import Pricing from './Pricing';

export default function Landing() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('user');
    setIsLoggedIn(!!user);
  }, []);

  return (
    <div className="min-h-screen bg-[#0B1130] text-white flex flex-col font-sans">

      {/* 1. LIGHT NAVBAR over dark hero */}
      <header className="bg-white sticky top-0 z-50 px-6 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">

          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#2546F0] to-[#34E0D8] flex items-center justify-center shadow-md">
              <FaBolt className="text-white" size={16} />
            </div>
            <span className="text-xl font-extrabold text-[#0B1130] tracking-tight">
              Skillforge
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <Link to="/catalog" className="text-[#2546F0] font-semibold text-sm">Courses</Link>
            <Link to="/paths" className="text-gray-600 hover:text-[#0B1130] text-sm font-medium transition">Paths</Link>
            <Link to="/for-business" className="text-gray-600 hover:text-[#0B1130] text-sm font-medium transition">For Business</Link>
            <Link to="/certificates" className="text-gray-600 hover:text-[#0B1130] text-sm font-medium transition">Certificates</Link>
            <Link to="/pricing" className="text-gray-600 hover:text-[#0B1130] text-sm font-medium transition">Pricing</Link>
          </nav>

          <div className="flex items-center gap-5">
            {isLoggedIn ? (
              <Link
                to="/dashboard"
                className="bg-gradient-to-r from-[#2546F0] to-[#1d3ac9] text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition hover:shadow-lg hover:shadow-blue-500/30"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" className="text-[#0B1130] font-semibold text-sm hidden sm:inline-block">Log in</Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-[#2546F0] to-[#1d3ac9] text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition hover:shadow-lg hover:shadow-blue-500/30"
                >
                  Start learning free
                </Link>
              </>
            )}
          </div>

        </div>
      </header>

      {/* 2. HERO — dark gradient with product mockup */}
      <section className="relative bg-gradient-to-br from-[#0B1130] via-[#141a6b] to-[#2546F0] px-6 py-16 md:py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">

          {/* Left: copy */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0f1e4d] border border-[#2546F0] text-[#34E0D8] text-xs font-bold uppercase tracking-wide mb-6">
              <span className="w-2 h-2 rounded-full bg-[#34E0D8] animate-pulse"></span>
              New Skill Tracks Available
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold leading-[1.1] mb-6">
              Tech skills, built through <span className="bg-gradient-to-r from-[#34E0D8] to-[#2546F0] text-transparent bg-clip-text">practical courses.</span>
            </h1>

            <p className="text-gray-300 text-base md:text-lg max-w-lg leading-relaxed mb-8">
              Hands-on tracks designed for Systems Administration, Computer Networking, Software Engineering, and Business IT — with real projects and verified certificates.
            </p>

            <div className="flex flex-wrap items-center gap-4 mb-10">
              <Link
                to="/catalog"
                className="bg-gradient-to-r from-[#2546F0] to-[#34E0D8] text-[#0B1130] px-8 py-3.5 rounded-lg font-bold text-base transition-all shadow-lg shadow-blue-500/20 hover:shadow-cyan-400/30 hover:scale-[1.02]"
              >
                Browse Courses →
              </Link>
              <Link
                to="/register"
                className="border border-gray-600 hover:border-[#34E0D8] text-white px-8 py-3.5 rounded-lg font-semibold text-base transition-all hover:text-[#34E0D8]"
              >
                Create Free Account
              </Link>
            </div>

            {/* Honest qualitative badges instead of fabricated hard numbers */}
            <div className="flex flex-wrap gap-x-8 gap-y-3">
              <div>
                <p className="text-2xl font-extrabold text-white">5 Tracks</p>
                <p className="text-gray-400 text-sm">Web Dev, Networking, Security &amp; more</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-white">100% Hands-On</p>
                <p className="text-gray-400 text-sm">Real projects, not just theory</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-white">Free to Start</p>
                <p className="text-gray-400 text-sm">No payment required today</p>
              </div>
            </div>
          </div>

          {/* Right: illustrative product mockup — represents the real player UI, no fabricated data */}
          <div className="rounded-2xl bg-[#111936] border border-[#2546F0]/40 shadow-2xl overflow-hidden">
            <div className="flex items-center gap-1.5 px-4 py-3 bg-[#0d1330] border-b border-gray-800">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400/70"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/70"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-green-400/70"></span>
            </div>
            <div className="relative aspect-video bg-[#0d1330] flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-sm">
                <FaPlay className="text-white ml-1" size={20} />
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-800">
                <div className="h-full w-1/3 bg-gradient-to-r from-[#2546F0] to-[#34E0D8]"></div>
              </div>
            </div>
            <div className="p-5">
              <p className="text-[11px] font-bold text-[#34E0D8] uppercase tracking-wide mb-1">Course Player</p>
              <h3 className="font-bold text-white mb-4">Watch lessons, complete quizzes, earn a certificate</h3>
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-gray-300"><span className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center text-[9px]">✓</span> Lesson 1: Getting Started</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-white font-medium"><span className="w-4 h-4 rounded-full bg-[#2546F0] flex items-center justify-center text-[9px]">2</span> Lesson 2: Core Concepts</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-gray-500"><span className="w-4 h-4 rounded-full bg-gray-700 flex items-center justify-center text-[9px]">3</span> Course Quiz</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 3. Real skill tracks — reuses the honest, already-built section */}
      <TrustedSection />

      {/* 4. FOOTER */}
      <Footer />

    </div>
  );
}