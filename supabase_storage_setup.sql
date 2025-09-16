-- CoCred File Upload Storage Setup Script
-- Run this script in your Supabase SQL Editor to enable file uploads

-- NOTE: Storage bucket and policies need to be created through the Supabase Dashboard UI
-- This script only creates the metadata table and its policies

-- MANUAL STEPS (Do these in Supabase Dashboard first):
-- 1. Go to Storage > Buckets
-- 2. Click "New bucket"
-- 3. Name: student-uploads
-- 4. Set as Public: true
-- 5. Click "Create bucket"
-- 6. Go to bucket settings and add these policies manually:
--    - Allow authenticated users to upload: bucket_id = 'student-uploads' AND auth.uid()::text = (storage.foldername(name))[1]
--    - Allow authenticated users to select: bucket_id = 'student-uploads' AND auth.uid()::text = (storage.foldername(name))[1]
--    - Allow authenticated users to delete: bucket_id = 'student-uploads' AND auth.uid()::text = (storage.foldername(name))[1]

-- 7. Create a table to track uploaded files metadata (for better organization)
CREATE TABLE IF NOT EXISTS public.uploaded_files (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  file_type TEXT NOT NULL,
  upload_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Enable RLS on the uploaded_files table
ALTER TABLE public.uploaded_files ENABLE ROW LEVEL SECURITY;

-- 9. Policy: Users can only see their own uploaded files
CREATE POLICY "Users can view their own uploaded files" 
ON public.uploaded_files 
FOR SELECT 
USING (auth.uid() = user_id);

-- 10. Policy: Users can insert their own file records
CREATE POLICY "Users can insert their own file records" 
ON public.uploaded_files 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- 11. Policy: Users can update their own file records
CREATE POLICY "Users can update their own file records" 
ON public.uploaded_files 
FOR UPDATE 
USING (auth.uid() = user_id);

-- 12. Policy: Users can delete their own file records
CREATE POLICY "Users can delete their own file records" 
ON public.uploaded_files 
FOR DELETE 
USING (auth.uid() = user_id);

-- 13. Create an index for better query performance
CREATE INDEX IF NOT EXISTS idx_uploaded_files_user_id ON public.uploaded_files(user_id);
CREATE INDEX IF NOT EXISTS idx_uploaded_files_upload_date ON public.uploaded_files(upload_date);

-- Verification queries (optional - run these to check if everything is set up correctly)
-- SELECT * FROM storage.buckets WHERE id = 'student-uploads';
-- SELECT * FROM public.uploaded_files LIMIT 5;