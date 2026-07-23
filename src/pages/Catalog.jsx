import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { PlayCircle, ShieldCheck, Clock, Award, Sparkles, ArrowRight, BookOpen, User } from 'lucide-react';

export default function Catalog() {
  const navigate = useNavigate();
  const token = localStorage.getItem('sf_token');
  const user = JSON.parse(localStorage.getItem('sf_user') || '{}');

  const courses = [
    {
      id: 'net-sec-101',
      title: 'Network Architecture & Protocol Security',
      level: 'Intermediate',
      duration: '6 Hours',
      modules: 4,
      description: 'Master packet filtering, transport layer security, stateful inspection, and ACL deployment.',
      tag: 'Systems & Infrastructure'
    },
    {
      id: 'fullstack-node',
      title: 'Full-Stack Web Engineering with Node.js',
      level: 'Advanced',
      duration: '10 Hours',
      modules: 6,
      description: 'Build REST APIs, manage JWT authentication, integrate MongoDB/PostgreSQL, and optimize web app UI.',
      tag: 'Software Engineering'
    },
    {
      id: 'sys-admin-core',
      title: 'Enterprise Systems Administration & Active Directory',
      level: 'Beginner to Intermediate',
      duration: '8 Hours',
      modules: 5,
      description: 'Learn domain controller management, group policies, access control, and server automation.',
      tag: 'IT Infrastructure'
    }
  ];

  const handleEnrollClick = (courseId) => {
    if (token) {
      // User is logged in -> Go directly to the player
      navigate(`/player/${courseId}`);
    } else {
      // User is NOT logged in -> Route to login with return path
      navigate('/login', { state: { from: `/player/${courseId}` } });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('sf_token');
    localStorage.removeItem('sf_user');
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[#0B1130] text-white">
      {/* Top Navbar */}
      <header className="border-b border-white/10 px-8 py-5 flex items-center justify-between max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#2546F0] flex items-center justify-center font-bold text-lg shadow-lg shadow-[#2546F0]/30">
            SF
          </div>
          <span className="text-xl font-extrabold text-[#34E0D8] tracking-wider">SKILLFORGE.</span>
        </div>

        <nav className="flex items-center gap-6 text-sm font-semibold">
          {token ? (
            <div className="flex items-center gap-4">
              <span className="text-gray-300 flex items-center gap-2">
                <User className="w-4 h-4 text-[#34E0D8]" /> {user.fullName || 'Learner'}
              </span>
              <Link to="/dashboard" className="text-[#34E0D8] hover:underline">
                Dashboard
              </Link>
              <button 
                onClick={handleLogout}
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs transition-colors"
              >
                Log Out
              </button>
            </div>
          ) : (
            <Link 
              to="/login"
              className="px-5 py-2.5 rounded-xl bg-[#2546F0] hover:bg-[#2546F0]/90 text-white font-semibold transition-all shadow-lg shadow-[#2546F0]/30"
            >
              Sign In
            </Link>
          )}
        </nav>
      </header>

      {/* Hero Welcome Section */}
      <section className="max-w-7xl mx-auto px-8 pt-16 pb-12 text-center relative overflow-hidden">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-semibold text-[#34E0D8] mb-6">
          <Sparkles className="w-4 h-4" /> Next-Generation Hands-On Tech Education
        </div>
        
        <h1 className="text-4xl md:text-6xl font-black tracking-tight mb-6 leading-tight">
          Forge Practical Engineering & <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#34E0D8] to-[#2546F0]">
            Systems Infrastructure Mastery
          </span>
        </h1>
        
        <p className="text-gray-400 max-w-2xl mx-auto text-base md:text-lg mb-8 leading-relaxed">
          Welcome to Skillforge! Explore short, high-impact technical tracks. Complete video modules, pass practical benchmarks, and earn verified digital credentials signed directly by industry leadership.
        </p>

        {/* Feature Pill Highlights */}
        <div className="flex flex-wrap justify-center gap-8 text-xs font-semibold text-gray-300 border-y border-white/10 py-6 max-w-4xl mx-auto">
          <div className="flex items-center gap-2">
            <PlayCircle className="w-4 h-4 text-[#34E0D8]" /> Adaptive HLS Video Streams
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#1FC98D]" /> ≥ 80% Assessment Benchmark Gating
          </div>
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-[#F5A524]" /> Cryptographically Signed Certificates
          </div>
        </div>
      </section>

      {/* Course Track Catalog Grid */}
      <main className="max-w-7xl mx-auto px-8 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold">Featured Technical Tracks</h2>
            <p className="text-gray-400 text-sm">Select a course track below to start your learning path.</p>
          </div>
          <span className="text-xs font-mono bg-white/5 border border-white/10 px-3 py-1.5 rounded-full text-gray-300">
            {courses.length} Active Tracks
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div 
              key={course.id}
              className="bg-white/5 border border-white/10 hover:border-[#34E0D8]/40 rounded-2xl p-6 flex flex-col justify-between transition-all group"
            >
              <div>
                <span className="inline-block px-3 py-1 rounded-md bg-[#2546F0]/20 text-[#34E0D8] text-xs font-semibold mb-4">
                  {course.tag}
                </span>
                
                <h3 className="text-xl font-bold mb-3 group-hover:text-[#34E0D8] transition-colors">
                  {course.title}
                </h3>
                
                <p className="text-gray-400 text-sm mb-6 leading-relaxed">
                  {course.description}
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs text-gray-400 border-t border-white/10 pt-4 mb-6">
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {course.duration}</span>
                  <span className="flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" /> {course.modules} Modules</span>
                  <span className="text-[#34E0D8]">{course.level}</span>
                </div>

                <button
                  onClick={() => handleEnrollClick(course.id)}
                  className="w-full py-3 rounded-xl bg-[#2546F0] hover:bg-[#2546F0]/90 font-bold text-white text-sm flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#2546F0]/20"
                >
                  Enroll Now <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}