import React from 'react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import type { DailyProgress } from '../../types';
import { format, parseISO } from 'date-fns';

interface ProgressChartProps {
  data: DailyProgress[];
  isLoading?: boolean;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ payload?: { date: string; completedTasks: number; totalTasks: number; completionPercentage: number } }>;
}

const CustomTooltip = (props: CustomTooltipProps) => {
  const { active, payload } = props;
  const data = payload?.[0]?.payload;

  if (active && data) {
    return (
      <div className="card-base p-3 text-sm space-y-1">
        <p className="font-medium text-soft-gray">
          {format(parseISO(data.date), 'MMM d, yyyy')}
        </p>
        <p className="text-soft-pink">
          {data.completedTasks}/{data.totalTasks} tasks
        </p>
        <p className="text-lavender font-semibold">{data.completionPercentage}%</p>
      </div>
    );
  }
  return null;
};

export const ProgressChart: React.FC<ProgressChartProps> = ({ data, isLoading = false }) => {
  const chartData = data.map((item) => ({
    ...item,
    date: format(parseISO(item.date), 'MMM d'),
  }));

  if (data.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-base p-8 text-center text-soft-gray/40"
      >
        <p>No data yet. Start tracking to see your progress chart! 📊</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="card-base p-6 space-y-4"
    >
      <h3 className="font-poppins font-semibold text-soft-gray">Weekly Progress</h3>

      {isLoading ? (
        <div className="h-96 flex items-center justify-center">
          <div className="animate-pulse-soft text-soft-gray/40">Loading chart...</div>
        </div>
      ) : (
        <div className="h-80 -mx-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
            >
              <defs>
                <linearGradient id="colorCompletion" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f8c8dc" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#f8c8dc" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(200, 200, 200, 0.3)" />
              <XAxis
                dataKey="date"
                stroke="#4a4a4a"
                style={{ fontSize: '12px', opacity: 0.6 }}
              />
              <YAxis stroke="#4a4a4a" style={{ fontSize: '12px', opacity: 0.6 }} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="completionPercentage"
                stroke="#f8c8dc"
                strokeWidth={3}
                dot={{ fill: '#f8c8dc', r: 5 }}
                activeDot={{ r: 7 }}
                isAnimationActive
                animationDuration={800}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </motion.div>
  );
};

interface CompletionBarChartProps {
  data: DailyProgress[];
  isLoading?: boolean;
}

export const CompletionBarChart: React.FC<CompletionBarChartProps> = ({
  data,
  isLoading = false,
}) => {
  const chartData = data.map((item) => ({
    ...item,
    date: format(parseISO(item.date), 'MMM d'),
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="card-base p-6 space-y-4"
    >
      <h3 className="font-poppins font-semibold text-soft-gray">Tasks Completed</h3>

      {isLoading ? (
        <div className="h-60 flex items-center justify-center">
          <div className="animate-pulse-soft text-soft-gray/40">Loading chart...</div>
        </div>
      ) : (
        <div className="h-60 -mx-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(200, 200, 200, 0.3)" />
              <XAxis
                dataKey="date"
                stroke="#4a4a4a"
                style={{ fontSize: '12px', opacity: 0.6 }}
              />
              <YAxis stroke="#4a4a4a" style={{ fontSize: '12px', opacity: 0.6 }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                dataKey="completedTasks"
                fill="#f8d0dc"
                radius={[8, 8, 0, 0]}
                isAnimationActive
                animationDuration={600}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </motion.div>
  );
};
