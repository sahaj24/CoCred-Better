"use client";

import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredUserType?: 'student' | 'teacher' | 'authority';
}

export function ProtectedRoute({ children, requiredUserType }: ProtectedRouteProps) {
  const { user, loading, session } = useAuth();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    // Add a small delay to allow session restoration
    const checkAuth = async () => {
      if (!loading && !user && !session) {
        console.log('No user/session found, redirecting to login');
        setIsRedirecting(true);
        
        // Redirect to appropriate login page based on required user type
        const loginPath = requiredUserType ? `/login/${requiredUserType}` : '/login/student';
        router.push(loginPath);
      } else if (user && session) {
        console.log('User authenticated, allowing access');
        setIsRedirecting(false);
      }
    };

    // Add a small delay to prevent premature redirects
    const timeoutId = setTimeout(checkAuth, 100);
    
    return () => clearTimeout(timeoutId);
  }, [user, loading, session, router, requiredUserType]);

  // Show loading state
  if (loading || isRedirecting) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
          <div className="text-lg text-gray-600">
            {loading ? 'Loading...' : 'Redirecting...'}
          </div>
        </div>
      </div>
    );
  }

  // Only render children if user is authenticated
  if (!user || !session) {
    return null;
  }

  return <>{children}</>;
}