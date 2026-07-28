import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';

export default function Player() {
  const { courseId } = useParams();

  // Test lessons using music video embeds
  const [lessons] = useState([
    {
      id: 1,
      title: 'Track 1: Networking Basics & Flow',
      embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Sample video link
      duration: '3:30',
    },
    {
      id: 2,
      title: 'Track 2: Core Protocols in Action',
      embedUrl: 'https://www.youtube.com/embed/3JZ_D3ELwOQ',
      duration: '4:15',
    },
  ]);

  const [activeLesson, setActiveLesson] = useState(lessons[0]);
  const [completedLessons, setCompletedLessons] = useState([]);

  const toggleComplete = (id) => {
    if (completedLessons.includes(id)) {
      setCompletedLessons(completedLessons.filter((item) => item !== id));
    } else {
      setCompletedLessons([...completedLessons, id]);
    }
  };

  const progressPercent = Math.round(
    (completedLessons.length / lessons.length) * 100
  );

  return (
    <div className="min-h-screen bg-[#0B1130] text-white flex flex-col font-sans">
      {/* Top Bar */}
      <header className="border-b border-gray-800 bg-[#0B1130]/90 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            to="/dashboard"
            className="text-xs bg-gray-800 hover:bg-gray-700 text-gray-300 px-3 py-1.5 rounded-lg border border-gray-700 transition"
          >
            ← Back to Dashboard
          </Link>
          <h1 className="text-lg font-bold text-white">
            Skill Track #{courseId}
          </h1>
        </div>

        {/* Course Progress Indicator */}
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

      {/* Main Player & Sidebar Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-6 p-6 max-w-7xl w-full mx-auto">
        
        {/* Main Video Viewport (3 Cols) */}
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

        {/* Playlist / Lesson Sidebar (1 Col) */}
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