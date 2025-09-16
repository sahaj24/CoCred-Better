import mockData from './facultyDashboard.json';
import { Student } from '@/components/faculty/StudentTable';

// TODO: connect API - Replace these functions with actual API calls
export const getFacultyStatistics = () => {
  return mockData.statistics;
};

export const getFacultyStudents = (): Student[] => {
  return mockData.students as Student[];
};

export const getFacultyCourses = () => {
  return mockData.courses;
};

export const getFacultyNotifications = () => {
  return mockData.notifications;
};

export const getUploadHistory = () => {
  return mockData.uploadHistory;
};

// Simulated API functions with TODO comments for future implementation
export const approveStudent = async (studentId: string) => {
  // TODO: connect API - Implement actual approve student API call
  console.log('Approving student:', studentId);
  return { success: true, message: 'Student approved successfully' };
};

export const disapproveStudent = async (studentId: string) => {
  // TODO: connect API - Implement actual disapprove student API call
  console.log('Disapproving student:', studentId);
  return { success: true, message: 'Student disapproved successfully' };
};

export const updateStudentStatus = async (studentId: string, status: 'approved' | 'pending' | 'disapproved') => {
  // TODO: connect API - Implement actual update student status API call
  console.log('Updating student status:', studentId, status);
  return { success: true, message: 'Student status updated successfully' };
};

export const createCourse = async (courseData: any) => {
  // TODO: connect API - Implement actual create course API call
  console.log('Creating course:', courseData);
  return { success: true, message: 'Course created successfully' };
};

export const uploadFiles = async (files: File[]) => {
  // TODO: connect API - Implement actual file upload API call
  console.log('Uploading files:', files);
  return { 
    success: true, 
    message: 'Files uploaded successfully',
    uploadedFiles: files.map(f => ({ name: f.name, size: f.size }))
  };
};

export const markNotificationAsRead = async (notificationId: number) => {
  // TODO: connect API - Implement actual mark notification as read API call
  console.log('Marking notification as read:', notificationId);
  return { success: true, message: 'Notification marked as read' };
};

export const markAllNotificationsAsRead = async () => {
  // TODO: connect API - Implement actual mark all notifications as read API call
  console.log('Marking all notifications as read');
  return { success: true, message: 'All notifications marked as read' };
};

export const updateFacultyProfile = async (profileData: any) => {
  // TODO: connect API - Implement actual update faculty profile API call
  console.log('Updating faculty profile:', profileData);
  return { success: true, message: 'Profile updated successfully' };
};

export const changePassword = async (currentPassword: string, newPassword: string) => {
  // TODO: connect API - Implement actual change password API call
  console.log('Changing password');
  return { success: true, message: 'Password changed successfully' };
};