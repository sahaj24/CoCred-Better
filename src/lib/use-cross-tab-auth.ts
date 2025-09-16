import { useEffect } from 'react';
import { useAuth } from './auth-context';

// Hook to handle cross-tab authentication synchronization
export function useCrossTabAuth() {
  const { signOut } = useAuth();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Listen for storage events (fired when localStorage changes in another tab)
    const handleStorageChange = (event: StorageEvent) => {
      // If the auth token was removed in another tab, sign out this tab too
      if (event.key === 'supabase.auth.token' && event.newValue === null) {
        console.log('Auth token removed in another tab, signing out...');
        signOut();
      }
      
      // If our custom session state was cleared in another tab
      if (event.key === 'cocred_session_state' && event.newValue === null) {
        console.log('Session state cleared in another tab, signing out...');
        signOut();
      }
    };

    // Listen for custom logout events
    const handleCustomLogout = () => {
      console.log('Logout event received from another tab');
      signOut();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('cocred_logout', handleCustomLogout);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cocred_logout', handleCustomLogout);
    };
  }, [signOut]);
}

// Utility to broadcast logout to other tabs
export const broadcastLogout = () => {
  if (typeof window === 'undefined') return;
  
  try {
    // Dispatch custom event to notify other tabs
    window.dispatchEvent(new CustomEvent('cocred_logout'));
    
    // Also trigger a storage event by temporarily setting and removing an item
    localStorage.setItem('cocred_logout_signal', Date.now().toString());
    localStorage.removeItem('cocred_logout_signal');
  } catch (error) {
    console.warn('Error broadcasting logout:', error);
  }
};