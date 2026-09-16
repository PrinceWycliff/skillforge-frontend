import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaBolt, FaPlay, FaBars, FaTimes } from 'react-icons/fa';
import TrustedSection from '../components/TrustedSection';
import Footer from '../components/Footer';

export default function Landing() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('user');
    setIsLoggedIn(!!user);
  }, []);

  return (
    <div className="min-h-screen bg-[#060E20] text-white flex flex-col font-sans">

      {/* ========== NAVBAR ========== */}
      <header className="bg-white sticky top-0 z-50 px-6 py-4 shadow-sm relative">
        <div className="max-w-7xl mx-auto flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#2546F0] to-[#34E0D8] flex items-center justify-center shadow-md">
              <FaBolt className="text-white" size={16} />
            </div>
            <span className="text-xl font-semibold text-[#0B1130] tracking-tight">
              Skillforge
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/catalog" className="text-[#2546F0] font-medium text-sm hover:text-[#1d3ac9] transition">
              Courses
            </Link>
            <Link to="/paths" className="text-gray-600 hover:text-[#0B1130] text-sm font-medium transition">
              Paths
            </Link>
            <Link to="/for-business" className="text-gray-600 hover:text-[#0B1130] text-sm font-medium transition">
              For Business
            </Link>
            <Link to="/certificates" className="text-gray-600 hover:text-[#0B1130] text-sm font-medium transition">
              Certificates
            </Link>
            <Link to="/pricing" className="text-[#2546F0] font-medium text-sm hover:text-[#1d3ac9] transition">
              Pricing
            </Link>
          </nav>

          {/* Right side: Auth + Mobile button */}
          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <Link
                to="/dashboard"
                className="hidden sm:inline-flex bg-[#2546F0] hover:bg-[#1d3ac9] text-white font-medium px-5 py-2.5 rounded-full text-sm transition"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="hidden sm:inline-block text-[#0B1130] font-medium text-sm hover:text-[#2546F0] transition"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="hidden sm:inline-flex bg-[#2546F0] hover:bg-[#1d3ac9] text-white font-medium px-5 py-2.5 rounded-full text-sm transition"
                >
                  Start learning free
                </Link>
              </>
            )}

            {/* Mobile Hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white border-t border-gray-100 shadow-xl z-40">
            <div className="flex flex-col px-6 py-4">
              <Link
                to="/catalog"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-3.5 text-[#2546F0] font-medium text-sm border-b border-gray-100"
              >
                Courses
              </Link>
              <Link
                to="/paths"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-3.5 text-gray-700 hover:text-[#0B1130] text-sm font-medium border-b border-gray-100"
              >
                Paths
              </Link>
              <Link
                to="/for-business"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-3.5 text-gray-700 hover:text-[#0B1130] text-sm font-medium border-b border-gray-100"
              >
                For Business
              </Link>
              <Link
                to="/certificates"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-3.5 text-gray-700 hover:text-[#0B1130] text-sm font-medium border-b border-gray-100"
              >
                Certificates
              </Link>
              <Link
                to="/pricing"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-3.5 text-[#2546F0] font-medium text-sm border-b border-gray-100"
              >
                Pricing
              </Link>

              {/* Mobile auth buttons */}
              <div className="pt-4 flex flex-col gap-3">
                {isLoggedIn ? (
                  <Link
                    to="/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="bg-[#2546F0] text-white text-center font-medium py-3 rounded-full text-sm"
                  >
                    Go to Dashboard
                  </Link>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-center text-[#0B1130] font-medium py-2.5 text-sm"
                    >
                      Log in
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="bg-[#2546F0] text-white text-center font-medium py-3 rounded-full text-sm"
                    >
                      Start learning free
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* ========== HERO ========== */}
      <section className="relative bg-[#060E20] px-6 py-20 md:py-28 overflow-hidden">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">

          {/* Left: Copy */}
          <div>
            {/* Elegant small label */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-px bg-[#2546F0]"></div>
              <span className="text-[#34E0D8] text-xs font-medium tracking-[0.2em] uppercase">
                New Skill Tracks Available
              </span>
            </div>

            {/* Serif Headline */}
            <h1 className="font-serif font-light text-5xl sm:text-6xl md:text-7xl leading-[1.05] tracking-tight text-white mb-6">
              Tech skills, built through{' '}
              <span className="text-[#3B82F6] italic">practical courses.</span>
            </h1>

            <p className="text-gray-400 text-lg leading-relaxed max-w-md mb-10">
              Hands-on tracks designed for Systems Administration, Computer Networking,
              Software Engineering, and Business IT — with real projects and verified certificates.
            </p>

            <div className="flex flex-wrap items-center gap-4 mb-14">
              <Link
                to="/catalog"
                className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-8 py-3.5 rounded-full font-medium text-sm transition shadow-lg shadow-blue-500/20"
              >
                Browse Courses
              </Link>
              <Link
                to="/register"
                className="border border-white/20 hover:border-white/40 text-white px-8 py-3.5 rounded-full font-medium text-sm transition"
              >
                Create Free Account
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-10">
              <div>
                <p className="font-serif text-3xl font-light text-white">5</p>
                <p className="text-gray-500 text-sm mt-1">Skill Tracks</p>
              </div>
              <div>
                <p className="font-serif text-3xl font-light text-white">100%</p>
                <p className="text-gray-500 text-sm mt-1">Hands-On</p>
              </div>
              <div>
                <p className="font-serif text-3xl font-light text-white">Free</p>
                <p className="text-gray-500 text-sm mt-1">To Start</p>
              </div>
            </div>
          </div>

          {/* Right: Product Mockup */}
          <div className="rounded-2xl bg-[#0F172A] border border-white/10 shadow-2xl overflow-hidden">
            <div className="flex items-center gap-1.5 px-4 py-3 bg-[#0B1220] border-b border-white/5">
              <span className="w-2.5 h-2.5 rounded-full bg-red-400/70"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-400/70"></span>
              <span className="w-2.5 h-2.5 rounded-full bg-green-400/70"></span>
            </div>

            <div className="relative aspect-video bg-[#0B1220] flex items-center justify-center">
              <div className="w-16 h-16 rounded-full bg-white/10 border border-white/20 flex items-center justify-center backdrop-blur-sm">
                <FaPlay className="text-white ml-1" size={20} />
              </div>
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-800">
                <div className="h-full w-1/3 bg-gradient-to-r from-[#2546F0] to-[#34E0D8]"></div>
              </div>
            </div>

            <div className="p-5">
              <p className="text-[11px] font-medium text-[#34E0D8] uppercase tracking-wider mb-1">
                Course Player
              </p>
              <h3 className="font-medium text-white mb-4">
                Watch lessons, complete quizzes, earn a certificate
              </h3>
              <div className="space-y-2.5">
                <div className="flex items-center gap-2 text-sm text-gray-300">
                  <span className="w-4 h-4 rounded-full bg-green-500 flex items-center justify-center text-[9px] text-white">✓</span>
                  Lesson 1: Getting Started
                </div>
                <div className="flex items-center gap-2 text-sm text-white font-medium">
                  <span className="w-4 h-4 rounded-full bg-[#2546F0] flex items-center justify-center text-[9px]">2</span>
                  Lesson 2: Core Concepts
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <span className="w-4 h-4 rounded-full bg-gray-700 flex items-center justify-center text-[9px]">3</span>
                  Course Quiz
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ========== TRUSTED / TRACKS SECTION ========== */}
      <TrustedSection />

    </div>
  );
}