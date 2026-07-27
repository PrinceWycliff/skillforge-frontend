import React, { useEffect, useState } from 'react';

export default function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Read the user object from local storage on mount
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Error parsing user from localStorage", e);
      }
    }
  }, []);

  // Fallback chain: full_name -> fullName -> email prefix -> Student
  const displayName = 
    user?.full_name || 
    user?.fullName || 
    user?.email?.split('@')[0] || 
    'Student';

  return (
    <div className="p-8 max-w-7xl mx-auto min-h-screen text-white">
      {/* Dynamic Welcome Banner */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold">
          Welcome back, <span className="text-blue-400">{displayName}</span>! 👋
        </h1>
        <p className="text-gray-400 mt-2">
          Track your enrolled tracks, assessment scores, and verified digital certificates.
        </p>
      </header>

      {/* Courses / Tracks Section */}
      <section className="mt-8">
        <h2 className="text-xl font-semibold mb-4">My Enrolled Courses</h2>
        
        <div className="bg-gray-800/60 p-8 rounded-xl text-center border border-gray-700 max-w-2xl">
          <h3 className="text-lg font-semibold text-gray-200 mb-2">No Enrolled Courses Yet</h3>
          <p className="text-gray-400 text-sm mb-6">
            Explore the catalog to enroll in IT, Networking, or Software Engineering tracks tailored for you.
          </p>
          <a 
            href="/catalog" 
            className="inline-block bg-blue-600 hover:bg-blue-500 text-white font-medium px-5 py-2.5 rounded-lg transition"
          >
            Explore Course Catalog
          </a>
        </div>
      </section>
    </div>
  );
}