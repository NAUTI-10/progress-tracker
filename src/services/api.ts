import { format, subDays } from 'date-fns';
import { supabase } from './supabase';
import type { DailyProgress, Profile, Streak, Task } from '../types';

const DEFAULT_TASK_TITLES = [
  'Drink 3-4L water 💧',
  'Consume 1500-2000 calories 🍽️',
  'Walk 8,000-10,000 steps 🚶',
  'Study for 2-4 hours 📚',
  'Sleep 7-8 hours 😴',
] as const;

const logSupabaseError = (context: string, error: unknown) => {
  console.log(`Supabase ${context} failed:`, error);
  console.error(`Supabase ${context} failed:`, error);
};

const getAuthenticatedUserId = async (): Promise<string> => {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    logSupabaseError('auth user lookup', error);
    throw new Error('Unable to verify the logged-in user.');
  }

  if (!user) {
    throw new Error('You must be logged in to create tasks.');
  }

  return user.id;
};

const mapTasksToProgress = (tasks: Task[]): DailyProgress[] => {
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
      date: format(new Date(), 'yyyy-MM-dd'),
      completionPercentage,
      completedTasks,
      totalTasks,
    },
  ];
};

// Tasks API
export const tasksAPI = {
  create: async (_userId: string, title: string): Promise<Task> => {
    const normalizedTitle = title.trim();
    const userId = await getAuthenticatedUserId();

    const { data, error } = await supabase
      .from('tasks')
      .insert([
        {
          user_id: userId,
          title: normalizedTitle,
          completed: false,
          created_at: new Date().toISOString(),
        },
      ])
      .select('*')
      .single();

    if (error) {
      console.log('Insert error:', error);
      logSupabaseError('task creation', error);
      if ('code' in error && error.code === '23505') {
        throw new Error('You already have a task with this title.');
      }
      throw new Error('Failed to save task to Supabase.');
    }

    return data;
  },

  getAll: async (userId: string): Promise<Task[]> => {
    const { data, error } = await supabase
      .from('tasks')
      .select('id, user_id, title, completed, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (error) {
      logSupabaseError('task fetch', error);
      throw new Error('Failed to load tasks from Supabase.');
    }

    return data ?? [];
  },

  ensureDefaults: async (userId: string): Promise<Task[]> => {
    const existingTasks = await tasksAPI.getAll(userId);
    if (existingTasks.length > 0) {
      return existingTasks;
    }

    const { data, error } = await supabase
      .from('tasks')
      .insert(
        DEFAULT_TASK_TITLES.map((title) => ({
          user_id: userId,
          title,
          completed: false,
          created_at: new Date().toISOString(),
        }))
      )
      .select('id, user_id, title, completed, created_at');

    if (error) {
      logSupabaseError('default task creation', error);
      throw new Error('Failed to create default tasks.');
    }

    return data ?? [];
  },

  updateCompletion: async (taskId: string, completed: boolean): Promise<Task> => {
    const { data, error } = await supabase
      .from('tasks')
      .update({ completed })
      .eq('id', taskId)
      .select('id, user_id, title, completed, created_at')
      .single();

    if (error) {
      logSupabaseError('task completion update', error);
      throw new Error('Failed to update task status.');
    }

    return data;
  },

  delete: async (taskId: string): Promise<void> => {
    const { error } = await supabase.from('tasks').delete().eq('id', taskId);

    if (error) {
      logSupabaseError('task delete', error);
      throw new Error('Failed to delete task.');
    }
  },
};

export const profilesAPI = {
  getOrCreate: async (userId: string, fallbackName: string): Promise<Profile> => {
    const { data, error } = await supabase
      .from('profiles')
      .select('id, name, streak, last_streak_date')
      .eq('id', userId)
      .maybeSingle();

    if (error) {
      logSupabaseError('profile fetch', error);
      throw new Error('Failed to load your profile.');
    }

    if (data) {
      return {
        id: data.id,
        name: data.name,
        streak: data.streak ?? 0,
        last_streak_date: data.last_streak_date ?? null,
      };
    }

    const { data: insertedProfile, error: insertError } = await supabase
      .from('profiles')
      .insert([
        {
          id: userId,
          name: fallbackName,
          streak: 0,
          last_streak_date: null,
        },
      ])
      .select('id, name, streak, last_streak_date')
      .single();

    if (insertError) {
      logSupabaseError('profile creation', insertError);
      throw new Error('Failed to create your profile.');
    }

    return {
      id: insertedProfile.id,
      name: insertedProfile.name,
      streak: insertedProfile.streak ?? 0,
      last_streak_date: insertedProfile.last_streak_date ?? null,
    };
  },

  updateStreak: async (userId: string, streak: number, lastStreakDate: string): Promise<Profile> => {
    const { data, error } = await supabase
      .from('profiles')
      .update({
        streak,
        last_streak_date: lastStreakDate,
      })
      .eq('id', userId)
      .select('id, name, streak, last_streak_date')
      .single();

    if (error) {
      logSupabaseError('profile streak update', error);
      throw new Error('Failed to update your streak.');
    }

    return {
      id: data.id,
      name: data.name,
      streak: data.streak ?? 0,
      last_streak_date: data.last_streak_date ?? null,
    };
  },
};

// Streaks API
export const streaksAPI = {
  getOrCreate: async (userId: string): Promise<Streak | null> => {
    const { data: existingStreak, error: fetchError } = await supabase
      .from('streaks')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (!fetchError && existingStreak) {
      return existingStreak;
    }

    const { data: newStreak, error: createError } = await supabase
      .from('streaks')
      .insert([
        {
          user_id: userId,
          current_streak: 0,
          longest_streak: 0,
          last_completed_date: null,
        },
      ])
      .select()
      .single();

    if (createError) {
      logSupabaseError('streak creation', createError);
      return null;
    }

    return newStreak;
  },

  updateStreaks: async (userId: string, allComplete: boolean): Promise<Streak | null> => {
    const streak = await streaksAPI.getOrCreate(userId);
    if (!streak) {
      return null;
    }

    const today = format(new Date(), 'yyyy-MM-dd');
    const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd');

    let newCurrentStreak = streak.current_streak;
    let newLongestStreak = streak.longest_streak;

    if (allComplete) {
      if (streak.last_completed_date === today) {
        newCurrentStreak = streak.current_streak;
      } else if (streak.last_completed_date === yesterday) {
        newCurrentStreak = streak.current_streak + 1;
      } else {
        newCurrentStreak = 1;
      }

      newLongestStreak = Math.max(streak.longest_streak, newCurrentStreak);
    } else if (streak.last_completed_date !== today) {
      newCurrentStreak = 0;
    }

    const { data, error } = await supabase
      .from('streaks')
      .update({
        current_streak: newCurrentStreak,
        longest_streak: newLongestStreak,
        last_completed_date: allComplete ? today : streak.last_completed_date,
      })
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      logSupabaseError('streak update', error);
      return null;
    }

    return data;
  },
};

// Progress Analytics
export const analyticsAPI = {
  getDailyProgress: async (userId: string): Promise<DailyProgress[]> => {
    try {
      const tasks = await tasksAPI.getAll(userId);
      return mapTasksToProgress(tasks);
    } catch (error) {
      logSupabaseError('analytics fetch', error);
      return [];
    }
  },
};
