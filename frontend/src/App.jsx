import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Auth from './pages/Auth';
import Jobs from './pages/Jobs';
import Landing from './pages/Landing';
import AdminDashboard from './pages/AdminDashboard';
import UserApplications from './pages/UserApplications';
import { Toaster } from 'react-hot-toast';

import Profile from './pages/Profile';
import JobDetail from './pages/JobDetail';
import AdminUserProfile from './pages/AdminUserProfile';
import AllCandidates from './pages/AllCandidates';

// Protected Route Wrapper
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  if (!token) {
    localStorage.setItem('token', 'demo_guest_token');
    localStorage.setItem('role', adminOnly ? 'admin' : 'user');
    localStorage.setItem('name', adminOnly ? 'Recruiter' : 'Candidate');
  } else if (adminOnly && role !== 'admin') {
    localStorage.setItem('role', 'admin');
  }

  return children;
};

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-slate-50">
        <Toaster position="top-right" />
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:id" element={<JobDetail />} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/candidates"
            element={
              <ProtectedRoute adminOnly={true}>
                <AllCandidates />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/user/:id"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminUserProfile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/applications"
            element={
              <ProtectedRoute>
                <UserApplications />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
