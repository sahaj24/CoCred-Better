import { supabase } from './supabase';

// Session persistence utilities
export class SessionManager {
  private static SESSION_KEY = 'cocred_session_state';
  private static USER_TYPE_KEY = 'cocred_user_type';

  // Save session state to localStorage
  static saveSessionState(session: any, userType?: string) {
    if (typeof window === 'undefined') return;
    
    try {
      // Try to detect user type from session metadata or URL if not provided
      let detectedUserType = userType;
      
      if (!detectedUserType) {
        // Try to get from current URL
        if (typeof window !== 'undefined') {
          const currentPath = window.location.pathname;
          if (currentPath.includes('/student')) detectedUserType = 'student';
          else if (currentPath.includes('/teacher')) detectedUserType = 'teacher';
          else if (currentPath.includes('/authority')) detectedUserType = 'authority';
        }
        
        // Try to get from session metadata
        if (!detectedUserType && session?.user?.user_metadata) {
          detectedUserType = session.user.user_metadata.user_type;
        }
        
        // Default to student if still not detected
        if (!detectedUserType) {
          detectedUserType = 'student';
        }
      }
      
      const sessionData = {
        session,
        timestamp: Date.now(),
        userType: detectedUserType
      };
      
      localStorage.setItem(this.SESSION_KEY, JSON.stringify(sessionData));
      localStorage.setItem(this.USER_TYPE_KEY, detectedUserType);
      
      console.log('Session state saved to localStorage with user type:', detectedUserType);
    } catch (error) {
      console.error('Error saving session state:', error);
    }
  }

  // Load session state from localStorage
  static loadSessionState() {
    if (typeof window === 'undefined') return null;
    
    try {
      const savedData = localStorage.getItem(this.SESSION_KEY);
      if (!savedData) return null;

      const sessionData = JSON.parse(savedData);
      
      // Check if session is not too old (7 days)
      const MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
      if (Date.now() - sessionData.timestamp > MAX_AGE) {
        this.clearSessionState();
        return null;
      }

      return sessionData;
    } catch (error) {
      console.error('Error loading session state:', error);
      return null;
    }
  }

  // Clear session state
  static clearSessionState() {
    if (typeof window === 'undefined') return;
    
    try {
      localStorage.removeItem(this.SESSION_KEY);
      localStorage.removeItem(this.USER_TYPE_KEY);
      console.log('Session state cleared from localStorage');
    } catch (error) {
      console.error('Error clearing session state:', error);
    }
  }

  // Get saved user type
  static getSavedUserType(): string {
    if (typeof window === 'undefined') return 'student';
    
    try {
      // First check for explicitly saved user type
      let userType = localStorage.getItem(this.USER_TYPE_KEY);
      
      // If no saved type, check for pending type (from OAuth flow)
      if (!userType) {
        userType = localStorage.getItem('cocred_pending_user_type');
        if (userType) {
          // Save it as the primary user type and clear pending
          localStorage.setItem(this.USER_TYPE_KEY, userType);
          localStorage.removeItem('cocred_pending_user_type');
        }
      }
      
      // Try to detect from current URL as fallback
      if (!userType && typeof window !== 'undefined') {
        const currentPath = window.location.pathname;
        if (currentPath.includes('/student')) userType = 'student';
        else if (currentPath.includes('/teacher')) userType = 'teacher';
        else if (currentPath.includes('/authority')) userType = 'authority';
      }
      
      return userType || 'student';
    } catch (error) {
      console.error('Error getting saved user type:', error);
      return 'student';
    }
  }

  // Enhanced session check with automatic refresh
  static async ensureValidSession() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error checking session:', error);
        return null;
      }

      if (session) {
        // Session is valid, save it
        this.saveSessionState(session);
        return session;
      } else {
        // No session, check if we have a saved state
        const savedState = this.loadSessionState();
        if (savedState) {
          console.log('No active session but found saved state, attempting refresh...');
          // Try to refresh the session
          const { data: { session: refreshedSession }, error: refreshError } = await supabase.auth.refreshSession();
          
          if (refreshedSession && !refreshError) {
            this.saveSessionState(refreshedSession);
            return refreshedSession;
          } else {
            console.log('Session refresh failed, clearing saved state');
            this.clearSessionState();
          }
        }
        return null;
      }
    } catch (error) {
      console.error('Error ensuring valid session:', error);
      return null;
    }
  }
}

// Auto-save session when it changes
if (typeof window !== 'undefined') {
  supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_IN' && session) {
      SessionManager.saveSessionState(session);
    } else if (event === 'SIGNED_OUT') {
      SessionManager.clearSessionState();
    } else if (event === 'TOKEN_REFRESHED' && session) {
      SessionManager.saveSessionState(session);
    }
  });
}