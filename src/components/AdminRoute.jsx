import React from 'react';
import { Navigate } from 'react-router-dom';

export default function AdminRoute({ children }) {
  const token = localStorage.getItem('sf_token');
  const user = JSON.parse(localStorage.getItem('sf_user') || '{}');

  if (!token || user.role !== 'admin') {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
}