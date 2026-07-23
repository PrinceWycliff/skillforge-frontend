import React, { useState, useEffect } from 'react';
import { PlusCircle, BookOpen, Users, Star, Video, CheckCircle, FileText, LayoutDashboard } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function InstructorStudio() {
  const [courses, setCourses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newCourse, setNewCourse] = useState({ title: '', category: 'Software Dev', description: '', duration: '4 Hours' });

  useEffect(() => {
    const token = localStorage.getItem('sf_token');
    fetch('http://localhost:5000/api/instructor/courses', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) setCourses(data.courses);
      })
      .catch(() => {
        // Fallback state for local dev
        setCourses([
          { id: 'track-1', title: 'Network Security & Infrastructure', category: 'Cybersecurity', students: 142, rating: 4.9, status: 'Published' },
          { id: 'track-2', title: 'Full-Stack Web Development with Node.js', category: 'Software Dev', students: 89, rating: 4.8, status: 'Published' },
          { id: 'track-3', title: 'Advanced Active Directory & SysAdmin', category: 'Systems Administration', students: 0, rating: 0, status: 'Draft' }
        ]);
      });
  }, []);

  const handleCreateCourse = (e) => {
    e.preventDefault();
    const created = {
      id: `track-${Date.now()}`,
      ...newCourse,
      students: 0,
      rating: 5.0,
      status: 'Draft'
    };
    setCourses([...courses, created]);
    setShowModal(false);
    setNewCourse({ title: '', category: 'Software Dev', description: '', duration: '4 Hours' });
  };

  return (
    <div className="min-h-screen bg-[#0B1130] text-white p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/10 pb-6 gap-4">
          <div>
            <span className="text-xs font-mono text-[#34E0D8] font-bold">INSTRUCTOR STUDIO</span>
            <h1 className="text-3xl font-extrabold mt-1">Authoring & Course Management</h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowModal(true)}
              className="px-5 py-2.5 rounded-xl bg-[#2546F0] hover:bg-[#2546F0]/90 font-semibold text-xs text-white flex items-center gap-2 transition-all shadow-lg shadow-[#2546F0]/30"
            >
              <PlusCircle className="w-4 h-4" /> Create New Track
            </button>
            <Link
              to="/dashboard"
              className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-semibold flex items-center gap-2 transition-colors"
            >
              <LayoutDashboard className="w-4 h-4" /> Student View
            </Link>
          </div>
        </header>

        {/* Studio Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex items-center gap-4">
            <div className="p-3 bg-[#2546F0]/20 text-[#34E0D8] rounded-xl"><BookOpen className="w-6 h-6" /></div>
            <div>
              <p className="text-xs text-gray-400">Authored Tracks</p>
              <p className="text-2xl font-bold">{courses.length}</p>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex items-center gap-4">
            <div className="p-3 bg-[#1FC98D]/20 text-[#1FC98D] rounded-xl"><Users className="w-6 h-6" /></div>
            <div>
              <p className="text-xs text-gray-400">Total Enrolled Students</p>
              <p className="text-2xl font-bold">{courses.reduce((acc, c) => acc + c.students, 0)}</p>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex items-center gap-4">
            <div className="p-3 bg-amber-500/20 text-amber-400 rounded-xl"><Star className="w-6 h-6" /></div>
            <div>
              <p className="text-xs text-gray-400">Average Track Rating</p>
              <p className="text-2xl font-bold">4.85 / 5.0</p>
            </div>
          </div>
        </div>

        {/* Course List */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold">Your Managed Courses</h2>
          <div className="grid grid-cols-1 gap-4">
            {courses.map(course => (
              <div key={course.id} className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-[#34E0D8]/40 transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-[#34E0D8] font-bold">{course.category}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${course.status === 'Published' ? 'bg-[#1FC98D]/20 text-[#1FC98D]' : 'bg-amber-500/20 text-amber-400'}`}>
                      {course.status}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold">{course.title}</h3>
                  <p className="text-xs text-gray-400 flex items-center gap-4">
                    <span>👥 {course.students} Learners</span>
                    <span>⭐ {course.rating > 0 ? course.rating : 'N/A'}</span>
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-semibold flex items-center gap-2 transition-colors">
                    <Video className="w-4 h-4 text-[#34E0D8]" /> Add Lessons
                  </button>
                  <button className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-xs font-semibold flex items-center gap-2 transition-colors">
                    <FileText className="w-4 h-4 text-[#34E0D8]" /> Edit Quiz
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>

      {/* New Course Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-6 z-50">
          <div className="bg-[#0B1130] border border-[#34E0D8]/30 rounded-2xl p-8 max-w-lg w-full space-y-6 shadow-2xl">
            <h2 className="text-2xl font-bold text-[#34E0D8]">Create Course Track</h2>
            <form onSubmit={handleCreateCourse} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Track Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Low-Level Systems & Memory Management"
                  value={newCourse.title}
                  onChange={e => setNewCourse({ ...newCourse, title: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#34E0D8]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Category</label>
                <select
                  value={newCourse.category}
                  onChange={e => setNewCourse({ ...newCourse, category: e.target.value })}
                  className="w-full bg-[#0B1130] border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#34E0D8]"
                >
                  <option value="Software Dev">Software Dev</option>
                  <option value="Cybersecurity">Cybersecurity</option>
                  <option value="Systems Administration">Systems Administration</option>
                  <option value="Data Analytics">Data Analytics</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">Description</label>
                <textarea
                  rows="3"
                  placeholder="Brief overview of course track outcomes..."
                  value={newCourse.description}
                  onChange={e => setNewCourse({ ...newCourse, description: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#34E0D8]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-white/5 text-xs text-gray-300 font-semibold hover:bg-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#2546F0] text-xs text-white font-bold hover:bg-[#2546F0]/90 shadow-lg shadow-[#2546F0]/30"
                >
                  Publish Draft Track
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}