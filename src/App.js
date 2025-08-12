import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';

// Components
import Navbar from './components/Layout/Navbar';
import LoadingSpinner from './components/UI/LoadingSpinner';

// Pages
import Login from './pages/Auth/Login';
import Dashboard from './pages/Dashboard/Dashboard';
import Tasks from './pages/Tasks/Tasks';
import TaskDetail from './pages/Tasks/TaskDetail';
import Withdrawal from './pages/Withdrawal/Withdrawal';
import WithdrawalHistory from './pages/Withdrawal/WithdrawalHistory';
import Profile from './pages/Profile/Profile';

// Admin Pages
import AdminDashboard from './pages/Admin/AdminDashboard';
import AdminUsers from './pages/Admin/AdminUsers';
import AdminVideos from './pages/Admin/AdminVideos';
import AdminWithdrawals from './pages/Admin/AdminWithdrawals';

import './App.css';
import { BottomNav } from './components/Layout/Navbar';
import { Register } from './pages/Auth/Login';
import { Notifications } from './pages/Profile/Profile';
import { AdminSettings } from './pages/Admin/AdminWithdrawals';
import PrivacyPolicy from './pages/PrivacyPolicy/PrivacyPolicy';

// Layout wrapper for authenticated users
const AuthenticatedLayout = ({ children }) => {
  const { user } = useAuth();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (user?.userType === 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navbar />
        <main className="pt-16">
          {children}
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {!isMobile && <Navbar />}
      <main className={`${!isMobile ? 'pt-16' : ''} ${isMobile ? 'pb-20' : ''}`}>
        {children}
      </main>
      {isMobile && <BottomNav />}
    </div>
  );
};

// Protected route component
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.userType !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return <AuthenticatedLayout>{children}</AuthenticatedLayout>;
};

// Public route component (redirects if already authenticated)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (user) {
    if (user.userType === 'admin') {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {children}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Public Routes */}
              <Route
                path="/login"
                element={
                  <PublicRoute>
                    <Login />
                  </PublicRoute>
                }
              />
              <Route
                path="/register"
                element={
                  <PublicRoute>
                    <Register />
                  </PublicRoute>
                }
              />

              <Route
                path="/privacy-policy"
                element={
                  <PublicRoute>
                    <PrivacyPolicy />
                  </PublicRoute>
                }
              />

              {/* Protected User Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tasks"
                element={
                  <ProtectedRoute>
                    <Tasks />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/tasks/:taskNumber"
                element={
                  <ProtectedRoute>
                    <TaskDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/withdrawal"
                element={
                  <ProtectedRoute>
                    <Withdrawal />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/withdrawal-history"
                element={
                  <ProtectedRoute>
                    <WithdrawalHistory />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/notifications"
                element={
                  <ProtectedRoute>
                    <Notifications />
                  </ProtectedRoute>
                }
              />

              {/* Protected Admin Routes */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute adminOnly>
                    <AdminDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute adminOnly>
                    <AdminUsers />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/videos"
                element={
                  <ProtectedRoute adminOnly>
                    <AdminVideos />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/withdrawals"
                element={
                  <ProtectedRoute adminOnly>
                    <AdminWithdrawals />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/settings"
                element={
                  <ProtectedRoute adminOnly>
                    <AdminSettings />
                  </ProtectedRoute>
                }
              />

              {/* Default redirect */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>

            <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  duration: 3000,
                  iconTheme: {
                    primary: '#4ade80',
                    secondary: '#fff',
                  },
                },
                error: {
                  duration: 4000,
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#fff',
                  },
                },
              }}
            />
          </div>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;