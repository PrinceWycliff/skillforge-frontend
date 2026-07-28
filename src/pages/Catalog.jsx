import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://skillforge-backend-4wd6.onrender.com';

export default function Catalog() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fetch Courses from PostgreSQL Database
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/courses`);
        const data = await res.json();

        if (res.ok && data.success) {
          setCourses(data.data || []);
        } else {
          setError(data.message || 'Failed to fetch catalog courses.');
        }
      } catch (err) {
        console.error('Catalog Fetch Error:', err);
        setError('Unable to load course catalog.');
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  // Handle Enrollment Action
  const handleEnroll = (courseId) => {
    const existingEnrollments = JSON.parse(localStorage.getItem('enrolledCourses') || '[]');
    if (!existingEnrollments.includes(courseId)) {
      existingEnrollments.push(courseId);
      localStorage.setItem('enrolledCourses', JSON.stringify(existingEnrollments));
    }
    // Navigate to course content/player page
    navigate(`/course/${courseId}`);
  };

  // Handle Course Deletion (Instructor Action)
  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course from SkillForge?')) return;

    try {
      const res = await fetch(`${API_BASE}/api/courses/${courseId}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (res.ok && data.success) {
        // Remove course from local UI state
        setCourses((prevCourses) => prevCourses.filter((course) => course.id !== courseId));
      } else {
        alert(data.message || 'Failed to delete course.');
      }
    } catch (err) {
      console.error('Delete Error:', err);
      alert('Server error while attempting to delete course.');
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: '#fff' }}>
        <h3>Loading Course Catalog...</h3>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '3rem', textAlign: 'center', color: '#f87171' }}>
        <h3>{error}</h3>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', color: '#fff' }}>
      {/* Header Banner & Instructor Access */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2>Course Catalog</h2>
          <p style={{ color: '#aaa', margin: 0 }}>Explore available course tracks and start learning today.</p>
        </div>

        {/* Quick Route to Instructor Studio */}
        <button
          onClick={() => navigate('/instructor/studio')}
          style={{
            padding: '0.6rem 1.2rem',
            backgroundColor: '#2563eb',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            fontWeight: 'bold',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          🛠️ Open Instructor Studio
        </button>
      </div>

      {/* Course Cards Grid */}
      {courses.length === 0 ? (
        <div style={{ padding: '3rem', textAlign: 'center', backgroundColor: '#1e293b', borderRadius: '8px', border: '1px solid #334155' }}>
          <p style={{ fontSize: '1.1rem', color: '#cbd5e1' }}>No published courses available yet.</p>
          <button
            onClick={() => navigate('/instructor/studio')}
            style={{ marginTop: '1rem', padding: '0.6rem 1.2rem', backgroundColor: '#16a34a', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
          >
            Publish the First Course →
          </button>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {courses.map((course) => (
            <div
              key={course.id}
              style={{
                backgroundColor: '#1e293b',
                borderRadius: '8px',
                padding: '1.5rem',
                border: '1px solid #334155',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <span
                  style={{
                    fontSize: '0.75rem',
                    backgroundColor: '#2563eb',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '4px',
                    fontWeight: 'bold',
                    textTransform: 'uppercase',
                  }}
                >
                  {course.category || 'Web Development'}
                </span>
                <h3 style={{ marginTop: '0.8rem', marginBottom: '0.5rem', color: '#f8fafc' }}>{course.title}</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.4' }}>
                  {course.description || 'No description provided.'}
                </p>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1.5rem' }}>
                <button
                  onClick={() => handleEnroll(course.id)}
                  style={{
                    flex: 1,
                    padding: '0.6rem',
                    backgroundColor: '#059669',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                  }}
                >
                  Enroll / View Track
                </button>

                <button
                  onClick={() => handleDeleteCourse(course.id)}
                  title="Delete Course (Instructor)"
                  style={{
                    padding: '0.6rem 0.8rem',
                    backgroundColor: '#dc2626',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                  }}
                >
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}