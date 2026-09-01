import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

export default function Dashboard() {
  const [userData, setUserData] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
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
      <div className="flex min-h-screen bg-[#0B1130]">
        <Sidebar role="student" />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#34E0D8]"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen bg-[#0B1130]">
        <Sidebar role="student" />
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
      <Sidebar role="student" />
      <div className="flex-1 text-white p-6 md:p-10">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8 border-b border-gray-800/80 pb-4">
            <h1 className="text-3xl font-bold">Welcome back, {userData?.name}!</h1>
            <p className="text-gray-400 text-sm mt-1">
              Role: <span className="capitalize text-[#34E0D8] font-semibold">{userData?.role}</span>
            </p>
          </header>

          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-6 text-gray-200">Enrolled Courses</h2>
            {enrolledCourses.length === 0 ? (
              <div className="bg-[#131b4d] rounded-xl p-8 text-center border border-[#1e295d]">
                <p className="text-gray-400 mb-4">You have not enrolled in any courses yet.</p>
                <Link to="/catalog" className="bg-gradient-to-r from-[#2546F0] to-[#34E0D8] text-[#0B1130] px-6 py-2.5 rounded-lg font-bold inline-block transition hover:shadow-lg hover:shadow-cyan-400/20">
                  Browse Courses
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {enrolledCourses.map((course) => (
                  <div key={course.id} className="bg-[#131b4d] border border-[#1e295d] rounded-xl overflow-hidden shadow-lg flex flex-col justify-between">
                    <div className="p-6">
                      <span className="text-xs font-bold uppercase text-[#34E0D8] bg-[#0f1e4d] px-2.5 py-1 rounded">
                        {course.category || 'General'}
                      </span>
                      <h3 className="text-xl font-bold mt-3 mb-2">{course.title}</h3>
                      <p className="text-gray-400 text-sm line-clamp-2">{course.description}</p>
                    </div>
                    <div className="p-6 pt-0 border-t border-[#1e295d]/60 mt-4">
                      <div className="flex justify-between items-center text-xs text-gray-400 mb-2">
                        <span>Progress</span>
                        <span>{course.progress || 0}%</span>
                      </div>
                      <div className="w-full bg-[#0B1130] h-2 rounded-full overflow-hidden mb-4">
                        <div className="bg-gradient-to-r from-[#2546F0] to-[#34E0D8] h-full rounded-full transition-all duration-300" style={{ width: `${course.progress || 0}%` }}></div>
                      </div>
                      <Link
                        to={`/player/${course.id}`}
                        className="block text-center bg-[#2546F0] hover:bg-[#1d3ac9] text-white px-4 py-2.5 rounded-lg font-semibold text-sm transition"
                      >
                        {course.progress > 0 ? 'Continue Course' : 'Start Course'}
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}