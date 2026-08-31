import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://skillforge-backend-4wd6.onrender.com';

export default function Catalog() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filtering & Search States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'az' | 'za'

  // URL Query Parameter handling
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category') || 'All';

  const navigate = useNavigate();

  // Fetch Courses from Backend
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

  // Unique Categories Derived from Backend Data
  const categoriesList = useMemo(() => {
    const set = new Set(courses.map((c) => c.category || 'Web Development'));
    return ['All', ...Array.from(set)];
  }, [courses]);

  // Category Switch handler (URL synced)
  const handleCategorySelect = (cat) => {
    if (cat === 'All') {
      searchParams.delete('category');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ ...Object.fromEntries(searchParams), category: cat });
    }
  };

  // Combined Multi-Criteria Filtering & Sorting Engine
  const filteredCourses = useMemo(() => {
    return courses
      .filter((course) => {
        // Category Filter
        const matchesCategory =
          activeCategory === 'All' ||
          (course.category || 'Web Development').toLowerCase() === activeCategory.toLowerCase();

        // Level Filter
        const matchesLevel =
          selectedLevel === 'All' ||
          (course.level || 'Beginner').toLowerCase() === selectedLevel.toLowerCase();

        // Live Text Search Filter (Title + Description)
        const query = searchTerm.toLowerCase().trim();
        const matchesSearch =
          !query ||
          course.title?.toLowerCase().includes(query) ||
          course.description?.toLowerCase().includes(query);

        return matchesCategory && matchesLevel && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'az') return a.title.localeCompare(b.title);
        if (sortBy === 'za') return b.title.localeCompare(a.title);
        // Default: Newest first (by ID or array order)
        return (b.id || 0) - (a.id || 0);
      });
  }, [courses, activeCategory, selectedLevel, searchTerm, sortBy]);

  // Reset All Active Filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedLevel('All');
    setSortBy('newest');
    setSearchParams({});
  };

  const hasActiveFilters = activeCategory !== 'All' || selectedLevel !== 'All' || searchTerm.trim() !== '';

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0b1120', color: '#f8fafc', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* Navbar Header */}
      <header
        style={{
          backgroundColor: '#0f172a',
          borderBottom: '1px solid #1e293b',
          position: 'sticky',
          top: 0,
          zIndex: 50,
          backdropFilter: 'blur(8px)',
        }}
      >
        <div
          style={{
            maxWidth: '1280px',
            margin: '0 auto',
            padding: '0.875rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Link
            to="/"
            style={{
              fontSize: '1.35rem',
              fontWeight: '800',
              color: '#3b82f6',
              textDecoration: 'none',
              letterSpacing: '-0.02em',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
            }}
          >
            <span style={{ backgroundColor: '#2563eb', color: '#fff', borderRadius: '6px', padding: '0.2rem 0.5rem', fontSize: '1rem' }}>⚡</span>
            Skillforge
          </Link>

          <nav style={{ display: 'flex', gap: '1.75rem', alignItems: 'center', fontSize: '0.9rem', fontWeight: 500 }}>
            <Link to="/" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s' }}>
              Home
            </Link>
            <Link
              to="/catalog"
              style={{
                color: '#3b82f6',
                fontWeight: '600',
                textDecoration: 'none',
                borderBottom: '2px solid #3b82f6',
                paddingBottom: '0.25rem',
              }}
            >
              Catalog
            </Link>
            <Link to="/dashboard" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s' }}>
              Dashboard
            </Link>
            <Link to="/contact" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s' }}>
              Support
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Container */}
      <main style={{ maxWidth: '1280px', margin: '0 auto', padding: '2rem 1.5rem 4rem' }}>
        
        {/* Banner Title */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '2.25rem', fontWeight: '800', tracking: '-0.03em', margin: '0 0 0.5rem 0', color: '#f8fafc' }}>
            Course Catalog
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '1rem', margin: 0, maxWidth: '600px' }}>
            Discover industry-ready technology tracks, master practical code exercises, and level up your skills.
          </p>
        </div>

        {/* Multi-Criteria Search & Filter Controls Toolbar */}
        <div
          style={{
            backgroundColor: '#0f172a',
            borderRadius: '12px',
            border: '1px solid #1e293b',
            padding: '1.25rem',
            marginBottom: '1.75rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.4)',
          }}
        >
          {/* Top Row: Live Search Input + Level Dropdown + Sort Dropdown */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', alignItems: 'center' }}>
            
            {/* Live Search Input */}
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="🔍 Search courses by keyword..."
                style={{
                  width: '100%',
                  padding: '0.65rem 1rem 0.65rem 2.2rem',
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  color: '#f8fafc',
                  fontSize: '0.9rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#64748b',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                  }}
                >
                  ✕
                </button>
              )}
            </div>

            {/* Level Filter Dropdown */}
            <div>
              <select
                value={selectedLevel}
                onChange={(e) => setSelectedLevel(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 1rem',
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  color: '#f8fafc',
                  fontSize: '0.9rem',
                  outline: 'none',
                  cursor: 'pointer',
                }}
              >
                <option value="All">All Skill Levels</option>
                <option value="Beginner">Beginner Level</option>
                <option value="Intermediate">Intermediate Level</option>
                <option value="Advanced">Advanced Level</option>
              </select>
            </div>

            {/* Sort Filter Dropdown */}
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.65rem 1rem',
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  color: '#f8fafc',
                  fontSize: '0.9rem',
                  outline: 'none',
                  cursor: 'pointer',
                }}
              >
                <option value="newest">Sort: Newest Releases</option>
                <option value="az">Sort: Alphabetical (A-Z)</option>
                <option value="za">Sort: Alphabetical (Z-A)</option>
              </select>
            </div>
          </div>

          {/* Bottom Row: Category Quick Pills + Active Filter Badges */}
          {!loading && !error && courses.length > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem', pt: '0.5rem' }}>
              
              {/* Category Pills */}
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, marginRight: '0.25rem' }}>CATEGORIES:</span>
                {categoriesList.map((cat) => {
                  const isActive = activeCategory.toLowerCase() === cat.toLowerCase();
                  return (
                    <button
                      key={cat}
                      onClick={() => handleCategorySelect(cat)}
                      style={{
                        padding: '0.3rem 0.85rem',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        border: isActive ? '1px solid #3b82f6' : '1px solid #334155',
                        backgroundColor: isActive ? '#2563eb' : '#1e293b',
                        color: isActive ? '#ffffff' : '#94a3b8',
                      }}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>

              {/* Reset Action */}
              {hasActiveFilters && (
                <button
                  onClick={handleResetFilters}
                  style={{
                    fontSize: '0.8rem',
                    color: '#f87171',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: 600,
                    textDecoration: 'underline',
                  }}
                >
                  Clear Filters ↺
                </button>
              )}
            </div>
          )}
        </div>

        {/* Results Counter Summary */}
        {!loading && !error && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', px: '0.25rem' }}>
            <span style={{ fontSize: '0.875rem', color: '#94a3b8', fontWeight: 500 }}>
              Showing <strong style={{ color: '#f8fafc' }}>{filteredCourses.length}</strong> of{' '}
              <strong style={{ color: '#f8fafc' }}>{courses.length}</strong> courses
            </span>
          </div>
        )}

        {/* Loading Skeleton View */}
        {loading && (
          <div style={{ padding: '4rem 2rem', textAlign: 'center', backgroundColor: '#0f172a', borderRadius: '12px', border: '1px solid #1e293b' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>⌛</div>
            <h3 style={{ margin: 0, color: '#cbd5e1', fontWeight: 600 }}>Loading Course Catalog...</h3>
            <p style={{ color: '#64748b', fontSize: '0.875rem', marginTop: '0.25rem' }}>Fetching latest tracks from backend</p>
          </div>
        )}

        {/* Error State */}
        {!loading && error && (
          <div style={{ padding: '3rem 2rem', textAlign: 'center', backgroundColor: '#181016', borderRadius: '12px', border: '1px solid #7f1d1d' }}>
            <h3 style={{ color: '#f87171', margin: '0 0 0.5rem 0' }}>{error}</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.875rem', margin: 0 }}>Please check your internet connection or backend configuration.</p>
          </div>
        )}

        {/* Empty State: No Courses Match Filter */}
        {!loading && !error && filteredCourses.length === 0 && (
          <div
            style={{
              padding: '4rem 2rem',
              textAlign: 'center',
              backgroundColor: '#0f172a',
              borderRadius: '12px',
              border: '1px solid #1e293b',
            }}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🔎</div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, margin: '0 0 0.5rem 0', color: '#f8fafc' }}>No matching courses found</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.5rem', maxWidth: '450px', margin: '0 auto 1.5rem' }}>
              We couldn't find any courses matching your search criteria. Try clearing some filters or searching for another keyword.
            </p>
            <button
              onClick={handleResetFilters}
              style={{
                padding: '0.65rem 1.25rem',
                backgroundColor: '#2563eb',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                fontSize: '0.875rem',
                cursor: 'pointer',
              }}
            >
              Reset All Filters
            </button>
          </div>
        )}

        {/* Course Cards Grid */}
        {!loading && !error && filteredCourses.length > 0 && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {filteredCourses.map((course) => (
              <div
                key={course.id}
                style={{
                  backgroundColor: '#0f172a',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  border: '1px solid #1e293b',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.2)',
                  transition: 'transform 0.2s ease, border-color 0.2s ease',
                }}
              >
                <div>
                  {/* Category & Level Badges */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.875rem' }}>
                    <span
                      style={{
                        fontSize: '0.7rem',
                        backgroundColor: '#1e3a8a',
                        color: '#93c5fd',
                        padding: '0.2rem 0.6rem',
                        borderRadius: '6px',
                        fontWeight: '700',
                        letterSpacing: '0.04em',
                        textTransform: 'uppercase',
                      }}
                    >
                      {course.category || 'Web Development'}
                    </span>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        color: '#94a3b8',
                        fontWeight: '500',
                      }}
                    >
                      {course.level || 'Beginner'}
                    </span>
                  </div>

                  {/* Course Title */}
                  <h3
                    style={{
                      marginTop: '0.4rem',
                      marginBottom: '0.6rem',
                      color: '#f8fafc',
                      fontSize: '1.15rem',
                      fontWeight: 700,
                      lineHeight: '1.35',
                    }}
                  >
                    {course.title}
                  </h3>

                  {/* Course Description */}
                  <p
                    style={{
                      color: '#94a3b8',
                      fontSize: '0.875rem',
                      lineHeight: '1.5',
                      margin: '0 0 1.25rem 0',
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                    }}
                  >
                    {course.description || 'Master hands-on skills with real-world mini-projects and practical tracks.'}
                  </p>
                </div>

                {/* Course Metadata & Action CTA */}
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingTop: '0.875rem',
                      borderTop: '1px solid #1e293b',
                      fontSize: '0.8rem',
                      color: '#64748b',
                      marginBottom: '1rem',
                    }}
                  >
                    <span>📚 {course.modules ? course.modules.length : 4} Modules</span>
                    <span>⏱️ {course.duration || '2-3 Hours'}</span>
                  </div>

                  <button
                    onClick={() => handleEnroll(course.id)}
                    style={{
                      width: '100%',
                      padding: '0.7rem',
                      backgroundColor: '#2563eb',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: '600',
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '0.5rem',
                    }}
                  >
                    <span>Enroll / Start Track</span>
                    <span style={{ fontSize: '1rem' }}>→</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}