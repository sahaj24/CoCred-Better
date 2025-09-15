# Deployment Setup Guide

## 1. Environment Variables Setup

### For Vercel Deployment:
1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add the following variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://sewsbkwlkdegjuaiccth.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNld3Nia3dsa2RlZ2p1YWljY3RoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc5Mjc1NDAsImV4cCI6MjA3MzUwMzU0MH0.YDx-6qbta6ejDbpct6UgbG7P5jIEvxgxeXvL66dgehc
NEXT_PUBLIC_SITE_URL=https://co-cred-better.vercel.app
```

**Note:** Vercel automatically sets `NEXT_PUBLIC_VERCEL_URL=co-cred-better.vercel.app`, but setting `NEXT_PUBLIC_SITE_URL` ensures consistency.

### For Other Platforms:
Set `NEXT_PUBLIC_SITE_URL` to your deployed domain:
```
NEXT_PUBLIC_SITE_URL=https://your-deployed-domain.com
```

## 2. Supabase Configuration

You MUST configure redirect URLs in your Supabase project:

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project: `sewsbkwlkdegjuaiccth`
3. Go to Authentication → URL Configuration
4. Add your deployed domain(s) to **Site URL** and **Redirect URLs**:

### Site URL:
```
https://co-cred-better.vercel.app
```

### Redirect URLs (add all of these):
```
http://localhost:3000/dashboard/student
http://localhost:3000/dashboard/teacher
http://localhost:3000/dashboard/authority
https://co-cred-better.vercel.app/dashboard/student
https://co-cred-better.vercel.app/dashboard/teacher
https://co-cred-better.vercel.app/dashboard/authority
```

**Important:** You need BOTH localhost (for development) AND your Vercel domain (for production) in the redirect URLs list.

## 3. How the Redirect URL Detection Works

The app automatically detects the correct base URL in this order:

1. **Vercel**: Uses `NEXT_PUBLIC_VERCEL_URL` (automatically set by Vercel)
2. **Custom Domain**: Uses `NEXT_PUBLIC_SITE_URL` (if you set it)
3. **Development**: Uses `window.location.origin` 
4. **Fallback**: Uses `localhost:3000`

## 4. Testing

After deployment:

1. Try logging in with Google OAuth
2. Check that you're redirected to your deployed domain, not localhost
3. Verify the correct dashboard loads based on user type (student/teacher/authority)

## 5. Troubleshooting

If you still get redirected to localhost:

1. **Check Supabase URL Configuration**: Make sure your deployed domain is added to Supabase redirect URLs
2. **Check Environment Variables**: Ensure they're properly set in your deployment platform
3. **Clear Browser Cache**: OAuth can cache redirect URLs
4. **Check Console**: Look for any error messages in browser developer tools

## 6. Local Development

For local development, the app will automatically use `localhost:3000` - no additional configuration needed.