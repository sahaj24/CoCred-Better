import { supabase } from './supabase';

export type ActivityType = "certificate" | "internship" | "project" | "workshop" | "competition" | "volunteer";
export type ActivityCategory = "Academic" | "Technical" | "Leadership" | "Sports" | "Cultural" | "Social";
export type ActivityStatus = "pending" | "approved" | "rejected";

export interface Activity {
  id: string;
  student_id: string;
  title: string;
  description: string;
  activity_type: ActivityType;
  category: ActivityCategory;
  organization: string;
  start_date: string;
  end_date: string;
  skills: string[];
  attachments: string[];
  status: ActivityStatus;
  faculty_comment?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateActivityData {
  title: string;
  description: string;
  activity_type: ActivityType;
  category: ActivityCategory;
  organization: string;
  start_date: string;
  end_date: string;
  skills: string;
  attachments: File[];
}

// Upload files to Supabase Storage
export async function uploadActivityFiles(files: File[], activityId: string): Promise<string[]> {
  const uploadedPaths: string[] = [];
  
  for (const file of files) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${activityId}_${Date.now()}.${fileExt}`;
    const filePath = `activities/${fileName}`;
    
    const { data, error } = await supabase.storage
      .from('student-documents')
      .upload(filePath, file);
    
    if (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
    
    uploadedPaths.push(filePath);
  }
  
  return uploadedPaths;
}

// Get public URLs for files
export async function getFileUrl(path: string): Promise<string> {
  const { data } = supabase.storage
    .from('student-documents')
    .getPublicUrl(path);
  
  return data.publicUrl;
}

// Create a new activity
export async function createActivity(activityData: CreateActivityData): Promise<Activity> {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    throw new Error('User not authenticated');
  }

  // Get student ID
  const { data: studentData, error: studentError } = await supabase
    .from('students')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (studentError || !studentData) {
    throw new Error('Student profile not found');
  }

  // First create the activity record
  const activityId = crypto.randomUUID();
  
  // Upload files if any
  let attachmentPaths: string[] = [];
  if (activityData.attachments.length > 0) {
    attachmentPaths = await uploadActivityFiles(activityData.attachments, activityId);
  }

  // Parse skills string into array
  const skillsArray = activityData.skills
    .split(',')
    .map(skill => skill.trim())
    .filter(skill => skill.length > 0);

  const { data, error } = await supabase
    .from('activities')
    .insert({
      id: activityId,
      student_id: studentData.id,
      title: activityData.title,
      description: activityData.description,
      activity_type: activityData.activity_type,
      category: activityData.category,
      organization: activityData.organization,
      start_date: activityData.start_date,
      end_date: activityData.end_date,
      skills: skillsArray,
      attachments: attachmentPaths,
      status: 'pending'
    })
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}

// Get activities for current student
export async function getStudentActivities(): Promise<Activity[]> {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    throw new Error('User not authenticated');
  }

  // Get student ID
  const { data: studentData, error: studentError } = await supabase
    .from('students')
    .select('id')
    .eq('user_id', user.id)
    .single();

  if (studentError || !studentData) {
    throw new Error('Student profile not found');
  }

  const { data, error } = await supabase
    .from('activities')
    .select('*')
    .eq('student_id', studentData.id)
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data || [];
}

// Get activities for faculty approval (if faculty is logged in)
export async function getFacultyActivities(): Promise<Activity[]> {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    throw new Error('User not authenticated');
  }

  // For now, get all pending activities - you can modify this based on your faculty-student association logic
  const { data, error } = await supabase
    .from('activities')
    .select(`
      *,
      students!inner(
        full_name,
        college_id
      )
    `)
    .eq('status', 'pending')
    .order('created_at', { ascending: false });

  if (error) {
    throw error;
  }

  return data || [];
}

// Update activity status (for faculty)
export async function updateActivityStatus(
  activityId: string, 
  status: ActivityStatus, 
  comment?: string
): Promise<Activity> {
  const { data, error } = await supabase
    .from('activities')
    .update({
      status,
      faculty_comment: comment,
      updated_at: new Date().toISOString()
    })
    .eq('id', activityId)
    .select()
    .single();

  if (error) {
    throw error;
  }

  return data;
}