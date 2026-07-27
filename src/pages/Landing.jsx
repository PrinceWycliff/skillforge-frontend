import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Landing() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user session exists in local storage
    const user = localStorage.getItem('user');
    setIsLoggedIn(!!user);
  }, []);

  return (
    <div className="min-h-screen bg-[#0B1130] text-white flex flex-col">
      
      {/* ========================================================= */}
      {/* 1. TOP NAVBAR / HEADER WITH LOGO & NAVIGATION             */}
      {/* ========================================================= */}
      <header className="border-b border-gray-800 bg-[#0B1130]/90 backdrop-blur sticky top-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          
          {/* Skillforge Logo & Brand Name */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-xl text-white shadow-lg group-hover:bg-blue-500 transition">
              S
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 text-transparent bg-clip-text tracking-wide">
              Skillforge
            </span>
          </Link>

          {/* Navigation & Action Buttons */}
          <div className="flex items-center gap-4">
            <Link 
              to="/catalog" 
              className="hidden sm:inline-block text-gray-300 hover:text-white text-sm font-medium transition px-3 py-2"
            >
              Courses
            </Link>

            {isLoggedIn ? (
              <Link
                to="/dashboard"
                className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-5 py-2 rounded-lg text-sm transition shadow-md"
              >
                Go to Dashboard
              </Link>
            ) : (
              <Link
                to="/login"
                className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-5 py-2 rounded-lg text-sm transition shadow-md"
              >
                Sign In
              </Link>
            )}
          </div>

        </div>
      </header>

      {/* ========================================================= */}
      {/* 2. RESTORED CENTERED HERO BANNER SECTION (image_2.png)     */}
      {/* ========================================================= */}
      <main className="flex-1 flex flex-col justify-center items-center text-center px-6 py-12 md:py-20">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          
          {/* Main Headline */}
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-3">
            Explore Courses & Skill Tracks <span className="text-blue-400">Build hands-on expertise in Networking, Systems Administration, and Software Engineering.</span>
          </h1>

          {/* Subtitle / Description Text */}
          <p className="text-gray-400 text-base md:text-lg max-w-xl mb-12">
            Hands-on tracks designed for Systems Administration, Computer Networking, Software Engineering, and Business IT.
          </p>

          {/* Centered Explore Catalog Button (Restored Design) */}
          <Link
            to="/catalog"
            className="bg-blue-600 hover:bg-blue-500 text-white px-10 py-3 rounded-md font-semibold transition"
          >
            Explore Course Catalog
          </Link>

        </div>
      </main>

    </div>
  );
}