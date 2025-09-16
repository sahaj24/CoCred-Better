"use client";

import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { SupabaseUserProfile, AuthorityPermissions } from '@/lib/types';
import { hasAuthorityAccess, hasPermission } from '@/lib/authority-roles';
import { DEV_MODE, getMockProfile } from '@/lib/dev-config';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredUserType?: 'student' | 'authority';
  requiredAuthorityType?: 'admin' | 'faculty' | 'club_organizer' | 'event_organizer';
  requiredPermission?: keyof AuthorityPermissions;
}

export function ProtectedRoute({ 
  children, 
  requiredUserType,
  requiredAuthorityType,
  requiredPermission
}: ProtectedRouteProps) {
  const { user, loading, session } = useAuth();
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<SupabaseUserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Development mode bypass
  if (DEV_MODE.BYPASS_AUTH) {
    // Return mock profile based on required user type
    const mockProfile = getMockProfile(requiredUserType || 'authority');
    
    // Show dev banner
    return (
      <div>
        {/* Dev Mode Banner */}
        <div className="bg-yellow-100 border-b border-yellow-200 px-4 py-2 text-center">
          <p className="text-yellow-800 text-sm font-medium">
            🚧 DEV MODE: Authentication bypassed - Using mock {requiredUserType || 'authority'} profile
          </p>
        </div>
        {children}
      </div>
    );
  }

  // Fetch user profile to get user_type and authority details
  useEffect(() => {
    async function fetchUserProfile() {
      if (!user?.id) {
        setProfileLoading(false);
        return;
      }

      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error('Error fetching user profile:', error);
        } else {
          setUserProfile(profile);
        }
      } catch (error) {
        console.error('Error in fetchUserProfile:', error);
      } finally {
        setProfileLoading(false);
      }
    }

    if (user) {
      fetchUserProfile();
    } else {
      setProfileLoading(false);
    }
  }, [user]);

  // Enhanced redirect logic
  useEffect(() => {
    if (loading || profileLoading) return;

    const checkAuth = async () => {
      if (!user && !session) {
        console.log('No user/session found, redirecting to login');
        setIsRedirecting(true);
        
        // Redirect to appropriate login page based on required user type
        const loginPath = requiredUserType ? `/login/${requiredUserType}` : '/login/student';
        router.push(loginPath);
        return;
      }

      if (user && session) {
        console.log('User authenticated, checking permissions');
        setIsRedirecting(false);
        
        // If we have a user profile, check permissions
        if (userProfile) {
          // Check user type
          if (requiredUserType && userProfile.user_type !== requiredUserType) {
            console.error(`Access denied: Required ${requiredUserType}, got ${userProfile.user_type}`);
            router.push('/unauthorized');
            return;
          }

          // Check authority type
          if (requiredAuthorityType && userProfile.user_type === 'authority') {
            if (!hasAuthorityAccess(userProfile.user_type, userProfile.authority_type)) {
              console.error(`Access denied: Invalid authority type ${userProfile.authority_type}`);
              router.push('/unauthorized');
              return;
            }

            if (userProfile.authority_type !== requiredAuthorityType) {
              console.error(`Access denied: Required authority type ${requiredAuthorityType}, got ${userProfile.authority_type}`);
              router.push('/unauthorized');
              return;
            }
          }

          // Check specific permission
          if (requiredPermission && userProfile.user_type === 'authority') {
            if (!hasPermission(userProfile.permissions, requiredPermission)) {
              console.error(`Access denied: Missing permission ${requiredPermission}`);
              router.push('/unauthorized');
              return;
            }
          }
        }
      }
    };

    // Add a small delay to prevent premature redirects
    const timeoutId = setTimeout(checkAuth, 100);
    
    return () => clearTimeout(timeoutId);
  }, [user, userProfile, loading, profileLoading, session, router, requiredUserType, requiredAuthorityType, requiredPermission]);

  // Show loading state
  if (loading || profileLoading || isRedirecting) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
          <div className="text-lg text-gray-600">
            {loading || profileLoading ? 'Loading...' : 'Redirecting...'}
          </div>
        </div>
      </div>
    );
  }

  // Only render children if user is authenticated
  if (!user || !session || (!userProfile && !DEV_MODE.BYPASS_AUTH)) {
    return null;
  }

  return <>{children}</>;
}

// Convenience wrapper for authority routes
export function AuthorityRoute({ 
  children, 
  requiredAuthorityType,
  requiredPermission 
}: Omit<ProtectedRouteProps, 'requiredUserType'>) {
  return (
    <ProtectedRoute 
      requiredUserType="authority"
      requiredAuthorityType={requiredAuthorityType}
      requiredPermission={requiredPermission}
    >
      {children}
    </ProtectedRoute>
  );
}