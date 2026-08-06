import React, { useState, useEffect } from 'react';

// Automatically uses Vercel / Vite / React env variables or falls back to backend host
const API_BASE_URL = 
  process.env.REACT_APP_API_URL || 
  import.meta.env?.VITE_API_URL || 
  'https://skillforge-backend.onrender.com'; // Adjust fallback to your active backend host URL if different

const AdminDashboard = () => {
  const [adminUser, setAdminUser] = useState(null);
  const [activeTab, setActiveTab] = useState('users');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeEnrollments: 0,
    issuedCertificates: 0,
    completionRate: '0.0%',
    avgScore: '94.2%'
  });
  const [chartData, setChartData] = useState([]);
  const [users, setUsers] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [message, setMessage] = useState({ type: '', text: '' });

  // Account Creation Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    full_name: '',
    email: '',
    password: '',
    role: 'admin'
  });

  useEffect(() => {
    // Retrieve Logged-in Admin Info from Session / LocalStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setAdminUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse admin session user');
      }
    }
    fetchDashboardData();

    // Refresh active metrics every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const getAuthHeader = () => ({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${localStorage.getItem('token')}`
  });

  const fetchDashboardData = async () => {
    try {
      // Fetch Analytics Overview & Chart Data
      const analyticsRes = await fetch(`${API_BASE_URL}/api/admin/analytics`, { headers: getAuthHeader() });
      const analyticsData = await analyticsRes.json();
      if (analyticsData.success) {
        setStats(analyticsData.stats);
        setChartData(analyticsData.chartData || []);
      } else {
        showMessage('error', analyticsData.message || 'Failed to synchronize dashboard metrics.');
      }

      // Fetch System Accounts
      const usersRes = await fetch(`${API_BASE_URL}/api/admin/users`, { headers: getAuthHeader() });
      const usersData = await usersRes.json();
      if (usersData.success) {
        setUsers(usersData.users || []);
      }

      // Fetch Instructors
      const instructorsRes = await fetch(`${API_BASE_URL}/api/admin/instructors`, { headers: getAuthHeader() });
      const instructorsData = await instructorsRes.json();
      if (instructorsData.success) {
        setInstructors(instructorsData.instructors || []);
      }
    } catch (err) {
      console.error('Dashboard Fetch Error:', err);
      showMessage('error', `Failed to connect to API backend at ${API_BASE_URL}`);
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const handleCreateAccount = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/users`, {
        method: 'POST',
        headers: getAuthHeader(),
        body: JSON.stringify(newUser)
      });

      const data = await res.json();
      if (data.success) {
        showMessage('success', `${newUser.role.toUpperCase()} account created successfully!`);
        setIsModalOpen(false);
        setNewUser({ full_name: '', email: '', password: '', role: 'admin' });
        fetchDashboardData();
      } else {
        showMessage('error', data.message || 'Failed to create account.');
      }
    } catch (err) {
      showMessage('error', 'Error connecting to API server.');
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    const nextStatus = currentStatus === 'suspended' ? 'active' : 'suspended';
    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/users/${userId}/status`, {
        method: 'PUT',
        headers: getAuthHeader(),
        body: JSON.stringify({ status: nextStatus })
      });

      const data = await res.json();
      if (data.success) {
        showMessage('success', `Account status updated to ${nextStatus}.`);
        fetchDashboardData();
      } else {
        showMessage('error', data.message || 'Failed to update account.');
      }
    } catch (err) {
      showMessage('error', 'Error updating account status.');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to permanently delete this user account?')) return;

    try {
      const res = await fetch(`${API_BASE_URL}/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: getAuthHeader()
      });

      const data = await res.json();
      if (data.success) {
        showMessage('success', 'User account deleted successfully.');
        fetchDashboardData();
      } else {
        showMessage('error', data.message || 'Failed to delete user.');
      }
    } catch (err) {
      showMessage('error', 'Error deleting user account.');
    }
  };

  const filteredUsers = users.filter((u) => {
    const query = searchQuery.toLowerCase();
    const matchesQuery = 
      (u.full_name || u.name || '').toLowerCase().includes(query) ||
      (u.email || '').toLowerCase().includes(query) ||
      String(u.id).includes(query);

    const matchesRole = roleFilter === 'ALL' || (u.role || '').toLowerCase() === roleFilter.toLowerCase();
    return matchesQuery && matchesRole;
  });

  const maxChartValue = Math.max(...chartData.map((d) => Number(d.count) || 0), 10);

  if (loading) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center', backgroundColor: '#0b0f19', color: '#38bdf8', minHeight: '100vh', fontFamily: 'sans-serif' }}>
        <h2>Loading Skillforge Control Center...</h2>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#0b0f19', color: '#f3f4f6', minHeight: '100vh', padding: '2rem', fontFamily: 'sans-serif' }}>
      
      {/* Top Header displaying dynamic active admin details */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid #1e293b', paddingBottom: '1rem' }}>
        <div>
          <span style={{ fontSize: '0.75rem', letterSpacing: '0.05em', color: '#38bdf8', fontWeight: 'bold' }}>
            ROLE: PLATFORM ADMINISTRATOR
          </span>
          <h1 style={{ margin: '0.25rem 0 0 0', fontSize: '1.875rem', fontWeight: 'bold', color: '#ffffff' }}>
            Skillforge Control Center
          </h1>
        </div>

        {/* Dynamic Logged-in Admin Account Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ color: '#ffffff', fontWeight: 'bold', fontSize: '0.95rem' }}>
              {adminUser?.full_name || 'Active Admin Account'}
            </div>
            <div style={{ color: '#64748b', fontSize: '0.8rem' }}>
              {adminUser?.email || 'admin@skillforge.com'}
            </div>
          </div>
          <div style={{ width: '42px', height: '42px', borderRadius: '50%', backgroundColor: '#2563eb', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '1.1rem', border: '2px solid #3b82f6' }}>
            {(adminUser?.full_name || 'A').charAt(0).toUpperCase()}
          </div>
        </div>
      </div>

      {/* Message / Error Notification Banner */}
      {message.text && (
        <div style={{ padding: '0.75rem 1rem', marginBottom: '1.5rem', borderRadius: '0.5rem', backgroundColor: message.type === 'error' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)', border: message.type === 'error' ? '1px solid #ef4444' : '1px solid #10b981', color: message.type === 'error' ? '#fca5a5' : '#6ee7b7' }}>
          {message.text}
        </div>
      )}

      {/* Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        <div style={cardStyle}>
          <span style={cardLabelStyle}>Total Registered Accounts</span>
          <h2 style={cardValueStyle}>{stats.totalUsers}</h2>
        </div>
        <div style={cardStyle}>
          <span style={cardLabelStyle}>Active Published Courses</span>
          <h2 style={cardValueStyle}>{stats.activeEnrollments}</h2>
        </div>
        <div style={cardStyle}>
          <span style={cardLabelStyle}>Verified Credentials Issued</span>
          <h2 style={cardValueStyle}>{stats.issuedCertificates}</h2>
        </div>
        <div style={cardStyle}>
          <span style={cardLabelStyle}>Assessment Pass Rate</span>
          <h2 style={cardValueStyle}>{stats.avgScore}</h2>
        </div>
      </div>

      {/* Bar Chart Section: User Registration Trends */}
      <div style={{ backgroundColor: '#111827', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid #1e293b', marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h3 style={{ margin: 0, color: '#ffffff', fontSize: '1.1rem' }}>Platform Registration Growth</h3>
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Monthly account signups across all user roles</span>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            style={{ backgroundColor: '#2563eb', border: 'none', color: '#ffffff', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontWeight: 'bold', cursor: 'pointer' }}
          >
            + Create Account
          </button>
        </div>

        {/* Visual CSS Bar Chart */}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1.5rem', height: '180px', padding: '1rem 0', borderBottom: '1px solid #1e293b' }}>
          {chartData.length > 0 ? (
            chartData.map((bar, idx) => {
              const heightPercent = Math.round((bar.count / maxChartValue) * 100);
              return (
                <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                  <span style={{ color: '#38bdf8', fontSize: '0.75rem', fontWeight: 'bold', marginBottom: '0.4rem' }}>
                    {bar.count}
                  </span>
                  <div
                    style={{
                      width: '100%',
                      maxWidth: '45px',
                      height: `${Math.max(heightPercent, 10)}%`,
                      backgroundColor: '#2563eb',
                      borderRadius: '4px 4px 0 0',
                      transition: 'height 0.3s ease'
                    }}
                  />
                  <span style={{ color: '#94a3b8', fontSize: '0.75rem', marginTop: '0.5rem' }}>
                    {bar.month}
                  </span>
                </div>
              );
            })
          ) : (
            <div style={{ width: '100%', textAlign: 'center', color: '#64748b', padding: '3rem 0' }}>
              No monthly growth analytics recorded yet.
            </div>
          )}
        </div>
      </div>

      {/* Tabs Header */}
      <div style={{ display: 'flex', gap: '2rem', borderBottom: '1px solid #1e293b', marginBottom: '1.5rem' }}>
        <button
          onClick={() => setActiveTab('users')}
          style={activeTab === 'users' ? activeTabStyle : inactiveTabStyle}
        >
          User Management ({users.length})
        </button>
        <button
          onClick={() => setActiveTab('instructors')}
          style={activeTab === 'instructors' ? activeTabStyle : inactiveTabStyle}
        >
          Instructors ({instructors.length})
        </button>
      </div>

      {/* Tab 1: User & Admin Accounts Table */}
      {activeTab === 'users' && (
        <div style={{ backgroundColor: '#111827', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid #1e293b' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.25rem', color: '#ffffff' }}>Registered System Accounts</h3>
            
            <div style={{ display: 'flex', gap: '1rem' }}>
              <input
                type="text"
                placeholder="Search name, email, or ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={searchInputStyle}
              />
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                style={searchInputStyle}
              >
                <option value="ALL">All Roles</option>
                <option value="admin">Admins</option>
                <option value="instructor">Instructors</option>
                <option value="student">Students</option>
              </select>
            </div>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #1e293b', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                <th style={thStyle}>User Details</th>
                <th style={thStyle}>Role</th>
                <th style={thStyle}>Activity / Online Status</th>
                <th style={thStyle}>Account Status</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((u) => (
                  <tr key={u.id} style={{ borderBottom: '1px solid #1f2937' }}>
                    <td style={tdStyle}>
                      <div style={{ fontWeight: 'bold', color: '#ffffff' }}>{u.full_name || u.name}</div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b' }}>{u.email}</div>
                    </td>
                    <td style={tdStyle}>
                      <span style={getRoleBadgeStyle(u.role)}>
                        {(u.role || 'student').toUpperCase()}
                      </span>
                    </td>
                    <td style={tdStyle}>
                      {u.is_online ? (
                        <span style={{ color: '#34d399', fontSize: '0.85rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#34d399', display: 'inline-block' }}></span>
                          Active Now
                        </span>
                      ) : (
                        <span style={{ color: '#64748b', fontSize: '0.85rem' }}>
                          {u.last_seen ? `Last active: ${new Date(u.last_seen).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}` : 'Offline'}
                        </span>
                      )}
                    </td>
                    <td style={tdStyle}>
                      <span style={{ color: u.status === 'suspended' ? '#f87171' : '#34d399', fontSize: '0.85rem', fontWeight: 'bold' }}>
                        {u.status === 'suspended' ? 'RESTRICTED' : 'ACTIVE'}
                      </span>
                    </td>
                    <td style={{ ...tdStyle, textAlign: 'right' }}>
                      <button
                        onClick={() => handleToggleStatus(u.id, u.status)}
                        style={{ backgroundColor: 'rgba(217, 119, 6, 0.2)', border: '1px solid #d97706', color: '#fbbf24', padding: '0.3rem 0.6rem', borderRadius: '0.375rem', cursor: 'pointer', marginRight: '0.5rem', fontSize: '0.8rem' }}
                      >
                        {u.status === 'suspended' ? 'Activate' : 'Restrict'}
                      </button>
                      <button
                        onClick={() => handleDeleteUser(u.id)}
                        style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)', border: '1px solid #ef4444', color: '#fca5a5', padding: '0.3rem 0.6rem', borderRadius: '0.375rem', cursor: 'pointer', fontSize: '0.8rem' }}
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                    No system accounts found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 2: Instructors */}
      {activeTab === 'instructors' && (
        <div style={{ backgroundColor: '#111827', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid #1e293b' }}>
          <h3 style={{ marginTop: 0, color: '#ffffff' }}>Instructor Directory</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #1e293b', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                <th style={thStyle}>Instructor Name</th>
                <th style={thStyle}>Email</th>
                <th style={thStyle}>Assigned Courses</th>
                <th style={thStyle}>Total Students</th>
              </tr>
            </thead>
            <tbody>
              {instructors.length > 0 ? (
                instructors.map((inst) => (
                  <tr key={inst.id} style={{ borderBottom: '1px solid #1f2937' }}>
                    <td style={tdStyle}><strong style={{ color: '#ffffff' }}>{inst.name}</strong></td>
                    <td style={tdStyle}>{inst.email}</td>
                    <td style={tdStyle}>{inst.coursesCount || 0}</td>
                    <td style={tdStyle}>{inst.totalStudents || 0}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
                    No instructor accounts registered.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Account Creation Modal */}
      {isModalOpen && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h3 style={{ marginTop: 0, color: '#ffffff' }}>Create New Account</h3>
            <form onSubmit={handleCreateAccount}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={labelStyle}>Full Name</label>
                <input
                  type="text"
                  required
                  value={newUser.full_name}
                  onChange={(e) => setNewUser({ ...newUser, full_name: e.target.value })}
                  style={modalInputStyle}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={labelStyle}>Email Address</label>
                <input
                  type="email"
                  required
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  style={modalInputStyle}
                />
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <label style={labelStyle}>Password</label>
                <input
                  type="password"
                  required
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  style={modalInputStyle}
                />
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={labelStyle}>Account Role</label>
                <select
                  value={newUser.role}
                  onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                  style={modalInputStyle}
                >
                  <option value="admin">Admin</option>
                  <option value="instructor">Instructor</option>
                  <option value="student">Student</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{ backgroundColor: '#334155', border: 'none', color: '#ffffff', padding: '0.5rem 1rem', borderRadius: '0.375rem', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ backgroundColor: '#2563eb', border: 'none', color: '#ffffff', padding: '0.5rem 1rem', borderRadius: '0.375rem', fontWeight: 'bold', cursor: 'pointer' }}
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
};

// Dark Mode Component Styles
const cardStyle = { backgroundColor: '#111827', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid #1e293b' };
const cardLabelStyle = { fontSize: '0.75rem', color: '#64748b', textTransform: 'uppercase', fontWeight: 'bold' };
const cardValueStyle = { margin: '0.5rem 0 0 0', fontSize: '1.875rem', color: '#ffffff', fontWeight: 'bold' };
const activeTabStyle = { backgroundColor: 'transparent', border: 'none', borderBottom: '2px solid #38bdf8', color: '#38bdf8', padding: '0.5rem 0', fontWeight: 'bold', cursor: 'pointer' };
const inactiveTabStyle = { backgroundColor: 'transparent', border: 'none', color: '#64748b', padding: '0.5rem 0', cursor: 'pointer' };
const searchInputStyle = { backgroundColor: '#1f2937', border: '1px solid #374151', color: '#ffffff', padding: '0.5rem 0.75rem', borderRadius: '0.375rem', fontSize: '0.85rem' };
const thStyle = { padding: '0.75rem 1rem' };
const tdStyle = { padding: '1rem', color: '#cbd5e1', fontSize: '0.9rem' };
const modalOverlayStyle = { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0, 0, 0, 0.75)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 };
const modalContentStyle = { backgroundColor: '#111827', padding: '2rem', borderRadius: '0.75rem', width: '100%', maxWidth: '420px', border: '1px solid #1e293b' };
const labelStyle = { display: 'block', marginBottom: '0.35rem', fontSize: '0.8rem', color: '#94a3b8', fontWeight: 'bold' };
const modalInputStyle = { width: '100%', backgroundColor: '#1f2937', border: '1px solid #374151', color: '#ffffff', padding: '0.5rem', borderRadius: '0.375rem', boxSizing: 'border-box' };

const getRoleBadgeStyle = (role) => {
  const r = (role || '').toLowerCase();
  if (r === 'admin') return { backgroundColor: 'rgba(239, 68, 68, 0.2)', color: '#fca5a5', border: '1px solid #ef4444', padding: '0.2rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.75rem', fontWeight: 'bold' };
  if (r === 'instructor') return { backgroundColor: 'rgba(168, 85, 247, 0.2)', color: '#c084fc', border: '1px solid #a855f7', padding: '0.2rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.75rem', fontWeight: 'bold' };
  return { backgroundColor: 'rgba(6, 182, 212, 0.2)', color: '#22d3ee', border: '1px solid #06b6d4', padding: '0.2rem 0.5rem', borderRadius: '0.25rem', fontSize: '0.75rem', fontWeight: 'bold' };
};

export default AdminDashboard;