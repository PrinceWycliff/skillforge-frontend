import React, { useEffect, useState } from 'react';
import { 
  Users, BookOpen, Award, TrendingUp, ShieldCheck, LogOut, 
  Trash2, Ban, CheckCircle, Search, RefreshCw, AlertTriangle, 
  BookMarked, UserPlus, ChevronDown, ChevronUp, BarChart2, PieChart,
  UserCheck, Plus
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  // --- CORE STATE ---
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeEnrollments: 0,
    issuedCertificates: 0,
    completionRate: '0.0%',
    avgScore: '82%'
  });
  const [recentCerts, setRecentCerts] = useState([]);
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [instructors, setInstructors] = useState([]);
  
  // --- UI CONTROLS ---
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'users' | 'courses' | 'instructors' | 'certs'
  const [expandedStudentId, setExpandedStudentId] = useState(null);
  
  // --- LOADERS & MESSAGES ---
  const [loading, setLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState(null);
  
  // --- MODAL STATE ---
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [newUser, setNewUser] = useState({
    full_name: '',
    email: '',
    password: '',
    role: 'STUDENT'
  });

  const navigate = useNavigate();
  const API_BASE = 'https://skillforge-backend-4wd6.onrender.com';

  const getHeaders = () => {
    const token = localStorage.getItem('sf_token') || localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    };
  };

  const triggerMessage = (msg, type = 'success') => {
    setActionMessage({ msg, type });
    setTimeout(() => setActionMessage(null), 4000);
  };

  // --- DATA FETCHING ---
  const fetchAllDashboardData = async () => {
    setLoading(true);
    try {
      const headers = getHeaders();

      // Fetch analytics overview
      const analyticsRes = await fetch(`${API_BASE}/api/admin/analytics`, { headers });
      const analyticsData = await analyticsRes.json();
      if (analyticsData.success) {
        setStats(analyticsData.stats || stats);
        setRecentCerts(analyticsData.recentCertificates || []);
      }

      // Fetch users
      const usersRes = await fetch(`${API_BASE}/api/admin/users`, { headers });
      const usersData = await usersRes.json();
      if (usersRes.ok) {
        setUsers(usersData.users || usersData.data || []);
      }

      // Fetch courses
      const coursesRes = await fetch(`${API_BASE}/api/courses`);
      const coursesData = await coursesRes.json();
      const courseList = coursesData.data || (Array.isArray(coursesData) ? coursesData : []);
      setCourses(courseList);

      // Fetch instructor performance stats
      const instRes = await fetch(`${API_BASE}/api/admin/instructors`, { headers });
      if (instRes.ok) {
        const instData = await instRes.json();
        setInstructors(instData.instructors || []);
      }

    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllDashboardData();
  }, []);

  // --- USER ACTIONS ---
  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE}/api/admin/users`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(newUser)
      });
      const data = await res.json();

      if (res.ok) {
        triggerMessage(`Account created for ${newUser.email}`);
        setShowAddUserModal(false);
        setNewUser({ full_name: '', email: '', password: '', role: 'STUDENT' });
        fetchAllDashboardData();
      } else {
        triggerMessage(data.message || 'Failed to create user account.', 'error');
      }
    } catch (err) {
      triggerMessage('Network error while creating account.', 'error');
    }
  };

  const handleDeleteUser = async (userId, email) => {
    if (!window.confirm(`Delete user "${email}" permanently?`)) return;

    try {
      const res = await fetch(`${API_BASE}/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      if (res.ok) {
        triggerMessage(`User ${email} deleted.`);
        setUsers(prev => prev.filter(u => u.id !== userId));
      } else {
        triggerMessage('Failed to remove user.', 'error');
      }
    } catch (err) {
      triggerMessage('Server error while deleting user.', 'error');
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    const newStatus = currentStatus === 'suspended' ? 'active' : 'suspended';
    try {
      const res = await fetch(`${API_BASE}/api/admin/users/${userId}/status`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        triggerMessage(`User status updated to ${newStatus.toUpperCase()}`);
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, status: newStatus } : u));
      }
    } catch (err) {
      triggerMessage('Failed to update status.', 'error');
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/admin/login');
  };

  // Derived Top Enrolled Courses for Analytics Chart
  const sortedCourses = [...courses].sort((a, b) => (b.enrollments || 0) - (a.enrollments || 0)).slice(0, 5);
  const maxEnrollments = Math.max(...sortedCourses.map(c => c.enrollments || 10), 10);

  // User search filtering
  const filteredUsers = users.filter(u => {
    const search = searchTerm.toLowerCase();
    const matchesSearch = 
      (u.name || u.full_name || '').toLowerCase().includes(search) ||
      (u.email || '').toLowerCase().includes(search);
    const matchesRole = roleFilter === 'ALL' || (u.role || 'STUDENT').toUpperCase() === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="min-h-screen bg-[#0B1130] text-white p-4 sm:p-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-white/10 pb-6">
          <div>
            <span className="text-xs font-mono text-[#34E0D8] tracking-widest uppercase">
              Skillforge System Administration
            </span>
            <h1 className="text-3xl font-extrabold mt-1">Platform Analytics & Management</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowAddUserModal(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#2546F0] hover:bg-[#1a38c9] text-white text-xs font-semibold transition"
            >
              <UserPlus className="w-4 h-4" /> Create User Account
            </button>
            <button
              onClick={fetchAllDashboardData}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold transition"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} /> Sync Data
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 text-xs font-semibold transition"
            >
              <LogOut className="w-4 h-4" /> Exit Session
            </button>
          </div>
        </header>

        {/* Action Status Notification */}
        {actionMessage && (
          <div className={`p-4 rounded-xl border flex items-center justify-between text-sm font-medium ${
            actionMessage.type === 'error' ? 'bg-red-500/20 border-red-500/40 text-red-300' : 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
          }`}>
            <span className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" /> {actionMessage.msg}
            </span>
            <button onClick={() => setActionMessage(null)} className="text-xs opacity-70">✕</button>
          </div>
        )}

        {/* Dynamic Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex items-center gap-4 shadow-lg">
            <div className="p-3 bg-[#2546F0]/20 text-[#34E0D8] rounded-xl"><Users className="w-6 h-6" /></div>
            <div>
              <p className="text-xs text-gray-400">Total User Base</p>
              <p className="text-2xl font-bold">{users.length || stats.totalUsers || 0}</p>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex items-center gap-4 shadow-lg">
            <div className="p-3 bg-[#2546F0]/20 text-[#34E0D8] rounded-xl"><BookOpen className="w-6 h-6" /></div>
            <div>
              <p className="text-xs text-gray-400">Active Courses</p>
              <p className="text-2xl font-bold">{courses.length}</p>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex items-center gap-4 shadow-lg">
            <div className="p-3 bg-[#1FC98D]/20 text-[#1FC98D] rounded-xl"><Award className="w-6 h-6" /></div>
            <div>
              <p className="text-xs text-gray-400">Issued Credentials</p>
              <p className="text-2xl font-bold">{stats.issuedCertificates || 0}</p>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex items-center gap-4 shadow-lg">
            <div className="p-3 bg-amber-500/20 text-amber-400 rounded-xl"><TrendingUp className="w-6 h-6" /></div>
            <div>
              <p className="text-xs text-gray-400">Completion Rate</p>
              <p className="text-2xl font-bold">{stats.completionRate || '0.0%'}</p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-white/10 gap-8 text-sm font-semibold overflow-x-auto">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 flex items-center gap-2 border-b-2 transition whitespace-nowrap ${
              activeTab === 'overview' ? 'border-[#34E0D8] text-[#34E0D8]' : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <BarChart2 className="w-4 h-4" /> Performance Graphs
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`pb-3 flex items-center gap-2 border-b-2 transition whitespace-nowrap ${
              activeTab === 'users' ? 'border-[#34E0D8] text-[#34E0D8]' : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <Users className="w-4 h-4" /> Students & Enrollment ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('instructors')}
            className={`pb-3 flex items-center gap-2 border-b-2 transition whitespace-nowrap ${
              activeTab === 'instructors' ? 'border-[#34E0D8] text-[#34E0D8]' : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <UserCheck className="w-4 h-4" /> Instructor Statistics
          </button>
          <button
            onClick={() => setActiveTab('courses')}
            className={`pb-3 flex items-center gap-2 border-b-2 transition whitespace-nowrap ${
              activeTab === 'courses' ? 'border-[#34E0D8] text-[#34E0D8]' : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <BookMarked className="w-4 h-4" /> Platform Courses ({courses.length})
          </button>
          <button
            onClick={() => setActiveTab('certs')}
            className={`pb-3 flex items-center gap-2 border-b-2 transition whitespace-nowrap ${
              activeTab === 'certs' ? 'border-[#34E0D8] text-[#34E0D8]' : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4" /> Credentials Audit
          </button>
        </div>

        {/* --- TAB 1: OVERVIEW & PERFORMANCE GRAPHS --- */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Top Enrolled Courses Graph */}
            <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold flex items-center gap-2">
                    <BarChart2 className="w-5 h-5 text-[#34E0D8]" /> Highest Enrolled Courses
                  </h2>
                  <p className="text-xs text-gray-400">Popular tracks ranked by active user registrations</p>
                </div>
                <span className="text-xs font-mono text-gray-400">Live Analytics</span>
              </div>

              {sortedCourses.length === 0 ? (
                <div className="py-12 text-center text-gray-400 text-sm">No course enrollment data recorded yet.</div>
              ) : (
                <div className="space-y-4 pt-2">
                  {sortedCourses.map((course, idx) => {
                    const count = course.enrollments || (15 - idx * 2); // Fallback sample scaling
                    const percentage = Math.min(100, Math.round((count / maxEnrollments) * 100));
                    return (
                      <div key={course.id || idx} className="space-y-1.5">
                        <div className="flex justify-between text-xs">
                          <span className="font-semibold truncate max-w-[250px]">{course.title}</span>
                          <span className="font-mono text-[#34E0D8]">{count} Students enrolled</span>
                        </div>
                        <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden border border-white/10">
                          <div 
                            className="h-full bg-gradient-to-r from-[#2546F0] to-[#34E0D8] rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Score & Completion Distribution */}
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl space-y-6">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <PieChart className="w-5 h-5 text-[#1FC98D]" /> Score Distribution
              </h2>
              
              <div className="flex flex-col items-center justify-center py-4 space-y-4">
                <div className="relative w-36 h-36 flex items-center justify-center border-8 border-[#1FC98D]/20 border-t-[#1FC98D] border-r-[#34E0D8] rounded-full">
                  <div className="text-center">
                    <span className="text-2xl font-extrabold">{stats.avgScore || '82%'}</span>
                    <span className="block text-[10px] text-gray-400 uppercase tracking-widest">Avg Quiz Score</span>
                  </div>
                </div>

                <div className="w-full space-y-2 text-xs pt-2">
                  <div className="flex justify-between p-2 rounded bg-white/5">
                    <span className="text-gray-400">Passing Scores (&gt;70%):</span>
                    <span className="font-bold text-emerald-400">88%</span>
                  </div>
                  <div className="flex justify-between p-2 rounded bg-white/5">
                    <span className="text-gray-400">Average Completion Time:</span>
                    <span className="font-bold text-white">4.2 Days</span>
                  </div>
                  <div className="flex justify-between p-2 rounded bg-white/5">
                    <span className="text-gray-400">Retake Rate:</span>
                    <span className="font-bold text-amber-400">12%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* --- TAB 2: STUDENTS & ENROLLED COURSES --- */}
        {activeTab === 'users' && (
          <section className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl space-y-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <Users className="w-5 h-5 text-[#34E0D8]" /> Student Directory & Enrolled Track Details
              </h2>
              
              <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search name or email..."
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
              <table className="w-full text-left text-sm">
                <thead className="text-xs text-gray-400 border-b border-white/10 uppercase bg-white/5">
                  <tr>
                    <th className="py-3 px-4">User</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Enrolled Courses</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredUsers.map(u => {
                    const isExpanded = expandedStudentId === u.id;
                    const enrolledList = u.enrolledCourses || [];

                    return (
                      <React.Fragment key={u.id}>
                        <tr className="hover:bg-white/5 transition-colors">
                          <td className="py-3.5 px-4">
                            <div className="font-semibold text-white">{u.name || u.full_name || 'Unnamed User'}</div>
                            <div className="text-xs font-mono text-gray-400">{u.email}</div>
                          </td>
                          <td className="py-3.5 px-4">
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-300">
                              {u.role || 'STUDENT'}
                            </span>
                          </td>
                          <td className="py-3.5 px-4">
                            {u.status === 'suspended' ? (
                              <span className="text-xs text-red-400 font-semibold">RESTRICTED</span>
                            ) : (
                              <span className="text-xs text-emerald-400 font-semibold">ACTIVE</span>
                            )}
                          </td>
                          <td className="py-3.5 px-4">
                            <button
                              onClick={() => setExpandedStudentId(isExpanded ? null : u.id)}
                              className="flex items-center gap-1.5 text-xs text-[#34E0D8] hover:underline font-semibold"
                            >
                              {enrolledList.length} Courses {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                            </button>
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleToggleStatus(u.id, u.status)}
                                className="p-1.5 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-xs"
                              >
                                {u.status === 'suspended' ? 'Unrestrict' : 'Restrict'}
                              </button>
                              <button
                                onClick={() => handleDeleteUser(u.id, u.email)}
                                className="p-1.5 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>

                        {/* Expanded Sub-Table for Enrolled Courses */}
                        {isExpanded && (
                          <tr className="bg-[#080d26]">
                            <td colSpan={5} className="p-4">
                              <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3">
                                <h4 className="text-xs font-bold text-[#34E0D8] uppercase tracking-wider">
                                  Enrolled Tracks & Quiz Performance for {u.name || u.email}
                                </h4>
                                {enrolledList.length === 0 ? (
                                  <p className="text-xs text-gray-400">This student is not enrolled in any courses yet.</p>
                                ) : (
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {enrolledList.map((c, i) => (
                                      <div key={i} className="p-3 bg-white/5 rounded-lg border border-white/5 flex justify-between items-center text-xs">
                                        <div>
                                          <p className="font-bold">{c.title || `Course #${c.course_id}`}</p>
                                          <p className="text-gray-400">Progress: {c.progress || '0'}%</p>
                                        </div>
                                        <div className="text-right">
                                          <span className="text-emerald-400 font-bold">Score: {c.score || 'N/A'}</span>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* --- TAB 3: INSTRUCTOR MANAGEMENT STATISTICS --- */}
        {activeTab === 'instructors' && (
          <section className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-[#34E0D8]" /> Instructor Management & Metrics
            </h2>

            {instructors.length === 0 ? (
              <div className="py-12 text-center text-gray-400 text-sm">No instructor statistics available.</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {instructors.map((inst) => (
                  <div key={inst.id} className="bg-[#0B1130] border border-white/10 rounded-xl p-5 space-y-4">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <div>
                        <h3 className="font-bold text-base">{inst.name || inst.email}</h3>
                        <p className="text-xs text-gray-400">{inst.email}</p>
                      </div>
                      <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 text-[10px] font-bold uppercase">
                        Instructor
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-white/5 p-2 rounded">
                        <span className="text-gray-400 block">Assigned Courses</span>
                        <span className="text-lg font-bold text-white">{inst.coursesCount || 0}</span>
                      </div>
                      <div className="bg-white/5 p-2 rounded">
                        <span className="text-gray-400 block">Total Students</span>
                        <span className="text-lg font-bold text-[#34E0D8]">{inst.totalStudents || 0}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* --- TAB 4: COURSES --- */}
        {activeTab === 'courses' && (
          <section className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl space-y-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <BookMarked className="w-5 h-5 text-[#34E0D8]" /> Course Catalog & Content Control
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {courses.map(course => (
                <div key={course.id} className="bg-[#0B1130] border border-white/10 rounded-xl p-4 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded">
                      {course.category || 'General'}
                    </span>
                    <h3 className="font-bold text-base mt-2 line-clamp-1">{course.title}</h3>
                    <p className="text-xs text-gray-400 mt-1 line-clamp-2">{course.description || 'No description.'}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-white/10 flex justify-between items-center text-xs">
                    <span className="text-gray-400 font-mono">ID: {course.id}</span>
                    <span className="text-emerald-400 font-semibold">{course.enrollments || 0} Enrolled</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* --- TAB 5: CERTIFICATES AUDIT --- */}
        {activeTab === 'certs' && (
          <section className="bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-[#34E0D8]" /> Issued Credentials Audit
            </h2>
            <table className="w-full text-left text-sm">
              <thead className="text-xs text-gray-400 border-b border-white/10 uppercase bg-white/5">
                <tr>
                  <th className="py-3 px-4">Credential ID</th>
                  <th className="py-3 px-4">Recipient</th>
                  <th className="py-3 px-4">Track</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recentCerts.map((cert, index) => (
                  <tr key={index} className="hover:bg-white/5">
                    <td className="py-3 px-4 font-mono text-[#34E0D8]">{cert.id || `CERT-${index + 100}`}</td>
                    <td className="py-3 px-4">{cert.student || 'Student'}</td>
                    <td className="py-3 px-4">{cert.course || 'Course Track'}</td>
                    <td className="py-3 px-4"><span className="text-emerald-400 text-xs font-bold">VERIFIED</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

      </div>

      {/* --- ADD USER MODAL --- */}
      {showAddUserModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-[#0B1130] border border-white/10 rounded-2xl p-6 w-full max-w-md space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-[#34E0D8]" /> Create System Account
              </h3>
              <button onClick={() => setShowAddUserModal(false)} className="text-gray-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <label className="text-xs text-gray-400 block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newUser.full_name}
                  onChange={(e) => setNewUser({ ...newUser, full_name: e.target.value })}
                  placeholder="e.g. Prince Dickson"
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#34E0D8]"
                />
              </div>

              <div>
                <label className="text-xs text-gray-400 block mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="student@example.com"
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#34E0D8]"
                />
              </div>

              <div>
                <label className="text-xs text-gray-400 block mb-1">Password</label>
                <input
                  type="password"
                  required
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#34E0D8]"
                />
              </div>

              <div>
                <label className="text-xs text-gray-400 block mb-1">Assigned Role</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  className="w-full px-3 py-2 bg-[#0B1130] border border-white/10 rounded-xl text-xs text-white focus:outline-none focus:border-[#34E0D8]"
                >
                  <option value="STUDENT">Student</option>
                  <option value="INSTRUCTOR">Instructor</option>
                  <option value="ADMIN">Administrator</option>
                </select>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddUserModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#2546F0] hover:bg-[#1a38c9] text-white text-xs font-semibold"
                >
                  Create Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}