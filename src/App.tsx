import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { FeedbackProvider } from './context/FeedbackContext';
import { LoginForm } from './components/Auth/LoginForm';
import { Header } from './components/Layout/Header';
import { Navigation } from './components/Layout/Navigation';
import { ManagerDashboard } from './components/Dashboard/ManagerDashboard';
import { EmployeeDashboard } from './components/Dashboard/EmployeeDashboard';
import { FeedbackForm } from './components/Feedback/FeedbackForm';
import { FeedbackHistory } from './components/Feedback/FeedbackHistory';
import { MyFeedback } from './components/Feedback/MyFeedback';
import { TeamView } from './components/Team/TeamView';
import { LoadingSpinner } from './components/UI/LoadingSpinner';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return <LoginForm />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        <Navigation />
        <main className="flex-1 overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
};

const DashboardRoute: React.FC = () => {
  const { user } = useAuth();
  return user?.role === 'manager' ? <ManagerDashboard /> : <EmployeeDashboard />;
};

function App() {
  return (
    <AuthProvider>
      <FeedbackProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginForm />} />
            <Route path="/" element={
              <ProtectedRoute>
                <Navigate to="/dashboard" replace />
              </ProtectedRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardRoute />
              </ProtectedRoute>
            } />
            <Route path="/team" element={
              <ProtectedRoute>
                <TeamView />
              </ProtectedRoute>
            } />
            <Route path="/feedback/new" element={
              <ProtectedRoute>
                <FeedbackForm />
              </ProtectedRoute>
            } />
            <Route path="/feedback/history" element={
              <ProtectedRoute>
                <FeedbackHistory />
              </ProtectedRoute>
            } />
            <Route path="/feedback/received" element={
              <ProtectedRoute>
                <MyFeedback />
              </ProtectedRoute>
            } />
          </Routes>
        </Router>
      </FeedbackProvider>
    </AuthProvider>
  );
}

export default App;