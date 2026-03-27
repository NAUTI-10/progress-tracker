# Architecture & API Documentation

## Project Architecture

```
Progress Tracker - Full Stack Application
│
├── Frontend (React + TypeScript + Vite)
│   ├── Components (Reusable UI components)
│   ├── Pages (Layout and Page containers)
│   ├── Services (API integration)
│   ├── Hooks (Custom React hooks)
│   ├── Types (TypeScript interfaces)
│   └── Styles (Tailwind CSS + global styles)
│
├── Backend (Supabase - Managed PostgreSQL)
│   ├── Authentication (Email/Password)
│   ├── Database (PostgreSQL)
│   ├── Row Level Security (Data isolation)
│   └── Real-time Subscriptions (Optional)
│
└── Infrastructure
    └── Environment Variables (.env.local)
```

## Data Flow

### User Authentication
```
1. User enters email/password on Auth page
2. Supabase authenticates and creates session
3. Session stored in browser
4. App redirects to Dashboard
5. useAuth hook manages auth state
```

### Task Creation
```
1. User fills task form in TaskList component
2. Calls tasksAPI.create()
3. Supabase inserts into tasks table
4. Returns created task to frontend
5. State updates and UI refreshes
```

### Daily Tracking
```
1. Dashboard loads and creates today's DailyLog if needed
2. tasksAPI.getAll() fetches user's tasks
3. taskStatusAPI.createForTasks() creates empty status records
4. User toggles task checkbox
5. taskStatusAPI.updateCompletion() saves status
6. Streak calculation runs (if all complete, increment)
7. Charts and history update
```

### Streak Calculation
```
If user toggles a task:
  - Get all task statuses for today
  - Count completed tasks
  - If (completed === total):
      - current_streak += 1
      - If current_streak > longest_streak:
        - longest_streak = current_streak
  - Else:
      - current_streak = 0
  - Save to streaks table
```

## Database Schema

### Users Table (Managed by Supabase Auth)
```
id: UUID (Primary Key)
email: VARCHAR
created_at: TIMESTAMP
```

### Tasks Table
```
id: UUID
user_id: UUID (Foreign Key → users)
title: VARCHAR(200) ← Unique per user
description: TEXT (optional)
created_at: TIMESTAMP

Indexes:
- user_id (for fast queries by user)
```

### Daily_Logs Table
```
id: UUID
user_id: UUID (Foreign Key → users)
date: DATE ← Unique per user  
created_at: TIMESTAMP

Indexes:
- user_id (fast user lookups)
- date (find specific days)
```

### Task_Status Table
```
id: UUID
daily_log_id: UUID (Foreign Key → daily_logs)
task_id: UUID (Foreign Key → tasks)
completed: BOOLEAN (default: false)
created_at: TIMESTAMP

Unique: (daily_log_id, task_id)

Indexes:
- daily_log_id (fetch all tasks for a day)
- task_id (find task across all logs)
```

### Streaks Table
```
user_id: UUID (Primary Key, Foreign Key → users)
current_streak: INTEGER (default: 0)
longest_streak: INTEGER (default: 0)
last_completed_date: DATE (nullable)
updated_at: TIMESTAMP
```

## API Layer (`src/services/api.ts`)

### Tasks API
```typescript
tasksAPI.create(userId, title, description?)
  → Creates a new task
  → Returns: Task object

tasksAPI.getAll(userId)
  → Fetches all tasks for user
  → Returns: Task[]

tasksAPI.update(taskId, title, description?)
  → Updates task details
  → Returns: Task object

tasksAPI.delete(taskId)
  → Removes task
  → Returns: boolean (success)
```

### Daily Logs API
```typescript
dailyLogsAPI.getOrCreate(userId)
  → Gets today's log or creates it
  → Returns: DailyLog

dailyLogsAPI.getRange(userId, startDate, endDate)
  → Fetches logs for date range
  → Returns: DailyLog[]
```

### Task Status API
```typescript
taskStatusAPI.getForLog(dailyLogId)
  → Gets all task completions for a day
  → Returns: TaskStatus[]

taskStatusAPI.updateCompletion(taskStatusId, completed)
  → Toggles task completion
  → Returns: TaskStatus

taskStatusAPI.createForTasks(dailyLogId, taskIds)
  → Creates empty status records
  → Returns: TaskStatus[]
```

### Streaks API
```typescript
streaksAPI.getOrCreate(userId)
  → Gets or initializes streak record
  → Returns: Streak

streaksAPI.updateStreaks(userId, allComplete)
  → Updates based on daily completion
  → Returns: Streak
```

### Analytics API
```typescript
analyticsAPI.getDailyProgress(userId, days)
  → Gets completion % for past N days
  → Returns: DailyProgress[]
  
DailyProgress {
  date: string
  completionPercentage: number
  completedTasks: number
  totalTasks: number
}
```

## Authentication & Security

### Row Level Security (RLS)
- All tables have RLS enabled
- Users can only see/modify their own data
- Policies match `auth.uid()` to prevent data leakage

### Environment Variables
```
VITE_SUPABASE_URL    → API endpoint
VITE_SUPABASE_ANON_KEY → Public key for client auth
```

⚠️ **Never expose admin API key** - only use ANON key

## State Management

### Component State
```typescript
// Dashboard has:
- tasks: Task[]
- taskStatuses: Map<string, boolean>
- dailyLog: DailyLog | null
- streak: Streak | null
- chartData: DailyProgress[]
- historyData: DailyProgress[]
```

### Global State (via Context/Hooks)
```typescript
// useAuth provides:
- user: User | null
- loading: boolean
- error: string | null
- signUp(), signIn(), signOut()
```

## Error Handling

```typescript
// API calls wrap in try-catch
try {
  const result = await tasksAPI.create(...)
  if (result) { /* success */ }
} catch (error) {
  console.error('Error:', error)
  // User-friendly message shown in UI
}
```

## Performance Considerations

1. **Lazy Loading**: Charts only render when visible
2. **Debouncing**: Task toggles debounced to prevent spam
3. **Memoization**: Components use React.memo to prevent rerenders
4. **Code Splitting**: Framer Motion loaded on demand
5. **CSS**: Tailwind generates only used classes

## Testing Checklist

- [ ] Auth: Signup, signin, signout
- [ ] Tasks: Create, read, update, delete
- [ ] Completion: Toggle task status
- [ ] Streak: Increments on all complete, resets on any incomplete
- [ ] Charts: Display correctly with data
- [ ] History: Shows past days accurately
- [ ] Responsiveness: Mobile, tablet, desktop
- [ ] Persistence: Data survives page reload

## Debugging Tips

1. **Check Network Tab**: Verify Supabase requests
2. **Supabase Dashboard**: View database records directly
3. **React DevTools**: Inspect component state
4. **Console**: Check for JS errors
5. **Tailor logs**: Add `console.log()` after API calls

```typescript
const task = await tasksAPI.create(userId, title)
console.log('Created task:', task) // Debug
```

## Future Enhancements

- [ ] Dark mode toggle
- [ ] Task categories/tags
- [ ] Recurring tasks
- [ ] Notifications/reminders
- [ ] Social sharing
- [ ] Data export (CSV/PDF)
- [ ] Mobile app (React Native)
- [ ] Offline support
- [ ] Real-time multiplayer (for shared goals)
- [ ] Analytics dashboard

---

**Built for scalability and maintainability** 🚀
