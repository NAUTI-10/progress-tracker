import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';
import { Loader } from 'lucide-react';

interface AuthFormProps {
  isLogin: boolean;
  onToggle: () => void;
}

export const AuthForm: React.FC<AuthFormProps> = ({ isLogin, onToggle }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const { loading, signUp, signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');

    if (!email || !password) {
      setMessage('Please fill in all fields');
      return;
    }

    if (!isLogin && !name.trim()) {
      setMessage('Please enter your name');
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }

    if (!isLogin && password.length < 6) {
      setMessage('Password must be at least 6 characters');
      return;
    }

    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          setMessage(error);
        } else {
          setMessage('Signed in successfully!');
        }
      } else {
        const { error } = await signUp(email, password, name.trim());
        if (error) {
          setMessage(error);
        } else {
          setMessage('Check your email to confirm your account');
        }
      }
    } catch (error) {
      console.error('Auth form submit error:', error);
      setMessage('An error occurred. Please try again.');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto"
    >
      <div className="card-base p-8 space-y-6">
        <div>
          <h2 className="text-3xl font-poppins font-bold text-gray-900 mb-2">
            {isLogin ? 'Welcome Back' : 'Join Us'}
          </h2>
          <p className="text-gray-600/80">
            {isLogin
              ? 'Continue your journey to success'
              : 'Start tracking your progress today'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full px-4 py-3 rounded-lg bg-white border-1.5 border-pink-200/50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-pink-200/60 focus:border-pink-400 transition-smooth shadow-sm"
                disabled={loading}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-lg bg-white border-1.5 border-pink-200/50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-pink-200/60 focus:border-pink-400 transition-smooth shadow-sm"
              disabled={loading}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-lg bg-white border-1.5 border-pink-200/50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-pink-200/60 focus:border-pink-400 transition-smooth shadow-sm"
              disabled={loading}
            />
          </div>

          {!isLogin && (
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-lg bg-white border-1.5 border-pink-200/50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-pink-200/60 focus:border-pink-400 transition-smooth shadow-sm"
                disabled={loading}
              />
            </div>
          )}

          {message && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className={`p-4 rounded-lg text-sm font-medium ${
                message.includes('error') || message.includes('not')
                  ? 'bg-red-100/60 text-red-700 border border-red-200/50'
                  : 'bg-green-100/60 text-green-700 border border-green-200/50'
              }`}
            >
              {message}
            </motion.div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="button-primary w-full flex items-center justify-center gap-2"
          >
            {loading && <Loader className="w-4 h-4 animate-spin" />}
            {isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <button
          onClick={onToggle}
          className="w-full text-center text-sm font-medium text-gray-600/80 hover:text-pink-600 transition-smooth"
        >
          {isLogin
            ? "Don't have an account? Sign up"
            : 'Already have an account? Sign in'}
        </button>
      </div>
    </motion.div>
  );
};
