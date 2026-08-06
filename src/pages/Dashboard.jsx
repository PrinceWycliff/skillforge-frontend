import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaPlay, FaGraduationCap, FaBookOpen, FaCheckCircle, FaAward } from 'react-icons/fa';

const API_BASE_URL = import.meta.env?.VITE_API_URL || 'https://skillforge-backend.onrender.com';

// Helper to decode JWT token payload without external libraries
const decodeToken = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    // 1. Try retrieving token across common localStorage key names
    const token =
      localStorage.getItem('token') ||
      localStorage.getItem('accessToken') ||
      localStorage.getItem('jwt') ||
      localStorage.getItem('user_token');

    // Also check if user object was directly saved on login
    const savedUserJson = localStorage.getItem('user');
    let savedUser = null;
    if (savedUserJson) {
      try {
        savedUser = JSON.parse(savedUserJson);
      } catch (e) {
        savedUser = null;
      }
    }

    if (!token && !savedUser) {
      navigate('/login');
      return;
    }

    // Try decoding JWT as early fallback for student name
    const decoded = token ? decodeToken(token) : null;
    const fallbackName =
      savedUser?.name ||
      savedUser?.fullName ||
      savedUser?.username ||
      decoded?.name ||
      decoded?.fullName ||
      decoded?.username ||
      decoded?.email?.split('@')[0] ||
      'Learner';

    try {
      setLoading(true);

      // 2. Query backend user endpoint
      const res = await fetch(`${API_BASE_URL}/api/users/me`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (res.ok) {
        const data = await res.json();
        
        // Extract user details
        const userData = data.user || data.profile || data;
        setUser({
          name: userData.name || userData.fullName || userData.username || fallbackName,
          email: userData.email || decoded?.email,
          ...userData,
        });

        // Extract enrolled courses array across all backend conventions
        const courses =
          data.enrolledCourses ||
          data.courses ||
          data.user?.enrolledCourses ||
          data.user?.courses ||
          data.enrollments ||
          savedUser?.enrolledCourses ||
          [];

        setEnrolledCourses(Array.isArray(courses) ? courses : []);
      } else {
        // Fallback to local storage or JWT payload if API endpoint response differs
        setUser({ name: fallbackName });
        if (savedUser?.enrolledCourses && Array.isArray(savedUser.enrolledCourses)) {
          setEnrolledCourses(savedUser.enrolledCourses);
        }
      }
    } catch (err) {
      console.error('Dashboard data fetch error:', err);
      // Soft fail fallback
      setUser({ name: fallbackName });
      if (savedUser?.enrolledCourses && Array.isArray(savedUser.enrolledCourses)) {
        setEnrolledCourses(savedUser.enrolledCourses);
      } else {
        setError('Unable to sync latest courses from backend. Showing local state.');
      }
    } finally {
      setLoading(false);
    }
  };

  const lastActiveCourse = enrolledCourses.length > 0 ? enrolledCourses[0] : null;

  if (loading) {
    return (
      <div style={loadingContainerStyle}>
        <div style={spinnerStyle}></div>
        <p style={{ color: '#94a3b8', marginTop: '1rem' }}>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div style={pageContainerStyle}>
      <div style={contentWrapperStyle}>
        
        {/* Welcome Banner */}
        <header style={welcomeHeaderStyle}>
          <div>
            <h1 style={welcomeTitleStyle}>
              Welcome back, {user?.name || 'Learner'}! 👋
            </h1>
            <p style={welcomeSubtitleStyle}>
              Track your progress, continue learning, and build your skills.
            </p>
          </div>
          <Link to="/catalog" style={browseCatalogButtonStyle}>
            <FaBookOpen style={{ marginRight: '8px' }} /> Explore Catalog
          </Link>
        </header>

        {error && <div style={errorMessageStyle}>{error}</div>}

        {/* Empty State */}
        {enrolledCourses.length === 0 ? (
          <div style={emptyStateCardStyle}>
            <div style={emptyIconWrapperStyle}>
              <FaGraduationCap size={42} color="#c084fc" />
            </div>
            <h3 style={{ fontSize: '1.5rem', color: '#ffffff', marginBottom: '0.5rem' }}>
              No Enrolled Courses Found
            </h3>
            <p style={{ color: '#94a3b8', maxWidth: '480px', margin: '0 auto 1.5rem auto' }}>
              You haven't enrolled in any courses yet. Explore our course catalog to start learning!
            </p>
            <Link to="/catalog" style={primaryBtnStyle}>
              Browse Available Courses
            </Link>
          </div>
        ) : (
          <>
            {/* 1. Resume Learning Banner */}
            {lastActiveCourse && (
              <div style={resumeBannerStyle}>
                <div style={{ flex: 1 }}>
                  <span style={resumeTagStyle}>RESUME LEARNING</span>
                  <h2 style={resumeCourseTitleStyle}>
                    {lastActiveCourse.title || lastActiveCourse.course?.title || 'Enrolled Course'}
                  </h2>
                  <p style={{ color: '#cbd5e1', fontSize: '0.95rem', marginBottom: '1rem' }}>
                    {lastActiveCourse.description || lastActiveCourse.course?.description || 'Pick up right where you left off.'}
                  </p>
                  
                  <div style={bannerProgressWrapperStyle}>
                    <div style={bannerProgressBarBgStyle}>
                      <div
                        style={{
                          ...bannerProgressBarFillStyle,
                          width: `${lastActiveCourse.progress || 15}%`,
                        }}
                      ></div>
                    </div>
                    <span style={{ fontSize: '0.85rem', color: '#c084fc', fontWeight: 'bold' }}>
                      {lastActiveCourse.progress || 15}% Completed
                    </span>
                  </div>
                </div>

                <Link
                  to={`/player/${lastActiveCourse._id || lastActiveCourse.id || lastActiveCourse.course?._id}`}
                  style={resumeBtnStyle}
                >
                  <FaPlay style={{ marginRight: '8px', fontSize: '0.9rem' }} /> Resume Course
                </Link>
              </div>
            )}

            {/* Stats Overview */}
            <div style={statsGridStyle}>
              <div style={statCardStyle}>
                <FaBookOpen size={24} color="#a855f7" />
                <div>
                  <h4 style={statNumberStyle}>{enrolledCourses.length}</h4>
                  <p style={statLabelStyle}>Enrolled Courses</p>
                </div>
              </div>
              <div style={statCardStyle}>
                <FaCheckCircle size={24} color="#10b981" />
                <div>
                  <h4 style={statNumberStyle}>
                    {enrolledCourses.filter((c) => (c.progress || 0) === 100).length}
                  </h4>
                  <p style={statLabelStyle}>Completed Courses</p>
                </div>
              </div>
              <div style={statCardStyle}>
                <FaAward size={24} color="#f59e0b" />
                <div>
                  <h4 style={statNumberStyle}>
                    {enrolledCourses.filter((c) => (c.progress || 0) === 100).length}
                  </h4>
                  <p style={statLabelStyle}>Certificates Earned</p>
                </div>
              </div>
            </div>

            {/* Enrolled Courses Grid */}
            <h3 style={sectionHeadingStyle}>My Enrolled Courses</h3>
            <div style={courseGridStyle}>
              {enrolledCourses.map((item, idx) => {
                const course = item.course || item;
                const progressVal = item.progress || 0;
                const courseId = course._id || course.id || item._id || idx;

                return (
                  <div key={courseId} style={courseCardStyle}>
                    <div style={thumbnailWrapperStyle}>
                      <img
                        src={course.thumbnailUrl || course.thumbnail || 'https://via.placeholder.com/350x180/131b4d/ffffff?text=SkillForge+Course'}
                        alt={course.title || 'Course thumbnail'}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    </div>

                    <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                      <h4 style={courseTitleStyle}>{course.title || 'Untitled Course'}</h4>
                      <p style={courseCategoryStyle}>{course.category || 'General'}</p>

                      <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
                        <div style={progressLabelRowStyle}>
                          <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Progress</span>
                          <span style={{ fontSize: '0.8rem', color: '#c084fc', fontWeight: 'bold' }}>
                            {progressVal}%
                          </span>
                        </div>
                        <div style={progressBarBgStyle}>
                          <div style={{ ...progressBarFillStyle, width: `${progressVal}%` }}></div>
                        </div>

                        <Link to={`/player/${courseId}`} style={cardActionBtnStyle}>
                          {progressVal > 0 ? 'Continue Course' : 'Start Course'}
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

      </div>
    </div>
  );
};

// Component styles
const pageContainerStyle = {
  backgroundColor: '#0B1130',
  minHeight: '100vh',
  padding: '2.5rem 1.5rem',
  color: '#ffffff',
  fontFamily: 'sans-serif',
};

const contentWrapperStyle = {
  maxWidth: '1100px',
  margin: '0 auto',
};

const welcomeHeaderStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: '1rem',
  marginBottom: '2rem',
};

const welcomeTitleStyle = {
  fontSize: '2rem',
  fontWeight: '800',
  margin: '0 0 0.25rem 0',
  color: '#ffffff',
};

const welcomeSubtitleStyle = {
  fontSize: '0.95rem',
  color: '#94a3b8',
  margin: 0,
};

const browseCatalogButtonStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  padding: '0.65rem 1.25rem',
  borderRadius: '0.5rem',
  backgroundColor: '#1e295d',
  color: '#ffffff',
  textDecoration: 'none',
  fontWeight: '600',
  fontSize: '0.9rem',
  border: '1px solid #3b82f6',
};

const resumeBannerStyle = {
  background: 'linear-gradient(135deg, #1e1b4b 0%, #311042 100%)',
  border: '1px solid #6b21a8',
  borderRadius: '1rem',
  padding: '2rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexWrap: 'wrap',
  gap: '1.5rem',
  marginBottom: '2.5rem',
  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.3)',
};

const resumeTagStyle = {
  display: 'inline-block',
  fontSize: '0.75rem',
  fontWeight: '800',
  letterSpacing: '0.05em',
  color: '#c084fc',
  marginBottom: '0.5rem',
};

const resumeCourseTitleStyle = {
  fontSize: '1.6rem',
  fontWeight: '800',
  color: '#ffffff',
  margin: '0 0 0.5rem 0',
};

const bannerProgressWrapperStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  maxWidth: '400px',
};

const bannerProgressBarBgStyle = {
  flex: 1,
  height: '8px',
  backgroundColor: '#0f172a',
  borderRadius: '9999px',
  overflow: 'hidden',
};

const bannerProgressBarFillStyle = {
  height: '100%',
  backgroundColor: '#c084fc',
  borderRadius: '9999px',
  transition: 'width 0.3s ease',
};

const resumeBtnStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  padding: '0.85rem 1.75rem',
  backgroundColor: '#9333ea',
  color: '#ffffff',
  textDecoration: 'none',
  fontWeight: 'bold',
  borderRadius: '0.5rem',
  fontSize: '0.95rem',
  boxShadow: '0 4px 14px rgba(147, 51, 234, 0.4)',
};

const statsGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
  gap: '1.25rem',
  marginBottom: '3rem',
};

const statCardStyle = {
  backgroundColor: '#131b4d',
  borderRadius: '0.75rem',
  padding: '1.25rem',
  display: 'flex',
  alignItems: 'center',
  gap: '1rem',
  border: '1px solid #1e295d',
};

const statNumberStyle = {
  fontSize: '1.5rem',
  fontWeight: 'bold',
  margin: 0,
  color: '#ffffff',
};

const statLabelStyle = {
  fontSize: '0.85rem',
  color: '#94a3b8',
  margin: 0,
};

const sectionHeadingStyle = {
  fontSize: '1.4rem',
  fontWeight: 'bold',
  color: '#ffffff',
  marginBottom: '1.25rem',
};

const courseGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
  gap: '1.5rem',
};

const courseCardStyle = {
  backgroundColor: '#131b4d',
  borderRadius: '0.85rem',
  overflow: 'hidden',
  border: '1px solid #1e295d',
  display: 'flex',
  flexDirection: 'column',
};

const thumbnailWrapperStyle = {
  height: '160px',
  backgroundColor: '#1e295d',
};

const courseTitleStyle = {
  fontSize: '1.1rem',
  fontWeight: 'bold',
  color: '#ffffff',
  margin: '0 0 0.25rem 0',
};

const courseCategoryStyle = {
  fontSize: '0.8rem',
  color: '#94a3b8',
  margin: 0,
};

const progressLabelRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: '0.35rem',
};

const progressBarBgStyle = {
  width: '100%',
  height: '6px',
  backgroundColor: '#0B1130',
  borderRadius: '9999px',
  overflow: 'hidden',
  marginBottom: '1rem',
};

const progressBarFillStyle = {
  height: '100%',
  backgroundColor: '#a855f7',
  borderRadius: '9999px',
};

const cardActionBtnStyle = {
  display: 'block',
  textAlign: 'center',
  padding: '0.65rem',
  backgroundColor: '#9333ea',
  color: '#ffffff',
  textDecoration: 'none',
  fontWeight: 'bold',
  fontSize: '0.85rem',
  borderRadius: '0.375rem',
};

const emptyStateCardStyle = {
  backgroundColor: '#131b4d',
  borderRadius: '1rem',
  padding: '3.5rem 2rem',
  textAlign: 'center',
  border: '1px solid #1e295d',
  marginTop: '2rem',
};

const emptyIconWrapperStyle = {
  width: '72px',
  height: '72px',
  borderRadius: '50%',
  backgroundColor: '#1e1b4b',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '0 auto 1.25rem auto',
};

const primaryBtnStyle = {
  display: 'inline-block',
  padding: '0.75rem 1.5rem',
  backgroundColor: '#9333ea',
  color: '#ffffff',
  textDecoration: 'none',
  fontWeight: 'bold',
  borderRadius: '0.5rem',
};

const loadingContainerStyle = {
  minHeight: '80vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#0B1130',
};

const spinnerStyle = {
  width: '40px',
  height: '40px',
  border: '4px solid #1e295d',
  borderTop: '4px solid #9333ea',
  borderRadius: '50%',
  animation: 'spin 1s linear infinite',
};

const errorMessageStyle = {
  padding: '1rem',
  backgroundColor: '#7f1d1d',
  color: '#fca5a5',
  borderRadius: '0.5rem',
  marginBottom: '1.5rem',
  fontSize: '0.9rem',
};

export default Dashboard;