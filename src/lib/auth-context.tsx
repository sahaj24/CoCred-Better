"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { SessionManager } from '@/lib/session-manager';
import { broadcastLogout } from '@/lib/use-cross-tab-auth';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    // Enhanced session initialization
    const initializeSession = async () => {
      try {
        console.log('Initializing session...');
        
        // First, try to get the current session
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting current session:', error);
        }

        let validSession = currentSession;

        // If no current session, try to restore from saved state
        if (!validSession) {
          console.log('No current session, checking saved state...');
          const savedState = SessionManager.loadSessionState();
          
          if (savedState) {
            console.log('Found saved session state, attempting to refresh...');
            // Try to refresh the session
            const { data: { session: refreshedSession }, error: refreshError } = await supabase.auth.refreshSession();
            
            if (refreshedSession && !refreshError) {
              console.log('Session refreshed successfully');
              validSession = refreshedSession;
              SessionManager.saveSessionState(refreshedSession);
            } else {
              console.log('Session refresh failed, clearing saved state');
              SessionManager.clearSessionState();
            }
          }
        } else {
          console.log('Current session found, saving state');
          SessionManager.saveSessionState(currentSession);
        }

        if (mounted) {
          console.log('Session initialized:', validSession ? 'Valid session' : 'No session');
          setSession(validSession);
          setUser(validSession?.user ?? null);
          setLoading(false);
        }
      } catch (error) {
        console.error('Error initializing session:', error);
        if (mounted) {
          setSession(null);
          setUser(null);
          setLoading(false);
        }
      }
    };

    initializeSession();

    // Listen for auth changes with enhanced handling
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state change:', event, session ? 'Session present' : 'No session');
      
      if (mounted) {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);

        // Handle different auth events
        switch (event) {
          case 'SIGNED_OUT':
            console.log('User signed out, clearing state and redirecting');
            SessionManager.clearSessionState();
            // Broadcast logout to other tabs
            broadcastLogout();
            // Clear any other cached data
            if (typeof window !== 'undefined') {
              // Clear any other app-specific storage
              try {
                localStorage.removeItem('cocred_user_preferences');
                sessionStorage.clear();
              } catch (e) {
                console.warn('Error clearing storage:', e);
              }
            }
            window.location.href = '/login/student';
            break;
          case 'SIGNED_IN':
            console.log('User signed in successfully');
            if (session) {
              SessionManager.saveSessionState(session);
            }
            break;
          case 'TOKEN_REFRESHED':
            console.log('Auth token refreshed');
            if (session) {
              SessionManager.saveSessionState(session);
            }
            break;
          case 'USER_UPDATED':
            console.log('User data updated');
            if (session) {
              SessionManager.saveSessionState(session);
            }
            break;
          default:
            console.log('Other auth event:', event);
        }
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    try {
      console.log('Signing out user...');
      setLoading(true);
      
      // Clear session state immediately
      SessionManager.clearSessionState();
      
      // Broadcast logout to other tabs
      broadcastLogout();
      
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Sign out error:', error);
        throw error;
      }
      
      console.log('Sign out successful');
      
      // Clear local state
      setSession(null);
      setUser(null);
      
    } catch (error) {
      console.error('Error during sign out:', error);
      // Even if there's an error, clear local state
      setSession(null);
      setUser(null);
      SessionManager.clearSessionState();
    } finally {
      setLoading(false);
      // Force redirect regardless of success/failure
      window.location.href = '/login/student';
    }
  };

  const value = {
    user,
    session,
    loading,
    signOut: handleSignOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}