import { supabase } from './supabase';

export type ActivityStatus = "pending" | "approved" | "rejected";
export type ActivityType = "certificate" | "internship" | "project" | "workshop";
export type ActivityCategory = "Academic" | "Technical" | "Leadership" | "Sports" | "Cultural" | "Social";

export interface Activity {
  id: string;
  title: string;
  type: ActivityType;
  category: ActivityCategory;
  description: string;
  status: ActivityStatus;
  date: string;
  organization?: string;
  duration?: string;
  skills?: string[];
  student_id: string;
  created_at: string;
}

/**
 * Get all activities for the current student
 */
export async function getStudentActivities(studentId: string): Promise<Activity[]> {
  try {
    const { data, error } = await supabase
      .from('certificates')
      .select('*')
      .eq('student_id', studentId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data.map(cert => ({
      id: cert.id,
      title: cert.name,
      type: cert.type as ActivityType,
      category: cert.category || 'Technical' as ActivityCategory,
      description: cert.description || '',
      status: cert.status as ActivityStatus,
      date: cert.created_at,
      organization: cert.organization || '',
      duration: cert.duration || '',
      skills: cert.skills || [],
      student_id: cert.student_id,
      created_at: cert.created_at
    }));
  } catch (error) {
    console.error('Error fetching student activities:', error);
    throw error;
  }
}

/**
 * Get activity statistics for the student
 */
export async function getActivityStats(studentId: string) {
  try {
    const activities = await getStudentActivities(studentId);
    
    return {
      total: activities.length,
      approved: activities.filter(a => a.status === "approved").length,
      pending: activities.filter(a => a.status === "pending").length,
      rejected: activities.filter(a => a.status === "rejected").length
    };
  } catch (error) {
    console.error('Error fetching activity stats:', error);
    throw error;
  }
}
