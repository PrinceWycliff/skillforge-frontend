import React from 'react';
import { Link } from 'react-router-dom';

export default function ContactSupport() {
  return (
    <div className="min-h-screen bg-[#0B1130] text-white font-sans flex flex-col justify-between">
      {/* Navigation Header */}
      <header className="border-b border-gray-800 bg-[#111936]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold tracking-wide text-blue-400">
            Skillforge
          </Link>
          <div className="flex items-center gap-6 text-sm font-medium">
            <Link to="/catalog" className="text-gray-300 hover:text-white transition">
              Catalog
            </Link>
            <Link to="/dashboard" className="text-gray-300 hover:text-white transition">
              Dashboard
            </Link>
          </div>
        </div>
      </header>

      {/* Content Container */}
      <main className="max-w-4xl mx-auto px-6 py-12 flex-1 w-full">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-3">Contact Support</h1>
          <p className="text-gray-400 text-sm max-w-lg mx-auto">
            Have questions about your courses, account, or need help? Get in touch with our team directly.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Direct Email */}
          <div className="bg-[#111936] border border-gray-800 p-6 rounded-xl hover:border-blue-500/50 transition shadow-lg">
            <div className="w-10 h-10 bg-blue-600/20 text-blue-400 rounded-lg flex items-center justify-center mb-4">
              ✉️
            </div>
            <h3 className="font-semibold text-lg text-white mb-1">Email Support</h3>
            <p className="text-xs text-gray-400 mb-4">Drop us an email and we'll reply as soon as possible.</p>
            <a
              href="mailto:dicksonprince.wycliff@gmail.com"
              className="text-sm font-medium text-blue-400 hover:underline break-all"
            >
              dicksonprince.wycliff@gmail.com
            </a>
          </div>

          {/* Phone & WhatsApp */}
          <div className="bg-[#111936] border border-gray-800 p-6 rounded-xl hover:border-blue-500/50 transition shadow-lg">
            <div className="w-10 h-10 bg-green-600/20 text-green-400 rounded-lg flex items-center justify-center mb-4">
              📞
            </div>
            <h3 className="font-semibold text-lg text-white mb-1">Phone & WhatsApp</h3>
            <p className="text-xs text-gray-400 mb-4">Available for direct calls and instant WhatsApp messaging.</p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <a href="tel:+265886292423" className="text-gray-200 hover:text-white transition">
                  +265 886 292 423
                </a>
                <span className="text-gray-600">|</span>
                <a
                  href="https://wa.me/265886292423"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-400 hover:underline text-xs"
                >
                  WhatsApp
                </a>
              </div>
              <div className="flex items-center gap-2">
                <a href="tel:+265993827285" className="text-gray-200 hover:text-white transition">
                  +265 993 827 285
                </a>
                <span className="text-gray-600">|</span>
                <a
                  href="https://wa.me/265993827285"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-400 hover:underline text-xs"
                >
                  WhatsApp
                </a>
              </div>
            </div>
          </div>

          {/* Facebook */}
          <div className="bg-[#111936] border border-gray-800 p-6 rounded-xl hover:border-blue-500/50 transition shadow-lg">
            <div className="w-10 h-10 bg-blue-500/20 text-blue-400 rounded-lg flex items-center justify-center mb-4">
              🌐
            </div>
            <h3 className="font-semibold text-lg text-white mb-1">Facebook</h3>
            <p className="text-xs text-gray-400 mb-4">Connect with us on Facebook.</p>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-blue-400 hover:underline"
            >
              Prince Wycliff Dickson
            </a>
          </div>

          {/* Twitter / X */}
          <div className="bg-[#111936] border border-gray-800 p-6 rounded-xl hover:border-blue-500/50 transition shadow-lg">
            <div className="w-10 h-10 bg-gray-700/30 text-white rounded-lg flex items-center justify-center mb-4">
              𝕏
            </div>
            <h3 className="font-semibold text-lg text-white mb-1">X (Twitter)</h3>
            <p className="text-xs text-gray-400 mb-4">Follow us or send a direct message on X.</p>
            <a
              href="https://x.com/Princewyclsejw"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium text-blue-400 hover:underline"
            >
              @Princewyclsejw
            </a>
          </div>
        </div>
      </main>

     
    </div>
  );
}