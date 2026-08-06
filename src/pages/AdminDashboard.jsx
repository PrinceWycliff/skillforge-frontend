import React, { useState, useEffect } from 'react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('users');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeEnrollments: 0,
    issuedCertificates: 0,
    completionRate: '0.0%',
    avgScore: '94.2%'
  });
  const [users, setUsers] = useState([]);
  const [instructors, setInstructors] = useState([]);
  const [recentCertificates, setRecentCertificates] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [message, setMessage] = useState({ type: '', text: '' });

  // Modal State for New Account Creation (Admin / Instructor / Student)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newUser, setNewUser] = useState({
    full_name: '',
    email: '',
    password: '',
    role: 'admin'
  });

  const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    };
  };

  useEffect(() => {
    fetchDashboardData();
    // Refresh user activity status every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      // 1. Fetch Analytics Overview
      const analyticsRes = await fetch('/api/admin/analytics', { headers: getAuthHeader() });
      const analyticsData = await analyticsRes.json();
      if (analyticsData.success) {
        setStats(analyticsData.stats);
        setRecentCertificates(analyticsData.recentCertificates || []);
      }

      // 2. Fetch All Accounts Dynamically
      const usersRes = await fetch('/api/admin/users', { headers: getAuthHeader() });
      const usersData = await usersRes.json();
      if (usersData.success) {
        setUsers(usersData.users || []);
      }

      // 3. Fetch Instructor Metrics
      const instructorsRes = await fetch('/api/admin/instructors', { headers: getAuthHeader() });
      const instructorsData = await instructorsRes.json();
      if (instructorsData.success) {
        setInstructors(instructorsData.instructors || []);
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
      showMessage('error', 'Failed to sync with API server.');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 4000);
  };

  // Create New Account (Supports Admin, Instructor, Student)
  const handleCreateAccount = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/users', {
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
        showMessage('error', data.message || 'Failed to create user account.');
      }
    } catch (err) {
      showMessage('error', 'Error connecting to server.');
    }
  };

  // Toggle Account Restrict / Activate
  const handleToggleStatus = async (userId, currentStatus) => {
    const nextStatus = currentStatus === 'suspended' ? 'active' : 'suspended';
    try {
      const res = await fetch(`/api/admin/users/${userId}/status`, {
        method: 'PUT',
        headers: getAuthHeader(),
        body: JSON.stringify({ status: nextStatus })
      });

      const data = await res.json();
      if (data.success) {
        showMessage('success', `Account status set to ${nextStatus}.`);
        fetchDashboardData();
      } else {
        showMessage('error', data.message || 'Failed to update status.');
      }
    } catch (err) {
      showMessage('error', 'Error updating account status.');
    }
  };

  // Delete Account
  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to remove this account?')) return;

    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: getAuthHeader()
      });

      const data = await res.json();
      if (data.success) {
        showMessage('success', 'Account removed successfully.');
        fetchDashboardData();
      } else {
        showMessage('error', data.message || 'Failed to delete account.');
      }
    } catch (err) {
      showMessage('error', 'Error deleting account.');
    }
  };

  // Filter Accounts Dynamic List
  const filteredUsers = users.filter((u) => {
    const matchesQuery = 
      (u.full_name || u.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      String(u.id).includes(searchQuery);

    const matchesRole = roleFilter === 'ALL' || (u.role || '').toLowerCase() === roleFilter.toLowerCase();
    return matchesQuery && matchesRole;
  });

  if (loading) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center', backgroundColor: '#0b0f19', color: '#38bdf8', minHeight: '100vh', fontFamily: 'sans-serif' }}>
        <h2>Loading Control Center...</h2>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: '#0b0f19', color: '#f3f4f6', minHeight: '100vh', padding: '2rem', fontFamily: 'sans-serif' }}>
      
      {/* Top Navigation */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <span style={{ fontSize: '0.75rem', letterSpacing: '0.05em', color: '#38bdf8', fontWeight: 'bold' }}>
            ROLE: PLATFORM ADMINISTRATOR
          </span>
          <h1 style={{ margin: '0.25rem 0 0 0', fontSize: '1.875rem', fontWeight: 'bold', color: '#ffffff' }}>
            Skillforge Control Center
          </h1>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={fetchDashboardData}
            style={{ backgroundColor: '#1e293b', border: '1px solid #334155', color: '#94a3b8', padding: '0.5rem 1rem', borderRadius: '0.5rem', cursor: 'pointer' }}
          >
            🔄 Refresh Data
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            style={{ backgroundColor: '#2563eb', border: 'none', color: '#ffffff', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontWeight: 'bold', cursor: 'pointer' }}
          >
            + Create Account
          </button>
        </div>
      </div>

      {/* Notifications */}
      {message.text && (
        <div style={{ padding: '0.75rem 1rem', marginBottom: '1.5rem', borderRadius: '0.5rem', backgroundColor: message.type === 'error' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)', border: message.type === 'error' ? '1px solid #ef4444' : '1px solid #10b981', color: message.type === 'error' ? '#fca5a5' : '#6ee7b7' }}>
          {message.text}
        </div>
      )}

      {/* Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
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

      {/* Navigation Tabs */}
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
        <button
          onClick={() => setActiveTab('audit')}
          style={activeTab === 'audit' ? activeTabStyle : inactiveTabStyle}
        >
          Credentials Audit
        </button>
      </div>

      {/* Tab 1: User & Admin Account Management */}
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
                <th style={thStyle}>Activity / Online</th>
                <th style={thStyle}>Account Status</th>
                <th style={{ ...thStyle, textAlign: 'right' }}>Admin Actions</th>
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
                    No matching accounts found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 2: Instructor Statistics */}
      {activeTab === 'instructors' && (
        <div style={{ backgroundColor: '#111827', borderRadius: '0.75rem', padding: '1.5rem', border: '1px solid #1e293b' }}>
          <h3 style={{ marginTop: 0, color: '#ffffff' }}>Instructor Directory & Reach</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #1e293b', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                <th style={thStyle}>Instructor</th>
                <th style={thStyle}>Email</th>
                <th style={thStyle}>Assigned Courses</th>
                <th style={thStyle}>Students Reached</th>
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
                    No instructor accounts registered yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Account Creation Modal (Admin / Instructor / Student) */}
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
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

// Custom Styles matching dark theme
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