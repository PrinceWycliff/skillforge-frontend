import React, { useEffect, useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://skillforge-backend-4wd6.onrender.com';

export default function Catalog() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // URL Query Parameter handling
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') || 'All';

  const navigate = useNavigate();

  // Fetch Courses
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
    navigate(`/player/${courseId}`);
  };

  // Derive unique categories from fetched courses
  const categoriesList = ['All', ...new Set(courses.map((c) => c.category || 'Web Development'))];

  // Filter courses based on active URL parameter
  const filteredCourses = activeCategory === 'All'
    ? courses
    : courses.filter(
        (course) => (course.category || 'Web Development').toLowerCase() === activeCategory.toLowerCase()
      );

  // Switch category filter in URL
  const handleCategorySelect = (cat) => {
    if (cat === 'All') {
      setSearchParams({});
    } else {
      setSearchParams({ category: cat });
    }
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0b1120', color: '#fff' }}>
      {/* Top Navigation Header */}
      <header
        style={{
          backgroundColor: '#1e293b',
          borderBottom: '1px solid #334155',
          position: 'sticky',
          top: 0,
          zIndex: 40,
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '1rem 2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          {/* Logo / Brand Link */}
          <Link
            to="/"
            style={{
              fontSize: '1.25rem',
              fontWeight: 'bold',
              color: '#3b82f6',
              textDecoration: 'none',
              letterSpacing: '0.05em',
            }}
          >
            Skillforge
          </Link>

          {/* Navigation Links */}
          <nav style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', fontSize: '0.9rem', fontWeight: 500 }}>
            <Link to="/" style={{ color: '#cbd5e1', textDecoration: 'none' }}>
              Home
            </Link>
            <Link
              to="/catalog"
              style={{
                color: '#3b82f6',
                fontWeight: 'bold',
                textDecoration: 'none',
                borderBottom: '2px solid #3b82f6',
                paddingBottom: '0.2rem',
              }}
            >
              Catalog
            </Link>
            <Link to="/dashboard" style={{ color: '#cbd5e1', textDecoration: 'none' }}>
              Dashboard
            </Link>
           
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header Title */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', margin: '0 0 0.5rem 0' }}>Course Catalog</h2>
          <p style={{ color: '#aaa', margin: 0 }}>Explore available course tracks and start learning today.</p>
        </div>

        {/* Category Filter Pills Bar */}
        {!loading && !error && courses.length > 0 && (
          <div
            style={{
              display: 'flex',
              gap: '0.5rem',
              flexWrap: 'wrap',
              marginBottom: '2rem',
              paddingBottom: '0.5rem',
              borderBottom: '1px solid #1e293b',
            }}
          >
            {categoriesList.map((cat) => {
              const isActive = activeCategory.toLowerCase() === cat.toLowerCase();
              return (
                <button
                  key={cat}
                  onClick={() => handleCategorySelect(cat)}
                  style={{
                    padding: '0.4rem 1rem',
                    borderRadius: '20px',
                    fontSize: '0.85rem',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    border: isActive ? '1px solid #3b82f6' : '1px solid #334155',
                    backgroundColor: isActive ? '#2563eb' : '#1e293b',
                    color: isActive ? '#ffffff' : '#cbd5e1',
                  }}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#fff' }}>
            <h3>Loading Course Catalog...</h3>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div style={{ padding: '3rem', textAlign: 'center', color: '#f87171' }}>
            <h3>{error}</h3>
          </div>
        )}

        {/* Empty / No Courses Found State */}
        {!loading && !error && filteredCourses.length === 0 && (
          <div
            style={{
              padding: '3rem',
              textAlign: 'center',
              backgroundColor: '#1e293b',
              borderRadius: '8px',
              border: '1px solid #334155',
            }}
          >
            <p style={{ fontSize: '1.1rem', color: '#cbd5e1', marginBottom: '1rem' }}>
              {activeCategory === 'All'
                ? 'No published courses available yet. Check back soon!'
                : `No courses available under the "${activeCategory}" category right now.`}
            </p>
            {activeCategory !== 'All' && (
              <button
                onClick={() => handleCategorySelect('All')}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#3b82f6',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                }}
              >
                View All Courses
              </button>
            )}
          </div>
        )}

        {/* Course Grid */}
        {!loading && !error && filteredCourses.length > 0 && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(290px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {filteredCourses.map((course) => (
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

                {/* Student Action */}
                <button
                  onClick={() => handleEnroll(course.id)}
                  style={{
                    marginTop: '1.5rem',
                    padding: '0.6rem',
                    height: '42px',
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
      </main>
    </div>
  );
}