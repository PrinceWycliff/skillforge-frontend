import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing'; // Landing / Homepage
import Catalog from './pages/Catalog'; // Dedicated Course Catalog
import Player from './pages/Player';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import InstructorLogin from './pages/InstructorLogin';
import InstructorStudio from './pages/InstructorStudio';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import Register from './pages/Register';

// Inline Guard for Instructor Studio
const InstructorRoute = ({ children }) => {
  const isAuth = localStorage.getItem('instructor_token') || localStorage.getItem('token');
  return isAuth ? children : <Navigate to="/instructor/login" replace />;
};

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#0B1130] text-white">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Password Recovery Routes */}
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route 
            path="/admin/dashboard" 
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } 
          />

          {/* Instructor Routes */}
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

          {/* Fallback Catch-all Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}