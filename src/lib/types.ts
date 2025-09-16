
import { User } from '@supabase/supabase-js'

export type UserProfile = {
  name: string;
  email: string;
  dob: string; // ISO date string
  aaparId: string;
  imageUrl: string; // data URL
  signatureUrl:string; // data URL
  password?: string;
};

// Extended user profile for Supabase integration
export type SupabaseUserProfile = {
  id: string;
  user_id: string;
  full_name: string;
  email: string;
  avatar_url?: string;
  user_type: 'student' | 'authority';
  authority_type?: 'admin' | 'faculty' | 'club_organizer' | 'event_organizer';
  organization?: string; // For club organizers - club name, for faculty - department
  permissions?: AuthorityPermissions;
  created_at: string;
  updated_at: string;
};

export type AuthorityPermissions = {
  can_issue_certificates: boolean;
  can_approve_certificates: boolean;
  can_create_events: boolean;
  can_manage_students: boolean;
  can_manage_faculty: boolean;
  can_delete_events: boolean;
  can_view_analytics: boolean;
};

export type AuthorityRole = {
  type: 'admin' | 'faculty' | 'club_organizer' | 'event_organizer';
  label: string;
  description: string;
  permissions: AuthorityPermissions;
};

export type AuthUser = User | null;

export type StoredFile = {
  id: string;
  name: string;
  date: string;
  file: File;
  status: 'pending' | 'approved' | 'rejected';
  signature: string | null;
  qrCode: string | null;
  eventKey: string | null;
};

export type Notification = {
  id: string;
  message: string;
  read: boolean;
  date: string;
};

export type AppEvent = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  key: string;
  organizer: string;
  devopsLink: string;
};
