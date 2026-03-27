export interface Task {
  id: string;
  user_id: string;
  title: string;
  completed: boolean;
  created_at: string;
}

export interface DailyLog {
  id: string;
  user_id: string;
  date: string;
  created_at: string;
}

export interface Streak {
  user_id: string;
  current_streak: number;
  longest_streak: number;
  last_completed_date: string | null;
}

export interface Profile {
  id: string;
  name: string | null;
  streak: number;
  last_streak_date: string | null;
}

export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface DailyProgress {
  date: string;
  completionPercentage: number;
  completedTasks: number;
  totalTasks: number;
}
