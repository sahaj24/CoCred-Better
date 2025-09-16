import { supabase } from './supabase';

// File upload configuration
export const UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: [
    'application/pdf',
    'image/jpeg',
    'image/png',
    'image/jpg',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain'
  ],
  BUCKET_NAME: 'student-uploads'
};

// File type validation
export const validateFile = (file: File): { isValid: boolean; error?: string } => {
  // Check if file is valid
  if (!file) {
    return {
      isValid: false,
      error: 'Invalid file'
    };
  }

  // Check file size
  if (file.size > UPLOAD_CONFIG.MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: `File size must be less than ${UPLOAD_CONFIG.MAX_FILE_SIZE / (1024 * 1024)}MB`
    };
  }

  // Check file type
  if (!file.type || !UPLOAD_CONFIG.ALLOWED_TYPES.includes(file.type)) {
    return {
      isValid: false,
      error: 'File type not supported. Please upload PDF, DOC, DOCX, TXT, or image files.'
    };
  }

  return { isValid: true };
};

// Generate file path with original name
export const generateFileName = (file: File, userId: string): string => {
  // Clean the filename to remove special characters and spaces
  const cleanFileName = file.name
    .replace(/[^a-zA-Z0-9.-]/g, '_') // Replace special chars with underscore
    .replace(/_{2,}/g, '_') // Replace multiple underscores with single
    .replace(/^_|_$/g, ''); // Remove leading/trailing underscores
  
  // Add timestamp prefix to ensure uniqueness while keeping original name
  const timestamp = Date.now();
  const fileExtension = file.name.split('.').pop();
  const nameWithoutExt = cleanFileName.replace(/\.[^/.]+$/, '');
  
  return `${userId}/${timestamp}_${nameWithoutExt}.${fileExtension}`;
};

// Upload file to Supabase storage
export const uploadFile = async (
  file: File,
  userId: string,
  onProgress?: (progress: number) => void
): Promise<{ success: boolean; data?: any; error?: string }> => {
  try {
    // Validate file
    const validation = validateFile(file);
    if (!validation.isValid) {
      return { success: false, error: validation.error };
    }

    // Generate unique file name
    const fileName = generateFileName(file, userId);

    console.log('Uploading file:', fileName);

    // Upload to Supabase storage
    const { data, error } = await supabase.storage
      .from(UPLOAD_CONFIG.BUCKET_NAME)
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Upload error:', error);
      return { success: false, error: error.message };
    }

    console.log('Upload successful:', data);

    // Get public URL
    const { data: urlData } = supabase.storage
      .from(UPLOAD_CONFIG.BUCKET_NAME)
      .getPublicUrl(fileName);

    // Save file metadata to database
    const { error: dbError } = await supabase
      .from('uploaded_files')
      .insert({
        user_id: userId,
        file_name: file.name, // Original filename
        file_path: data.path,
        file_size: file.size,
        file_type: file.type || 'application/octet-stream'
      });

    if (dbError) {
      console.warn('Failed to save file metadata:', dbError);
      // Don't fail the upload if metadata insertion fails
    }

    return {
      success: true,
      data: {
        path: data.path,
        fullPath: data.fullPath,
        publicUrl: urlData.publicUrl,
        fileName: file.name, // Original filename
        fileSize: file.size,
        fileType: file.type
      }
    };
  } catch (error) {
    console.error('Upload failed:', error);
    return { success: false, error: 'Upload failed. Please try again.' };
  }
};

// Delete file from storage and database
export const deleteFile = async (filePath: string): Promise<{ success: boolean; error?: string }> => {
  try {
    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from(UPLOAD_CONFIG.BUCKET_NAME)
      .remove([filePath]);

    if (storageError) {
      console.error('Storage delete error:', storageError);
      return { success: false, error: storageError.message };
    }

    // Delete from database
    const { error: dbError } = await supabase
      .from('uploaded_files')
      .delete()
      .eq('file_path', filePath);

    if (dbError) {
      console.warn('Database delete error:', dbError);
      // Don't fail if database deletion fails
    }

    return { success: true };
  } catch (error) {
    console.error('Delete failed:', error);
    return { success: false, error: 'Delete failed. Please try again.' };
  }
};

// List user files
// List user files from database (with original filenames)
export const listUserFiles = async (userId: string): Promise<{ success: boolean; data?: any[]; error?: string }> => {
  try {
    const { data, error } = await supabase
      .from('uploaded_files')
      .select('*')
      .eq('user_id', userId)
      .order('upload_date', { ascending: false });

    if (error) {
      console.error('List files error:', error);
      return { success: false, error: error.message };
    }

    // Add public URLs to the file data
    const filesWithUrls = data?.map(file => {
      const { data: urlData } = supabase.storage
        .from(UPLOAD_CONFIG.BUCKET_NAME)
        .getPublicUrl(file.file_path);
      
      return {
        ...file,
        publicUrl: urlData.publicUrl,
        originalName: file.file_name // Original filename from database
      };
    }) || [];

    return { success: true, data: filesWithUrls };
  } catch (error) {
    console.error('List files failed:', error);
    return { success: false, error: 'Failed to list files. Please try again.' };
  }
};

// Download file
export const downloadFile = async (filePath: string): Promise<{ success: boolean; data?: Blob; error?: string }> => {
  try {
    const { data, error } = await supabase.storage
      .from(UPLOAD_CONFIG.BUCKET_NAME)
      .download(filePath);

    if (error) {
      console.error('Download error:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (error) {
    console.error('Download failed:', error);
    return { success: false, error: 'Download failed. Please try again.' };
  }
};

// Get file metadata
export const getFileMetadata = (file: File) => {
  return {
    name: file?.name || 'Unknown',
    size: file?.size || 0,
    type: file?.type || 'application/octet-stream',
    lastModified: file?.lastModified || Date.now(),
    sizeFormatted: formatFileSize(file?.size || 0)
  };
};

// Format file size
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Get file icon based on type
export const getFileIcon = (fileType: string): string => {
  if (!fileType || typeof fileType !== 'string') return '📎';
  
  const type = fileType.toLowerCase();
  if (type.includes('pdf')) return '📄';
  if (type.includes('image')) return '🖼️';
  if (type.includes('word') || type.includes('document')) return '📝';
  if (type.includes('text')) return '📄';
  return '📎';
};