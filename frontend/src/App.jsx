import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AdminPage from './pages/AdminPage';
import BlogDetail from './pages/BlogDetails';

const ProtectedRoute = ({ element, allowedRoles, ...props }) => {
  // Replace the following line with your actual authentication and role-checking logic
  const userRole = 'admin'; // Example role, replace it with your actual logic
  const isAuthenticated = !!document.cookie; // Check if the user is authenticated

  // Check if the user has the required role to access the route
  const hasAccess = isAuthenticated && allowedRoles.includes(userRole);

  return hasAccess ? (
    React.cloneElement(element, props)
  ) : (
    <Navigate to="/login" replace />
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={<ProtectedRoute element={<Dashboard />} allowedRoles={['admin', 'user']} />}
        />
        <Route
          path="/admin"
          element={<ProtectedRoute element={<AdminPage />} allowedRoles={['admin']} />}
        />
      <Route path="/BlogDetails/:contentId" element={<BlogDetail />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;
