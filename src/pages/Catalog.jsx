import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Catalog() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

  return (
    <div className="min-h-screen bg-[#0B1130] text-white p-6 md:p-12">
      <div className="max-w-7xl mx-auto">
        {/* Header Bar */}
        <div className="flex justify-between items-center mb-10 pb-6 border-b border-gray-800">
          <div>
            <h1 className="text-3xl font-bold">Skillforge Course Catalog</h1>
            <p className="text-gray-400 text-sm mt-1">Explore available skill tracks and start learning.</p>
          </div>
          <button 
            onClick={() => navigate('/dashboard')}
            className="bg-gray-800 hover:bg-gray-700 text-sm px-4 py-2 rounded-lg border border-gray-700 transition"
          >
            ← Back to Dashboard
          </button>
        </div>

        {/* Course Grid */}
        {loading ? (
          <div className="text-gray-400 animate-pulse">Loading available tracks...</div>
        ) : courses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div key={course.id} className="bg-gray-800/80 rounded-xl p-6 border border-gray-700/60 shadow-lg flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">{course.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-4">
                    {course.description || 'Comprehensive track with hands-on projects.'}
                  </p>
                </div>
                <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium py-2.5 rounded-lg transition text-sm">
                  Enroll in Track
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-800/40 border border-gray-700 p-8 rounded-xl text-center">
            <p className="text-gray-300 mb-2">No courses published yet.</p>
            <p className="text-gray-500 text-sm">Check back soon for new tracks!</p>
          </div>
        )}
      </div>
    </div>
  );
}