import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { Flame, Trophy } from 'lucide-react';
import type { Streak } from '../../types';

interface StreakDisplayProps {
  streak: Streak | null;
  userName?: string;
}

export const StreakDisplay: React.FC<StreakDisplayProps> = ({
  streak,
  userName = 'sparshika',
}) => {
  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="space-y-6"
    >
      {/* Greeting */}
      <div className="card-base p-6 space-y-2">
        <h2 className="text-2xl font-poppins font-bold text-gray-900">
          {greeting}, {userName}
        </h2>
        <p className="text-gray-600/80 text-lg">
          c'mon {userName}, you got this 🌸
        </p>
      </div>

      {/* Streaks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Current Streak */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="card-base p-6 space-y-3"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-poppins font-semibold text-gray-800">
              Current Streak
            </h3>
            <Flame className="w-5 h-5 text-orange-400" />
          </div>

          <div className="flex items-baseline gap-2">
            <motion.span
              key={streak?.current_streak}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-5xl font-poppins font-bold premium-text"
            >
              {streak?.current_streak || 0}
            </motion.span>
            <span className="text-2xl text-orange-400">🔥</span>
          </div>

          <p className="text-sm text-soft-gray/60">
            Keep it going! Complete all tasks today.
          </p>
        </motion.div>

        {/* Longest Streak */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="card-base p-6 space-y-3"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-poppins font-semibold text-gray-800">
              Longest Streak
            </h3>
            <Trophy className="w-5 h-5 text-yellow-500" />
          </div>

          <div className="flex items-baseline gap-2">
            <motion.span
              key={streak?.longest_streak}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="text-5xl font-poppins font-bold premium-text"
            >
              {streak?.longest_streak || 0}
            </motion.span>
            <span className="text-2xl text-yellow-400">🏆</span>
          </div>

          <p className="text-sm text-soft-gray/60">
            Your personal best record.
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
};

interface QuickStatsProps {
  totalTasks: number;
  completedTasks: number;
}

export const QuickStats: React.FC<QuickStatsProps> = ({ totalTasks, completedTasks }) => {
  const percentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="card-base p-6 space-y-4"
    >
      <h3 className="font-poppins font-semibold text-soft-gray">Today's Progress</h3>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-soft-gray/60">
            {completedTasks} of {totalTasks} tasks completed
          </span>
          <span className="font-semibold text-soft-pink">{Math.round(percentage)}%</span>
        </div>

        <div className="h-2 bg-white/30 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="h-full bg-gradient-to-r from-soft-pink to-rose rounded-full"
          />
        </div>
      </div>

      {percentage === 100 && totalTasks > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-2 bg-green-100/50 rounded-lg text-green-700 text-sm font-medium"
        >
          🎉 All tasks completed today!
        </motion.div>
      )}
    </motion.div>
  );
};
