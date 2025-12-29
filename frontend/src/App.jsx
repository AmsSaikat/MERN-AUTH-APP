import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import FloatingShape from './components/FloatingShape';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import EmailVerificationPage from './pages/EmailVerificationPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import HomePage from './pages/HomePage';
import ForgetPasswordPage from './pages/ForgetPasswordPage';
import { useAuthStore } from './store/authStore.js'

// Protect routes that require authentication (verified users only)
const ProtectRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuthStore();

  if (loading) return <div className="text-white text-xl">Checking authentication...</div>;

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (!user?.isVerified) return <Navigate to="/verify-email" replace />;

  return children;
};

// Protect routes that require authentication (even if unverified)
const AuthRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuthStore();

  if (loading) return <div className="text-white text-xl">Checking authentication...</div>;

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return children; // authenticated, may or may not be verified
};

// Redirect authenticated users away from login/signup
const RedirectAuthenticatedUser = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuthStore();

  if (loading) return <div className="text-white text-xl">Checking authentication...</div>;

  if (isAuthenticated && user?.isVerified) return <Navigate to="/" replace />;

  return children;
};

function App() {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  // Run auth check once on app load
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-900 via-green-900 to-emerald-900
      flex items-center justify-center relative overflow-hidden">

      {/* Floating shapes */}
      <FloatingShape color="bg-green-500" size="w-64 h-64" top="-5%" left="10%" delay={0} />
      <FloatingShape color="bg-green-500" size="w-48 h-48" top="70%" left="80%" delay={5} />
      <FloatingShape color="bg-green-500" size="w-32 h-32" top="40%" left="10%" delay={2} />

      <Routes>
        <Route path="/" element={<ProtectRoute><HomePage /></ProtectRoute>} />
        <Route path="/signup" element={<RedirectAuthenticatedUser><SignUpPage /></RedirectAuthenticatedUser>} />
        <Route path="/login" element={<RedirectAuthenticatedUser><LoginPage /></RedirectAuthenticatedUser>} />
        <Route path="/verify-email" element={<AuthRoute><EmailVerificationPage /></AuthRoute>} />
        <Route path="/forgot-password" element={<RedirectAuthenticatedUser><ForgetPasswordPage /></RedirectAuthenticatedUser>} />
        <Route path="/reset-password/:token" element={<RedirectAuthenticatedUser><ResetPasswordPage /></RedirectAuthenticatedUser>} />
      </Routes>
    </div>
  );
}

export default App;
