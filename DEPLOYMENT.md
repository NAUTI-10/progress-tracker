# Deployment Guide - Progress Tracker

## Deploy to Vercel (Recommended)

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-username/progress-tracker.git
git push -u origin main
```

### Step 2: Connect to Vercel
1. Go to https://vercel.com
2. Click "New Project"
3. Import your GitHub repository
4. Click "Continue"

### Step 3: Configure Environment Variables
In Vercel project settings → Environment Variables:
```
VITE_SUPABASE_URL = your-supabase-url
VITE_SUPABASE_ANON_KEY = your-anon-key
```

### Step 4: Deploy
Click "Deploy" - your app will be live in seconds!

Your URL will be something like: `progress-tracker.vercel.app`

---

## Deploy to Netlify

### Step 1: Connect GitHub
1. Go to https://netlify.com
2. Click "New site from Git"
3. Select GitHub and authorize
4. Choose your repository

### Step 2: Build Settings
- **Build command**: `npm run build`
- **Publish directory**: `dist`

### Step 3: Environment Variables
In site settings → Build & Deploy → Environment:
```
VITE_SUPABASE_URL = your-supabase-url
VITE_SUPABASE_ANON_KEY = your-anon-key
```

### Step 4: Deploy
Click "Deploy" and wait for build to finish.

---

## Deploy to Your Own Server

### Prerequisites
- Node.js v18+
- npm or yarn

### Steps

1. **Clone repository**
   ```bash
   git clone your-repo-url
   cd Progress-Tracker
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create .env file**
   ```bash
   cp .env.example .env
   # Edit .env with your Supabase credentials
   nano .env
   ```

4. **Build**
   ```bash
   npm run build
   ```

5. **Run with PM2 (for Node.js)**
   ```bash
   npm install -g pm2
   pm2 start "npm run preview" --name "progress-tracker"
   pm2 save
   ```

6. **Setup Nginx Reverse Proxy** (optional)
   ```nginx
   server {
     listen 80;
     server_name your-domain.com;
     
     location / {
       proxy_pass http://localhost:4173;
       proxy_http_version 1.1;
       proxy_set_header Upgrade $http_upgrade;
       proxy_set_header Connection 'upgrade';
       proxy_set_header Host $host;
       proxy_cache_bypass $http_upgrade;
     }
   }
   ```

---

## Post-Deployment Checklist

- [ ] Test all authentication (signup, signin, signout)
- [ ] Create a task and verify it saves
- [ ] Complete a task and check streak updates
- [ ] Verify charts display correctly
- [ ] Test on mobile devices
- [ ] Check browser console for errors
- [ ] Set up a custom domain (optional)

## Performance Tips

- The build creates optimized production files
- CSS and JS are automatically minified
- Consider CDN for static assets
- Monitor Supabase usage on free tier

## SSL/HTTPS

- **Vercel**: Automatic SSL (included)
- **Netlify**: Automatic SSL (included)
- **Custom Server**: Use Let's Encrypt with Certbot

---

## Need Help?

- 🔗 Vercel Docs: https://vercel.com/docs
- 🔗 Netlify Docs: https://docs.netlify.com
- 🔗 Supabase Support: https://discord.supabase.com

---

**Your Progress Tracker is now live! 🚀🌸**
