# 📋 Installation & First Run Checklist

Complete this checklist to get your Progress Tracker running!

## ✅ Setup Verification

### 1. Project Structure
```
[✓] node_modules/              - Dependencies installed
[✓] src/                       - All source code present
[✓] src/components/            - 6 component folders
[✓] src/pages/                 - 2 pages (Auth + Dashboard)
[✓] src/services/              - API integration
[✓] src/hooks/                 - Custom React hooks
[✓] src/types/                 - TypeScript interfaces  
[✓] src/styles/                - Global CSS + Tailwind
[✓] public/                    - Static assets
[✓] dist/                      - Build output (generated)
```

### 2. Configuration Files
```
[✓] package.json               - Dependencies listed
[✓] vite.config.ts             - Vite configuration
[✓] tsconfig.json              - TypeScript config
[✓] tailwind.config.js         - Tailwind themes
[✓] postcss.config.js          - CSS processing
[✓] .env.example               - Example env template
[✓] .env.local                 - Your local secrets (not committed)
[✓] .gitignore                 - Git ignore rules
```

### 3. Documentation
```
[✓] README.md                  - Full feature guide
[✓] QUICK_START.md             - 5-minute setup
[✓] SETUP_DATABASE.md          - Database instructions
[✓] DEPLOYMENT.md              - Deploy guide
[✓] ARCHITECTURE.md            - Technical details
[✓] PROJECT_SUMMARY.md         - Complete overview
```

### 4. Scripts Available
```
[✓] npm run dev                - Start dev server
[✓] npm run build              - Production build
[✓] npm run preview            - Preview build locally
[✓] npm run lint               - Lint code (ESLint)
```

---

## 🚀 First Run Checklist

### Prerequisites
- [ ] Node.js v18+ installed (`node --version`)
- [ ] npm installed (`npm --version`)  
- [ ] Text editor ready (VS Code recommended)
- [ ] Supabase account created (https://supabase.com)

### Step 1: Verify Installation
```bash
cd c:\NAUTI\Progress-Tracker
npm --version           # Should be 9+
node --version          # Should be 18+
npm list                # View all dependencies
```

### Step 2: Dependencies Installed
✅ Already completed! View installed:
```bash
npm list --depth=0  # Top-level packages
```

**Key packages:**
- react 18.3.1
- vite 8.0.3
- tailwindcss 4.0.0
- framer-motion 11.0.0
- recharts 2.10.0
- @supabase/supabase-js (latest)
- date-fns 3.0.0

### Step 3: Configuration
Create `.env.local`:
```bash
# Copy from .env.example:
VITE_SUPABASE_URL=                    # Get from Supabase
VITE_SUPABASE_ANON_KEY=               # Get from Supabase
```

**To get credentials:**
1. Login to Supabase
2. Select your project
3. Go Settings → API
4. Copy URL and anon/public key

### Step 4: Database Setup
Follow `SETUP_DATABASE.md` exactly:
1. Open Supabase SQL Editor
2. Run 4 CREATE TABLE commands
3. Create all RLS policies
4. Note: Policies are REQUIRED

**Optional Verification:**
```sql
-- In Supabase SQL Editor, run:
SELECT table_name FROM information_schema.tables 
  WHERE table_schema = 'public';
-- Should show: tasks, daily_logs, task_status, streaks
```

### Step 5: Start Development
```bash
npm run dev
# Should see:
# ➜  Local: http://localhost:5173/
```

Visit `http://localhost:5173`

### Step 6: Test Functionality

**Auth Test:**
- [ ] Click "Sign up"
- [ ] Enter email (any valid format)
- [ ] Enter password (6+ characters)
- [ ] Should redirect to email confirmation
- [ ] Check browser console for errors

**After Confirmation:**
- [ ] Login with that email/password
- [ ] Should redirect to Dashboard
- [ ] See "Welcome" greeting

**Task Test:**
- [ ] Click "Add New Task"
- [ ] Enter task title (e.g., "Drink water")
- [ ] Click "Add Task"
- [ ] Task appears in list

**Completion Test:**
- [ ] Click checkbox next to task
- [ ] Progress % should update
- [ ] If all tasks complete, streak should appear

**Chart Test:**
- [ ] Complete some tasks
- [ ] Scroll down to see charts
- [ ] Charts should display (may need refresh)

---

## ⚠️ Common Issues & Fixes

### Issue: "Cannot find module 'react'"
**Solution:** Run `npm install`

### Issue: "VITE_SUPABASE_URL is undefined"
**Solution:** 
1. Check `.env.local` exists
2. Verify correct spelling (no typos)
3. No spaces around `=`
4. Restart dev server

### Issue: "Permission denied" in console
**Solution:**
1. All RLS policies created?
2. Using ANON key (not SERVICE key)?
3. Policies have correct conditions?
4. See SETUP_DATABASE.md

### Issue: Blank white screen
**Solution:**
1. Check browser console (F12)
2. Look for red errors
3. Common: Missing environment variables
4. Check Network tab for 401/403 errors

### Issue: "Port 5173 in use"
**Solution:** 
- Vite tries 5174, 5175, etc. automatically
- Or kill process: `lsof -i :5173`

### Issue: Slow build
**Solution:**
- First build always slower (dependency optimization)
- Subsequent builds are faster
- Once optimized, takes ~1 second

---

## 🧪 Testing Checklist

### Authentication
- [ ] Signup works
- [ ] Email confirmation flow
- [ ] Login with correct credentials
- [ ] Login fails with wrong password
- [ ] Logout works
- [ ] Page doesn't reload on logout

### Tasks
- [ ] Create new task
- [ ] Task appears immediately
- [ ] Delete task works
- [ ] Cannot create empty task
- [ ] Task title shows correctly

### Progress Tracking
- [ ] Toggle task complete
- [ ] Progress % updates
- [ ] Can toggle back incomplete
- [ ] Multiple tasks tracked
- [ ] Visual feedback smooth

### Streaks  
- [ ] Current streak displays
- [ ] Longest streak displays
- [ ] Streak increments when all complete
- [ ] Streak resets when any incomplete
- [ ] Values persist on refresh

### Charts
- [ ] Progress line chart displays
- [ ] Tasks bar chart displays
- [ ] Charts have data points
- [ ] Tooltip shows on hover
- [ ] Charts are responsive

### History
- [ ] Past days show
- [ ] Completion % accurate
- [ ] Perfect days marked green (if applicable)
- [ ] List is newest first

### Responsive
- [ ] Mobile (320px) - single column
- [ ] Tablet (768px) - two columns
- [ ] Desktop (1200px) - full layout
- [ ] Buttons touch-friendly
- [ ] Text readable at all sizes

---

## 🔧 Development Commands Reference

```bash
# Start development server
npm run dev

# Create production build
npm run build

# Test production build locally
npm run preview

# Lint code with ESLint
npm run lint

# Clean build
rm -rf dist
npm run build

# View dependencies tree
npm list --all

# Update dependencies
npm update

# Install specific version
npm install package-name@1.2.3
```

---

## 📱 Browser DevTools Tips

### React DevTools
1. Install React DevTools extension
2. Inspect components
3. Check state and props
4. Trace renders

### Redux/State DevTools
1. Check Network tab for API calls
2. Look at request/response
3. Verify header have auth token

### Console Debugging
```javascript
// Try in console while viewing app
localStorage.getItem('sb-auth')  // Check session
window.location              // Current URL
performance.now()            // Timing
```

---

## ✨ Next Steps After Verification

1. **Customize Colors:**
   - Edit component files (hex codes)
   - Test with your preferred palette
   - Keep soft tones

2. **Personalize Greeting:**
   - Find: `cmon sparshika`
   - In: `StreakDisplay.tsx`
   - Change to your name

3. **Add More Tasks:**
   - Create 5-10 sample tasks
   - Mark some complete
   - Watch streaks grow

4. **Deploy:**
   - Follow DEPLOYMENT.md
   - Push to GitHub
   - Connect to Vercel/Netlify
   - Get live URL

---

## 📞 Need Help?

- **Build Issues?** → Check `npm run build` output
- **Runtime Errors?** → Check F12 console
- **Database Issues?** → Check SETUP_DATABASE.md
- **Deployment Issues?** → Check DEPLOYMENT.md
- **Architecture Questions?** → Check ARCHITECTURE.md

---

## ✅ Completion Checklist

When everything is working:

- [ ] Dev server starts without errors
- [ ] Can signup and login
- [ ] Can create and complete tasks
- [ ] Streaks increment correctly
- [ ] Charts display data
- [ ] App works on mobile
- [ ] Build completes successfully
- [ ] All docs read or skimmed
- [ ] Deployed or ready to deploy

---

**You're all set! Time to start tracking progress 🌸**

*Consider this your progress tracker companion guide.*
