import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaHome, FaBook, FaChalkboardTeacher, FaUserShield, FaSignOutAlt } from 'react-icons/fa';

// One reusable sidebar for every logged-in page. Nav items and logout behavior
// adapt based on the `role` prop passed in by each page.
const NAV_CONFIG = {
  student: [
    { label: 'Dashboard', path: '/dashboard', icon: FaHome },
    { label: 'Browse Catalog', path: '/catalog', icon: FaBook },
  ],
  instructor: [
    { label: 'Instructor Studio', path: '/instructor/studio', icon: FaChalkboardTeacher },
    { label: 'Browse Catalog', path: '/catalog', icon: FaBook },
  ],
  admin: [
    { label: 'Admin Dashboard', path: '/admin/dashboard', icon: FaUserShield },
  ],
};

export default function Sidebar({ role = 'student' }) {
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = NAV_CONFIG[role] || NAV_CONFIG.student;

  const handleLogout = () => {
    if (role === 'instructor') {
      localStorage.removeItem('instructor_token');
      localStorage.removeItem('instructor_user');
      navigate('/instructor/login');
    } else if (role === 'admin') {
      localStorage.clear();
      navigate('/admin/login');
    } else {
      localStorage.clear();
      navigate('/login');
    }
  };

  return (
    <aside className="w-64 shrink-0 min-h-screen bg-[#0B1130] border-r border-gray-800/80 flex flex-col sticky top-0">
      {/* Brand */}
      <Link to="/" className="flex items-center gap-2.5 px-6 py-6 border-b border-gray-800/80">
        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#2546F0] to-[#34E0D8] flex items-center justify-center font-bold text-lg text-white shadow-lg shadow-blue-500/20 shrink-0">
          S
        </div>
        <span className="text-xl font-bold bg-gradient-to-r from-white to-[#34E0D8] text-transparent bg-clip-text tracking-tight">
          Skillforge
        </span>
      </Link>

      {/* Nav Links */}
      <nav className="flex-1 px-4 py-6 space-y-1.5">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition ${
                isActive
                  ? 'bg-gradient-to-r from-[#2546F0]/20 to-[#34E0D8]/10 text-[#34E0D8] border border-[#2546F0]/40'
                  : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <Icon size={16} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-4 py-6 border-t border-gray-800/80">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition"
        >
          <FaSignOutAlt size={16} />
          Logout
        </button>
      </div>
    </aside>
  );
}