import React, { useEffect, useState } from 'react';
import { Users, BookOpen, Award, TrendingUp, ShieldCheck, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentCerts, setRecentCerts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('sf_token');
    fetch('https://skillforge-backend-4wd6.onrender.com/api/admin/analytics', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setStats(data.stats);
          setRecentCerts(data.recentCertificates);
        }
      })
      .catch(console.error);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('sf_token');
    localStorage.removeItem('sf_user');
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-[#0B1130] text-white p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Bar */}
        <header className="flex items-center justify-between border-b border-white/10 pb-6">
          <div>
            <span className="text-xs font-mono text-[#34E0D8]">ROLE: PLATFORM ADMINISTRATOR</span>
            <h1 className="text-3xl font-extrabold mt-1">Skillforge Control Center</h1>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-sm font-semibold transition-colors"
          >
            <LogOut className="w-4 h-4" /> Admin Sign Out
          </button>
        </header>

        {/* Analytics Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex items-center gap-4">
              <div className="p-3 bg-[#2546F0]/20 text-[#34E0D8] rounded-xl"><Users className="w-6 h-6" /></div>
              <div>
                <p className="text-xs text-gray-400">Total Registered Learners</p>
                <p className="text-2xl font-bold">{stats.totalUsers}</p>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex items-center gap-4">
              <div className="p-3 bg-[#2546F0]/20 text-[#34E0D8] rounded-xl"><BookOpen className="w-6 h-6" /></div>
              <div>
                <p className="text-xs text-gray-400">Active Course Enrollments</p>
                <p className="text-2xl font-bold">{stats.activeEnrollments}</p>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex items-center gap-4">
              <div className="p-3 bg-[#1FC98D]/20 text-[#1FC98D] rounded-xl"><Award className="w-6 h-6" /></div>
              <div>
                <p className="text-xs text-gray-400">Verified Credentials Issued</p>
                <p className="text-2xl font-bold">{stats.issuedCertificates}</p>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex items-center gap-4">
              <div className="p-3 bg-amber-500/20 text-amber-400 rounded-xl"><TrendingUp className="w-6 h-6" /></div>
              <div>
                <p className="text-xs text-gray-400">Assessment Pass Rate</p>
                <p className="text-2xl font-bold">{stats.completionRate}</p>
              </div>
            </div>
          </div>
        )}

        {/* Audit Log / Issued Credentials Section */}
        <section className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-[#34E0D8]" /> Recently Issued Digital Certificates
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="text-xs text-gray-400 border-b border-white/10 uppercase bg-white/5">
                <tr>
                  <th className="py-3 px-4">Serial Hash</th>
                  <th className="py-3 px-4">Student Name</th>
                  <th className="py-3 px-4">Course Track</th>
                  <th className="py-3 px-4">Issue Date</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recentCerts.map(cert => (
                  <tr key={cert.id} className="hover:bg-white/5 transition-colors">
                    <td className="py-3 px-4 font-mono text-[#34E0D8]">{cert.id}</td>
                    <td className="py-3 px-4 font-semibold">{cert.student}</td>
                    <td className="py-3 px-4 text-gray-300">{cert.course}</td>
                    <td className="py-3 px-4 text-gray-400">{cert.date}</td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-1 rounded-full bg-[#1FC98D]/20 text-[#1FC98D] text-xs font-semibold">
                        VERIFIED
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

      </div>
    </div>
  );
}