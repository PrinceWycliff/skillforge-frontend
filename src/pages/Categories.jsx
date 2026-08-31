import React from 'react';
import { Link } from 'react-router-dom';
import { FaCode, FaNetworkWired, FaShieldAlt, FaDatabase } from 'react-icons/fa';

export default function Categories() {
  const categories = [
    { icon: <FaCode className="text-[#34E0D8]" size={32} />, title: "Web Development", desc: "Full-stack development, React, Node.js, HTML/CSS, and REST APIs." },
    { icon: <FaNetworkWired className="text-[#34E0D8]" size={32} />, title: "Networking & Enterprise Systems", desc: "OSI Model, Access Control Lists (ACLs), NAT configurations, and VPNs." },
    { icon: <FaDatabase className="text-[#34E0D8]" size={32} />, title: "Database Engineering", desc: "Relational database design, SQL queries, indexing, and data modelling." },
    { icon: <FaShieldAlt className="text-[#34E0D8]" size={32} />, title: "Cybersecurity & Infrastructure", desc: "Network security, access management, system auditing, and threat analysis." }
  ];

  return (
    <div className="min-h-screen bg-[#0B1130] text-white py-12 px-6 font-sans">
      <div className="max-w-5xl mx-auto text-center mb-12">
        <h1 className="text-4xl font-extrabold text-white mb-3">Course Categories</h1>
        <p className="text-[#94a3b8] text-base max-w-lg mx-auto">Explore technical domains structured for practical learning.</p>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((cat, idx) => (
          <div key={idx} className="bg-[#131b4d] border border-[#1e293b] rounded-xl p-8 flex flex-col justify-between hover:border-[#34E0D8]/50 transition">
            <div>
              <div className="mb-4">{cat.icon}</div>
              <h3 className="text-xl font-bold text-white mb-2">{cat.title}</h3>
              <p className="text-sm text-[#94a3b8] mb-6 leading-relaxed">{cat.desc}</p>
            </div>
            <Link to="/catalog" className="inline-block text-xs font-bold text-[#34E0D8] hover:underline">
              Explore Courses →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}