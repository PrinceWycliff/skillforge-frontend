import React from 'react';
import { Link } from 'react-router-dom';
import { FaCheck } from 'react-icons/fa';

export default function Pricing() {
  const plans = [
    {
      name: "Pay Per Course",
      price: "Individual",
      desc: "Buy courses individually with lifetime access.",
      features: ["Lifetime course access", "Interactive quizzes", "Verified certificate of completion", "Downloadable source code"],
      button: "Browse Catalog",
      link: "/catalog"
    },
    {
      name: "All-Access Pass",
      price: "$19/mo",
      desc: "Unlimited access to all technical courses.",
      features: ["Full course library access", "All upcoming course additions", "Interactive exercises & labs", "Priority community support"],
      highlighted: true,
      button: "Start Free Trial",
      link: "/register"
    },
    {
      name: "Enterprise",
      price: "Custom",
      desc: "Tailored for tech teams and organizations.",
      features: ["Unlimited seat licenses", "Admin reporting dashboard", "Dedicated account manager", "Custom course pathways"],
      button: "Contact Sales",
      link: "/enterprise"
    }
  ];

  return (
    <div className="min-h-screen bg-[#0B1130] text-white py-12 px-6 font-sans">
      <div className="max-w-5xl mx-auto text-center mb-16">
        <h1 className="text-4xl font-extrabold text-white mb-3">Simple, Transparent Pricing</h1>
        <p className="text-[#94a3b8] text-base max-w-lg mx-auto">Choose the learning plan that fits your technical education goals.</p>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, idx) => (
          <div 
            key={idx} 
            className={`bg-[#131b4d] border rounded-2xl p-8 flex flex-col justify-between ${
              plan.highlighted ? 'border-[#34E0D8] ring-1 ring-[#34E0D8]' : 'border-[#1e293b]'
            }`}
          >
            <div>
              <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
              <div className="text-3xl font-extrabold text-[#34E0D8] mb-3">{plan.price}</div>
              <p className="text-xs text-[#94a3b8] mb-6 leading-relaxed">{plan.desc}</p>
              
              <ul className="space-y-3 mb-8">
                {plan.features.map((feat, i) => (
                  <li key={i} className="flex items-center gap-3 text-xs text-[#94a3b8]">
                    <FaCheck className="text-[#34E0D8]" size={12} />
                    {feat}
                  </li>
                ))}
              </ul>
            </div>

            <Link
              to={plan.link}
              className={`w-full py-2.5 text-center text-xs font-bold rounded-lg transition ${
                plan.highlighted 
                  ? 'bg-gradient-to-r from-[#2546F0] to-[#34E0D8] text-[#0B1130]' 
                  : 'bg-[#0B1130] text-white border border-[#1e293b] hover:border-[#34E0D8]'
              }`}
            >
              {plan.button}
            </Link>
          </div>
        ))}
      </div>
        {/* Footer Link */}
              <div className="mt-8 pt-6 border-t border-gray-800 text-center text-xs text-gray-500">
                <Link to="/" className="hover:text-gray-300 transition">
                  ← Return to Main Homepage
                </Link>
              </div>
    </div>
  );
}