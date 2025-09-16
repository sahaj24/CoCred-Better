-- Fix for RSA Policy Violation when adding activities
-- This adds the missing INSERT policy for students on the certificates table
-- Run this in your Supabase SQL editor to fix the issue

-- Add INSERT policy for students to insert their own certificates
CREATE POLICY certificate_student_insert ON public.certificates
  FOR INSERT WITH CHECK ( auth.uid() = (
    SELECT user_id FROM public.students s WHERE s.id = student_id
  ));