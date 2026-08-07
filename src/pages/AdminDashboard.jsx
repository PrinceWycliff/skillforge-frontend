import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const getApiUrl = () => {
    let envUrl = import.meta.env.VITE_API_URL || 'https://skillforge-backend-80t0.onrender.com';
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
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-8 flex flex-col items-center justify-center">
        <div className="bg-red-900/50 border border-red-500 p-6 rounded-lg max-w-md text-center">
          <p className="mb-4">{error}</p>
          <button onClick={() => navigate('/login')} className="bg-blue-600 px-4 py-2 rounded font-semibold">
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 md:p-10">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
          <div>
            <h1 className="text-3xl font-bold text-blue-500">Admin Control Panel</h1>
            <p className="text-gray-400 text-sm mt-1">Live Database Analytics & System User Management</p>
          </div>
          <button
            onClick={() => { localStorage.clear(); navigate('/login'); }}
            className="bg-red-600/80 hover:bg-red-600 text-white px-4 py-2 rounded text-sm transition"
          >
            Logout
          </button>
        </header>

        {/* Dynamic Analytics Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <p className="text-gray-400 text-xs font-semibold uppercase">Total Registered Users</p>
            <p className="text-3xl font-bold mt-2 text-white">{stats?.totalUsers || 0}</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <p className="text-gray-400 text-xs font-semibold uppercase">Published Courses</p>
            <p className="text-3xl font-bold mt-2 text-blue-400">{stats?.totalCourses || 0}</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
            <p className="text-gray-400 text-xs font-semibold uppercase">Active Enrollments</p>
            <p className="text-3xl font-bold mt-2 text-green-400">{stats?.activeEnrollments || 0}</p>
          </div>
        </div>

        {/* Dynamic User List Table */}
        <section className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
          <div className="p-6 border-b border-gray-700">
            <h2 className="text-xl font-bold">System Users</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-700/50 text-gray-400 uppercase text-xs">
                <tr>
                  <th className="p-4">Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Current Role</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Change Privilege</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-750">
                    <td className="p-4 font-semibold">{u.name}</td>
                    <td className="p-4 text-gray-400">{u.email}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded text-xs font-semibold capitalize ${
                        u.role === 'admin' ? 'bg-purple-900/50 text-purple-300 border border-purple-500' :
                        u.role === 'instructor' ? 'bg-blue-900/50 text-blue-300 border border-blue-500' :
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
                        className="bg-gray-700 border border-gray-600 rounded px-2 py-1 text-xs text-white focus:outline-none focus:border-blue-500"
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
  );
}