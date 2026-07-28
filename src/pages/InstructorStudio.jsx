import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function InstructorStudio() {
  const [activeTab, setActiveTab] = useState('course'); // 'course' | 'lessons' | 'quiz'
  const [publishedCourses, setPublishedCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  // Form State: Course Basic Info
  const [courseData, setCourseData] = useState({
    title: '',
    category: 'Music Videos & Demo Tracks',
    description: '',
    thumbnail: ''
  });

  // Form State: Lessons / Video Tracks
  const [lessons, setLessons] = useState([
    { title: 'Good Life (Official Video)', videoUrl: 'https://www.youtube.com/embed/3JZ_D3ELwOQ', duration: '3:45' }
  ]);

  // Form State: Quiz Questions
  const [quizQuestions, setQuizQuestions] = useState([
    { question: 'Who is the featured artist in Good Life?', options: ['G-Eazy', 'Drake', 'Post Malone', 'Eminem'], correctAnswer: 'G-Eazy' }
  ]);

  // Fallback to production API URL if VITE_API_BASE_URL isn't set in Vercel
  const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://skillforge-backend.onrender.com';

  // Fetch Existing Courses
  const fetchCourses = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/courses`);
      if (res.ok) {
        const data = await res.json();
        setPublishedCourses(data);
        if (data.length > 0 && !selectedCourseId) {
          setSelectedCourseId(data[0].id);
        }
      }
    } catch (e) {
      console.error('Fetch courses error:', e);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Handlers for dynamic Lessons
  const addLessonField = () => {
    setLessons([...lessons, { title: '', videoUrl: '', duration: '' }]);
  };

  const updateLesson = (index, field, value) => {
    const updated = [...lessons];
    updated[index][field] = value;
    setLessons(updated);
  };

  const removeLesson = (index) => {
    setLessons(lessons.filter((_, i) => i !== index));
  };

  // Handlers for dynamic Quizzes
  const addQuizQuestion = () => {
    setQuizQuestions([
      ...quizQuestions,
      { question: '', options: ['', '', '', ''], correctAnswer: '' }
    ]);
  };

  // Submit Handler for Entire Course Package
  const handlePublishCourse = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg({ type: '', text: '' });

    const fullCoursePackage = {
      ...courseData,
      lessons,
      quiz: quizQuestions
    };

    try {
      const res = await fetch(`${API_BASE}/api/courses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fullCoursePackage),
      });

      const data = await res.json();

      if (res.ok) {
        setMsg({ type: 'success', text: 'Course with Lessons & Quiz published successfully!' });
        setCourseData({ title: '', category: 'Music Videos & Demo Tracks', description: '', thumbnail: '' });
        fetchCourses();
      } else {
        setMsg({ type: 'error', text: data.message || 'Error publishing to backend.' });
      }
    } catch (err) {
      console.error(err);
      setMsg({ type: 'error', text: `Network error connecting to ${API_BASE}` });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1130] text-white p-6 md:p-12 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Top Navigation */}
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-800">
          <div>
            <h1 className="text-3xl font-bold">Instructor Studio</h1>
            <p className="text-gray-400 text-sm mt-1">Publish courses with embedded video lessons and interactive quizzes.</p>
          </div>
          <div className="flex gap-3">
            <Link to="/catalog" className="bg-blue-600 hover:bg-blue-500 text-sm px-4 py-2 rounded-lg font-medium transition">
              View Catalog
            </Link>
            <Link to="/dashboard" className="bg-gray-800 hover:bg-gray-700 text-sm px-4 py-2 rounded-lg border border-gray-700 transition">
              Dashboard
            </Link>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex gap-4 mb-6 border-b border-gray-800 pb-2">
          <button
            onClick={() => setActiveTab('course')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
              activeTab === 'course' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            1. Course Details
          </button>
          <button
            onClick={() => setActiveTab('lessons')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
              activeTab === 'lessons' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            2. Video Lessons ({lessons.length})
          </button>
          <button
            onClick={() => setActiveTab('quiz')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
              activeTab === 'quiz' ? 'bg-blue-600 text-white' : 'bg-gray-800 text-gray-400 hover:text-white'
            }`}
          >
            3. Quiz Questions ({quizQuestions.length})
          </button>
        </div>

        {/* Feedback Alert */}
        {msg.text && (
          <div className={`p-4 rounded-xl text-sm font-medium mb-6 ${
            msg.type === 'success' 
              ? 'bg-green-500/20 text-green-300 border border-green-500/40' 
              : 'bg-red-500/20 text-red-300 border border-red-500/40'
          }`}>
            {msg.text}
          </div>
        )}

        <form onSubmit={handlePublishCourse}>
          {/* TAB 1: COURSE DETAILS */}
          {activeTab === 'course' && (
            <div className="bg-gray-800/80 p-6 rounded-xl border border-gray-700 space-y-4 max-w-2xl">
              <h2 className="text-xl font-semibold mb-2">Basic Track Information</h2>
              <div>
                <label className="block text-xs text-gray-300 mb-1">Course Title</label>
                <input
                  type="text"
                  required
                  value={courseData.title}
                  onChange={(e) => setCourseData({ ...courseData, title: e.target.value })}
                  placeholder="e.g. Good Life by G-Eazy & Kehlani"
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-300 mb-1">Category</label>
                <input
                  type="text"
                  value={courseData.category}
                  onChange={(e) => setCourseData({ ...courseData, category: e.target.value })}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-300 mb-1">Description</label>
                <textarea
                  required
                  rows={4}
                  value={courseData.description}
                  onChange={(e) => setCourseData({ ...courseData, description: e.target.value })}
                  placeholder="Give students an overview of this course track..."
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white"
                />
              </div>

              <button
                type="button"
                onClick={() => setActiveTab('lessons')}
                className="bg-blue-600 hover:bg-blue-500 text-white text-sm px-5 py-2 rounded-lg font-medium"
              >
                Next: Add Video Lessons →
              </button>
            </div>
          )}

          {/* TAB 2: LESSONS & VIDEO EMBEDS */}
          {activeTab === 'lessons' && (
            <div className="bg-gray-800/80 p-6 rounded-xl border border-gray-700 space-y-6 max-w-3xl">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Lessons & Video Tracks</h2>
                <button
                  type="button"
                  onClick={addLessonField}
                  className="bg-green-600 hover:bg-green-500 text-white text-xs px-3 py-2 rounded-lg font-semibold"
                >
                  + Add Lesson
                </button>
              </div>

              {lessons.map((lesson, idx) => (
                <div key={idx} className="bg-gray-900 p-4 rounded-xl border border-gray-700 space-y-3 relative">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-blue-400">Lesson #{idx + 1}</span>
                    {lessons.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeLesson(idx)}
                        className="text-red-400 hover:text-red-300 text-xs"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Lesson Title (e.g. Good Life Official Music Video)"
                      value={lesson.title}
                      onChange={(e) => updateLesson(idx, 'title', e.target.value)}
                      className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white"
                    />
                    <input
                      type="text"
                      placeholder="YouTube Embed URL (https://www.youtube.com/embed/...)"
                      value={lesson.videoUrl}
                      onChange={(e) => updateLesson(idx, 'videoUrl', e.target.value)}
                      className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white"
                    />
                  </div>
                </div>
              ))}

              <button
                type="button"
                onClick={() => setActiveTab('quiz')}
                className="bg-blue-600 hover:bg-blue-500 text-white text-sm px-5 py-2 rounded-lg font-medium"
              >
                Next: Add Quiz →
              </button>
            </div>
          )}

          {/* TAB 3: QUIZZES */}
          {activeTab === 'quiz' && (
            <div className="bg-gray-800/80 p-6 rounded-xl border border-gray-700 space-y-6 max-w-3xl">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Interactive Course Quiz</h2>
                <button
                  type="button"
                  onClick={addQuizQuestion}
                  className="bg-green-600 hover:bg-green-500 text-white text-xs px-3 py-2 rounded-lg font-semibold"
                >
                  + Add Question
                </button>
              </div>

              {quizQuestions.map((q, qIdx) => (
                <div key={qIdx} className="bg-gray-900 p-4 rounded-xl border border-gray-700 space-y-3">
                  <span className="text-xs font-bold text-indigo-400">Question #{qIdx + 1}</span>
                  <input
                    type="text"
                    placeholder="Enter assessment question..."
                    value={q.question}
                    onChange={(e) => {
                      const updated = [...quizQuestions];
                      updated[qIdx].question = e.target.value;
                      setQuizQuestions(updated);
                    }}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-xs text-white"
                  />
                </div>
              ))}

              <div className="pt-4 border-t border-gray-700">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-semibold py-3 rounded-lg text-sm transition shadow-lg"
                >
                  {loading ? 'Publishing Track to Database...' : '🚀 Publish Complete Course Track'}
                </button>
              </div>
            </div>
          )}
        </form>

      </div>
    </div>
  );
}