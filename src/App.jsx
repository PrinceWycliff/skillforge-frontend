import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

// Page Imports
import Landing from './pages/Landing';
import Catalog from './pages/Catalog';
import Player from './pages/Player';
import Dashboard from './pages/Dashboard';
import ContactSupport from './pages/ContactSupport';
import Login from './pages/Login';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import InstructorLogin from './pages/InstructorLogin';
import InstructorStudio from './pages/InstructorStudio';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ProtectedRoute from './components/ProtectedRoute';
import Scrolltotop from './components/Scrolltotop';
import AdminRoute from './components/AdminRoute';
import Register from './pages/Register';
import VerifyEmail from './pages/VerifyEmail';
import Footer from './components/Footer';
import BecomeInstructor from './pages/BecomeInstructor';

// Static Info Page Imports
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import HelpCenter from './pages/HelpCenter';
import Enterprise from './pages/Enterprise';
import Pricing from './pages/Pricing';
import Categories from './pages/Categories';
import Blog from './pages/Blog';
import Community from './pages/Community';
import FAQPage from './pages/FAQPage';
import ComingSoon from './pages/Comingsoon';

// Page Transition Animation Wrapper
const PageTransition = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -15 }}
    transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1.0] }}
  >
    {children}
  </motion.div>
);

// Inline Guard for Instructor Studio
const InstructorRoute = ({ children }) => {
  const isAuth = localStorage.getItem('instructor_token') || localStorage.getItem('token');
  return isAuth ? children : <Navigate to="/instructor/login" replace />;
};

// Main Animated Content Component
function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route path="/" element={<PageTransition><Landing /></PageTransition>} />
        <Route path="/catalog" element={<PageTransition><Catalog /></PageTransition>} />
        <Route path="/courses" element={<PageTransition><Catalog /></PageTransition>} />
        <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
        <Route path="/register" element={<PageTransition><Register /></PageTransition>} />
        <Route path="/contact" element={<PageTransition><ContactSupport /></PageTransition>} />

        {/* Coming Soon Routes */}
        <Route path="/paths" element={<PageTransition><ComingSoon title="Learning Paths" description="Curated multi-course paths are on the way — we're building this right now." /></PageTransition>} />
        <Route path="/for-business" element={<PageTransition><ComingSoon title="Skillforge for Business" description="Team plans and enterprise features are coming soon." /></PageTransition>} />
        <Route path="/certificates" element={<PageTransition><ComingSoon title="Certificate Verification" description="A public certificate verification page is coming soon." /></PageTransition>} />
        <Route path="/pricing" element={<PageTransition><Pricing /></PageTransition>} />

        {/* Password Recovery Routes */}
        <Route path="/forgot-password" element={<PageTransition><ForgotPassword /></PageTransition>} />
        <Route path="/reset-password" element={<PageTransition><ResetPassword /></PageTransition>} />
        <Route path="/verify-email" element={<PageTransition><VerifyEmail /></PageTransition>} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<PageTransition><AdminLogin /></PageTransition>} />
        <Route 
          path="/admin/dashboard" 
          element={
            <AdminRoute>
              <PageTransition><AdminDashboard /></PageTransition>
            </AdminRoute>
          } 
        />

        {/* Instructor Routes */}
        <Route path="/instructor/login" element={<PageTransition><InstructorLogin /></PageTransition>} />
        <Route 
          path="/instructor/studio" 
          element={
            <InstructorRoute>
              <PageTransition><InstructorStudio /></PageTransition>
            </InstructorRoute>
          } 
        />

        {/* Student Protected Routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <PageTransition><Dashboard /></PageTransition>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/player/:courseId" 
          element={
            <ProtectedRoute>
              <PageTransition><Player /></PageTransition>
            </ProtectedRoute>
          } 
        />

        {/* Footer Static Routes */}
        <Route path="/privacy" element={<PageTransition><PrivacyPolicy /></PageTransition>} />
        <Route path="/terms" element={<PageTransition><TermsOfService /></PageTransition>} />
        <Route path="/instructor/register" element={<PageTransition><BecomeInstructor /></PageTransition>} />
        <Route path="/help" element={<PageTransition><HelpCenter /></PageTransition>} />
        <Route path="/community" element={<PageTransition><Community /></PageTransition>} />
        <Route path="/faq" element={<PageTransition><FAQPage /></PageTransition>} />
        <Route path="/enterprise" element={<PageTransition><Enterprise /></PageTransition>} />
        <Route path="/categories" element={<PageTransition><Categories /></PageTransition>} />
        <Route path="/blog" element={<PageTransition><Blog /></PageTransition>} />

        {/* Fallback Catch-all Route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <Router>
      <Scrolltotop />
      <div className="flex flex-col min-h-screen bg-[#0B1130] text-white overflow-x-hidden">
        {/* Main Content Area */}
        <main className="flex-grow">
          <AnimatedRoutes />
        </main>

        {/* Global Iconic Footer */}
        <Footer />
      </div>
    </Router>
  );
}