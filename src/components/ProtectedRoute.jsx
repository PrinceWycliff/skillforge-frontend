import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem('sf_token');
  const user = localStorage.getItem('user');
  const location = useLocation();

  // Allow access if either sf_token or user object is present in localStorage
  if (!token && !user) {
    // Redirect to login, preserving the path they were trying to access
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
}