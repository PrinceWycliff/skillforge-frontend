import React, { useState } from 'react';
import StaticPage from './StaticPage';
import { Link } from 'react-router-dom';
import { 
  FaSearch, 
  FaChevronDown, 
  FaChevronUp, 
  FaQuestionCircle, 
  FaBookReader, 
  FaAward, 
  FaCreditCard, 
  FaUserCog 
} from 'react-icons/fa';

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [openFaq, setOpenFaq] = useState(null);

  const categories = [
    { name: 'All', icon: <FaQuestionCircle size={14} /> },
    { name: 'Courses & Access', icon: <FaBookReader size={14} /> },
    { name: 'Certificates', icon: <FaAward size={14} /> },
    { name: 'Pricing & Billing', icon: <FaCreditCard size={14} /> },
    { name: 'Account & Profile', icon: <FaUserCog size={14} /> },
  ];

  const faqs = [
    {
      category: 'Courses & Access',
      q: "How long do I have access to enrolled courses?",
      a: "Once enrolled in a course, you enjoy full lifetime access to all course lectures, slideshows, exercise files, and future content updates. You can learn at your own pace without strict deadlines."
    },
    {
      category: 'Courses & Access',
      q: "Can I download course videos for offline viewing?",
      a: "Course videos are streamed directly through our web player to ensure content security. However, all downloadable course resources, code templates, and slide decks can be saved locally to your device."
    },
    {
      category: 'Certificates',
      q: "Are verified certificates provided upon completion?",
      a: "Yes! Once you reach 100% course completion and pass all module assessments, a verified SkillForge Certificate of Completion is automatically generated in your dashboard."
    },
    {
      category: 'Certificates',
      q: "Can I add my SkillForge certificate to LinkedIn or CVs?",
      a: "Absolutely. Every certificate includes a unique verification ID and link that you can directly embed on your LinkedIn profile, portfolio, or resume."
    },
    {
      category: 'Pricing & Billing',
      q: "What payment methods are supported?",
      a: "We support all major credit/debit cards, secure online payment gateways, and local payment processing options depending on your location."
    },
    {
      category: 'Pricing & Billing',
      q: "What is the refund policy?",
      a: "SkillForge offers a 14-day money-back guarantee for single course purchases, provided you have consumed less than 30% of the course content."
    },
    {
      category: 'Account & Profile',
      q: "How do I reset my account password?",
      a: "Navigate to the Login page, click 'Forgot Password', and enter your registered email address. You will receive a secure password reset link in your inbox."
    },
    {
      category: 'Account & Profile',
      q: "Can I update my email address or full name on my certificate?",
      a: "Yes, you can update your legal full name and account details inside your Dashboard profile settings before generating your final completion certificate."
    }
  ];

  // Filter Logic
  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory = activeCategory === 'All' || faq.category === activeCategory;
    const matchesSearch = 
      faq.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
      faq.a.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-[#0B1130] text-white py-12 px-6 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* Header & Title */}
        <div className="text-center mb-10">
          <span className="text-[#34E0D8] text-xs font-bold tracking-widest uppercase bg-[#131b4d] px-3 py-1 rounded-full border border-[#1e293b]">
            Got Questions?
          </span>
          <h1 className="text-3xl md:text-4xl font-extrabold text-white mt-4 mb-3">
            Frequently Asked Questions
          </h1>
          <p className="text-[#94a3b8] text-sm md:text-base max-w-xl mx-auto">
            Everything you need to know about SkillForge courses, certification, billing, and account management.
          </p>
        </div>

        {/* Live Search Bar */}
        <div className="relative max-w-2xl mx-auto mb-8">
          <FaSearch className="absolute left-4 top-3.5 text-[#94a3b8]" size={16} />
          <input
            type="text"
            placeholder="Search questions (e.g. certificates, payments, password)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-[#131b4d] border border-[#1e293b] rounded-xl text-white text-sm placeholder-[#94a3b8] focus:outline-none focus:border-[#34E0D8] transition shadow-md"
          />
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => setActiveCategory(cat.name)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition border ${
                activeCategory === cat.name
                  ? 'bg-[#2546F0] border-[#2546F0] text-white'
                  : 'bg-[#131b4d] border-[#1e293b] text-[#94a3b8] hover:border-[#34E0D8] hover:text-white'
              }`}
            >
              {cat.icon}
              {cat.name}
            </button>
          ))}
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-4 mb-16">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, idx) => (
              <div 
                key={idx} 
                className="bg-[#131b4d] border border-[#1e293b] rounded-xl overflow-hidden transition hover:border-[#34E0D8]/50"
              >
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full p-5 text-left flex justify-between items-center text-sm md:text-base font-semibold text-white hover:text-[#34E0D8] transition gap-4"
                >
                  <span className="flex-1">{faq.q}</span>
                  <span className="text-[#34E0D8]">
                    {openFaq === idx ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
                  </span>
                </button>
                
                {openFaq === idx && (
                  <div className="px-5 pb-5 pt-2 text-xs md:text-sm text-[#94a3b8] leading-relaxed border-t border-[#1e293b]/60">
                    <span className="inline-block mb-2 text-[10px] uppercase font-bold text-[#34E0D8] tracking-wider">
                      {faq.category}
                    </span>
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-12 bg-[#131b4d] rounded-xl border border-[#1e293b]">
              <p className="text-[#94a3b8] text-sm">No questions matched your search criteria.</p>
              <button 
                onClick={() => { setSearchQuery(''); setActiveCategory('All'); }}
                className="mt-3 text-xs text-[#34E0D8] underline hover:opacity-80"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>

        {/* Unresolved Question Escalation Box */}
        <div className="bg-gradient-to-r from-[#131b4d] via-[#111827] to-[#131b4d] border border-[#1e293b] rounded-2xl p-6 md:p-8 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-lg font-bold text-white mb-1">Still have questions?</h3>
            <p className="text-xs md:text-sm text-[#94a3b8]">
              Can't find the answer you're looking for? Reach out directly to our support team.
            </p>
          </div>
          <Link
            to="/contact"
            className="whitespace-nowrap px-5 py-2.5 bg-gradient-to-r from-[#2546F0] to-[#34E0D8] text-[#0B1130] text-xs font-bold rounded-lg hover:opacity-90 transition shadow-lg"
          >
            Contact Support
          </Link>
        </div>

      </div>
    </div>
  );
}