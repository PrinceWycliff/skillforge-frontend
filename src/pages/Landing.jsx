import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import TrustedSection from '../components/TrustedSection';

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
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-lg text-white shadow-md group-hover:bg-blue-500 transition">
              S
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 text-transparent bg-clip-text tracking-tight">
              Skillforge
            </span>
          </Link>

          {/* Navigation & Action Buttons */}
          <div className="flex items-center gap-6">
            <Link 
              to="/catalog" 
              className="hidden sm:inline-block text-gray-300 hover:text-white text-sm font-medium transition"
            >
              Courses
            </Link>

            {isLoggedIn ? (
              <Link
                to="/dashboard"
                className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-4 py-2 rounded-lg text-sm transition shadow-sm"
              >
                Go to Dashboard
              </Link>
            ) : (
              <Link
                to="/login"
                className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-4 py-2 rounded-lg text-sm transition shadow-sm"
              >
                Sign In
              </Link>
            )}
          </div>

        </div>
      </header>

      {/* 2. HERO BANNER */}
      <main className="flex-1 flex flex-col justify-center items-center text-center px-4 py-16 md:py-24">
        <div className="max-w-3xl mx-auto flex flex-col items-center">
     
          
          {/* Clean Main Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight leading-tight mb-4">
            Master Practical Tech Skills with <span className="text-blue-400">Skillforge</span>
          </h1>

          {/* Subtitle with proper hierarchy */}
          <p className="text-gray-300 text-sm sm:text-base md:text-lg max-w-xl leading-relaxed mb-8">
            Hands-on tracks designed for Systems Administration, Computer Networking, Software Engineering, and Business IT.
          </p>

          {/* Primary Action Button */}
          <Link
            to="/catalog"
            className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-lg font-semibold text-sm sm:text-base transition-all shadow-md hover:shadow-blue-500/20"
          >
            Explore Course Catalog
          </Link>
               
        </div>
          {/* Social Proof & Partner Section */}
          <TrustedSection />
      </main>

      {/* 3. FOOTER (INCLUDED INSIDE JSX RETURN) */}
      <footer className="border-t border-gray-800/80 py-8 text-center text-xs text-gray-500">
        <p>© 2026 SkillForge. All rights reserved.</p>
        
        {/* Discreet Portal Links */}
        <div className="mt-2 flex justify-center gap-6">
          <Link to="/instructor/login" className="hover:text-gray-400 transition">
            Instructor Portal
          </Link>
          <Link to="/admin/login" className="hover:text-gray-400 transition">
            Admin Access
          </Link>
        </div>
      </footer>

    </div>
  );
}