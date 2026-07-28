import React, { useEffect, useState } from 'react';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://skillforge-backend-4wd6.onrender.com';

export default function Catalog() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: '#fff' }}>
        <h3>Loading Course Catalog...</h3>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: '#f87171' }}>
        <h3>{error}</h3>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', color: '#fff' }}>
      <h2>Course Catalog</h2>
      <p style={{ color: '#aaa', marginBottom: '2rem' }}>
        Explore available course tracks and start learning today.
      </p>

      {courses.length === 0 ? (
        <div style={{ padding: '2rem', textAlign: 'center', backgroundColor: '#1e293b', borderRadius: '8px' }}>
          <p>No courses published yet. Use the Instructor Studio to publish one!</p>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
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
                    fontSize: '0.8rem',
                    backgroundColor: '#2563eb',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '4px',
                    fontWeight: 'bold',
                  }}
                >
                  {course.category || 'Web Development'}
                </span>
                <h3 style={{ marginTop: '0.8rem', marginBottom: '0.5rem' }}>{course.title}</h3>
                <p style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
                  {course.description || 'No description provided.'}
                </p>
              </div>

              <button
                style={{
                  marginTop: '1.5rem',
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
            </div>
          ))}
        </div>
      )}
    </div>
  );
}