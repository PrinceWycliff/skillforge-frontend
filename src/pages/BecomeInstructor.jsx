import React, { useState } from 'react';
import { 
  FaChalkboardTeacher, 
  FaLaptopCode, 
  FaGlobe, 
  FaCheckCircle, 
  FaPaperPlane 
} from 'react-icons/fa';

export default function BecomeInstructor() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    expertise: '',
    experience: '',
    bio: '',
    sampleUrl: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.fullName && formData.email) {
      setSubmitted(true);
    }
  };

  const benefits = [
    {
      icon: <FaGlobe className="text-[#34E0D8]" size={24} />,
      title: "Reach Global Learners",
      desc: "Share your industry expertise with thousands of passionate tech students and professionals worldwide."
    },
    {
      icon: <FaLaptopCode className="text-[#34E0D8]" size={24} />,
      title: "Modern Teaching Tools",
      desc: "Utilize SkillForge's Instructor Studio to upload HD video modules, code attachments, and quizzes with ease."
    },
    {
      icon: <FaChalkboardTeacher className="text-[#34E0D8]" size={24} />,
      title: "Build Your Personal Brand",
      desc: "Establish your reputation as an authority in web development, networking, systems administration, or cybersecurity."
    }
  ];

  const steps = [
    { num: "01", title: "Apply", desc: "Submit your details, technical expertise, and a brief intro about what you want to teach." },
    { num: "02", title: "Review", desc: "Our team reviews your technical background and teaching sample within 48 hours." },
    { num: "03", title: "Build", desc: "Access the Instructor Studio to structure curriculum, record lessons, and publish your course." }
  ];

  return (
    <div className="min-h-screen bg-[#0B1130] text-white py-12 px-6 font-sans">
      <div className="max-w-5xl mx-auto">
        
        {/* Hero Section */}
        <div className="text-center mb-16">
          <span className="text-[#34E0D8] text-xs font-bold tracking-widest uppercase bg-[#131b4d] px-3.5 py-1.5 rounded-full border border-[#1e293b]">
            Join Our Faculty
          </span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mt-5 mb-4 leading-tight">
            Teach the Next Generation of <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#2546F0] to-[#34E0D8]">Tech Pioneers</span>
          </h1>
          <p className="text-[#94a3b8] text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Inspire students worldwide by creating practical, industry-driven tech courses on SkillForge.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {benefits.map((item, idx) => (
            <div key={idx} className="bg-[#131b4d] border border-[#1e293b] rounded-xl p-6 hover:border-[#34E0D8]/50 transition">
              <div className="mb-4">{item.icon}</div>
              <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
              <p className="text-sm text-[#94a3b8] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* How It Works Steps */}
        <div className="mb-16 bg-[#131b4d]/50 border border-[#1e293b] rounded-2xl p-8">
          <h2 className="text-2xl font-bold text-center text-white mb-8">How to Become an Instructor</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {steps.map((s, idx) => (
              <div key={idx} className="relative flex flex-col items-center text-center">
                <span className="text-3xl font-extrabold text-[#34E0D8] mb-2">{s.num}</span>
                <h4 className="text-lg font-semibold text-white mb-1">{s.title}</h4>
                <p className="text-xs text-[#94a3b8] leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Application Form Container */}
        <div className="max-w-2xl mx-auto bg-[#131b4d] border border-[#1e293b] rounded-2xl p-8 shadow-xl">
          {submitted ? (
            <div className="text-center py-10 space-y-4">
              <FaCheckCircle className="text-[#34E0D8] mx-auto" size={50} />
              <h3 className="text-2xl font-bold text-white">Application Received!</h3>
              <p className="text-sm text-[#94a3b8] max-w-md mx-auto leading-relaxed">
                Thank you for applying to teach on SkillForge. Our academic team will review your submission and contact you via email within 48 hours.
              </p>
            </div>
          ) : (
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Instructor Application</h2>
              <p className="text-xs text-[#94a3b8] mb-6">Fill out the details below to start your teaching journey on SkillForge.</p>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#94a3b8] mb-1">Full Name *</label>
                    <input
                      type="text"
                      name="fullName"
                      required
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="e.g. Jane Doe"
                      className="w-full px-4 py-2.5 bg-[#0B1130] border border-[#1e293b] rounded-lg text-white text-sm focus:outline-none focus:border-[#34E0D8]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#94a3b8] mb-1">Email Address *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="e.g. instructor@skillforge.com"
                      className="w-full px-4 py-2.5 bg-[#0B1130] border border-[#1e293b] rounded-lg text-white text-sm focus:outline-none focus:border-[#34E0D8]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#94a3b8] mb-1">Primary Area of Expertise</label>
                    <select
                      name="expertise"
                      value={formData.expertise}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 bg-[#0B1130] border border-[#1e293b] rounded-lg text-white text-sm focus:outline-none focus:border-[#34E0D8]"
                    >
                      <option value="">Select Domain</option>
                      <option value="web-dev">Full-Stack Web Development</option>
                      <option value="networking">Networking & Infrastructure</option>
                      <option value="cybersecurity">Cybersecurity & Ethical Hacking</option>
                      <option value="databases">Database Systems & Analytics</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#94a3b8] mb-1">Years of Experience</label>
                    <input
                      type="text"
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      placeholder="e.g. 5+ Years"
                      className="w-full px-4 py-2.5 bg-[#0B1130] border border-[#1e293b] rounded-lg text-white text-sm focus:outline-none focus:border-[#34E0D8]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#94a3b8] mb-1">Link to Portfolio / GitHub / LinkedIn</label>
                  <input
                    type="url"
                    name="sampleUrl"
                    value={formData.sampleUrl}
                    onChange={handleChange}
                    placeholder="https://github.com/yourhandle or LinkedIn profile"
                    className="w-full px-4 py-2.5 bg-[#0B1130] border border-[#1e293b] rounded-lg text-white text-sm focus:outline-none focus:border-[#34E0D8]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#94a3b8] mb-1">Brief Pitch / Proposed Course Topics</label>
                  <textarea
                    name="bio"
                    rows="3"
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="Tell us about what courses or practical technical subjects you plan to teach..."
                    className="w-full px-4 py-2.5 bg-[#0B1130] border border-[#1e293b] rounded-lg text-white text-sm focus:outline-none focus:border-[#34E0D8]"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-[#2546F0] to-[#34E0D8] text-[#0B1130] font-bold text-sm rounded-lg hover:opacity-90 transition flex items-center justify-center gap-2"
                >
                  <FaPaperPlane size={14} /> Submit Application
                </button>
              </form>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}