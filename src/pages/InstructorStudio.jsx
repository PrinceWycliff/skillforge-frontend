import React, { useState } from 'react';

// Use environment variable if present, or fallback to your live Render backend URL
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://skillforge-backend-4wd6.onrender.com';

export default function InstructorStudio() {
  const [activeTab, setActiveTab] = useState(1);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

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

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto', color: '#fff' }}>
      <h2>Instructor Studio</h2>
      <p style={{ color: '#aaa', marginBottom: '1.5rem' }}>
        Publish courses with embedded video lessons and interactive quizzes.
      </p>

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
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
    </div>
  );
}