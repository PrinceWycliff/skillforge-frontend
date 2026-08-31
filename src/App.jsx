import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing'; // Landing / Homepage
import Catalog from './pages/Catalog'; // Dedicated Course Catalog
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
import BecomeInstructor from './pages/BecomeInstructor';
import Community from './pages/Community';
import FAQPage from './pages/FAQPage'; // Add FAQ Page Import

// Inline Guard for Instructor Studio
const InstructorRoute = ({ children }) => {
  const isAuth = localStorage.getItem('instructor_token') || localStorage.getItem('token');
  return isAuth ? children : <Navigate to="/instructor/login" replace />;
};

export default function App() {
  return (
    <Router>
      <Scrolltotop />
      <div className="flex flex-col min-h-screen bg-[#0B1130] text-white">
        {/* Main Content Area expands to fill remaining vertical space */}
        <main className="flex-grow">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/catalog" element={<Catalog />} />
            <Route path="/courses" element={<Catalog />} /> {/* Optional alias for Footer link */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/contact" element={<ContactSupport />} />
            
            {/* Password Recovery Routes */}
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/verify-email" element={<VerifyEmail />} />

            {/* Admin Routes (Direct Access via URL) */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route 
              path="/admin/dashboard" 
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } 
            />

            {/* Instructor Routes (Direct Access via URL) */}
            <Route path="/instructor/login" element={<InstructorLogin />} />
            <Route 
              path="/instructor/studio" 
              element={
                <InstructorRoute>
                  <InstructorStudio />
                </InstructorRoute>
              } 
            />

            {/* Student Protected Routes */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/player/:courseId" 
              element={
                <ProtectedRoute>
                  <Player />
                </ProtectedRoute>
              } 
            />

            {/* Footer Static Routes */}
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/instructor/register" element={<BecomeInstructor />} />
            <Route path="/help" element={<HelpCenter />} />
            <Route path="/community" element={<Community />} />
            <Route path="/faq" element={<FAQPage />} />
            <Route path="/enterprise" element={<Enterprise />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/instructor/register" element={<BecomeInstructor />} />

            {/* Fallback Catch-all Route - MUST remain at the bottom of Routes */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Global Iconic Footer */}
        <Footer />
      </div>
    </Router>
  );
}