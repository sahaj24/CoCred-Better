"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Auth callback error:', error);
          router.push('/login/student');
          return;
        }

        if (data.session) {
          // Successfully authenticated
          console.log('Auth successful, user:', data.session.user);
          
          // Get user type from localStorage
          const userType = localStorage.getItem('auth_user_type') || 'student';
          
          // Clean up localStorage
          localStorage.removeItem('auth_user_type');
          
          // Redirect to appropriate dashboard
          const dashboardPath = `/dashboard/${userType}`;
          console.log('Redirecting to:', dashboardPath);
          
          router.push(dashboardPath);
        } else {
          // No session, redirect to login
          console.log('No session found, redirecting to login');
          router.push('/login/student');
        }
      } catch (error) {
        console.error('Unexpected error in auth callback:', error);
        router.push('/login/student');
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center p-8 bg-white rounded-lg shadow-md">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Completing Authentication</h2>
        <p className="text-gray-600">Please wait while we sign you in...</p>
      </div>
    </div>
  );
}