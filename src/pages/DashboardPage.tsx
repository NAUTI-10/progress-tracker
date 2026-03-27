import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Loader } from 'lucide-react';
import { Header } from '../components/Layout/Header';
import { BackgroundAnimation } from '../components/Layout/BackgroundAnimation';
import { StreakDisplay, QuickStats } from '../components/Dashboard/StreakDisplay';
import { AddTaskForm, TaskList } from '../components/Tasks/TaskList';
import { ProgressChart, CompletionBarChart } from '../components/Chart/ProgressChart';
import { History } from '../components/History/History';
import type { DailyProgress, Streak, Task } from '../types';
import { analyticsAPI, profilesAPI, tasksAPI } from '../services/api';
import { useAuth } from '../hooks/useAuth';

const buildProgressSnapshot = (tasks: Task[]): DailyProgress[] => {
  if (tasks.length === 0) {
    return [];
  }

  const completedTasks = tasks.filter((task) => task.completed).length;
  const totalTasks = tasks.length;
  const completionPercentage = totalTasks > 0
    ? Math.round((completedTasks / totalTasks) * 100)
    : 0;

  return [
    {
      date: new Date().toISOString().slice(0, 10),
      completionPercentage,
      completedTasks,
      totalTasks,
    },
  ];
};

export const DashboardPage: React.FC = () => {
  const { user, name } = useAuth();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [streak, setStreak] = useState<Streak | null>(null);
  const [profileName, setProfileName] = useState<string | null>(null);
  const [chartData, setChartData] = useState<DailyProgress[]>([]);
  const [historyData, setHistoryData] = useState<DailyProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [taskError, setTaskError] = useState<string | null>(null);

  const syncDerivedState = (nextTasks: Task[]) => {
    const nextProgress = buildProgressSnapshot(nextTasks);
    setChartData(nextProgress);
    setHistoryData(nextProgress);
    return nextProgress;
  };

  useEffect(() => {
    if (!user?.id) {
      return;
    }

    const initializeData = async () => {
      setIsLoading(true);
      setTaskError(null);

      try {
        const displayName = name || user.email?.split('@')[0] || 'there';
        const profile = await profilesAPI.getOrCreate(user.id, displayName);
        const today = new Date();
        const todayStr = today.toDateString();
        const lastDate = profile.last_streak_date ? new Date(profile.last_streak_date) : null;

        let nextStreak = profile.streak ?? 0;
        let nextLastStreakDate = profile.last_streak_date;

        if (!lastDate || lastDate.toDateString() !== todayStr) {
          if (lastDate) {
            const diffTime = today.getTime() - lastDate.getTime();
            const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
            nextStreak = diffDays === 1 ? (profile.streak ?? 0) + 1 : 1;
          } else {
            nextStreak = 1;
          }

          const updatedProfile = await profilesAPI.updateStreak(user.id, nextStreak, todayStr);
          nextStreak = updatedProfile.streak;
          nextLastStreakDate = updatedProfile.last_streak_date;
          setProfileName(updatedProfile.name || displayName);
        } else {
          setProfileName(profile.name || displayName);
        }

        setStreak({
          user_id: user.id,
          current_streak: nextStreak,
          longest_streak: Math.max(profile.streak ?? 0, nextStreak),
          last_completed_date: nextLastStreakDate,
        });

        const seededTasks = await tasksAPI.ensureDefaults(user.id);
        setTasks(seededTasks);

        const analytics = await analyticsAPI.getDailyProgress(user.id);
        const fallbackAnalytics = analytics.length > 0 ? analytics : buildProgressSnapshot(seededTasks);
        setChartData(fallbackAnalytics);
        setHistoryData(fallbackAnalytics);
      } catch (error) {
        console.log('Dashboard initialization failed:', error);
        console.error('Dashboard initialization failed:', error);
        setTaskError(error instanceof Error ? error.message : 'Unable to load your tasks.');
      } finally {
        setIsLoading(false);
      }
    };

    initializeData();
  }, [name, user?.email, user?.id]);

  const handleAddTask = async (title: string): Promise<boolean> => {
    if (!user?.id) {
      setTaskError('You must be signed in to add tasks.');
      return false;
    }

    setIsSaving(true);
    setTaskError(null);

    try {
      const newTask = await tasksAPI.create(user.id, title);
      setTasks((currentTasks) => {
        const nextTasks = [newTask, ...currentTasks];
        syncDerivedState(nextTasks);
        return nextTasks;
      });
      return true;
    } catch (error) {
      console.log('Task add failed:', error);
      console.error('Task add failed:', error);
      setTaskError(error instanceof Error ? error.message : 'Unable to add task. Please try again.');
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleTask = async (taskId: string) => {
    if (!user?.id) {
      return;
    }

    const previousTasks = tasks;
    const toggledTasks = tasks.map((task) =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );

    setIsSaving(true);
    setTaskError(null);
    setTasks(toggledTasks);
    syncDerivedState(toggledTasks);

    try {
      const toggledTask = toggledTasks.find((task) => task.id === taskId);
      if (!toggledTask) {
        throw new Error('Task not found.');
      }

      const savedTask = await tasksAPI.updateCompletion(taskId, toggledTask.completed);
      const savedTasks = toggledTasks.map((task) => (task.id === taskId ? savedTask : task));
      setTasks(savedTasks);
      syncDerivedState(savedTasks);
    } catch (error) {
      console.log('Task toggle failed:', error);
      console.error('Task toggle failed:', error);
      setTasks(previousTasks);
      syncDerivedState(previousTasks);
      setTaskError(error instanceof Error ? error.message : 'Unable to update task status.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    const previousTasks = tasks;
    const nextTasks = tasks.filter((task) => task.id !== taskId);

    setIsSaving(true);
    setTaskError(null);
    setTasks(nextTasks);
    syncDerivedState(nextTasks);

    try {
      await tasksAPI.delete(taskId);
    } catch (error) {
      console.log('Task delete failed:', error);
      console.error('Task delete failed:', error);
      setTasks(previousTasks);
      syncDerivedState(previousTasks);
      setTaskError(error instanceof Error ? error.message : 'Unable to delete task.');
    } finally {
      setIsSaving(false);
    }
  };

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.completed).length;

  return (
    <div className="min-h-screen relative">
      <BackgroundAnimation />

      <div className="relative z-10">
        <Header />

        {isLoading ? (
          <div className="min-h-screen flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            >
              <Loader className="w-8 h-8 text-soft-pink" />
            </motion.div>
          </div>
        ) : (
          <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
            <StreakDisplay
              streak={streak}
              userName={profileName || name || user?.email?.split('@')[0] || 'there'}
            />

            <QuickStats totalTasks={totalTasks} completedTasks={completedTasks} />

            <motion.section
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="space-y-4"
            >
              <h2 className="text-2xl font-poppins font-bold text-gray-900">Today's Tasks</h2>
              {taskError && (
                <div className="rounded-xl border border-red-200/70 bg-red-50/70 px-4 py-3 text-sm font-medium text-red-700">
                  {taskError}
                </div>
              )}
              <AddTaskForm onAdd={handleAddTask} isLoading={isSaving} />
              <TaskList
                tasks={tasks}
                onToggle={handleToggleTask}
                onDelete={handleDeleteTask}
                isLoading={isSaving}
              />
            </motion.section>

            <motion.section
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="space-y-4"
            >
              <h2 className="text-2xl font-poppins font-bold text-soft-gray">Your Progress</h2>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ProgressChart data={chartData} isLoading={isLoading} />
                <CompletionBarChart data={chartData} isLoading={isLoading} />
              </div>
            </motion.section>

            <motion.section
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="space-y-4"
            >
              <h2 className="text-2xl font-poppins font-bold text-soft-gray">Recent Activity</h2>
              <History data={historyData} isLoading={isLoading} />
            </motion.section>

            <div className="py-8" />
          </main>
        )}
      </div>
    </div>
  );
};
