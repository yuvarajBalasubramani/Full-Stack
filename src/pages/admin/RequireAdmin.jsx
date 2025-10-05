import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useApp } from '../../context/AppContext.jsx';

// Protect admin routes
const RequireAdmin = () => {
  const { state } = useApp();
  if (!state.currentUser || state.currentUser.role !== 'admin') {
    return <Navigate to="/" replace />;
  }
  return <Outlet />;
};

export default RequireAdmin;