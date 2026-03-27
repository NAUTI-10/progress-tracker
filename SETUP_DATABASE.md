# Database Setup Guide for Progress Tracker

This guide will help you set up the Supabase database for the Progress Tracker application.

## Prerequisites

1. Supabase account (https://supabase.com)
2. A new Supabase project created

## Step 1: Create Tables

Navigate to the SQL Editor in your Supabase project and run each of these SQL commands:

### Create `tasks` Table

```sql
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, title)
);

-- Create index for faster queries
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
```

### Create `daily_logs` Table

```sql
CREATE TABLE daily_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Create indexes
CREATE INDEX idx_daily_logs_user_id ON daily_logs(user_id);
CREATE INDEX idx_daily_logs_date ON daily_logs(date);
```

### Create `task_status` Table

```sql
CREATE TABLE task_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  daily_log_id UUID NOT NULL REFERENCES daily_logs(id) ON DELETE CASCADE,
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(daily_log_id, task_id)
);

-- Create indexes
CREATE INDEX idx_task_status_daily_log_id ON task_status(daily_log_id);
CREATE INDEX idx_task_status_task_id ON task_status(task_id);
```

### Create `streaks` Table

```sql
CREATE TABLE streaks (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_completed_date DATE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Step 2: Enable Row Level Security (RLS)

For each table, you need to enable RLS and create policies.

### Enable RLS on All Tables

```sql
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_status ENABLE ROW LEVEL SECURITY;
ALTER TABLE streaks ENABLE ROW LEVEL SECURITY;
```

### Create Policies for `tasks` Table

```sql
-- SELECT policy
CREATE POLICY "Users can view their own tasks"
  ON tasks
  FOR SELECT
  USING (auth.uid() = user_id);

-- INSERT policy
CREATE POLICY "Users can create tasks"
  ON tasks
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- UPDATE policy
CREATE POLICY "Users can update their own tasks"
  ON tasks
  FOR UPDATE
  USING (auth.uid() = user_id);

-- DELETE policy
CREATE POLICY "Users can delete their own tasks"
  ON tasks
  FOR DELETE
  USING (auth.uid() = user_id);
```

### Create Policies for `daily_logs` Table

```sql
-- SELECT policy
CREATE POLICY "Users can view their own daily logs"
  ON daily_logs
  FOR SELECT
  USING (auth.uid() = user_id);

-- INSERT policy
CREATE POLICY "Users can create daily logs"
  ON daily_logs
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- UPDATE policy
CREATE POLICY "Users can update their own daily logs"
  ON daily_logs
  FOR UPDATE
  USING (auth.uid() = user_id);
```

### Create Policies for `task_status` Table

```sql
-- SELECT policy
CREATE POLICY "Users can view their own task statuses"
  ON task_status
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM daily_logs
      WHERE daily_logs.id = task_status.daily_log_id
      AND daily_logs.user_id = auth.uid()
    )
  );

-- UPDATE policy
CREATE POLICY "Users can update their own task statuses"
  ON task_status
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM daily_logs
      WHERE daily_logs.id = task_status.daily_log_id
      AND daily_logs.user_id = auth.uid()
    )
  );

-- INSERT policy
CREATE POLICY "Users can insert task statuses for their own logs"
  ON task_status
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM daily_logs
      WHERE daily_logs.id = task_status.daily_log_id
      AND daily_logs.user_id = auth.uid()
    )
  );
```

### Create Policies for `streaks` Table

```sql
-- SELECT policy
CREATE POLICY "Users can view their own streaks"
  ON streaks
  FOR SELECT
  USING (auth.uid() = user_id);

-- UPDATE policy
CREATE POLICY "Users can update their own streaks"
  ON streaks
  FOR UPDATE
  USING (auth.uid() = user_id);

-- INSERT policy
CREATE POLICY "Users can insert their own streaks"
  ON streaks
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

## Step 3: Get Your Credentials

1. Go to **Settings** → **API**
2. Copy your:
   - **Project URL** (VITE_SUPABASE_URL)
   - **anon/public** key (VITE_SUPABASE_ANON_KEY)

## Step 4: Configure Your Application

Create or update `.env.local` in your project root:

```
VITE_SUPABASE_URL=your_project_url_here
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

Replace with your actual credentials from Step 3.

## Verifying Your Setup

### Test Authentication

1. Start your application: `npm run dev`
2. Try signing up with a test email
3. Verify you received the confirmation email

### Test Database Access

Once logged in, try:

1. **Creating a task**: Click "Add New Task" and create one
2. **Marking task complete**: Click the checkbox next to a task
3. **Viewing charts**: Check if the Weekly Progress and Tasks Completed charts display data

### Check Database

In Supabase SQL Editor, verify data was created:

```sql
-- Check users
SELECT id, email FROM auth.users;

-- Check tasks
SELECT * FROM tasks;

-- Check daily logs
SELECT * FROM daily_logs;

-- Check task statuses
SELECT * FROM task_status;

-- Check streaks
SELECT * FROM streaks;
```

## Troubleshooting

### "No rows with this ID exist"
- Make sure you ran all the CREATE TABLE commands
- Verify RLS policies are created correctly
- Check that you're using the correct ANON key, not the SERVICE key

### "User doesn't have permission"
- Verify RLS policies are enabled and created for all tables
- Check that the policy conditions match your auth.uid()

### "Connection refused"
- Verify VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are in `.env.local`
- Ensure you copied the correct values without extra spaces
- Restart your dev server after changing .env.local

### Empty charts
- Create at least one task first
- Check task_status table to ensure completion status is being recorded
- Verify daily_logs table has entries with today's date

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [SQL Editor Guide](https://supabase.com/docs/guides/database/sql-editor)

For more help, visit: https://discord.supabase.com
