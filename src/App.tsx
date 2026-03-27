import React from 'react';
import { useAuth } from './hooks/useAuth';
import { AuthPage } from './pages/AuthPage';
import { DashboardPage } from './pages/DashboardPage';
import './styles/global.css';

const App: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-white to-pink-50 flex items-center justify-center">
        <div className="text-gray-400 text-lg font-medium animate-pulse-soft">Loading...</div>
      </div>
    );
  }

  return user ? <DashboardPage /> : <AuthPage />;
};

export default App;
