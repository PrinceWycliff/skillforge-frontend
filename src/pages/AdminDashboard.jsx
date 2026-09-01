import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const getApiUrl = () => {
    let envUrl = import.meta.env.VITE_API_URL || 'https://skillforge-backend-4wd6.onrender.com';
    envUrl = envUrl.trim().replace(/\/+$/, '');
    if (envUrl.endsWith('/api')) envUrl = envUrl.replace(/\/api$/, '');
    return envUrl;
  };

  useEffect(() => {
    const fetchAdminData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const baseUrl = getApiUrl();
        const headers = {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        };

        const [analyticsRes, usersRes] = await Promise.all([
          fetch(`${baseUrl}/api/admin/analytics`, { headers }),
          fetch(`${baseUrl}/api/admin/users`, { headers })
        ]);

        const analyticsData = await analyticsRes.json();
        const usersData = await usersRes.json();

        if (!analyticsRes.ok) throw new Error(analyticsData.message || 'Access denied.');
        if (!usersRes.ok) throw new Error(usersData.message || 'Failed to load user management data.');

        setStats(analyticsData.stats);
        setUsers(usersData.users || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [navigate]);

  const handleRoleChange = async (userId, newRole) => {
    const token = localStorage.getItem('token');
    try {
      const baseUrl = getApiUrl();
      const res = await fetch(`${baseUrl}/api/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ role: newRole })
      });

      const data = await res.json();

      if (res.ok) {
        setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
      } else {
        alert(data.message || 'Role update failed.');
      }
    } catch (err) {
      alert('Role update failed: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#0B1130]">
        <Sidebar role="admin" />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#34E0D8]"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-[#0B1130]">
        <Sidebar role="admin" />
        <div className="flex-1 text-white p-8 flex flex-col items-center justify-center">
          <div className="bg-red-900/30 border border-red-500/40 p-6 rounded-lg max-w-md text-center">
            <p className="mb-4">{error}</p>
            <button onClick={() => navigate('/login')} className="bg-[#2546F0] hover:bg-[#1d3ac9] px-4 py-2 rounded font-semibold transition">
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#0B1130]">
      <Sidebar role="admin" />
      <div className="flex-1 text-white p-6 md:p-10">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8 border-b border-gray-800/80 pb-4">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-[#34E0D8] text-transparent bg-clip-text">Admin Control Panel</h1>
            <p className="text-gray-400 text-sm mt-1">Live Database Analytics &amp; System User Management</p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-[#131b4d] p-6 rounded-xl border border-[#1e295d]">
              <p className="text-gray-400 text-xs font-semibold uppercase">Total Registered Users</p>
              <p className="text-3xl font-bold mt-2 text-white">{stats?.totalUsers || 0}</p>
            </div>
            <div className="bg-[#131b4d] p-6 rounded-xl border border-[#1e295d]">
              <p className="text-gray-400 text-xs font-semibold uppercase">Published Courses</p>
              <p className="text-3xl font-bold mt-2 text-[#34E0D8]">{stats?.totalCourses || 0}</p>
            </div>
            <div className="bg-[#131b4d] p-6 rounded-xl border border-[#1e295d]">
              <p className="text-gray-400 text-xs font-semibold uppercase">Active Enrollments</p>
              <p className="text-3xl font-bold mt-2 text-green-400">{stats?.activeEnrollments || 0}</p>
            </div>
          </div>

          <section className="bg-[#131b4d] rounded-xl border border-[#1e295d] overflow-hidden">
            <div className="p-6 border-b border-[#1e295d]">
              <h2 className="text-xl font-bold">System Users</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#0f1e4d] text-gray-400 uppercase text-xs">
                  <tr>
                    <th className="p-4">Name</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Current Role</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Change Privilege</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e295d]/60">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-white/5">
                      <td className="p-4 font-semibold">{u.name}</td>
                      <td className="p-4 text-gray-400">{u.email}</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-1 rounded text-xs font-semibold capitalize ${
                          u.role === 'admin' ? 'bg-purple-900/50 text-purple-300 border border-purple-500' :
                          u.role === 'instructor' ? 'bg-[#0f1e4d] text-[#34E0D8] border border-[#2546F0]' :
                          'bg-gray-700 text-gray-300'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs ${
                          u.status === 'active' ? 'bg-green-900/50 text-green-300' : 'bg-yellow-900/50 text-yellow-300'
                        }`}>
                          {u.status || 'active'}
                        </span>
                      </td>
                      <td className="p-4">
                        <select
                          value={u.role}
                          onChange={(e) => handleRoleChange(u.id, e.target.value)}
                          className="bg-[#0f1e4d] border border-[#1e295d] rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-[#34E0D8]"
                        >
                          <option value="student">Student</option>
                          <option value="instructor">Instructor</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}