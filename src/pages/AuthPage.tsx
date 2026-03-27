import React, { useState } from 'react';
import { AuthForm } from '../components/Auth/AuthForm';
import { BackgroundAnimation } from '../components/Layout/BackgroundAnimation';

export const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <main className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <BackgroundAnimation />
      <div className="relative z-10 w-full max-w-md px-4 py-8 mx-auto">
        <AuthForm isLogin={isLogin} onToggle={() => setIsLogin(!isLogin)} />
      </div>
    </main>
  );
};
