import React from 'react';
import StaticPage from './StaticPage';

export default function FAQPage() {
  const faqs = [
    {
      q: "How long do I have access to enrolled courses?",
      a: "Once you enroll in a course, you enjoy lifetime access to all course lectures, exercises, and project files."
    },
    {
      q: "Are verified certificates granted upon completion?",
      a: "Yes! A downloadable completion certificate is automatically generated in your student dashboard once you pass all module assessments."
    },
    {
      q: "Can I interact directly with instructors?",
      a: "Yes, you can ask questions directly through the course discussion board or via support."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <h1 className="text-3xl font-bold mb-8 text-[#34E0D8]">Frequently Asked Questions</h1>
      <div className="space-y-6">
        {faqs.map((faq, index) => (
          <div key={index} className="bg-[#131b4d] border border-[#1e293b] rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-2">{faq.q}</h3>
            <p className="text-[#94a3b8] text-sm leading-relaxed">{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}