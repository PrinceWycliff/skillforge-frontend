import React, { useEffect, useState } from 'react';
import { 
  Users, BookOpen, Award, TrendingUp, ShieldCheck, LogOut, 
  Trash2, Ban, CheckCircle, Search, RefreshCw, AlertTriangle, BookMarked 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [recentCerts, setRecentCerts] = useState([]);
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [activeTab, setActiveTab] = useState('users'); // 'users' | 'courses' | 'certs'
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingCourses, setLoadingCourses] = useState(false);
  const [actionMessage, setActionMessage] = useState(null);

  const navigate = useNavigate();
  const API_BASE = 'https://skillforge-backend-4wd6.onrender.com';

  const getHeaders = () => {
    const token = localStorage.getItem('sf_token') || localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    };
  };

  // 1. Fetch Overall Analytics & Issued Certificates
  const fetchAnalytics = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/admin/analytics`, { headers: getHeaders() });
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
        setRecentCerts(data.recentCertificates || []);
      }
    } catch (err) {
      console.error('Fetch Analytics Error:', err);
    }
  };

  // 2. Fetch All Registered Users
  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await fetch(`${API_BASE}/api/admin/users`, { headers: getHeaders() });
      const data = await res.json();
      if (res.ok && data.users) {
        setUsers(data.users);
      } else if (data.data) {
        setUsers(data.data);
      }
    } catch (err) {
      console.error('Fetch Users Error:', err);
    } finally {
      setLoadingUsers(false);
    }
  };

  // 3. Fetch All Platform Courses
  const fetchCourses = async () => {
    setLoadingCourses(true);
    try {
      const res = await fetch(`${API_BASE}/api/courses`);
      const data = await res.json();
      if (data.success && data.data) {
        setCourses(data.data);
      } else if (Array.isArray(data)) {
        setCourses(data);
      }
    } catch (err) {
      console.error('Fetch Courses Error:', err);
    } finally {
      setLoadingCourses(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
    fetchUsers();
    fetchCourses();
  }, []);

  const triggerMessage = (msg, type = 'success') => {
    setActionMessage({ msg, type });
    setTimeout(() => setActionMessage(null), 4000);
  };

  // Action: Delete User (Frees up email to re-register)
  const handleDeleteUser = async (userId, email) => {
    if (!window.confirm(`Are you sure you want to completely delete user "${email}"? This will allow them to re-register.`)) {
      return;
    }

    try {
      const res = await fetch(`${API_BASE}/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      const data = await res.json();

      if (res.ok) {
        triggerMessage(`User ${email} successfully removed from platform.`);
        setUsers(prev => prev.filter(u => u.id !== userId));
        fetchAnalytics();
      } else {
        triggerMessage(data.message || 'Failed to delete user.', 'error');
      }
    } catch (err) {
      console.error('Delete User Error:', err);
      triggerMessage('Server connection error while deleting user.', 'error');
    }
  };

  // Action: Toggle Restriction / Account Status
  const handleToggleStatus = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'suspended' ? 'active' : 'suspended';
    try {
      const res = await fetch(`${API_BASE}/api/admin/users/${userId}/status`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ status: newStatus })
      });
      const data = await res.json();

      if (res.ok) {
        triggerMessage(`User account status updated to ${newStatus.toUpperCase()}`);
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: newStatus } : u));
      } else {
        triggerMessage(data.message || 'Failed to update user status.', 'error');
      }
    } catch (err) {
      console.error('Status Toggle Error:', err);
      triggerMessage('Failed to update account restriction status.', 'error');
    }
  };

  // Action: Delete Course
  const handleDeleteCourse = async (courseId, title) => {
    if (!window.confirm(`Delete course "${title}" permanently?`)) return;

    try {
      const res = await fetch(`${API_BASE}/api/admin/courses/${courseId}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      
      if (res.ok) {
        triggerMessage(`Course "${title}" removed.`);
        setCourses(prev => prev.filter(c => c.id !== courseId));
        fetchAnalytics();
      } else {
        triggerMessage('Unable to delete course.', 'error');
      }
    } catch (err) {
      console.error('Delete Course Error:', err);
      triggerMessage('Error communicating with backend.', 'error');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('sf_token');
    localStorage.removeItem('sf_user');
    localStorage.removeItem('token');
    navigate('/admin/login');
  };

  // Filter users by search term & role filter
  const filteredUsers = users.filter(u => {
    const matchesSearch = 
      (u.name && u.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (u.email && u.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (u.id && String(u.id).includes(searchTerm));
    
    const matchesRole = roleFilter === 'ALL' || (u.role && u.role.toUpperCase() === roleFilter);
    return matchesSearch && matchesRole;
  });

  return (
    <div className="min-h-screen bg-[#0B1130] text-white p-4 sm:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Bar */}
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <span className="text-xs font-mono text-[#34E0D8] tracking-widest">
              ROLE: PLATFORM ADMINISTRATOR
            </span>
            <h1 className="text-3xl font-extrabold mt-1">Skillforge Control Center</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => { fetchAnalytics(); fetchUsers(); fetchCourses(); }}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold transition"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Refresh Data
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-sm font-semibold transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" /> Admin Sign Out
            </button>
          </div>
        </header>

        {/* Action Status Notification Banner */}
        {actionMessage && (
          <div className={`p-4 rounded-xl border flex items-center justify-between text-sm font-medium ${
            actionMessage.type === 'error' 
              ? 'bg-red-500/20 border-red-500/40 text-red-300' 
              : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
          }`}>
            <span className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              {actionMessage.msg}
            </span>
            <button onClick={() => setActionMessage(null)} className="text-xs opacity-70 hover:opacity-100">✕</button>
          </div>
        )}

        {/* Analytics Cards */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex items-center gap-4 shadow-lg">
              <div className="p-3 bg-[#2546F0]/20 text-[#34E0D8] rounded-xl"><Users className="w-6 h-6" /></div>
              <div>
                <p className="text-xs text-gray-400">Total Registered Accounts</p>
                <p className="text-2xl font-bold">{users.length || stats.totalUsers}</p>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex items-center gap-4 shadow-lg">
              <div className="p-3 bg-[#2546F0]/20 text-[#34E0D8] rounded-xl"><BookOpen className="w-6 h-6" /></div>
              <div>
                <p className="text-xs text-gray-400">Active Published Courses</p>
                <p className="text-2xl font-bold">{courses.length}</p>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex items-center gap-4 shadow-lg">
              <div className="p-3 bg-[#1FC98D]/20 text-[#1FC98D] rounded-xl"><Award className="w-6 h-6" /></div>
              <div>
                <p className="text-xs text-gray-400">Verified Credentials Issued</p>
                <p className="text-2xl font-bold">{stats.issuedCertificates}</p>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex items-center gap-4 shadow-lg">
              <div className="p-3 bg-amber-500/20 text-amber-400 rounded-xl"><TrendingUp className="w-6 h-6" /></div>
              <div>
                <p className="text-xs text-gray-400">Assessment Pass Rate</p>
                <p className="text-2xl font-bold">{stats.completionRate}</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab Navigation Controls */}
        <div className="flex border-b border-white/10 gap-8 text-sm font-semibold">
          <button
            onClick={() => setActiveTab('users')}
            className={`pb-3 flex items-center gap-2 border-b-2 transition ${
              activeTab === 'users' ? 'border-[#34E0D8] text-[#34E0D8]' : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" /> User Management ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('courses')}
            className={`pb-3 flex items-center gap-2 border-b-2 transition ${
              activeTab === 'courses' ? 'border-[#34E0D8] text-[#34E0D8]' : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <BookMarked className="w-4 h-4" /> Platform Courses ({courses.length})
          </button>
          <button
            onClick={() => setActiveTab('certs')}
            className={`pb-3 flex items-center gap-2 border-b-2 transition ${
              activeTab === 'certs' ? 'border-[#34E0D8] text-[#34E0D8]' : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4" /> Credentials Audit
          </button>
        </div>

        {/* TAB 1: USER MANAGEMENT PANEL */}
        {activeTab === 'users' && (
          <section className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Users className="w-5 h-5 text-[#34E0D8]" /> Registered System Accounts
              </h2>
              
              {/* Search & Filter Inputs */}
              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search name, email, or ID..."
                    className="w-full pl-9 pr-4 py-2 bg-[#0B1130] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#34E0D8]"
                  />
                </div>
                <select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  className="bg-[#0B1130] border border-white/10 rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none"
                >
                  <option value="ALL">All Roles</option>
                  <option value="STUDENT">Students</option>
                  <option value="INSTRUCTOR">Instructors</option>
                  <option value="ADMIN">Admins</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              {loadingUsers ? (
                <div className="py-12 text-center text-gray-400 text-sm">Loading user directory...</div>
              ) : filteredUsers.length === 0 ? (
                <div className="py-12 text-center text-gray-400 text-sm">
                  {users.length === 0 ? 'No accounts found in database.' : 'No users match your filter criteria.'}
                </div>
              ) : (
                <table className="w-full text-left text-sm">
                  <thead className="text-xs text-gray-400 border-b border-white/10 uppercase bg-white/5">
                    <tr>
                      <th className="py-3 px-4">User Details</th>
                      <th className="py-3 px-4">Role</th>
                      <th className="py-3 px-4">Account Status</th>
                      <th className="py-3 px-4 text-right">Admin Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredUsers.map(u => (
                      <tr key={u.id} className="hover:bg-white/5 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="font-semibold text-white">{u.name || u.full_name || 'Unnamed User'}</div>
                          <div className="text-xs font-mono text-gray-400">{u.email}</div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase ${
                            u.role?.toUpperCase() === 'ADMIN' 
                              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                              : u.role?.toUpperCase() === 'INSTRUCTOR'
                              ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          }`}>
                            {u.role || 'STUDENT'}
                          </span>
                        </td>
                        <td className="py-3.5 px-4">
                          {u.status === 'suspended' ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/20 text-red-400 text-xs font-semibold">
                              <Ban className="w-3 h-3" /> RESTRICTED
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-semibold">
                              <CheckCircle className="w-3 h-3" /> ACTIVE
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* Toggle Account Ban/Restriction */}
                            <button
                              onClick={() => handleToggleStatus(u.id, u.status)}
                              title={u.status === 'suspended' ? 'Re-activate Account' : 'Restrict Account Access'}
                              className={`p-2 rounded-lg border text-xs font-semibold transition ${
                                u.status === 'suspended'
                                  ? 'bg-emerald-500/10 hover:bg-emerald-500/20 border-emerald-500/30 text-emerald-400'
                                  : 'bg-amber-500/10 hover:bg-amber-500/20 border-amber-500/30 text-amber-400'
                              }`}
                            >
                              {u.status === 'suspended' ? 'Unrestrict' : 'Restrict'}
                            </button>

                            {/* Delete User Completely */}
                            <button
                              onClick={() => handleDeleteUser(u.id, u.email)}
                              title="Delete Account (Frees up email)"
                              className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 transition"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>
        )}

        {/* TAB 2: COURSE MANAGEMENT PANEL */}
        {activeTab === 'courses' && (
          <section className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <BookMarked className="w-5 h-5 text-[#34E0D8]" /> Published Platform Courses
            </h2>

            {loadingCourses ? (
              <div className="py-12 text-center text-gray-400 text-sm">Loading published courses...</div>
            ) : courses.length === 0 ? (
              <div className="py-12 text-center text-gray-400 text-sm">No courses available in catalog.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {courses.map(course => (
                  <div key={course.id} className="bg-[#0B1130] border border-white/10 rounded-xl p-4 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-mono uppercase bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded">
                        {course.category || 'General'}
                      </span>
                      <h3 className="font-bold text-base mt-2 line-clamp-1">{course.title}</h3>
                      <p className="text-xs text-gray-400 mt-1 line-clamp-2">{course.description || 'No description provided.'}</p>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                      <span className="text-xs text-gray-500 font-mono">Course ID: {course.id}</span>
                      <button
                        onClick={() => handleDeleteCourse(course.id, course.title)}
                        className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg text-xs font-semibold flex items-center gap-1 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" /> Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* TAB 3: CERTIFICATES AUDIT LOG */}
        {activeTab === 'certs' && (
          <section className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl">
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
                    <th className="py-3 px-4">Verification</th>
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
        )}

      </div>
    </div>
  );
}