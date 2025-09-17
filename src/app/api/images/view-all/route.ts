import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

interface ImageRecord {
  id: string;
  type: 'certificate' | 'activity' | 'storage_file';
  name: string;
  file_path: string;
  public_url: string;
  status: string;
  uploaded_at: string;
  student: {
    aapar_id: string;
    name: string;
    email: string;
  } | null;
  class_code?: string;
  activity_type?: string;
  activity_title?: string;
  file_size?: number;
  file_type?: string;
}

export async function GET(request: NextRequest) {
  try {
    // Get all certificates with student information
    const { data: certificates, error: certsError } = await supabase
      .from('certificates')
      .select(`
        *,
        students (
          college_id,
          full_name,
          phone_number
        )
      `)
      .order('uploaded_at', { ascending: false });

    if (certsError) {
      console.error('Error fetching certificates:', certsError);
      return NextResponse.json(
        { error: 'Failed to fetch certificates' },
        { status: 500 }
      );
    }

    // Get all files from student uploads bucket
    const { data: files, error: filesError } = await supabase.storage
      .from('student-uploads')
      .list('', {
        limit: 1000,
        offset: 0,
      });

    if (filesError) {
      console.error('Error fetching files:', filesError);
      return NextResponse.json(
        { error: 'Failed to fetch storage files' },
        { status: 500 }
      );
    }

    // Get all activity files from activities table (commented out - table may not exist)
    /*
    const { data: activities, error: activitiesError } = await supabase
      .from('activities')
      .select(`
        *,
        students (
          college_id,
          full_name,
          phone_number
        )
      `)
      .order('created_at', { ascending: false });

    if (activitiesError) {
      console.error('Error fetching activities:', activitiesError);
      return NextResponse.json(
        { error: 'Failed to fetch activities' },
        { status: 500 }
      );
    }
    */
    const activities = null; // Temporarily disabled

    // Combine all image data
    const allImages: ImageRecord[] = [];

    // Add certificates
    if (certificates) {
      certificates.forEach((cert) => {
        allImages.push({
          id: cert.id,
          type: 'certificate',
          name: cert.issued_name,
          file_path: cert.file_path,
          public_url: cert.public_url,
          status: cert.status,
          uploaded_at: cert.uploaded_at,
          student: cert.students ? {
            aapar_id: cert.students.college_id,
            name: cert.students.full_name,
            email: cert.students.phone_number || 'N/A'
          } : null,
          class_code: cert.class_code
        });
      });
    }

    // Add activity files (disabled for now - table may not exist)
    /*
    if (activities) {
      activities.forEach((activity) => {
        if (activity.attachment_paths && Array.isArray(activity.attachment_paths)) {
          activity.attachment_paths.forEach((path: string, index: number) => {
            const { data: publicUrlData } = supabase.storage
              .from('student-uploads')
              .getPublicUrl(path);

            allImages.push({
              id: `${activity.id}-${index}`,
              type: 'activity',
              name: `${activity.title} - Attachment ${index + 1}`,
              file_path: path,
              public_url: publicUrlData.publicUrl,
              status: activity.status,
              uploaded_at: activity.created_at,
              student: activity.students ? {
                aapar_id: activity.students.college_id,
                name: activity.students.full_name,
                email: activity.students.phone_number || 'N/A'
              } : null,
              activity_type: activity.type,
              activity_title: activity.title
            });
          });
        }
      });
    }
    */

    // Add storage files that might not be in database
    if (files) {
      files.forEach((file) => {
        // Check if this file is already in our database records
        const existsInDb = allImages.some(img => 
          img.file_path && img.file_path.includes(file.name)
        );

        if (!existsInDb && file.name.match(/\.(jpg|jpeg|png|gif|bmp|webp|pdf|doc|docx)$/i)) {
          const { data: publicUrlData } = supabase.storage
            .from('student-uploads')
            .getPublicUrl(file.name);

          allImages.push({
            id: `storage-${file.name}`,
            type: 'storage_file',
            name: file.name,
            file_path: file.name,
            public_url: publicUrlData.publicUrl,
            status: 'unknown',
            uploaded_at: file.updated_at || file.created_at,
            student: null,
            file_size: file.metadata?.size,
            file_type: file.metadata?.mimetype
          });
        }
      });
    }

    // Sort by upload date (newest first)
    allImages.sort((a, b) => 
      new Date(b.uploaded_at).getTime() - new Date(a.uploaded_at).getTime()
    );

    const summary = {
      total_files: allImages.length,
      certificates: allImages.filter(img => img.type === 'certificate').length,
      activities: allImages.filter(img => img.type === 'activity').length,
      storage_files: allImages.filter(img => img.type === 'storage_file').length,
      by_status: {
        pending: allImages.filter(img => img.status === 'pending').length,
        approved: allImages.filter(img => img.status === 'approved').length,
        rejected: allImages.filter(img => img.status === 'rejected').length,
        unknown: allImages.filter(img => img.status === 'unknown').length,
      }
    };

    return NextResponse.json({
      success: true,
      summary,
      images: allImages
    });

  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}