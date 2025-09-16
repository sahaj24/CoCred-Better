import type { AuthorityRole, AuthorityPermissions } from './types';

// Define authority roles and their permissions
export const AUTHORITY_ROLES: Record<string, AuthorityRole> = {
  admin: {
    type: 'admin',
    label: 'System Administrator',
    description: 'Full system access and management capabilities',
    permissions: {
      can_issue_certificates: true,
      can_approve_certificates: true,
      can_create_events: true,
      can_manage_students: true,
      can_manage_faculty: true,
      can_delete_events: true,
      can_view_analytics: true,
    }
  },
  faculty: {
    type: 'faculty',
    label: 'Faculty Member',
    description: 'Can organize events and approve certificates for their events',
    permissions: {
      can_issue_certificates: false,
      can_approve_certificates: true,
      can_create_events: true,
      can_manage_students: false,
      can_manage_faculty: false,
      can_delete_events: false,
      can_view_analytics: false,
    }
  },
  club_organizer: {
    type: 'club_organizer',
    label: 'Club Organizer',
    description: 'Can organize club events and activities',
    permissions: {
      can_issue_certificates: false,
      can_approve_certificates: false,
      can_create_events: true,
      can_manage_students: false,
      can_manage_faculty: false,
      can_delete_events: false,
      can_view_analytics: false,
    }
  },
  event_organizer: {
    type: 'event_organizer',
    label: 'Event Organizer',
    description: 'Can organize general events and manage registrations',
    permissions: {
      can_issue_certificates: false,
      can_approve_certificates: false,
      can_create_events: true,
      can_manage_students: false,
      can_manage_faculty: false,
      can_delete_events: false,
      can_view_analytics: false,
    }
  }
};

// Helper function to check if user has specific permission
export function hasPermission(
  userPermissions: AuthorityPermissions | undefined,
  permission: keyof AuthorityPermissions
): boolean {
  return userPermissions?.[permission] ?? false;
}

// Helper function to get role by type
export function getAuthorityRole(type: string): AuthorityRole | null {
  return AUTHORITY_ROLES[type] || null;
}

// Helper function to check if user is authority
export function isAuthority(userType: string): boolean {
  return userType === 'authority';
}

// Helper function to check if user has authority access
export function hasAuthorityAccess(
  userType: string,
  authorityType?: string
): boolean {
  return isAuthority(userType) && Boolean(authorityType && AUTHORITY_ROLES[authorityType]);
}

// Get dashboard features based on authority type
export function getAuthorityFeatures(authorityType: string) {
  const role = getAuthorityRole(authorityType);
  if (!role) return [];

  const features = [];

  if (role.permissions.can_manage_students) {
    features.push({
      id: 'student_management',
      label: 'Student Management',
      description: 'Manage student profiles and documents',
      icon: 'Users'
    });
  }

  if (role.permissions.can_create_events) {
    features.push({
      id: 'event_management',
      label: 'Event Management',
      description: 'Create and manage events',
      icon: 'Calendar'
    });
  }

  if (role.permissions.can_approve_certificates) {
    features.push({
      id: 'certificate_approval',
      label: 'Certificate Approval',
      description: 'Approve certificate requests',
      icon: 'Award'
    });
  }

  if (role.permissions.can_issue_certificates) {
    features.push({
      id: 'certificate_issuance',
      label: 'Certificate Issuance',
      description: 'Issue official certificates',
      icon: 'FileText'
    });
  }

  if (role.permissions.can_manage_faculty) {
    features.push({
      id: 'faculty_management',
      label: 'Faculty Management',
      description: 'Manage faculty members',
      icon: 'UserCheck'
    });
  }

  if (role.permissions.can_view_analytics) {
    features.push({
      id: 'analytics',
      label: 'Analytics & Reports',
      description: 'View system analytics and reports',
      icon: 'BarChart'
    });
  }

  return features;
}