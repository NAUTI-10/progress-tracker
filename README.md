# Progress Tracker 🌸

A beautiful, full-stack progress tracking web application built with modern technologies. Track your daily tasks, maintain streaks, and visualize your progress with aesthetic, calming design inspired by Japanese minimalism.

## 🎨 Features

### Core Functionality
- **Daily Task Management**: Create, edit, and delete custom daily tasks
- **Daily Tracking**: Mark tasks as completed or incomplete with smooth animations
- **Streak System**: Automatic streak tracking with current and longest streak display
- **Progress Charts**: Visualize your progress with line and bar charts
- **History Tracking**: View your past days and completion history
- **User Authentication**: Secure email-based authentication with Supabase

### Design Highlights
- Aesthetic, soft, romantic UI inspired by Japanese minimal aesthetics
- Glassmorphism cards with smooth blur effects
- Animated cherry blossom background
- Smooth transitions and micro-interactions
- Responsive mobile-first design
- Soft color palette (baby pink, lavender, soft grays)

## 🛠️ Tech Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Backend/Database**: Supabase (PostgreSQL + Auth)
- **Utilities**: date-fns, Lucide Icons

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Supabase account (free tier available at https://supabase.com)

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up Supabase**
   - Create a new project on [Supabase](https://supabase.com)
   - Copy your project URL and anonymous key
   - Create a file named `.env.local` and add:
   ```
   VITE_SUPABASE_URL=your_project_url
   VITE_SUPABASE_ANON_KEY=your_anonymous_key
   ```

3. **Set up the database schema** (see [Database Setup](#database-setup) below)

4. **Start the development server**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`

## 📊 Database Setup

### Tables to Create in Supabase

#### 1. `tasks` Table
```sql
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title VARCHAR(200) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, title)
);
```

#### 2. `daily_logs` Table
```sql
CREATE TABLE daily_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, date)
);
```

#### 3. `task_status` Table
```sql
CREATE TABLE task_status (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  daily_log_id UUID NOT NULL REFERENCES daily_logs(id) ON DELETE CASCADE,
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(daily_log_id, task_id)
);
```

#### 4. `streaks` Table
```sql
CREATE TABLE streaks (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_completed_date DATE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Row Level Security (RLS) Policies

Enable RLS on all tables and add these policies:

**For `tasks` table:**
```sql
CREATE POLICY "Users can view their own tasks"
  ON tasks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create tasks"
  ON tasks FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tasks"
  ON tasks FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tasks"
  ON tasks FOR DELETE
  USING (auth.uid() = user_id);
```

**For `daily_logs` table:**
```sql
CREATE POLICY "Users can view their own daily logs"
  ON daily_logs FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create daily logs"
  ON daily_logs FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

**For `task_status` table:**
```sql
CREATE POLICY "Users can view their own task statuses"
  ON task_status FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM daily_logs
      WHERE daily_logs.id = task_status.daily_log_id
      AND daily_logs.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their own task statuses"
  ON task_status FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM daily_logs
      WHERE daily_logs.id = task_status.daily_log_id
      AND daily_logs.user_id = auth.uid()
    )
  );
```

**For `streaks` table:**
```sql
CREATE POLICY "Users can view their own streaks"
  ON streaks FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own streaks"
  ON streaks FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own streaks"
  ON streaks FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

## 📁 Project Structure

```
Progress-Tracker/
├── src/
│   ├── components/
│   │   ├── Auth/
│   │   │   └── AuthForm.tsx
│   │   ├── Dashboard/
│   │   │   └── StreakDisplay.tsx
│   │   ├── Layout/
│   │   │   ├── Header.tsx
│   │   │   └── BackgroundAnimation.tsx
│   │   ├── Tasks/
│   │   │   └── TaskList.tsx
│   │   ├── Chart/
│   │   │   └── ProgressChart.tsx
│   │   └── History/
│   │       └── History.tsx
│   ├── pages/
│   │   ├── AuthPage.tsx
│   │   └── DashboardPage.tsx
│   ├── services/
│   │   ├── supabase.ts
│   │   └── api.ts
│   ├── hooks/
│   │   └── useAuth.ts
│   ├── types/
│   │   └── index.ts
│   ├── styles/
│   │   └── global.css
│   ├── App.tsx
│   └── main.tsx
├── public/
├── .env.example
├── .env.local
├── tailwind.config.js
├── vite.config.ts
└── package.json
```

## 🎯 How to Use

### Creating Tasks
1. Navigate to the Dashboard
2. Click "Add New Task"
3. Enter task title and optional description
4. Click "Add Task"

### Tracking Daily Progress
1. Mark tasks as completed by clicking the checkbox next to each task
2. Watch your progress percentage update in real-time
3. All tasks completed = streak +1 🔥

### Viewing Progress
1. Check the "Weekly Progress" chart for completion trends
2. View "Tasks Completed" bar chart for daily statistics
3. Browse "Recent Activity" for historical data

## 🌈 Color Palette

- **Soft Pink**: `#f8c8dc`
- **Soft White**: `#fefefe`
- **Soft Gray**: `#4a4a4a`
- **Rose**: `#f8d0dc`
- **Lavender**: `#e8d5f0`

## 🔧 Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```

## 🚀 Deployment

### Deploy to Vercel
1. Push code to GitHub
2. Connect to Vercel at https://vercel.com
3. Add environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`)
4. Deploy!

### Deploy to Netlify
1. Push code to GitHub
2. Connect to Netlify at https://netlify.com
3. Add environment variables
4. Deployment will happen automatically

## 🔐 Security Notes

- Never commit `.env.local` files (already in .gitignore)
- Use environment variables for all sensitive data
- Supabase RLS policies protect data at the database level
- Authentication is managed by Supabase

## 📝 Database Logic

### Streak System
- **All tasks completed in a day**: Streak +1, update longest streak if needed
- **Any task missed**: Streak resets to 0
- **Streak display**: Shows current streak and personal best (longest streak)

### Daily Reset
- New daily log created each day at first app visit
- Previous day's data automatically saved in history
- No manual reset needed

### Progress Calculation
- Completion percentage = (completed tasks / total tasks) × 100
- Stored in daily logs for historical tracking
- Visualized in charts for trend analysis

## 🎨 Customization

### Modify Colors
Edit `tailwind.config.js` to change the color palette:
```javascript
colors: {
  'soft-pink': '#YOUR_COLOR',
  'soft-white': '#YOUR_COLOR',
  // ... etc
}
```

### Modify Animations
Edit `src/styles/global.css` to adjust animation speeds and styles

### Add New Features
- Create new components in `src/components/`
- Add API methods in `src/services/api.ts`
- Create new pages in `src/pages/`

## 💡 Tips for Best Experience

1. **Daily Routine**: Check the app every morning to set your intentions
2. **Realistic Goals**: Start with 2-3 tasks for better streak success
3. **Progress Tracking**: Review your history weekly to see patterns
4. **Celebrate Small Wins**: Every completed day is a victory! 🎉

---

Built with care and emotion 🌸 | Track your progress, one day at a time
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
