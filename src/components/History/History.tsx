import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import type { DailyProgress } from '../../types';
import { Calendar, CheckCircle2, XCircle } from 'lucide-react';

interface HistoryProps {
  data: DailyProgress[];
  isLoading?: boolean;
}

export const History: React.FC<HistoryProps> = ({ data, isLoading = false }) => {
  if (isLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="card-base p-8 text-center text-soft-gray/40"
      >
        Loading history...
      </motion.div>
    );
  }

  if (data.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-base p-8 text-center text-soft-gray/40"
      >
        <p>No history yet. Start completing tasks! 📝</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <h3 className="font-poppins font-semibold text-gray-800 text-lg">History</h3>

      <div className="space-y-3">
        <AnimatePresence>
          {data.map((day, index) => {
            const isAllCompleted = day.completionPercentage === 100;
            const dateObj = parseISO(day.date);

            return (
              <motion.div
                key={day.date}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.05 }}
                className="group"
              >
                <div className="card-base p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-soft-gray/40" />
                      <div>
                        <p className="font-medium text-soft-gray">
                          {format(dateObj, 'EEEE, MMM d')}
                        </p>
                        <p className="text-xs text-soft-gray/50">
                          {format(dateObj, 'yyyy')}
                        </p>
                      </div>
                    </div>

                    {isAllCompleted ? (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="flex items-center gap-2 text-green-600"
                      >
                        <CheckCircle2 className="w-5 h-5" />
                        <span className="text-sm font-medium">Perfect Day!</span>
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="flex items-center gap-2"
                      >
                        <div className="text-right">
                          <p className="text-sm font-semibold text-soft-pink">
                            {day.completionPercentage}%
                          </p>
                          <p className="text-xs text-soft-gray/50">
                            {day.completedTasks}/{day.totalTasks}
                          </p>
                        </div>
                        <XCircle className="w-5 h-5 text-soft-gray/40" />
                      </motion.div>
                    )}
                  </div>

                  {/* Progress bar */}
                  <div className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${day.completionPercentage}%` }}
                      transition={{ duration: 0.5, ease: 'easeOut' }}
                      className={`h-full ${
                        isAllCompleted
                          ? 'bg-gradient-to-r from-green-300 to-green-400'
                          : 'bg-gradient-to-r from-soft-pink to-rose'
                      }`}
                    />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
