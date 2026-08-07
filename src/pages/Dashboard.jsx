import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
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
    const fetchDashboardData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      try {
        const baseUrl = getApiUrl();
        const res = await fetch(`${baseUrl}/api/users/me`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || 'Failed to authorize session.');
        }

        setUserData(data.user);
        setEnrolledCourses(data.enrolledCourses || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

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
            <h1 className="text-3xl font-bold">Welcome back, {userData?.name}!</h1>
            <p className="text-gray-400 text-sm mt-1">Role: <span className="capitalize text-blue-400 font-semibold">{userData?.role}</span></p>
          </div>
          <button
            onClick={() => { localStorage.clear(); navigate('/login'); }}
            className="bg-red-600/80 hover:bg-red-600 text-white px-4 py-2 rounded text-sm transition"
          >
            Logout
          </button>
        </header>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-6 text-gray-200">Enrolled Courses</h2>
          {enrolledCourses.length === 0 ? (
            <div className="bg-gray-800 rounded-xl p-8 text-center border border-gray-700">
              <p className="text-gray-400 mb-4">You have not enrolled in any courses yet.</p>
              <Link to="/courses" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-semibold inline-block transition">
                Browse Courses
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledCourses.map((course) => (
                <div key={course.id} className="bg-gray-800 border border-gray-700 rounded-xl overflow-hidden shadow-lg flex flex-col justify-between">
                  <div className="p-6">
                    <span className="text-xs font-bold uppercase text-blue-400 bg-blue-900/40 px-2.5 py-1 rounded">
                      {course.category || 'General'}
                    </span>
                    <h3 className="text-xl font-bold mt-3 mb-2">{course.title}</h3>
                    <p className="text-gray-400 text-sm line-clamp-2">{course.description}</p>
                  </div>
                  <div className="p-6 pt-0 border-t border-gray-700/50 mt-4">
                    <div className="flex justify-between items-center text-xs text-gray-400 mb-2">
                      <span>Progress</span>
                      <span>{course.progress || 0}%</span>
                    </div>
                    <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
                      <div className="bg-blue-500 h-full rounded-full transition-all duration-300" style={{ width: `${course.progress || 0}%` }}></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}