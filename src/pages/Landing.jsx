import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import TrustedSection from '../components/TrustedSection';
import Footer from '../components/Footer';
import heroImage from '../assets/landing.jpg';

export default function Landing() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('user');
    setIsLoggedIn(!!user);
  }, []);

  return (
    <div className="min-h-screen bg-[#0B1130] text-white flex flex-col font-sans">

      {/* 1. TOP NAVBAR / HEADER */}
      <header className="border-b border-gray-800/80 bg-[#0B1130]/90 backdrop-blur-md sticky top-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">

          {/* Skillforge Logo & Brand Name */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#2546F0] to-[#34E0D8] flex items-center justify-center font-bold text-lg text-white shadow-lg shadow-blue-500/20 group-hover:shadow-cyan-400/30 transition-all">
              S
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-white to-[#34E0D8] text-transparent bg-clip-text tracking-tight">
              Skillforge
            </span>
          </Link>

          {/* Navigation & Action Buttons */}
          <div className="flex items-center gap-3 sm:gap-6">
            <Link
              to="/catalog"
              className="hidden sm:inline-block text-gray-300 hover:text-white text-sm font-medium transition"
            >
              Courses
            </Link>
           

            {isLoggedIn ? (
              <Link
                to="/dashboard"
                className="bg-gradient-to-r from-[#2546F0] to-[#1d3ac9] hover:shadow-lg hover:shadow-blue-500/30 text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-all"
              >
                Go to Dashboard
              </Link>
            ) : (
              <Link
                to="/login"
                className="bg-gradient-to-r from-[#2546F0] to-[#1d3ac9] hover:shadow-lg hover:shadow-blue-500/30 text-white font-semibold px-5 py-2.5 rounded-lg text-sm transition-all"
              >
                Sign In
              </Link>
            )}
          </div>

        </div>
      </header>

      {/* 2. HERO — full-bleed photo with brand-tinted overlay */}
      <section className="relative w-full min-h-[600px] flex items-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        ></div>
        {/* Brand-tinted gradient overlay for legibility and on-brand color */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B1130] via-[#0B1130]/85 to-[#0B1130]/40"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1130] via-transparent to-transparent"></div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 w-full">
          <div className="max-w-xl">
            <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#0f1e4d] border border-[#2546F0] text-[#34E0D8] text-sm font-semibold mb-6">
              ⚡ Hands-On Learning, Real Skills
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6">
              Master Practical Tech Skills with <span className="bg-gradient-to-r from-[#34E0D8] to-[#2546F0] text-transparent bg-clip-text">Skillforge</span>
            </h1>

            <p className="text-gray-300 text-base md:text-lg max-w-lg leading-relaxed mb-8">
              Hands-on tracks designed for Systems Administration, Computer Networking, Software Engineering, and Business IT.
            </p>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                to="/catalog"
                className="bg-gradient-to-r from-[#2546F0] to-[#34E0D8] text-[#0B1130] px-8 py-3.5 rounded-lg font-bold text-base transition-all shadow-lg shadow-blue-500/20 hover:shadow-cyan-400/30 hover:scale-[1.02]"
              >
                Explore Course Catalog
              </Link>
              <Link
                to="/register"
                className="border border-gray-600 hover:border-[#34E0D8] text-white px-8 py-3.5 rounded-lg font-semibold text-base transition-all hover:text-[#34E0D8]"
              >
                Create Free Account
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. POPULAR SKILL TRACKS (real course categories, not fabricated stats) */}
      <TrustedSection />


    </div>
  );
}