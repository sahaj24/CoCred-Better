# Quick Setup Checklist for Co-Cred-Better

## ✅ Localhost + Vercel Deployment Setup

### 1. Supabase Configuration (REQUIRED)

Go to [Supabase Dashboard](https://supabase.com/dashboard) → Project `sewsbkwlkdegjuaiccth` → Authentication → URL Configuration

**Site URL:**
```
https://co-cred-better.vercel.app
```

**Redirect URLs (add ALL of these):**
```
http://localhost:3000/auth/callback
http://localhost:3001/auth/callback
http://localhost:3002/auth/callback
https://co-cred-better.vercel.app/auth/callback
```

**Note:** The app now uses a single auth callback endpoint that handles all user types. Multiple localhost ports are included in case the default port 3000 is busy.

### 2. Vercel Environment Variables

In your Vercel project dashboard → Settings → Environment Variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://sewsbkwlkdegjuaiccth.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNld3Nia3dsa2RlZ2p1YWljY3RoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5Mjc1NDAsImV4cCI6MjA3MzUwMzU0MH0.YDx-6qbta6ejDbpct6UgbG7P5jIEvxgxeXvL66dgehc
NEXT_PUBLIC_SITE_URL=https://co-cred-better.vercel.app
```

### 3. Local Development (Already Set Up)

Your `.env.local` is already configured for both environments.

### 4. How It Works

**Development (localhost):**
- Uses `http://localhost:3000` or `http://localhost:3001`
- Redirects to `http://localhost:3000/dashboard/[usertype]`

**Production (Vercel):**
- Uses `https://co-cred-better.vercel.app`
- Redirects to `https://co-cred-better.vercel.app/dashboard/[usertype]`

### 5. Test Both Environments

**Local Test:**
1. Run `npm run dev`
2. Go to `http://localhost:3000/login/student`
3. Try Google OAuth - should redirect to localhost dashboard

**Production Test:**
1. Go to `https://co-cred-better.vercel.app/login/student`
2. Try Google OAuth - should redirect to Vercel dashboard

## 🚨 Important Notes

- **Supabase redirect URLs are the most critical step** - without these, OAuth will fail
- Both localhost ports (3000 and 3001) are included in case port 3000 is busy
- The app automatically detects which environment it's running in
- No code changes needed - just configuration!