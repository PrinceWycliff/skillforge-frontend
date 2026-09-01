import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

export default function Player() {
  const { courseId } = useParams();

  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [activeLesson, setActiveLesson] = useState(null);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // --- Watch-time gating state ---
  const [watchedPercent, setWatchedPercent] = useState(0);
  const [videoUnlocked, setVideoUnlocked] = useState(false);
  const playerContainerRef = useRef(null);
  const playerRef = useRef(null);
  const pollRef = useRef(null);
  const WATCH_THRESHOLD = 90; // % of video that must be watched to unlock "Mark as Complete"

  // --- Quiz state ---
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [quizScore, setQuizScore] = useState(null);
  const CERTIFICATE_PASS_SCORE = 85;

  // --- Progress persistence ---
  const hasHydratedRef = useRef(false);

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

  const isYouTubeLesson = (lesson) => !!lesson?.embedUrl?.includes('youtube.com/embed/');
  const isSlideshowLesson = (lesson) => !!lesson?.slideshow;

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const audioRef = useRef(null);

  const extractYouTubeId = (embedUrl) => {
    const match = embedUrl?.match(/embed\/([a-zA-Z0-9_-]+)/);
    return match ? match[1] : null;
  };

  // Best-effort read of the logged-in student's name for the certificate, without touching auth setup
  const getUserName = () => {
    try {
      const stored = localStorage.getItem('user_name') || localStorage.getItem('userName');
      if (stored) return stored;
      const token = localStorage.getItem('token');
      if (token) {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return payload.name || payload.full_name || payload.email || 'Student';
      }
    } catch (e) {
      // ignore decode errors, fall through to default
    }
    return 'Student';
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
            quiz: [],
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
            slideshow: item.slideshow || null,
          }));
        } else if (Array.isArray(data.modules) && data.modules.length > 0) {
          loadedLessons = data.modules.map((item, idx) => ({
            id: item._id || item.id || idx + 1,
            title: item.title || `Module ${idx + 1}`,
            embedUrl: formatEmbedUrl(item.videoUrl || item.embedUrl),
            duration: item.duration || '10:00',
            slideshow: item.slideshow || null,
          }));
        } else {
          loadedLessons = [
            {
              id: 1,
              title: data.title ? `Overview: ${data.title}` : `Module 1: Intro`,
              embedUrl: formatEmbedUrl(data.videoUrl || data.embedUrl),
              duration: data.duration || '10:00',
              slideshow: null,
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

  // Restore saved progress once the course has loaded, and auto-enroll if this is a first visit
  useEffect(() => {
    const restoreProgress = async () => {
      const token = localStorage.getItem('token');
      if (!token || !courseId) {
        hasHydratedRef.current = true;
        return;
      }

      try {
        const res = await fetch(`${API_BASE}/api/users/me`, {
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        });
        const data = await res.json().catch(() => ({}));

        const match = (data.enrolledCourses || []).find((c) => String(c.id) === String(courseId));

        if (match) {
          let restoredCompleted = [];
          try {
            restoredCompleted = Array.isArray(match.completed_lessons)
              ? match.completed_lessons
              : JSON.parse(match.completed_lessons || '[]');
          } catch (e) {
            restoredCompleted = [];
          }
          setCompletedLessons(restoredCompleted);

          if (match.quiz_score !== null && match.quiz_score !== undefined) {
            setQuizScore(match.quiz_score);
            setQuizSubmitted(true);
          }
        } else {
          // Not enrolled yet — enroll now so progress has somewhere to save
          fetch(`${API_BASE}/api/enrollments`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ courseId }),
          }).catch(() => {});
        }
      } catch (err) {
        console.error('Error restoring progress:', err);
      } finally {
        hasHydratedRef.current = true;
      }
    };

    if (course) restoreProgress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [course]);

  // Save progress whenever completed lessons or quiz score change (skip the initial hydration itself)
  useEffect(() => {
    if (!hasHydratedRef.current || !course) return;

    const token = localStorage.getItem('token');
    if (!token) return;

    fetch(`${API_BASE}/api/enrollments/${courseId}/progress`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        completedLessonIds: completedLessons,
        progress: lessons.length > 0 ? Math.round((completedLessons.length / lessons.length) * 100) : 0,
        quizScore: quizScore,
      }),
    }).catch((err) => console.error('Error saving progress:', err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [completedLessons, quizScore]);

  // Load the YouTube IFrame API script once
  useEffect(() => {
    if (window.YT && window.YT.Player) return;
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    document.body.appendChild(tag);
  }, []);

  // (Re)initialize watch-tracking whenever the active lesson changes
  useEffect(() => {
    if (pollRef.current) clearInterval(pollRef.current);

    if (!activeLesson) return;

    // Already-completed lessons stay unlocked so students can revisit freely
    if (completedLessons.includes(activeLesson.id)) {
      setVideoUnlocked(true);
      setWatchedPercent(100);
      return;
    }

    setWatchedPercent(0);
    setCurrentSlideIndex(0);

    if (isSlideshowLesson(activeLesson)) {
      // Gating handled by the <audio> element's onTimeUpdate handler in the render below
      setVideoUnlocked(false);
      return;
    }

    if (!isYouTubeLesson(activeLesson)) {
      // Can't measure watch-time on non-YouTube embeds — don't block these students
      setVideoUnlocked(true);
      return;
    }

    setVideoUnlocked(false);
    const videoId = extractYouTubeId(activeLesson.embedUrl);
    if (!videoId || !playerContainerRef.current) {
      setVideoUnlocked(true);
      return;
    }

    const createPlayer = () => {
      if (playerRef.current && typeof playerRef.current.destroy === 'function') {
        playerRef.current.destroy();
      }
      playerRef.current = new window.YT.Player(playerContainerRef.current, {
        videoId,
        playerVars: { rel: 0 },
      });

      pollRef.current = setInterval(() => {
        const p = playerRef.current;
        if (p && typeof p.getCurrentTime === 'function' && typeof p.getDuration === 'function') {
          const duration = p.getDuration();
          const current = p.getCurrentTime();
          if (duration > 0) {
            const pct = Math.min(100, Math.round((current / duration) * 100));
            setWatchedPercent(pct);
            if (pct >= WATCH_THRESHOLD) {
              setVideoUnlocked(true);
            }
          }
        }
      }, 2000);
    };

    if (window.YT && window.YT.Player) {
      createPlayer();
    } else {
      window.onYouTubeIframeAPIReady = createPlayer;
    }

    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeLesson, completedLessons]);

  const toggleComplete = (id) => {
    if (!videoUnlocked && !completedLessons.includes(id)) return; // guard against bypass
    if (completedLessons.includes(id)) {
      setCompletedLessons(completedLessons.filter((item) => item !== id));
    } else {
      setCompletedLessons([...completedLessons, id]);
    }
  };

  const progressPercent = lessons.length > 0
    ? Math.round((completedLessons.length / lessons.length) * 100)
    : 0;

  const allLessonsComplete = lessons.length > 0 && completedLessons.length === lessons.length;

  // Parse quiz questions safely — jsonb columns usually arrive pre-parsed, but guard against strings too
  let quizQuestions = [];
  try {
    if (Array.isArray(course?.quiz)) {
      quizQuestions = course.quiz;
    } else if (typeof course?.quiz === 'string' && course.quiz.trim()) {
      quizQuestions = JSON.parse(course.quiz);
    }
  } catch (e) {
    quizQuestions = [];
  }

  const handleSelectAnswer = (qIdx, optIdx) => {
    if (quizSubmitted) return;
    setQuizAnswers({ ...quizAnswers, [qIdx]: optIdx });
  };

  const handleSubmitQuiz = () => {
    let correct = 0;
    quizQuestions.forEach((q, idx) => {
      if (quizAnswers[idx] === q.correctAnswer) correct++;
    });
    const score = quizQuestions.length > 0 ? Math.round((correct / quizQuestions.length) * 100) : 0;
    setQuizScore(score);
    setQuizSubmitted(true);
  };

  const handleRetakeQuiz = () => {
    setQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScore(null);
  };

  const certificateEligible =
    allLessonsComplete && quizSubmitted && quizScore !== null && quizScore >= CERTIFICATE_PASS_SCORE;

  const certificateUrl = course
    ? `${API_BASE}/api/certificates/generate/${courseId}?name=${encodeURIComponent(getUserName())}&courseName=${encodeURIComponent(course.title || courseId)}&score=${quizScore ?? ''}`
    : '#';

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#0B1130]">
        <Sidebar role="student" />
        <div className="flex-1 text-white flex items-center justify-center font-sans">
          <div className="text-center">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-sm text-gray-400">Loading Course Player...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !activeLesson) {
    return (
      <div className="flex min-h-screen bg-[#0B1130]">
        <Sidebar role="student" />
        <div className="flex-1 text-white flex items-center justify-center font-sans p-4">
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
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#0B1130]">
      <Sidebar role="student" />
      <div className="flex-1 text-white flex flex-col font-sans">
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
            {isSlideshowLesson(activeLesson) ? (
              <div className="w-full h-full flex flex-col bg-[#0B1130]">
                <div className="flex-1 flex items-center justify-center overflow-hidden">
                  <img
                    src={activeLesson.slideshow.slides[currentSlideIndex]?.imageUrl}
                    alt={`Slide ${currentSlideIndex + 1}`}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <audio
                  ref={audioRef}
                  src={activeLesson.slideshow.audioUrl}
                  controls
                  className="w-full"
                  onTimeUpdate={(e) => {
                    const current = e.target.currentTime;
                    const duration = e.target.duration;
                    if (duration > 0) {
                      const pct = Math.min(100, Math.round((current / duration) * 100));
                      setWatchedPercent(pct);
                      if (pct >= WATCH_THRESHOLD) setVideoUnlocked(true);
                    }
                    const manifest = activeLesson.slideshow.manifest || [];
                    const match = manifest.find((m) => current >= m.start && current < m.end);
                    if (match && match.slideIndex !== currentSlideIndex) {
                      setCurrentSlideIndex(match.slideIndex);
                    }
                  }}
                />
              </div>
            ) : isYouTubeLesson(activeLesson) ? (
              <div ref={playerContainerRef} className="w-full h-full" />
            ) : (
              <iframe
                className="w-full h-full"
                src={activeLesson.embedUrl}
                title={activeLesson.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            )}
          </div>

          <div className="mt-4 flex items-center justify-between">
            <h2 className="text-xl font-bold">{activeLesson.title}</h2>
            <div className="flex flex-col items-end gap-1">
              <button
                onClick={() => toggleComplete(activeLesson.id)}
                disabled={!videoUnlocked && !completedLessons.includes(activeLesson.id)}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition ${
                  completedLessons.includes(activeLesson.id)
                    ? 'bg-green-600 hover:bg-green-500 text-white'
                    : videoUnlocked
                    ? 'bg-blue-600 hover:bg-blue-500 text-white'
                    : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                }`}
              >
                {completedLessons.includes(activeLesson.id)
                  ? '✓ Completed'
                  : videoUnlocked
                  ? 'Mark as Complete'
                  : `Watch ${WATCH_THRESHOLD}% to Unlock`}
              </button>
              {(isYouTubeLesson(activeLesson) || isSlideshowLesson(activeLesson)) && !completedLessons.includes(activeLesson.id) && (
                <span className="text-[10px] text-gray-500">Watched: {watchedPercent}%</span>
              )}
            </div>
          </div>

          {/* --- Course Quiz --- */}
          {quizQuestions.length > 0 && (
            <div className="mt-8 bg-gray-800/60 border border-gray-700/70 rounded-xl p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-200">Course Quiz ({quizQuestions.length} questions)</h3>
                {!allLessonsComplete && (
                  <span className="text-[11px] text-amber-400">Complete all lessons to unlock the quiz</span>
                )}
              </div>

              <fieldset disabled={!allLessonsComplete} className={!allLessonsComplete ? 'opacity-40' : ''}>
                <div className="space-y-5">
                  {quizQuestions.map((q, qIdx) => (
                    <div key={qIdx} className="bg-gray-900/50 border border-gray-800 rounded-lg p-4">
                      <p className="text-sm font-medium text-white mb-3">
                        {qIdx + 1}. {q.question}
                      </p>
                      <div className="space-y-2">
                        {(q.options || []).map((opt, oIdx) => {
                          const selected = quizAnswers[qIdx] === oIdx;
                          const isCorrectOpt = q.correctAnswer === oIdx;
                          let optionStyle = 'border-gray-700 bg-gray-800/50 text-gray-300';
                          if (quizSubmitted) {
                            if (isCorrectOpt) optionStyle = 'border-green-500 bg-green-500/10 text-green-300';
                            else if (selected && !isCorrectOpt) optionStyle = 'border-red-500 bg-red-500/10 text-red-300';
                          } else if (selected) {
                            optionStyle = 'border-blue-500 bg-blue-500/10 text-white';
                          }
                          return (
                            <label
                              key={oIdx}
                              className={`flex items-center gap-2 p-2.5 rounded-lg border text-xs cursor-pointer transition ${optionStyle}`}
                            >
                              <input
                                type="radio"
                                name={`quiz-q-${qIdx}`}
                                checked={selected}
                                onChange={() => handleSelectAnswer(qIdx, oIdx)}
                                disabled={quizSubmitted}
                              />
                              {opt}
                            </label>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>

                {!quizSubmitted ? (
                  <button
                    onClick={handleSubmitQuiz}
                    disabled={Object.keys(quizAnswers).length < quizQuestions.length}
                    className="mt-5 w-full py-2.5 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition"
                  >
                    Submit Quiz
                  </button>
                ) : (
                  <div className="mt-5 flex items-center justify-between bg-gray-900/60 border border-gray-800 rounded-lg p-4">
                    <div>
                      <p className={`text-sm font-bold ${quizScore >= CERTIFICATE_PASS_SCORE ? 'text-green-400' : 'text-red-400'}`}>
                        Score: {quizScore}%
                      </p>
                      <p className="text-[11px] text-gray-400">
                        {quizScore >= CERTIFICATE_PASS_SCORE
                          ? 'Passed — certificate unlocked below.'
                          : `Need ${CERTIFICATE_PASS_SCORE}% or higher to earn a certificate.`}
                      </p>
                    </div>
                    <button
                      onClick={handleRetakeQuiz}
                      className="text-xs bg-gray-700 hover:bg-gray-600 text-gray-200 px-3 py-1.5 rounded-lg transition"
                    >
                      Retake Quiz
                    </button>
                  </div>
                )}
              </fieldset>
            </div>
          )}

          {/* --- Certificate --- */}
          {certificateEligible && (
            <div className="mt-6 bg-gradient-to-r from-blue-600/20 to-cyan-500/10 border border-cyan-500/40 rounded-xl p-5 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white">🎓 Certificate Ready!</h3>
                <p className="text-[11px] text-gray-300">
                  All lessons watched and quiz passed with {quizScore}%. Download your certificate now.
                </p>
              </div>
              <a
                href={certificateUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-[#0B1130] text-xs font-bold rounded-lg transition whitespace-nowrap"
              >
                Download Certificate
              </a>
            </div>
          )}
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

          {quizQuestions.length > 0 && (
            <div className="mt-2 pt-3 border-t border-gray-700/70 text-[11px] text-gray-400 flex items-center justify-between">
              <span>Course Quiz</span>
              <span className={quizSubmitted ? (quizScore >= CERTIFICATE_PASS_SCORE ? 'text-green-400' : 'text-red-400') : 'text-gray-500'}>
                {quizSubmitted ? `${quizScore}%` : `${quizQuestions.length} questions`}
              </span>
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}