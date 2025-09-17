import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import JSZip from 'jszip';

export async function GET(request: NextRequest) {
  try {
    const zip = new JSZip();
    
    // Get all certificates with student information
    const { data: certificates, error: certsError } = await supabase
      .from('certificates')
      .select(`
        *,
        students (
          aapar_id,
          name,
          email
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

    // Get all activity files from activities table
    const { data: activities, error: activitiesError } = await supabase
      .from('activities')
      .select(`
        *,
        students (
          aapar_id,
          name,
          email
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

    // Get all files from storage bucket
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

    let fileCount = 0;
    const maxFiles = 100; // Limit to prevent timeout
    
    // Create folders in zip
    const certificatesFolder = zip.folder('certificates');
    const activitiesFolder = zip.folder('activities');
    const storageFolder = zip.folder('other_files');
    const metadataArray: any[] = [];

    // Add certificates to zip
    if (certificates && certificatesFolder) {
      for (const cert of certificates) {
        if (fileCount >= maxFiles) break;
        
        try {
          // Download file from storage
          const { data: fileData, error: downloadError } = await supabase.storage
            .from('student-uploads')
            .download(cert.file_path);

          if (!downloadError && fileData) {
            const fileName = `${cert.students?.aapar_id || 'unknown'}_${cert.issued_name.replace(/[^a-z0-9]/gi, '_')}_${cert.id}`;
            const extension = cert.file_path.split('.').pop() || 'pdf';
            
            certificatesFolder.file(`${fileName}.${extension}`, fileData);
            
            metadataArray.push({
              folder: 'certificates',
              original_name: cert.issued_name,
              file_name: `${fileName}.${extension}`,
              student_id: cert.students?.aapar_id,
              student_name: cert.students?.name,
              student_email: cert.students?.email,
              status: cert.status,
              class_code: cert.class_code,
              uploaded_at: cert.uploaded_at,
              file_path: cert.file_path
            });
            
            fileCount++;
          }
        } catch (error) {
          console.error(`Error downloading certificate ${cert.id}:`, error);
        }
      }
    }

    // Add activity files to zip
    if (activities && activitiesFolder) {
      for (const activity of activities) {
        if (fileCount >= maxFiles) break;
        
        if (activity.attachment_paths && Array.isArray(activity.attachment_paths)) {
          for (let i = 0; i < activity.attachment_paths.length; i++) {
            if (fileCount >= maxFiles) break;
            
            const path = activity.attachment_paths[i];
            
            try {
              const { data: fileData, error: downloadError } = await supabase.storage
                .from('student-uploads')
                .download(path);

              if (!downloadError && fileData) {
                const fileName = `${activity.students?.aapar_id || 'unknown'}_${activity.title.replace(/[^a-z0-9]/gi, '_')}_${activity.id}_${i + 1}`;
                const extension = path.split('.').pop() || 'pdf';
                
                activitiesFolder.file(`${fileName}.${extension}`, fileData);
                
                metadataArray.push({
                  folder: 'activities',
                  original_name: `${activity.title} - Attachment ${i + 1}`,
                  file_name: `${fileName}.${extension}`,
                  student_id: activity.students?.aapar_id,
                  student_name: activity.students?.name,
                  student_email: activity.students?.email,
                  status: activity.status,
                  activity_type: activity.type,
                  activity_title: activity.title,
                  uploaded_at: activity.created_at,
                  file_path: path
                });
                
                fileCount++;
              }
            } catch (error) {
              console.error(`Error downloading activity file ${path}:`, error);
            }
          }
        }
      }
    }

    // Add other storage files not in database
    if (files && storageFolder) {
      const existingPaths = new Set();
      
      // Collect all paths already processed
      certificates?.forEach(cert => existingPaths.add(cert.file_path));
      activities?.forEach(activity => {
        if (activity.attachment_paths) {
          activity.attachment_paths.forEach((path: string) => existingPaths.add(path));
        }
      });

      for (const file of files) {
        if (fileCount >= maxFiles) break;
        
        if (!existingPaths.has(file.name) && file.name.match(/\.(jpg|jpeg|png|gif|bmp|webp|pdf|doc|docx)$/i)) {
          try {
            const { data: fileData, error: downloadError } = await supabase.storage
              .from('student-uploads')
              .download(file.name);

            if (!downloadError && fileData) {
              storageFolder.file(file.name, fileData);
              
              metadataArray.push({
                folder: 'other_files',
                original_name: file.name,
                file_name: file.name,
                student_id: null,
                student_name: null,
                student_email: null,
                status: 'unknown',
                uploaded_at: file.updated_at || file.created_at,
                file_path: file.name,
                file_size: file.metadata?.size,
                file_type: file.metadata?.mimetype
              });
              
              fileCount++;
            }
          } catch (error) {
            console.error(`Error downloading file ${file.name}:`, error);
          }
        }
      }
    }

    // Add metadata JSON file
    zip.file('metadata.json', JSON.stringify({
      export_date: new Date().toISOString(),
      total_files: fileCount,
      summary: {
        certificates: metadataArray.filter(m => m.folder === 'certificates').length,
        activities: metadataArray.filter(m => m.folder === 'activities').length,
        other_files: metadataArray.filter(m => m.folder === 'other_files').length,
      },
      files: metadataArray
    }, null, 2));

    // Generate the zip file
    const zipBuffer = await zip.generateAsync({ type: 'arraybuffer' });
    
    // Create response with zip file
    const response = new NextResponse(zipBuffer);
    response.headers.set('Content-Type', 'application/zip');
    response.headers.set('Content-Disposition', `attachment; filename="student_files_export_${new Date().toISOString().split('T')[0]}.zip"`);
    
    return response;

  } catch (error) {
    console.error('Unexpected error during bulk export:', error);
    return NextResponse.json(
      { error: 'Internal server error during export' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fileIds, studentIds, statusFilter } = body;

    const zip = new JSZip();
    let fileCount = 0;
    const metadataArray: any[] = [];

    // Create folders
    const certificatesFolder = zip.folder('certificates');
    const activitiesFolder = zip.folder('activities');

    // Build query filters
    let certificatesQuery = supabase
      .from('certificates')
      .select(`
        *,
        students (
          aapar_id,
          name,
          email
        )
      `);

    let activitiesQuery = supabase
      .from('activities')
      .select(`
        *,
        students (
          aapar_id,
          name,
          email
        )
      `);

    // Apply filters
    if (fileIds && fileIds.length > 0) {
      certificatesQuery = certificatesQuery.in('id', fileIds);
      activitiesQuery = activitiesQuery.in('id', fileIds);
    }

    if (statusFilter && statusFilter !== 'all') {
      certificatesQuery = certificatesQuery.eq('status', statusFilter);
      activitiesQuery = activitiesQuery.eq('status', statusFilter);
    }

    if (studentIds && studentIds.length > 0) {
      // Get student internal IDs first
      const { data: students } = await supabase
        .from('students')
        .select('id, aapar_id')
        .in('aapar_id', studentIds);

      if (students && students.length > 0) {
        const internalIds = students.map(s => s.id);
        certificatesQuery = certificatesQuery.in('student_id', internalIds);
        activitiesQuery = activitiesQuery.in('student_id', internalIds);
      }
    }

    const [{ data: certificates }, { data: activities }] = await Promise.all([
      certificatesQuery,
      activitiesQuery
    ]);

    // Process certificates
    if (certificates && certificatesFolder) {
      for (const cert of certificates) {
        try {
          const { data: fileData, error: downloadError } = await supabase.storage
            .from('student-uploads')
            .download(cert.file_path);

          if (!downloadError && fileData) {
            const fileName = `${cert.students?.aapar_id || 'unknown'}_${cert.issued_name.replace(/[^a-z0-9]/gi, '_')}_${cert.id}`;
            const extension = cert.file_path.split('.').pop() || 'pdf';
            
            certificatesFolder.file(`${fileName}.${extension}`, fileData);
            
            metadataArray.push({
              folder: 'certificates',
              original_name: cert.issued_name,
              file_name: `${fileName}.${extension}`,
              student_id: cert.students?.aapar_id,
              student_name: cert.students?.name,
              status: cert.status,
              uploaded_at: cert.uploaded_at
            });
            
            fileCount++;
          }
        } catch (error) {
          console.error(`Error downloading certificate ${cert.id}:`, error);
        }
      }
    }

    // Process activities
    if (activities && activitiesFolder) {
      for (const activity of activities) {
        if (activity.attachment_paths && Array.isArray(activity.attachment_paths)) {
          for (let i = 0; i < activity.attachment_paths.length; i++) {
            const path = activity.attachment_paths[i];
            
            try {
              const { data: fileData, error: downloadError } = await supabase.storage
                .from('student-uploads')
                .download(path);

              if (!downloadError && fileData) {
                const fileName = `${activity.students?.aapar_id || 'unknown'}_${activity.title.replace(/[^a-z0-9]/gi, '_')}_${activity.id}_${i + 1}`;
                const extension = path.split('.').pop() || 'pdf';
                
                activitiesFolder.file(`${fileName}.${extension}`, fileData);
                
                metadataArray.push({
                  folder: 'activities',
                  original_name: `${activity.title} - Attachment ${i + 1}`,
                  file_name: `${fileName}.${extension}`,
                  student_id: activity.students?.aapar_id,
                  student_name: activity.students?.name,
                  status: activity.status,
                  uploaded_at: activity.created_at
                });
                
                fileCount++;
              }
            } catch (error) {
              console.error(`Error downloading activity file ${path}:`, error);
            }
          }
        }
      }
    }

    // Add metadata
    zip.file('metadata.json', JSON.stringify({
      export_date: new Date().toISOString(),
      total_files: fileCount,
      filters_applied: {
        fileIds: fileIds || null,
        studentIds: studentIds || null,
        statusFilter: statusFilter || null
      },
      files: metadataArray
    }, null, 2));

    const zipBuffer = await zip.generateAsync({ type: 'arraybuffer' });
    
    const response = new NextResponse(zipBuffer);
    response.headers.set('Content-Type', 'application/zip');
    response.headers.set('Content-Disposition', `attachment; filename="filtered_export_${new Date().toISOString().split('T')[0]}.zip"`);
    
    return response;

  } catch (error) {
    console.error('Error in filtered export:', error);
    return NextResponse.json(
      { error: 'Internal server error during filtered export' },
      { status: 500 }
    );
  }
}