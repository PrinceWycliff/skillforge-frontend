import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function Player() {
  const { courseId } = useParams();

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [activeLesson, setActiveLesson] = useState(null);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const RAW_API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://skillforge-backend-4wd6.onrender.com';
  const API_BASE = RAW_API_BASE.replace(/\/$/, '');

  const formatEmbedUrl = (url) => {
    if (!url) return 'https://www.youtube.com/embed/dQw4w9WgXcQ';
    if (url.includes('youtube.com/embed/')) return url;
    if (url.includes('watch?v=')) {
      const videoId = url.split('watch?v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    return url;
  };

  useEffect(() => {
    const fetchCourseDetails = async () => {
      setLoading(true);
      setError('');

      try {
        const token = localStorage.getItem('token');
        const headers = {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        };

        const response = await fetch(`${API_BASE}/api/courses/${courseId}`, { headers });

        if (response.status === 404) {
          // Fallback for static/template courses not yet seeded in backend DB
          const fallbackCourse = {
            id: courseId,
            title: `Skill Track Course`,
            lessons: [
              {
                id: 1,
                title: 'Track 1: Networking Basics & Flow',
                embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
                duration: '3:30',
              },
              {
                id: 2,
                title: 'Track 2: Core Protocols in Action',
                embedUrl: 'https://www.youtube.com/embed/3JZ_D3ELwOQ',
                duration: '4:15',
              },
            ],
          };
          setCourse(fallbackCourse);
          setLessons(fallbackCourse.lessons);
          setActiveLesson(fallbackCourse.lessons[0]);
          return;
        }

        if (!response.ok) {
          throw new Error(`Failed to load course details (Status: ${response.status})`);
        }
        
        const data = await response.json();
        setCourse(data);

        let loadedLessons = [];

        if (Array.isArray(data.lessons) && data.lessons.length > 0) {
          loadedLessons = data.lessons.map((item, idx) => ({
            id: item._id || item.id || idx + 1,
            title: item.title || `Lesson ${idx + 1}`,
            embedUrl: formatEmbedUrl(item.videoUrl || item.embedUrl),
            duration: item.duration || '10:00',
          }));
        } else if (Array.isArray(data.modules) && data.modules.length > 0) {
          loadedLessons = data.modules.map((item, idx) => ({
            id: item._id || item.id || idx + 1,
            title: item.title || `Module ${idx + 1}`,
            embedUrl: formatEmbedUrl(item.videoUrl || item.embedUrl),
            duration: item.duration || '10:00',
          }));
        } else {
          loadedLessons = [
            {
              id: 1,
              title: data.title ? `Overview: ${data.title}` : `Module 1: Intro`,
              embedUrl: formatEmbedUrl(data.videoUrl || data.embedUrl),
              duration: data.duration || '10:00',
            },
          ];
        }

        setLessons(loadedLessons);
        setActiveLesson(loadedLessons[0]);
      } catch (err) {
        console.error('Error fetching course in Player:', err);
        setError(err.message || 'Could not load course content.');
      } finally {
        setLoading(false);
      }
    };

    if (courseId) {
      fetchCourseDetails();
    }
  }, [courseId, API_BASE]);

  const toggleComplete = (id) => {
    if (completedLessons.includes(id)) {
      setCompletedLessons(completedLessons.filter((item) => item !== id));
    } else {
      setCompletedLessons([...completedLessons, id]);
    }
  };

  const progressPercent = lessons.length > 0
    ? Math.round((completedLessons.length / lessons.length) * 100)
    : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B1130] text-white flex items-center justify-center font-sans">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-sm text-gray-400">Loading Course Player...</p>
        </div>
      </div>
    );
  }

  if (error || !activeLesson) {
    return (
      <div className="min-h-screen bg-[#0B1130] text-white flex items-center justify-center font-sans p-4">
        <div className="max-w-md w-full bg-[#111936] p-6 rounded-xl border border-gray-800 text-center shadow-xl">
          <h2 className="text-lg font-bold text-red-400 mb-2">Error Loading Course</h2>
          <p className="text-xs text-gray-400 mb-6">{error || 'Course content could not be loaded.'}</p>
          <Link
            to="/catalog"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold transition"
          >
            Back to Catalog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B1130] text-white flex flex-col font-sans">
      <header className="border-b border-gray-800 bg-[#0B1130]/90 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/catalog"
            className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1.5 rounded-lg border border-gray-700 transition"
          >
            ← Back to Catalog
          </Link>
          <h1 className="text-lg font-bold text-white truncate max-w-md">
            {course?.title || `Course #${courseId}`}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400">Progress: {progressPercent}%</span>
          <div className="w-32 bg-gray-800 h-2 rounded-full overflow-hidden border border-gray-700">
            <div
              className="bg-blue-500 h-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 p-6 max-w-7xl w-full mx-auto">
        <div className="lg:col-span-3 flex flex-col">
          <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border border-gray-800">
            <iframe
              className="w-full h-full"
              src={activeLesson.embedUrl}
              title={activeLesson.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">{activeLesson.title}</h2>
            <button
              onClick={() => toggleComplete(activeLesson.id)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition ${
                completedLessons.includes(activeLesson.id)
                  ? 'bg-green-600 hover:bg-green-500 text-white'
                  : 'bg-blue-600 hover:bg-blue-500 text-white'
              }`}
            >
              {completedLessons.includes(activeLesson.id)
                ? '✓ Completed'
                : 'Mark as Complete'}
            </button>
          </div>
        </div>

        <div className="bg-gray-800/60 border border-gray-700/70 rounded-xl p-4 flex flex-col gap-3 h-fit">
          <h3 className="text-sm font-semibold text-gray-300 mb-1">
            Course Modules ({lessons.length})
          </h3>

          <div className="space-y-2">
            {lessons.map((lesson) => {
              const isActive = lesson.id === activeLesson.id;
              const isDone = completedLessons.includes(lesson.id);

              return (
                <button
                  key={lesson.id}
                  onClick={() => setActiveLesson(lesson)}
                  className={`w-full text-left p-3 rounded-lg text-xs transition border flex items-center justify-between ${
                    isActive
                      ? 'bg-blue-600/20 border-blue-500/50 text-white font-medium'
                      : 'bg-gray-900/50 border-gray-800 text-gray-400 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                        isDone ? 'bg-green-500 text-black font-bold' : 'bg-gray-700'
                      }`}
                    >
                      {isDone ? '✓' : lesson.id}
                    </span>
                    <span className="truncate max-w-[160px]">{lesson.title}</span>
                  </div>
                  <span className="text-[10px] text-gray-500">{lesson.duration}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}