import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Landing from './pages/Landing'; // Landing / Homepage
import Catalog from './pages/Catalog'; // Dedicated Course Catalog
import Player from './pages/Player';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import InstructorStudio from './pages/InstructorStudio';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-[#0B1130] text-white">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/login" element={<Login />} />
          
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
          <Route path="/instructor/studio" element={<InstructorStudio />} />

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
        </Routes>
      </div>
    </Router>
  );
}