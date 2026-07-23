import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Award, CheckCircle, ShieldAlert, Play, LogOut } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('sf_token');
    localStorage.removeItem('sf_user');
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-[#0B1130] text-white p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Bar */}
        <header className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/10 pb-6 gap-4">
          <div>
            <h1 className="text-3xl font-extrabold">Student Learning Dashboard</h1>
            <p className="text-gray-400 text-sm mt-1">
              Track your enrolled tracks, assessment scores, and verified digital certificates.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Direct Switch to Admin Control Center */}
            <Link
              to="/admin/dashboard"
              className="px-4 py-2.5 rounded-xl bg-white/5 border border-[#34E0D8]/30 hover:bg-[#34E0D8]/10 text-[#34E0D8] text-xs font-semibold flex items-center gap-2 transition-all shadow-sm"
            >
              <ShieldAlert className="w-4 h-4" /> Admin Dashboard
            </Link>

            <button
              onClick={handleLogout}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold flex items-center gap-2 transition-colors"
            >
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </header>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex items-center gap-4">
            <div className="p-3 bg-[#2546F0]/20 text-[#2546F0] rounded-xl">
              <BookOpen className="w-6 h-6 text-[#34E0D8]" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Enrolled Courses</p>
              <p className="text-2xl font-bold">2 Tracks</p>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex items-center gap-4">
            <div className="p-3 bg-[#1FC98D]/20 text-[#1FC98D] rounded-xl">
              <CheckCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Avg Quiz Score</p>
              <p className="text-2xl font-bold">88.5%</p>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex items-center gap-4">
            <div className="p-3 bg-amber-500/20 text-amber-400 rounded-xl">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Certificates Earned</p>
              <p className="text-2xl font-bold">1 Verified</p>
            </div>
          </div>
        </div>

        {/* Active Tracks */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold">In Progress & Completed Tracks</h2>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 flex-1">
              <span className="text-xs font-mono text-[#34E0D8] uppercase tracking-wider font-bold">Cybersecurity</span>
              <h3 className="text-lg font-bold">Network Security & Infrastructure</h3>
              
              {/* Progress Bar */}
              <div className="w-full bg-white/10 rounded-full h-2.5 overflow-hidden max-w-xl mt-2">
                <div className="bg-[#34E0D8] h-full rounded-full" style={{ width: '85%' }}></div>
              </div>
              <p className="text-xs text-gray-400 font-mono">85% Completed — Final Quiz Passed</p>
            </div>

            <Link
              to="/player/network-security"
              className="px-6 py-3 rounded-xl bg-[#2546F0] hover:bg-[#2546F0]/90 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#2546F0]/30 self-start md:self-center"
            >
              <Play className="w-4 h-4 fill-current" /> Continue Course
            </Link>
          </div>
        </section>

      </div>
    </div>
  );
}
