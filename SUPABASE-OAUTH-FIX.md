# Supabase OAuth Configuration Fix

## Problem
OAuth login redirects to localhost:3000 even when using the deployed Vercel app.

## Root Cause
Supabase dashboard is not configured with the correct redirect URLs for your Vercel deployment.

## Solution Steps

### 1. Access Supabase Dashboard
- Go to: https://supabase.com/dashboard/project/sewsbkwlkdegjuaiccth
- Navigate to: **Authentication** → **Settings** → **URL Configuration**

### 2. Update Redirect URLs
Add these URLs to the "Redirect URLs" section:

**Development URLs:**
- `http://localhost:3000/dashboard/student`
- `http://localhost:3000/dashboard/teacher`
- `http://localhost:3000/dashboard/authority`

**Production URLs:**
- `https://co-cred-better.vercel.app/dashboard/student`
- `https://co-cred-better.vercel.app/dashboard/teacher`
- `https://co-cred-better.vercel.app/dashboard/authority`

### 3. Update Site URL (if needed)
In the same section, make sure the "Site URL" is set to:
- For development: `http://localhost:3000`
- For production: `https://co-cred-better.vercel.app`

### 4. Test the Fix
1. Deploy your changes to Vercel
2. Try logging in from the deployed app
3. Check browser console for debug logs
4. Visit `/test-env` to verify environment detection

## Important Notes
- Changes in Supabase dashboard take effect immediately
- Make sure to save the configuration in Supabase
- The redirect URLs must match exactly (including the dashboard path)
- You can test environment detection at: `https://your-app.vercel.app/test-env`

## Verification
After making these changes, OAuth should redirect to:
- `http://localhost:3000/dashboard/student` (when testing locally)
- `https://co-cred-better.vercel.app/dashboard/student` (when using deployed app)