import React, { useState } from 'react';
import StaticPage from './StaticPage';
import { Link } from 'react-router-dom';
import { 
  FaSearch, 
  FaBookOpen, 
  FaUserGraduate, 
  FaCreditCard, 
  FaLaptopCode, 
  FaChevronDown, 
  FaChevronUp,
  FaEnvelopeOpenText
} from 'react-icons/fa';

export default function HelpCenter() {
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  // Support Knowledge Base Categories
  const categories = [
    {
      icon: <FaUserGraduate className="text-[#34E0D8]" size={24} />,
      title: "Account & Dashboard",
      desc: "Managing profile settings, password resets, and login authentication."
    },
    {
      icon: <FaBookOpen className="text-[#34E0D8]" size={24} />,
      title: "Courses & Content",
      desc: "Accessing video lectures, slideshows, code repositories, and quizzes."
    },
    {
      icon: <FaCreditCard className="text-[#34E0D8]" size={24} />,
      title: "Enrollment & Pricing",
      desc: "Payment options, course receipts, refund policies, and enterprise plans."
    },
    {
      icon: <FaLaptopCode className="text-[#34E0D8]" size={24} />,
      title: "Certificates & Projects",
      desc: "Downloading verified certificates and submitting final course projects."
    }
  ];

  // Detailed Knowledge Base Articles / FAQs
  const articles = [
    {
      q: "How do I access my enrolled courses and course materials?",
      a: "Log into your student dashboard and click on any enrolled course card. You will be directed to the interactive course player where videos, slides, and exercise files are available."
    },
    {
      q: "What should I do if a course video or quiz fails to load?",
      a: "First, ensure your internet connection is stable. Try refreshing your browser or clearing your cache. If the issue persists, switch to another browser or check our system status."
    },
    {
      q: "How are SkillForge certificates generated and verified?",
      a: "Certificates are automatically generated upon completing 100% of the course modules and passing required quizzes. You can download or share your verified certificate directly from your dashboard."
    },
    {
      q: "Can I get a refund if I am not satisfied with a course?",
      a: "Yes, SkillForge offers a 14-day money-back guarantee for single-course purchases, provided less than 30% of the course content has been consumed."
    },
    {
      q: "How do I reset a forgotten password?",
      a: "Navigate to the Login page and click 'Forgot Password'. Enter your registered email address to receive a secure password reset link."
    }
  ];

  const filteredArticles = articles.filter(item => 
    item.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
    item.a.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0B1130] text-white py-12 px-6">
      <div className="max-w-5xl mx-auto">
        
        {/* Header & Search Bar */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-white mb-4">How can we help you today?</h1>
          <p className="text-[#94a3b8] text-base mb-8 max-w-2xl mx-auto">
            Search our knowledge base, browse help topics, or connect with our support team.
          </p>
          
          <div className="relative max-w-2xl mx-auto">
            <FaSearch className="absolute left-4 top-4 text-[#94a3b8]" size={18} />
            <input
              type="text"
              placeholder="Search guides, video issues, certificates, payments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-[#131b4d] border border-[#1e293b] rounded-xl text-white placeholder-[#94a3b8] focus:outline-none focus:border-[#34E0D8] transition shadow-lg"
            />
          </div>
        </div>

        {/* Support Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {categories.map((cat, idx) => (
            <div key={idx} className="bg-[#131b4d] border border-[#1e293b] rounded-xl p-6 hover:border-[#34E0D8] transition cursor-pointer flex flex-col justify-between">
              <div>
                <div className="mb-4">{cat.icon}</div>
                <h3 className="text-lg font-bold text-white mb-2">{cat.title}</h3>
                <p className="text-sm text-[#94a3b8] leading-relaxed">{cat.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Detailed Articles Accordion */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6 text-[#34E0D8]">Popular Help Articles</h2>
          <div className="space-y-4">
            {filteredArticles.length > 0 ? (
              filteredArticles.map((item, index) => (
                <div key={index} className="bg-[#131b4d] border border-[#1e293b] rounded-xl overflow-hidden">
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full p-5 text-left flex justify-between items-center font-semibold text-white hover:text-[#34E0D8] transition"
                  >
                    <span>{item.q}</span>
                    {openFaq === index ? <FaChevronUp className="text-[#34E0D8]" /> : <FaChevronDown className="text-[#94a3b8]" />}
                  </button>
                  {openFaq === index && (
                    <div className="px-5 pb-5 text-sm text-[#94a3b8] border-t border-[#1e293b] pt-4 leading-relaxed">
                      {item.a}
                    </div>
                  )}
                </div>
              ))
            ) : (
              <p className="text-[#94a3b8] italic">No articles match your search query.</p>
            )}
          </div>
        </div>

        {/* Fallback Contact Banner */}
        <div className="bg-gradient-to-r from-[#131b4d] to-[#1e293b] border border-[#2546F0]/40 rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-[#2546F0]/20 rounded-xl text-[#34E0D8]">
              <FaEnvelopeOpenText size={32} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-1">Still can't find what you need?</h3>
              <p className="text-sm text-[#94a3b8]">Our technical support team is available 24/7 to assist you directly.</p>
            </div>
          </div>
          <Link
            to="/contact"
            className="whitespace-nowrap px-6 py-3 bg-gradient-to-r from-[#2546F0] to-[#34E0D8] text-[#0B1130] font-bold rounded-lg hover:opacity-90 transition"
          >
            Contact Support Team
          </Link>
        </div>

      </div>
    </div>
  );
}