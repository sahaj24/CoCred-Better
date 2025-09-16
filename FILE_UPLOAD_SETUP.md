# File Upload Setup Instructions

## Supabase Storage Configuration

To enable file uploads, you need to create a storage bucket in your Supabase project:

### 1. Create Storage Bucket

1. Go to your Supabase project dashboard
2. Navigate to Storage → Buckets
3. Click "New bucket"
4. Name: `student-uploads`
5. Set as Public bucket: `true` (for easy file access)
6. Click "Create bucket"

### 2. Set Bucket Policies

Add the following policies to allow authenticated users to upload files:

#### Allow INSERT (Upload) for authenticated users:
```sql
CREATE POLICY "Users can upload their own files" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'student-uploads' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

#### Allow SELECT (View) for authenticated users:
```sql
CREATE POLICY "Users can view their own files" ON storage.objects
FOR SELECT USING (
  bucket_id = 'student-uploads' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

#### Allow DELETE for authenticated users:
```sql
CREATE POLICY "Users can delete their own files" ON storage.objects
FOR DELETE USING (
  bucket_id = 'student-uploads' 
  AND auth.uid()::text = (storage.foldername(name))[1]
);
```

### 3. File Organization

Files are organized by user ID in the bucket:
```
student-uploads/
├── user-id-1/
│   ├── certificate-1.pdf
│   ├── internship-report.docx
│   └── profile-picture.jpg
├── user-id-2/
│   ├── diploma.pdf
│   └── project-document.pdf
```

### 4. Supported File Types

- **Documents**: PDF, DOC, DOCX, TXT
- **Images**: JPG, JPEG, PNG
- **Size Limit**: 10MB per file
- **Batch Upload**: Up to 10 files at once

### 5. Testing the Upload System

1. Start the development server: `npm run dev`
2. Login as a student
3. Navigate to Dashboard → Upload tab
4. Try uploading different file types
5. Check the Supabase Storage dashboard to verify files are uploaded correctly

### 6. Error Handling

Common issues and solutions:

- **"Bucket not found"**: Ensure the bucket is created and named `student-uploads`
- **"Permission denied"**: Check that the RLS policies are correctly set up
- **"File too large"**: Current limit is 10MB, increase `MAX_FILE_SIZE` in config if needed
- **"Invalid file type"**: Check `ALLOWED_TYPES` array in the upload configuration

### 7. Configuration Options

You can modify the upload settings in `/src/lib/file-upload.ts`:

```typescript
export const UPLOAD_CONFIG = {
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: [
    'application/pdf',
    'image/jpeg',
    'image/png',
    // Add more types as needed
  ],
  BUCKET_NAME: 'student-uploads'
};
```

### 8. Security Considerations

- Files are organized by user ID to prevent access to other users' files
- RLS policies ensure users can only access their own files
- File type validation prevents malicious file uploads
- File size limits prevent abuse of storage space