import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import Hls from 'hls.js';
import { PlayCircle, CheckCircle, HelpCircle, ArrowLeft, Award, Lock } from 'lucide-react';

export default function Player() {
  const { courseId } = useParams();
  const videoRef = useRef(null);
  
  const [activeTab, setActiveTab] = useState('video'); // 'video' | 'quiz'
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  // Sample HLS Stream URL (Test adaptive stream)
  const streamUrl = 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8';

  useEffect(() => {
    let hls;

    if (activeTab === 'video' && videoRef.current) {
      const video = videoRef.current;

      if (Hls.isSupported()) {
        hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
        });
        hls.loadSource(streamUrl);
        hls.attachMedia(video);
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        // Native HLS support for Safari / iOS
        video.src = streamUrl;
      }
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [activeTab, streamUrl]);

  const handleQuizSubmit = (e) => {
    e.preventDefault();
    setScore(85); // Meets >= 80% threshold
    setQuizSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#0B1130] text-white p-6">
      <div className="max-w-6xl mx-auto">
        {/* Navigation */}
        <Link to="/catalog" className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Catalog
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Video & Quiz Panel */}
          <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-6">
            
            {/* View Selector Tabs */}
            <div className="flex gap-4 border-b border-white/10 pb-4 mb-6">
              <button
                onClick={() => setActiveTab('video')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === 'video' ? 'bg-[#2546F0] text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                <PlayCircle className="w-4 h-4" /> Video Lesson
              </button>
              <button
                onClick={() => setActiveTab('quiz')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === 'quiz' ? 'bg-[#2546F0] text-white' : 'text-gray-400 hover:text-white'
                }`}
              >
                <HelpCircle className="w-4 h-4" /> Knowledge Assessment
              </button>
            </div>

            {/* HLS Video Player Tab */}
            {activeTab === 'video' && (
              <div>
                <div className="relative aspect-video bg-black/80 rounded-xl overflow-hidden border border-white/10 mb-6 shadow-2xl">
                  <video
                    ref={videoRef}
                    controls
                    className="w-full h-full object-cover"
                    poster="https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=1200&auto=format&fit=crop"
                  />
                </div>
                <h2 className="text-2xl font-bold mb-2">Module 1: Architecture & Protocol Fundamentals</h2>
                <p className="text-gray-400 text-sm leading-relaxed">
                  In this lesson, we cover baseline infrastructure setup, transport protocols, and packet processing mechanics for practical systems deployment.
                </p>
              </div>
            )}

            {/* Assessment Tab */}
            {activeTab === 'quiz' && (
              <div>
                <h2 className="text-2xl font-bold mb-2">Module 1 Mastery Assessment</h2>
                <p className="text-gray-400 text-sm mb-6">Score 80% or higher to unlock the next module.</p>

                {!quizSubmitted ? (
                  <form onSubmit={handleQuizSubmit} className="space-y-6">
                    <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                      <p className="font-semibold text-sm mb-3">1. Which protocol structure is primarily utilized for stateful packet inspection and filtering?</p>
                      <div className="space-y-2 text-sm text-gray-300">
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input type="radio" name="q1" value="a" required className="accent-[#2546F0]" /> Access Control Lists (ACLs)
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                          <input type="radio" name="q1" value="b" className="accent-[#2546F0]" /> Dynamic Host Configuration
                        </label>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-[#1FC98D] hover:bg-[#1FC98D]/90 font-bold text-black transition-all"
                    >
                      Submit Assessment
                    </button>
                  </form>
                ) : (
                  <div className="p-6 bg-white/5 border border-[#1FC98D]/30 rounded-xl text-center">
                    <CheckCircle className="w-12 h-12 text-[#1FC98D] mx-auto mb-3" />
                    <h3 className="text-xl font-bold mb-1">Assessment Passed!</h3>
                    <p className="text-gray-400 text-sm mb-4">Score: <span className="text-[#34E0D8] font-bold">{score}%</span> (80% minimum required)</p>
                    <Link
                      to="/dashboard"
                      className="inline-block px-6 py-2.5 rounded-xl bg-[#2546F0] text-white text-sm font-semibold hover:bg-[#2546F0]/90 transition-all"
                    >
                      Return to Dashboard
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Module Track Navigation */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 h-fit">
            <h3 className="text-lg font-bold mb-4 flex items-center justify-between">
              Course Track
              <span className="text-xs bg-[#34E0D8]/20 text-[#34E0D8] px-2.5 py-1 rounded-full font-mono">1 / 4 Complete</span>
            </h3>
            <div className="space-y-3 text-sm">
              <div className="p-3 bg-[#2546F0]/20 border border-[#2546F0]/40 rounded-xl flex items-center justify-between">
                <span className="font-medium">1. Architecture Fundamentals</span>
                <CheckCircle className="w-4 h-4 text-[#34E0D8]" />
              </div>
              <div className="p-3 bg-white/5 rounded-xl flex items-center justify-between text-gray-400">
                <span>2. Core Implementation Mechanics</span>
                <Lock className="w-4 h-4" />
              </div>
              <div className="p-3 bg-white/5 rounded-xl flex items-center justify-between text-gray-400">
                <span>3. Live Simulation & Auditing</span>
                <Lock className="w-4 h-4" />
              </div>
              <div className="p-3 bg-white/5 rounded-xl flex items-center justify-between text-gray-400">
                <span>4. Final Mastery Exam</span>
                <Award className="w-4 h-4 text-[#F5A524]" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}