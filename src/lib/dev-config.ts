// Development mode configuration
export const DEV_MODE = {
  // Set to true to bypass authentication checks
  BYPASS_AUTH: true,
  
  // Mock user data for development
  MOCK_USER: {
    id: 'dev-user-123',
    email: 'dev@cocred.com',
    user_metadata: {
      full_name: 'Dev User'
    }
  },
  
  // Mock authority profile for development
  MOCK_AUTHORITY_PROFILE: {
    id: 'dev-profile-123',
    user_id: 'dev-user-123',
    full_name: 'Dev Authority',
    email: 'dev@cocred.com',
    avatar_url: undefined,
    user_type: 'authority' as const,
    authority_type: 'admin' as const,
    organization: 'CoCred Development',
    permissions: {
      can_issue_certificates: true,
      can_approve_certificates: true,
      can_create_events: true,
      can_manage_students: true,
      can_manage_faculty: true,
      can_delete_events: true,
      can_view_analytics: true,
    },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },

  // Mock student profile
  MOCK_STUDENT_PROFILE: {
    id: 'dev-student-123',
    user_id: 'dev-user-123',
    full_name: 'Dev Student',
    email: 'student@cocred.com',
    avatar_url: undefined,
    user_type: 'student' as const,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
};

// Helper to get mock profile based on required user type
export function getMockProfile(userType: 'student' | 'authority') {
  switch (userType) {
    case 'authority':
      return DEV_MODE.MOCK_AUTHORITY_PROFILE;
    case 'student':
      return DEV_MODE.MOCK_STUDENT_PROFILE;
    default:
      return DEV_MODE.MOCK_AUTHORITY_PROFILE;
  }
}