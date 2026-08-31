import React from 'react';
import { Link } from 'react-router-dom';
import { FaBuilding, FaUsers, FaShieldAlt, FaChartLine } from 'react-icons/fa';

export default function Enterprise() {
  const features = [
    { icon: <FaUsers className="text-[#34E0D8]" size={24} />, title: "Team Management", desc: "Assign course pathways and monitor team progress with admin dashboards." },
    { icon: <FaShieldAlt className="text-[#34E0D8]" size={24} />, title: "SSO & Security", desc: "Integrate with SAML SSO, Okta, and enterprise access security standards." },
    { icon: <FaChartLine className="text-[#34E0D8]" size={24} />, title: "Analytics & Reporting", desc: "Track completion rates and skill assessment metrics across departments." },
    { icon: <FaBuilding className="text-[#34E0D8]" size={24} />, title: "Custom Content Integration", desc: "Upload internal engineering documentation and custom training modules." }
  ];

  return (
    <div className="min-h-screen bg-[#0B1130] text-white py-12 px-6 font-sans">
      <div className="max-w-5xl mx-auto text-center mb-16">
        <span className="text-[#34E0D8] text-xs font-bold tracking-widest uppercase bg-[#131b4d] px-3.5 py-1.5 rounded-full border border-[#1e293b]">
          SkillForge for Business
        </span>
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mt-5 mb-4">
          Upskill Your Engineering Teams
        </h1>
        <p className="text-[#94a3b8] text-base md:text-lg max-w-2xl mx-auto">
          Equip your technical workforce with modern web development, networking, and systems administration skills.
        </p>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
        {features.map((f, idx) => (
          <div key={idx} className="bg-[#131b4d] border border-[#1e293b] rounded-xl p-6">
            <div className="mb-4">{f.icon}</div>
            <h3 className="text-lg font-bold text-white mb-2">{f.title}</h3>
            <p className="text-sm text-[#94a3b8] leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>

      <div className="max-w-2xl mx-auto bg-[#131b4d] border border-[#1e293b] rounded-2xl p-8 text-center">
        <h3 className="text-2xl font-bold text-white mb-2">Request Enterprise Demo</h3>
        <p className="text-xs text-[#94a3b8] mb-6">Contact our sales team for custom seat pricing and dedicated support.</p>
        <Link
          to="/contact"
          className="inline-block px-6 py-3 bg-gradient-to-r from-[#2546F0] to-[#34E0D8] text-[#0B1130] font-bold text-sm rounded-lg hover:opacity-90 transition"
        >
          Contact Enterprise Sales
        </Link>
      </div>
    </div>
  );
}