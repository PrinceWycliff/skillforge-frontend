import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Catalog() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [enrollingId, setEnrollingId] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check local session
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse user session', e);
      }
    }

    // Fetch catalog courses
    const fetchCourses = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
        const res = await fetch(`${baseUrl}/api/courses`);
        if (res.ok) {
          const data = await res.json();
          setCourses(data);
        }
      } catch (err) {
        console.error('Error fetching catalog courses:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Handle Enrollment Action
  const handleEnroll = async (courseId) => {
    if (!user) {
      navigate('/login');
      return;
    }

    setEnrollingId(courseId);

    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
      const response = await fetch(`${baseUrl}/api/enrollments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id || user.userId,
          courseId: courseId,
        }),
      });

      if (response.ok) {
        // Successfully enrolled! Redirect directly to student dashboard
        navigate('/dashboard');
      } else {
        const errData = await response.json();
        alert(errData.message || 'Failed to enroll in course.');
      }
    } catch (err) {
      console.error('Enrollment submission error:', err);
      alert('Network error while enrolling. Please try again.');
    } finally {
      setEnrollingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1130] text-white flex flex-col font-sans">
      
      {/* Header Bar */}
      <header className="border-b border-gray-800 bg-[#0B1130]/90 backdrop-blur sticky top-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-lg text-white">
              S
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 text-transparent bg-clip-text">
              Skillforge
            </span>
          </Link>

          <div className="flex items-center gap-4">
            {user ? (
              <Link to="/dashboard" className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-4 py-2 rounded-lg text-sm transition">
                Go to Dashboard
              </Link>
            ) : (
              <Link to="/login" className="bg-blue-600 hover:bg-blue-500 text-white font-medium px-4 py-2 rounded-lg text-sm transition">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Main Catalog Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 md:p-12">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-white">Course Catalog</h1>
          <p className="text-gray-400 text-sm mt-1">
            Choose a track below to add it directly to your learning dashboard.
          </p>
        </div>

        {loading ? (
          <div className="text-gray-400 animate-pulse">Loading catalog tracks...</div>
        ) : courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div 
                key={course.id} 
                className="bg-gray-800/80 rounded-xl p-6 border border-gray-700/60 shadow-lg flex flex-col justify-between hover:border-blue-500/50 transition duration-300"
              >
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">{course.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-4">
                    {course.description || 'Hands-on interactive learning module with practical exercises.'}
                  </p>
                </div>

                <button 
                  onClick={() => handleEnroll(course.id)}
                  disabled={enrollingId === course.id}
                  className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-medium py-2.5 rounded-lg transition text-sm shadow mt-4 flex items-center justify-center"
                >
                  {enrollingId === course.id ? (
                    <span>Enrolling...</span>
                  ) : user ? (
                    'Enroll Track'
                  ) : (
                    'Sign in to Enroll'
                  )}
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-800/40 border border-gray-700 p-8 rounded-xl text-center max-w-xl mx-auto mt-6">
            <h3 className="text-lg font-semibold text-gray-200 mb-1">Catalog Preparation</h3>
            <p className="text-gray-400 text-sm mb-4">
              We are currently publishing upcoming tracks to PostgreSQL.
            </p>
            {user && (
              <Link to="/dashboard" className="inline-block bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium px-4 py-2 rounded-lg transition">
                Return to Dashboard
              </Link>
            )}
          </div>
        )}
      </main>

    </div>
  );
}