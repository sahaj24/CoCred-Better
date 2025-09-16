# Manual Supabase Storage Setup Guide

Since storage policies require special permissions, you'll need to set up the storage bucket manually through the Supabase Dashboard.

## Step 1: Create Storage Bucket

1. **Go to Supabase Dashboard**
   - Open your Supabase project
   - Navigate to **Storage** → **Buckets**

2. **Create New Bucket**
   - Click **"New bucket"**
   - **Name**: `student-uploads`
   - **Public bucket**: ✅ **Check this box**
   - Click **"Create bucket"**

## Step 2: Set Up Bucket Policies

1. **Open Bucket Settings**
   - Click on the `student-uploads` bucket
   - Go to **"Policies"** tab
   - Click **"New Policy"**

2. **Create INSERT Policy (Upload)**
   - **Policy name**: `Users can upload their own files`
   - **Allowed operation**: `INSERT`
   - **Target roles**: `authenticated`
   - **USING expression**: 
   ```sql
   bucket_id = 'student-uploads' AND auth.uid()::text = (storage.foldername(name))[1]
   ```

3. **Create SELECT Policy (View)**
   - **Policy name**: `Users can view their own files`
   - **Allowed operation**: `SELECT`
   - **Target roles**: `authenticated`
   - **USING expression**:
   ```sql
   bucket_id = 'student-uploads' AND auth.uid()::text = (storage.foldername(name))[1]
   ```

4. **Create DELETE Policy (Delete)**
   - **Policy name**: `Users can delete their own files`
   - **Allowed operation**: `DELETE`
   - **Target roles**: `authenticated`
   - **USING expression**:
   ```sql
   bucket_id = 'student-uploads' AND auth.uid()::text = (storage.foldername(name))[1]
   ```

## Step 3: Run the SQL Script

Now you can run the updated `supabase_storage_setup.sql` script in the SQL Editor to create the metadata table.

## ✅ That's it!

Your file upload system will be fully functional after completing these steps. The policies ensure that each user can only access files in their own folder (organized by user ID).

## File Organization Structure:
```
student-uploads/
├── user-id-1/
│   ├── document1.pdf
│   └── image1.jpg
├── user-id-2/
│   ├── certificate.pdf
│   └── report.docx
```