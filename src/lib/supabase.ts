import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Get the correct base URL for redirects
const getBaseUrl = () => {
  // Always use window.location.origin in the browser for development
  if (typeof window !== 'undefined') {
    console.log('Using window.location.origin:', window.location.origin);
    return window.location.origin;
  }
  
  // Server-side fallback for development
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:3000';
  }
  
  // For Vercel deployments
  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
  }
  
  // For custom domain
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  
  // Production fallback
  return 'https://co-cred-better.vercel.app';
}

// Google OAuth configuration with dynamic redirect
export const signInWithGoogle = async (userType: 'student' | 'teacher' | 'authority' = 'student') => {
  const baseUrl = getBaseUrl()
  // Go back to direct dashboard redirect for simplicity
  const redirectUrl = `${baseUrl}/dashboard/${userType}`
  
  // Debug logging
  console.log('=== GOOGLE OAUTH DEBUG ===');
  console.log('User Type:', userType);
  console.log('Base URL:', baseUrl);
  console.log('Redirect URL:', redirectUrl);
  console.log('Current Location:', typeof window !== 'undefined' ? window.location.href : 'server-side');
  console.log('Environment Variables:', {
    NODE_ENV: process.env.NODE_ENV,
    VERCEL_URL: process.env.NEXT_PUBLIC_VERCEL_URL,
    SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
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