"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { SessionManager } from '@/lib/session-manager';

interface AuthRedirectWrapperProps {
  children: React.ReactNode;
}

export function AuthRedirectWrapper({ children }: AuthRedirectWrapperProps) {
  const { user, session, loading } = useAuth();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    const handleAuthRedirect = async () => {
      // Don't redirect while still loading
      if (loading) {
        return;
      }

      // If user is authenticated, redirect to dashboard
      if (user && session) {
        console.log('User is authenticated, redirecting to dashboard...');
        setIsRedirecting(true);
        
        // Get saved user type or default to student
        const userType = SessionManager.getSavedUserType();
        const dashboardPath = `/dashboard/${userType}`;
        
        console.log(`Redirecting to: ${dashboardPath}`);
        router.push(dashboardPath);
        return;
      }

      // If not authenticated and not loading, show the home page
      if (!loading && !user && !session) {
        setShouldRender(true);
      }
    };

    // Add a small delay to prevent flashing
    const timeoutId = setTimeout(handleAuthRedirect, 100);
    
    return () => clearTimeout(timeoutId);
  }, [user, session, loading, router]);

  // Show loading state while checking auth or redirecting
  if (loading || isRedirecting || !shouldRender) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
          <div className="text-lg text-gray-600">
            {loading ? 'Checking authentication...' : 'Redirecting to dashboard...'}
          </div>
        </div>
      </div>
    );
  }

  // Only render children (home page) if user is not authenticated
  return <>{children}</>;
}