# Quick Start Guide - Progress Tracker

## 5-Minute Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Create Supabase Project
- Go to https://supabase.com and sign up
- Create a new project
- Copy your **Project URL** and **Anon Public Key**

### 3. Configure Environment Variables
Edit `.env.local`:
```
VITE_SUPABASE_URL=your-project-url
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### 4. Set Up Database
Open Supabase SQL Editor and run ALL the SQL commands from `SETUP_DATABASE.md`

**Must create:**
- `tasks` table
- `daily_logs` table
- `task_status` table  
- `streaks` table
- Row Level Security policies

### 5. Start the App
```bash
npm run dev
```

Visit `http://localhost:5173`

## Initial Test

1. **Sign Up**: Create a test account
2. **Add a Task**: Click "Add New Task" and create one
3. **Mark Complete**: Click the checkbox
4. **Watch Progress**: View the progress percentage update

## Common Issues

### "Cannot connect to database"
- ✅ Check `.env.local` has correct credentials
- ✅ Restart dev server after changing `.env.local` 
- ✅ Verify Supabase project is active

### "Permission denied" errors
- ✅ Make sure ALL RLS policies from `SETUP_DATABASE.md` are created
- ✅ Check that you're using the ANON key, not the SERVICE role key

### Empty charts
- ✅ Create a task first
- ✅ Mark it complete
- ✅ Charts populate after you complete tasks

## Next Steps

- Review `README.md` for full features
- Check `SETUP_DATABASE.md` for detailed database instructions
- Customize colors in components using HEX values
- Deploy to Vercel or Netlify

## Support

- Supabase Docs: https://supabase.com/docs
- Discord: https://discord.supabase.com
- GitHub Issues: Report bugs and request features

---

**Pro Tip**: Start with just 2-3 tasks to build the habit! 🌸
