import React from 'react';
import { motion } from 'framer-motion';
import { LogOut, Flower2 } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export const Header: React.FC = () => {
  const { user, name, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-40 backdrop-blur-lg bg-gradient-to-b from-white/90 via-white/85 to-white/80 border-b border-pink-200/40 shadow-lg"
    >
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Flower2 className="w-6 h-6 text-soft-pink" />
          <h1 className="text-2xl font-poppins font-bold text-soft-gray">Progress Tracker</h1>
        </div>

        {user && (
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-soft-gray font-medium">{name || user.email?.split('@')[0]}</p>
            </div>
            <button
              onClick={handleSignOut}
              className="p-2 rounded-lg hover:bg-pink-100/50 transition-smooth text-gray-700 hover:text-pink-600"
              title="Sign out"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
    </motion.header>
  );
};
