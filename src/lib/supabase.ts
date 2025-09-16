import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    storage: typeof window !== 'undefined' ? {
      getItem: (key: string) => {
        try {
          return window.localStorage.getItem(key);
        } catch {
          return null;
        }
      },
      setItem: (key: string, value: string) => {
        try {
          window.localStorage.setItem(key, value);
        } catch {
          // Silently fail
        }
      },
      removeItem: (key: string) => {
        try {
          window.localStorage.removeItem(key);
        } catch {
          // Silently fail
        }
      },
    } : undefined,
    storageKey: 'supabase.auth.token',
    debug: process.env.NODE_ENV === 'development'
  }
})

// Get the correct base URL for redirects
const getBaseUrl = () => {
  // In browser environment, use current origin
  if (typeof window !== 'undefined') {
    const origin = window.location.origin;
    console.log('Browser detected, using window.location.origin:', origin);
    return origin;
  }
  
  // Server-side: Check environment variables in order of preference
  
  // 1. Explicit site URL (for production)
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    console.log('Using NEXT_PUBLIC_SITE_URL:', process.env.NEXT_PUBLIC_SITE_URL);
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  
  // 2. Vercel URL (auto-generated)
  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    const url = `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
    console.log('Using NEXT_PUBLIC_VERCEL_URL:', url);
    return url;
  }
  
  // 3. Vercel system environment variable
  if (process.env.VERCEL_URL) {
    const url = `https://${process.env.VERCEL_URL}`;
    console.log('Using VERCEL_URL:', url);
    return url;
  }
  
  // 4. Development fallback
  if (process.env.NODE_ENV === 'development') {
    console.log('Development mode, using localhost');
    return 'http://localhost:3000';
  }
  
  // 5. Production fallback
  const fallback = 'https://co-cred-better.vercel.app';
  console.log('Using production fallback:', fallback);
  return fallback;
}

// Google OAuth configuration with dynamic redirect
export const signInWithGoogle = async (userType: 'student' | 'teacher' | 'authority' = 'student') => {
  const baseUrl = getBaseUrl()
  // Go back to direct dashboard redirect for simplicity
  const redirectUrl = `${baseUrl}/dashboard/${userType}`
  
  // Save user type for later use
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('cocred_pending_user_type', userType);
    } catch (error) {
      console.warn('Could not save pending user type:', error);
    }
  }
  
  // Debug logging
  console.log('=== GOOGLE OAUTH DEBUG ===');
  console.log('User Type:', userType);
  console.log('Base URL:', baseUrl);
  console.log('Redirect URL:', redirectUrl);
  console.log('Current Location:', typeof window !== 'undefined' ? window.location.href : 'server-side');
  console.log('Environment Variables:', {
    NODE_ENV: process.env.NODE_ENV,
    VERCEL_URL: process.env.VERCEL_URL,
    NEXT_PUBLIC_VERCEL_URL: process.env.NEXT_PUBLIC_VERCEL_URL,
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
    windowOrigin: typeof window !== 'undefined' ? window.location.origin : 'not available'
  });
  console.log('========================');
  
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      },
    });
    
    if (error) {
      console.error('OAuth Error:', error);
      throw error;
    }
    
    console.log('OAuth initiated successfully:', data);
    return data;
  } catch (error) {
    console.error('Error signing in with Google:', error);
    throw error;
  }
}

// Sign out function
export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) {
    console.error('Error signing out:', error.message)
    throw error
  }
}