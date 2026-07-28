import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export default function InstructorStudio() {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Music Videos & Demo Tracks');
  const [description, setDescription] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [loading, setLoading] = useState(false);
  const [courses, setCourses] = useState([]);
  const [msg, setMsg] = useState({ type: '', text: '' });

  const fetchCourses = async () => {
    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
      const res = await fetch(`${baseUrl}/api/courses`);
      if (res.ok) {
        const data = await res.json();
        setCourses(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg({ type: '', text: '' });

    try {
      const baseUrl = import.meta.env.VITE_API_BASE_URL || '';
      const res = await fetch(`${baseUrl}/api/courses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, category, description, thumbnail }),
      });

      const data = await res.json();
      if (res.ok) {
        setMsg({ type: 'success', text: 'Course published into database!' });
        setTitle('');
        setDescription('');
        setThumbnail('');
        fetchCourses();
      } else {
        setMsg({ type: 'error', text: data.message || 'Failed to publish.' });
      }
    } catch (err) {
      setMsg({ type: 'error', text: 'Network error publishing course.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1130] text-white p-6 md:p-12 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-800">
          <div>
            <h1 className="text-3xl font-bold">Instructor Studio</h1>
            <p className="text-gray-400 text-sm mt-1">Add real tracks and video modules directly into PostgreSQL.</p>
          </div>
          <Link to="/dashboard" className="bg-gray-800 hover:bg-gray-700 text-sm px-4 py-2 rounded-lg border border-gray-700">
            ← Dashboard
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add Form */}
          <div className="bg-gray-800/80 p-6 rounded-xl border border-gray-700">
            <h2 className="text-lg font-semibold mb-4">Add New Course Track</h2>

            {msg.text && (
              <div className={`p-3 rounded-lg text-xs font-medium mb-4 ${msg.type === 'success' ? 'bg-green-500/20 text-green-300 border border-green-500/40' : 'bg-red-500/20 text-red-300 border border-red-500/40'}`}>
                {msg.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-gray-300 mb-1">Track Title</label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. 90s Music Videos Demo"
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-300 mb-1">Category</label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-300 mb-1">Description / Video Link</label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Track description or video embed details..."
                  className="w-full bg-gray-900 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 text-white font-medium py-2.5 rounded-lg text-sm transition"
              >
                {loading ? 'Publishing...' : 'Add Course'}
              </button>
            </form>
          </div>

          {/* Published List */}
          <div className="lg:col-span-2">
            <h2 className="text-lg font-semibold mb-4">Live Database Courses ({courses.length})</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {courses.map((c) => (
                <div key={c.id} className="bg-gray-800/50 p-4 rounded-xl border border-gray-700">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-blue-600/20 text-blue-400 border border-blue-500/30">
                    {c.category || 'General'}
                  </span>
                  <h3 className="text-base font-bold text-white mt-2">{c.title}</h3>
                  <p className="text-gray-400 text-xs mt-1 line-clamp-2">{c.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}