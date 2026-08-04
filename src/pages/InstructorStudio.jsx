import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

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
  });

  // Lessons State
  const [lessons, setLessons] = useState([
    { title: 'Course Overview & Setup', videoUrl: '' }
  ]);

  // Quiz Questions State
  const [quizQuestions, setQuizQuestions] = useState([
    {
      question: '',
      options: ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
      correctAnswer: 0
    }
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

  // Add / Remove / Edit Lessons
  const addLesson = () => {
    setLessons([...lessons, { title: '', videoUrl: '' }]);
  };

  const removeLesson = (index) => {
    if (lessons.length === 1) return;
    setLessons(lessons.filter((_, i) => i !== index));
  };

  const handleLessonChange = (index, field, value) => {
    const updated = [...lessons];
    updated[index][field] = value;
    setLessons(updated);
  };

  // Quiz Handlers
  const addQuestion = () => {
    setQuizQuestions([
      ...quizQuestions,
      { question: '', options: ['', '', '', ''], correctAnswer: 0 }
    ]);
  };

  const removeQuestion = (qIndex) => {
    if (quizQuestions.length === 1) return;
    setQuizQuestions(quizQuestions.filter((_, idx) => idx !== qIndex));
  };

  const handleQuestionTextChange = (qIndex, value) => {
    const updated = [...quizQuestions];
    updated[qIndex].question = value;
    setQuizQuestions(updated);
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const updated = [...quizQuestions];
    updated[qIndex].options[oIndex] = value;
    setQuizQuestions(updated);
  };

  const handleCorrectAnswerChange = (qIndex, oIndex) => {
    const updated = [...quizQuestions];
    updated[qIndex].correctAnswer = oIndex;
    setQuizQuestions(updated);
  };

  // Publish Form Handler (Strictly excludes 'thumbnail' to match PostgreSQL table schema)
  const handlePublishCourse = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setMsg({ type: '', text: '' });

    const fullCoursePackage = {
      title: courseData.title,
      category: courseData.category,
      description: courseData.description,
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

      const data = await res.json().catch(() => ({}));

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
        });
        setLessons([{ title: 'Course Overview & Setup', videoUrl: '' }]);
        setQuizQuestions([
          { question: '', options: ['', '', '', ''], correctAnswer: 0 }
        ]);
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

  // Fixed Delete Course Handler
  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm('Are you sure you want to permanently delete this course?')) return;

    try {
      const res = await fetch(`${API_BASE}/api/courses/${courseId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && (data.success || res.status === 200)) {
        setMsg({ type: 'success', text: '🗑️ Course deleted successfully.' });
        setExistingCourses((prev) => prev.filter((c) => c.id !== courseId && c._id !== courseId));
      } else {
        setMsg({ type: 'error', text: data.message || 'Failed to delete course from database.' });
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
            Create structured courses, video lessons, and interactive assessments.
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

      {/* Tab 1: Course Details */}
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
              placeholder="e.g. Full-Stack Web Development with Node.js"
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
              <option value="Cyber Security">Cyber Security</option>
            </select>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem' }}>Description</label>
            <textarea
              name="description"
              rows="4"
              value={courseData.description}
              onChange={handleCourseChange}
              placeholder="Overview of learning outcomes..."
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
            <div key={idx} style={{ marginBottom: '1rem', padding: '1rem', backgroundColor: '#0f172a', borderRadius: '6px', border: '1px solid #334155' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <strong>Lesson #{idx + 1}</strong>
                {lessons.length > 1 && (
                  <button
                    onClick={() => removeLesson(idx)}
                    style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', fontSize: '0.85rem' }}
                  >
                    Remove
                  </button>
                )}
              </div>
              <input
                type="text"
                value={lesson.title}
                onChange={(e) => handleLessonChange(idx, 'title', e.target.value)}
                placeholder="Lesson title..."
                style={{ width: '100%', padding: '0.5rem', marginBottom: '0.5rem', borderRadius: '4px', border: '1px solid #334155', backgroundColor: '#1e293b', color: '#fff' }}
              />
              <input
                type="text"
                value={lesson.videoUrl}
                onChange={(e) => handleLessonChange(idx, 'videoUrl', e.target.value)}
                placeholder="Video embed link (e.g. https://www.youtube.com/embed/...)"
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

      {/* Tab 3: Interactive Quiz Builder */}
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
            <div key={qIdx} style={{ marginBottom: '1.5rem', padding: '1rem', backgroundColor: '#0f172a', borderRadius: '6px', border: '1px solid #334155' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label style={{ fontWeight: 'bold' }}>Question #{qIdx + 1}</label>
                {quizQuestions.length > 1 && (
                  <button
                    onClick={() => removeQuestion(qIdx)}
                    style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', fontSize: '0.85rem' }}
                  >
                    Remove Question
                  </button>
                )}
              </div>
              <input
                type="text"
                value={q.question}
                onChange={(e) => handleQuestionTextChange(qIdx, e.target.value)}
                placeholder="e.g. What is the default port for Express.js?"
                style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem', borderRadius: '4px', border: '1px solid #334155', backgroundColor: '#1e293b', color: '#fff' }}
              />

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Options (Select the correct answer radio button):</span>
                {q.options.map((opt, oIdx) => (
                  <div key={oIdx} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input
                      type="radio"
                      name={`correct-${qIdx}`}
                      checked={q.correctAnswer === oIdx}
                      onChange={() => handleCorrectAnswerChange(qIdx, oIdx)}
                      style={{ cursor: 'pointer' }}
                    />
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => handleOptionChange(qIdx, oIdx, e.target.value)}
                      placeholder={`Option ${oIdx + 1}`}
                      style={{ flex: 1, padding: '0.4rem', borderRadius: '4px', border: '1px solid #334155', backgroundColor: '#1e293b', color: '#fff' }}
                    />
                  </div>
                ))}
              </div>
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
                  key={course.id || course._id}
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
                    onClick={() => handleDeleteCourse(course.id || course._id)}
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