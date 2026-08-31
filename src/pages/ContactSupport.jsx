import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  FaEnvelope, 
  FaPhoneAlt, 
  FaWhatsapp, 
  FaFacebook, 
  FaTwitter, 
  FaPaperPlane, 
  FaCheckCircle,
  FaClock,
  FaMapMarkerAlt
} from 'react-icons/fa';

export default function ContactSupport() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'General Inquiry',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.name && formData.email && formData.message) {
      setSubmitted(true);
      // Integrate backend API or email service payload here
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1130] text-white font-sans flex flex-col justify-between">
      {/* Navigation Header */}
      <header className="border-b border-[#1e293b] bg-[#0B1130]/90 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="bg-[#2546F0] text-white w-8 h-8 rounded-lg flex items-center justify-center font-bold text-lg">
              S
            </div>
            <span className="text-xl font-bold tracking-wide text-white">SkillForge</span>
          </Link>
          <div className="flex items-center gap-6 text-sm font-medium">
            <Link to="/catalog" className="text-[#94a3b8] hover:text-[#34E0D8] transition">
              Catalog
            </Link>
            <Link to="/dashboard" className="text-[#94a3b8] hover:text-[#34E0D8] transition">
              Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-6 py-12 flex-1 w-full">
        {/* Title Section */}
        <div className="text-center mb-14">
          <span className="text-[#34E0D8] text-xs font-bold tracking-widest uppercase bg-[#131b4d] px-3.5 py-1.5 rounded-full border border-[#1e293b]">
            Get In Touch
          </span>
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mt-4 mb-3">
            We're Here to Help
          </h1>
          <p className="text-[#94a3b8] text-sm md:text-base max-w-xl mx-auto leading-relaxed">
            Have questions about course access, enrollment, or platform features? Reach out to our technical support team directly.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Direct Support Channels */}
          <div className="lg:col-span-5 space-y-4">
            
            {/* Direct Email Card */}
            <div className="bg-[#131b4d] border border-[#1e293b] p-6 rounded-xl hover:border-[#34E0D8]/50 transition shadow-lg flex items-start gap-4">
              <div className="p-3.5 bg-[#2546F0]/20 rounded-xl text-[#34E0D8] shrink-0">
                <FaEnvelope size={20} />
              </div>
              <div className="overflow-hidden">
                <h3 className="font-bold text-base text-white mb-1">Email Support</h3>
                <p className="text-xs text-[#94a3b8] mb-2 leading-relaxed">
                  Send us an email and our support desk will get back to you within 24 hours.
                </p>
                <a
                  href="mailto:dicksonprince.wycliff@gmail.com"
                  className="text-xs font-semibold text-[#34E0D8] hover:underline break-all"
                >
                  skillforgesystems@gmail.com
                </a>
              </div>
            </div>

            {/* Phone & WhatsApp Card */}
            <div className="bg-[#131b4d] border border-[#1e293b] p-6 rounded-xl hover:border-[#34E0D8]/50 transition shadow-lg flex items-start gap-4">
              <div className="p-3.5 bg-[#34E0D8]/10 rounded-xl text-[#34E0D8] shrink-0">
                <FaPhoneAlt size={20} />
              </div>
              <div>
                <h3 className="font-bold text-base text-white mb-1">Direct Line & WhatsApp</h3>
                <p className="text-xs text-[#94a3b8] mb-3">Available for urgent inquiries and quick chat support.</p>
                
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2">
                    <a href="tel:+265886292423" className="text-white hover:text-[#34E0D8] transition font-medium">
                      +265 886 292 423
                    </a>
                    <span className="text-[#1e293b]">|</span>
                    <a
                      href="https://wa.me/265886292423"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#34E0D8] hover:underline flex items-center gap-1 font-semibold"
                    >
                      <FaWhatsapp size={13} /> WhatsApp
                    </a>
                  </div>
                  <div className="flex items-center gap-2">
                    <a href="tel:+265993827285" className="text-white hover:text-[#34E0D8] transition font-medium">
                      +265 993 827 285
                    </a>
                    <span className="text-[#1e293b]">|</span>
                    <a
                      href="https://wa.me/265993827285"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#34E0D8] hover:underline flex items-center gap-1 font-semibold"
                    >
                      <FaWhatsapp size={13} /> WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Channels Card */}
            <div className="bg-[#131b4d] border border-[#1e293b] p-6 rounded-xl hover:border-[#34E0D8]/50 transition shadow-lg">
              <h3 className="font-bold text-base text-white mb-1">Social Networks</h3>
              <p className="text-xs text-[#94a3b8] mb-4">Follow our official channels or send us direct messages.</p>
              
              <div className="grid grid-cols-2 gap-3">
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-2.5 bg-[#0B1130] border border-[#1e293b] rounded-lg text-xs font-medium text-white hover:border-[#34E0D8] transition"
                >
                  <FaFacebook className="text-[#34E0D8]" size={16} />
                  <span>Facebook</span>
                </a>
                <a
                  href="https://x.com/Princewyclsejw"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 p-2.5 bg-[#0B1130] border border-[#1e293b] rounded-lg text-xs font-medium text-white hover:border-[#34E0D8] transition"
                >
                  <FaTwitter className="text-[#34E0D8]" size={16} />
                  <span>X</span>
                </a>
              </div>
            </div>

            {/* Hours & Location Info */}
            <div className="bg-[#131b4d]/40 border border-[#1e293b] p-5 rounded-xl text-xs space-y-2 text-[#94a3b8]">
              <div className="flex items-center gap-2 text-[#34E0D8] font-semibold">
                <FaClock size={12} /> Response Time
              </div>
              <p>Mon – Fri: 8:00 AM – 6:00 PM (CAT)</p>
              <div className="flex items-center gap-2 text-[#34E0D8] font-semibold pt-2">
                <FaMapMarkerAlt size={12} /> Support Base
              </div>
              <p>Blantyre, Malawi</p>
            </div>

          </div>

          {/* Right Column: Interactive Support Form */}
          <div className="lg:col-span-7 bg-[#131b4d] border border-[#1e293b] p-8 rounded-2xl shadow-xl">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <FaCheckCircle className="text-[#34E0D8] mx-auto" size={54} />
                <h3 className="text-2xl font-bold text-white">Message Sent Successfully</h3>
                <p className="text-sm text-[#94a3b8] max-w-sm mx-auto leading-relaxed">
                  Thank you for contacting SkillForge. A support representative will review your inquiry and respond shortly.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', email: '', subject: 'General Inquiry', message: '' });
                  }}
                  className="mt-4 px-5 py-2.5 bg-[#0B1130] border border-[#1e293b] text-xs font-semibold text-[#34E0D8] rounded-lg hover:border-[#34E0D8] transition"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">Send Us a Message</h2>
                <p className="text-xs text-[#94a3b8] mb-6">
                  Fill out the form below and we'll route your ticket directly to technical support.
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-[#94a3b8] mb-1.5">Your Name *</label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. Prince Dickson"
                        className="w-full px-4 py-2.5 bg-[#0B1130] border border-[#1e293b] rounded-lg text-white text-xs placeholder-[#94a3b8]/60 focus:outline-none focus:border-[#34E0D8] transition"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#94a3b8] mb-1.5">Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        className="w-full px-4 py-2.5 bg-[#0B1130] border border-[#1e293b] rounded-lg text-white text-xs placeholder-[#94a3b8]/60 focus:outline-none focus:border-[#34E0D8] transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#94a3b8] mb-1.5">Topic / Issue Category</label>
                    <select
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-[#0B1130] border border-[#1e293b] rounded-lg text-white text-xs focus:outline-none focus:border-[#34E0D8] transition"
                    >
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Course Access Issue">Course Access & Video Playback</option>
                      <option value="Billing & Refund">Billing, Pricing & Refunds</option>
                      <option value="Certificate Assistance">Certificate Verification</option>
                      <option value="Technical Bug">Report a Bug / Platform Issue</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#94a3b8] mb-1.5">Message Details *</label>
                    <textarea
                      name="message"
                      required
                      rows="5"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Describe your issue or question in detail..."
                      className="w-full px-4 py-2.5 bg-[#0B1130] border border-[#1e293b] rounded-lg text-white text-xs placeholder-[#94a3b8]/60 focus:outline-none focus:border-[#34E0D8] transition leading-relaxed"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-gradient-to-r from-[#2546F0] to-[#34E0D8] text-[#0B1130] font-bold text-xs uppercase tracking-wider rounded-lg hover:opacity-95 transition flex items-center justify-center gap-2 shadow-lg"
                  >
                    <FaPaperPlane size={13} /> Send Support Ticket
                  </button>
                </form>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}