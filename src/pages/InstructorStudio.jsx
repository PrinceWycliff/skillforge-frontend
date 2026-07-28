import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Use environment variable if present, or fallback to your live Render backend URL
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://skillforge-backend-4wd6.onrender.com';

export default function InstructorStudio() {
  const [activeTab, setActiveTab] = useState(1);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  // Existing Courses (for management/deletion)
  const [existingCourses, setExistingCourses] = useState([]);
  const [loadingCourses, setLoadingCourses] = useState(false);

  const navigate = useNavigate();

  // Course Details State
  const [courseData, setCourseData] = useState({
    title: '',
    category: 'Web Development',
    description: '',
    thumbnail: '',
  });

  // Lessons State
  const [lessons, setLessons] = useState([
    { title: 'Course Overview & Setup', videoUrl: '' }
  ]);

  // Quiz Questions State
  const [quizQuestions, setQuizQuestions] = useState([
    { question: '', options: ['', '', '', ''], correctAnswer: 0 }
  ]);

  // Fetch courses whenever switching to Tab 4 (Manage Existing Courses)
  useEffect(() => {
    if (activeTab === 4) {
      fetchExistingCourses();
    }
  }, [activeTab]);

  const fetchExistingCourses = async () => {
    setLoadingCourses(true);
    try {
      const res = await fetch(`${API_BASE}/api/courses`);
      const data = await res.json();
      if (res.ok && data.success) {
        setExistingCourses(data.data || []);
      } else {
        setMsg({ type: 'error', text: 'Failed to fetch existing courses.' });
      }
    } catch (err) {
      console.error('Fetch Courses Error:', err);
      setMsg({ type: 'error', text: 'Network error fetching courses.' });
    } finally {
      setLoadingCourses(false);
    }
  };

  // Handle Course Inputs
  const handleCourseChange = (e) => {
    setCourseData({ ...courseData, [e.target.name]: e.target.value });
  };

  // Add / Remove Lessons
  const addLesson = () => {
    setLessons([...lessons, { title: '', videoUrl: '' }]);
  };

  const handleLessonChange = (index, field, value) => {
    const updated = [...lessons];
    updated[index][field] = value;
    setLessons(updated);
  };

  // Add / Remove Quiz Questions
  const addQuestion = () => {
    setQuizQuestions([
      ...quizQuestions,
      { question: '', options: ['', '', '', ''], correctAnswer: 0 }
    ]);
  };

  const handleQuestionChange = (qIndex, value) => {
    const updated = [...quizQuestions];
    updated[qIndex].question = value;
    setQuizQuestions(updated);
  };

  // Publish Form Handler
  const handlePublishCourse = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setMsg({ type: '', text: '' });

    const fullCoursePackage = {
      ...courseData,
      lessons,
      quiz: quizQuestions,
    };

    try {
      const res = await fetch(`${API_BASE}/api/courses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(fullCoursePackage),
      });

      // Safely parse JSON or default to empty object
      const data = await res.json().catch(() => ({}));

      // res.ok evaluates to true for status codes 200-299
      if (res.ok) {
        setMsg({
          type: 'success',
          text: '🚀 Course track published successfully!',
        });
        
        // Reset form state after success
        setCourseData({
          title: '',
          category: 'Web Development',
          description: '',
          thumbnail: '',
        });
        setLessons([{ title: '', videoUrl: '' }]);
        setQuizQuestions([{ question: '', options: ['', '', '', ''], correctAnswer: 0 }]);
        setActiveTab(1);
      } else {
        setMsg({
          type: 'error',
          text: data.message || `Server Error (${res.status}): Failed to publish course.`,
        });
      }
    } catch (err) {
      console.error('Publish Submit Error:', err);
      setMsg({
        type: 'error',
        text: `Connection error: ${err.message}`,
      });
    } finally {
      setLoading(false);
    }
  };

  // Delete Course Handler (Instructor Only)
  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Are you sure you want to permanently delete this course?')) return;

    try {
      const res = await fetch(`${API_BASE}/api/courses/${courseId}`, {
        method: 'DELETE',
      });
      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success) {
        setMsg({ type: 'success', text: '🗑️ Course deleted successfully.' });
        // Refresh local list
        setExistingCourses((prev) => prev.filter((course) => course.id !== courseId));
      } else {
        setMsg({ type: 'error', text: data.message || 'Failed to delete course.' });
      }
    } catch (err) {
      console.error('Delete Error:', err);
      setMsg({ type: 'error', text: `Error deleting course: ${err.message}` });
    }
  };

  // Logout Handler
  const handleLogout = () => {
    localStorage.removeItem('instructor_token');
    navigate('/instructor/login');
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto', color: '#fff' }}>
      {/* Header and Logout */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2>Instructor Studio</h2>
          <p style={{ color: '#aaa', margin: 0 }}>
            Publish courses with embedded video lessons, interactive quizzes, and manage existing offerings.
          </p>
        </div>
        <button
          onClick={handleLogout}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: '#334155',
            color: '#cbd5e1',
            border: '1px solid #475569',
            borderRadius: '6px',
            fontSize: '0.85rem',
            cursor: 'pointer',
          }}
        >
          🔒 Logout Studio
        </button>
      </div>

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <button
          onClick={() => setActiveTab(1)}
          style={{
            padding: '0.6rem 1.2rem',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer',
            backgroundColor: activeTab === 1 ? '#2563eb' : '#1e293b',
            color: '#fff',
          }}
        >
          1. Course Details
        </button>
        <button
          onClick={() => setActiveTab(2)}
          style={{
            padding: '0.6rem 1.2rem',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer',
            backgroundColor: activeTab === 2 ? '#2563eb' : '#1e293b',
            color: '#fff',
          }}
        >
          2. Video Lessons ({lessons.length})
        </button>
        <button
          onClick={() => setActiveTab(3)}
          style={{
            padding: '0.6rem 1.2rem',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer',
            backgroundColor: activeTab === 3 ? '#2563eb' : '#1e293b',
            color: '#fff',
          }}
        >
          3. Quiz Questions ({quizQuestions.length})
        </button>
        <button
          onClick={() => setActiveTab(4)}
          style={{
            padding: '0.6rem 1.2rem',
            borderRadius: '6px',
            border: 'none',
            cursor: 'pointer',
            backgroundColor: activeTab === 4 ? '#2563eb' : '#1e293b',
            color: '#fff',
          }}
        >
          4. Manage Courses 📁
        </button>
      </div>

      {/* Status Message Display */}
      {msg.text && (
        <div
          style={{
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '1.5rem',
            backgroundColor: msg.type === 'success' ? '#15803d' : '#991b1b',
            color: '#fff',
          }}
        >
          {msg.text}
        </div>
      )}

      {/* Tab 1: Details */}
      {activeTab === 1 && (
        <div style={{ backgroundColor: '#1e293b', padding: '1.5rem', borderRadius: '8px' }}>
          <h3>Course Details</h3>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Course Title</label>
            <input
              type="text"
              name="title"
              value={courseData.title}
              onChange={handleCourseChange}
              placeholder="e.g. Full-Stack Web Development"
              style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff' }}
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Category</label>
            <select
              name="category"
              value={courseData.category}
              onChange={handleCourseChange}
              style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff' }}
            >
              <option value="Web Development">Web Development</option>
              <option value="Systems Administration">Systems Administration</option>
              <option value="Database Engineering">Database Engineering</option>
              <option value="Networking">Networking</option>
            </select>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Description</label>
            <textarea
              name="description"
              rows="4"
              value={courseData.description}
              onChange={handleCourseChange}
              placeholder="Overview of course topics and goals..."
              style={{ width: '100%', padding: '0.6rem', borderRadius: '4px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#fff' }}
            />
          </div>
          <button
            onClick={() => setActiveTab(2)}
            style={{ padding: '0.6rem 1.2rem', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Next: Add Video Lessons →
          </button>
        </div>
      )}

      {/* Tab 2: Lessons */}
      {activeTab === 2 && (
        <div style={{ backgroundColor: '#1e293b', padding: '1.5rem', borderRadius: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3>Video Lessons</h3>
            <button
              onClick={addLesson}
              style={{ padding: '0.4rem 0.8rem', backgroundColor: '#16a34a', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              + Add Lesson
            </button>
          </div>
          {lessons.map((lesson, idx) => (
            <div key={idx} style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: '#0f172a', borderRadius: '6px' }}>
              <label style={{ display: 'block', marginBottom: '0.3rem' }}>Lesson #{idx + 1} Title</label>
              <input
                type="text"
                value={lesson.title}
                onChange={(e) => handleLessonChange(idx, 'title', e.target.value)}
                placeholder="e.g. Setting up Express Middleware"
                style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem', borderRadius: '4px', border: '1px solid #334155', backgroundColor: '#1e293b', color: '#fff' }}
              />
              <label style={{ display: 'block', marginBottom: '0.3rem' }}>Video Embed URL</label>
              <input
                type="text"
                value={lesson.videoUrl}
                onChange={(e) => handleLessonChange(idx, 'videoUrl', e.target.value)}
                placeholder="e.g. https://www.youtube.com/embed/..."
                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #334155', backgroundColor: '#1e293b', color: '#fff' }}
              />
            </div>
          ))}
          <button
            onClick={() => setActiveTab(3)}
            style={{ padding: '0.6rem 1.2rem', backgroundColor: '#2563eb', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Next: Add Quizzes →
          </button>
        </div>
      )}

      {/* Tab 3: Quizzes & Publish */}
      {activeTab === 3 && (
        <div style={{ backgroundColor: '#1e293b', padding: '1.5rem', borderRadius: '8px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3>Interactive Course Quiz</h3>
            <button
              onClick={addQuestion}
              style={{ padding: '0.4rem 0.8rem', backgroundColor: '#16a34a', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              + Add Question
            </button>
          </div>
          {quizQuestions.map((q, qIdx) => (
            <div key={qIdx} style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: '#0f172a', borderRadius: '6px' }}>
              <label style={{ display: 'block', marginBottom: '0.3rem' }}>Question #{qIdx + 1}</label>
              <input
                type="text"
                value={q.question}
                onChange={(e) => handleQuestionChange(qIdx, e.target.value)}
                placeholder="e.g. What does CORS stand for?"
                style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #334155', backgroundColor: '#1e293b', color: '#fff' }}
              />
            </div>
          ))}

          <button
            onClick={handlePublishCourse}
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.8rem',
              marginTop: '1.5rem',
              backgroundColor: loading ? '#64748b' : '#2563eb',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Publishing Course...' : '🚀 Publish Complete Course Track'}
          </button>
        </div>
      )}

      {/* Tab 4: Manage Existing Courses */}
      {activeTab === 4 && (
        <div style={{ backgroundColor: '#1e293b', padding: '1.5rem', borderRadius: '8px' }}>
          <h3>Manage Live Database Courses</h3>
          <p style={{ color: '#aaa', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            View and delete existing courses stored in your PostgreSQL database.
          </p>

          {loadingCourses ? (
            <p style={{ color: '#cbd5e1' }}>Loading courses...</p>
          ) : existingCourses.length === 0 ? (
            <p style={{ color: '#94a3b8' }}>No courses found in the database.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {existingCourses.map((course) => (
                <div
                  key={course.id}
                  style={{
                    backgroundColor: '#0f172a',
                    padding: '1rem',
                    borderRadius: '6px',
                    border: '1px solid #334155',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '1rem',
                  }}
                >
                  <div>
                    <h4 style={{ margin: '0 0 0.3rem 0', color: '#f8fafc' }}>{course.title}</h4>
                    <span style={{ fontSize: '0.75rem', backgroundColor: '#2563eb', padding: '0.1rem 0.5rem', borderRadius: '4px' }}>
                      {course.category || 'General'}
                    </span>
                  </div>

                  <button
                    onClick={() => handleDeleteCourse(course.id)}
                    style={{
                      padding: '0.5rem 0.9rem',
                      backgroundColor: '#dc2626',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '6px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                    }}
                  >
                    🗑️ Delete Course
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}