import { useEffect } from 'react';
import { useAuth } from './auth-context';
import { SessionManager } from './session-manager';

// Hook to handle session persistence and restoration
export function useSessionPersistence() {
  const { user, session, loading } = useAuth();

  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;

    // Save session state when user/session changes
    if (!loading) {
      if (user && session) {
        console.log('Saving session state - user authenticated');
        SessionManager.saveSessionState(session);
      } else {
        console.log('No user/session - checking if we should clear state');
        // Only clear if we're sure there's no session (not during loading)
        const savedState = SessionManager.loadSessionState();
        if (savedState && !user && !session) {
          console.log('Clearing stale session state');
          SessionManager.clearSessionState();
        }
      }
    }
  }, [user, session, loading]);

  // Periodic session validation (every 5 minutes)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const validateSession = async () => {
      if (!loading && user && session) {
        try {
          const validSession = await SessionManager.ensureValidSession();
          if (!validSession) {
            console.log('Session validation failed, user will be redirected');
            // The auth context will handle the redirect
          }
        } catch (error) {
          console.error('Error validating session:', error);
        }
      }
    };

    // Validate immediately and then every 5 minutes
    validateSession();
    const interval = setInterval(validateSession, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(interval);
  }, [user, session, loading]);

  // Handle page visibility change to check session when user returns
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleVisibilityChange = async () => {
      if (!document.hidden && user && session) {
        console.log('Page became visible, validating session');
        try {
          await SessionManager.ensureValidSession();
        } catch (error) {
          console.error('Error validating session on visibility change:', error);
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, [user, session]);

  return { user, session, loading };
}