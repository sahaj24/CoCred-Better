-- Supabase Schema for Classroom Management
-- -------------------------------------------------------------
-- This script creates four main tables: faculty, classrooms, students, certificates
-- It also sets up simple Row Level Security (RLS) policies so that:
-- 1.  Faculty can access their own classroom data and certificates belonging to their class.
-- 2.  Students can access their own student record and certificates that belong to them.
-- NOTE:  You MUST run this inside the Supabase SQL editor (or psql connected to the project).
--        Supabase already has the `auth.users` table for authentication.  We will reference that table via `user_id`.
-- -------------------------------------------------------------

-- Enable useful extensions --------------------------------------------------
CREATE EXTENSION IF NOT EXISTS pgcrypto; -- gen_random_uuid()

-- 1. FACULTY TABLE ----------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.faculty (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  class_code    text NOT NULL UNIQUE,                      -- 6-char alphanumeric code shown to students
  student_count integer NOT NULL DEFAULT 0,
  created_at    timestamptz NOT NULL DEFAULT now()
);

-- 2. CLASSROOMS TABLE -------------------------------------------------------
-- A faculty member can technically have only one classroom (per original spec),
-- but having a separate table keeps things extensible.
CREATE TABLE IF NOT EXISTS public.classrooms (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  faculty_id  uuid NOT NULL REFERENCES public.faculty(id) ON DELETE CASCADE,
  class_code  text NOT NULL UNIQUE,                       -- mirrors faculty.class_code
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- 3. STUDENTS TABLE ---------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.students (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name     text NOT NULL,
  phone_number  text,
  college_id    text,                                     -- college roll number / AAPAR ID
  class_code    text  REFERENCES public.classrooms(class_code), -- FK via code for convenience
  bucket_path   text,                                     -- S3/Supabase-storage folder (optional)
  created_at    timestamptz NOT NULL DEFAULT now()
);

-- 4. CERTIFICATES TABLE -----------------------------------------------------
CREATE TYPE public.certificate_status AS ENUM ('pending','approved','rejected');

CREATE TABLE IF NOT EXISTS public.certificates (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id    uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  class_code    text NOT NULL REFERENCES public.classrooms(class_code) ON DELETE CASCADE,
  file_path     text NOT NULL,                    -- Supabase storage path
  public_url    text NOT NULL,                    -- public URL to the file
  issued_name   text NOT NULL,                    -- certificate display name
  status        public.certificate_status NOT NULL DEFAULT 'pending',
  uploaded_at   timestamptz NOT NULL DEFAULT now()
);

-- Indexes -------------------------------------------------------------------
CREATE INDEX IF NOT EXISTS idx_students_class_code ON public.students(class_code);
CREATE INDEX IF NOT EXISTS idx_certificates_class_code ON public.certificates(class_code);
CREATE INDEX IF NOT EXISTS idx_certificates_student_id ON public.certificates(student_id);

-- Enable Row Level Security --------------------------------------------------
ALTER TABLE public.faculty      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classrooms   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

-- RLS Policies --------------------------------------------------------------
-- 1. FACULTY policies -------------------------------------------------------
-- Faculty can select & update their own row.
CREATE POLICY faculty_is_self_select ON public.faculty
  FOR SELECT USING ( auth.uid() = user_id );
CREATE POLICY faculty_is_self_update ON public.faculty
  FOR UPDATE USING ( auth.uid() = user_id );

-- Inserts are allowed by any authenticated user (will be faculty sign-up flow)
CREATE POLICY faculty_insert_self ON public.faculty
  FOR INSERT WITH CHECK ( auth.uid() = user_id );

-- 2. CLASSROOM policies -----------------------------------------------------
-- Faculty can manage the classroom they own.
CREATE POLICY classroom_faculty_select ON public.classrooms
  FOR SELECT USING ( auth.uid() = (SELECT user_id FROM public.faculty f WHERE f.id = faculty_id) );
CREATE POLICY classroom_faculty_update ON public.classrooms
  FOR UPDATE USING ( auth.uid() = (SELECT user_id FROM public.faculty f WHERE f.id = faculty_id) );
CREATE POLICY classroom_faculty_insert ON public.classrooms
  FOR INSERT WITH CHECK ( auth.uid() = (SELECT user_id FROM public.faculty f WHERE f.id = faculty_id) );

-- 3. STUDENTS policies ------------------------------------------------------
-- Student can see and update their own record
CREATE POLICY student_is_self_select ON public.students
  FOR SELECT USING ( auth.uid() = user_id );
CREATE POLICY student_is_self_update ON public.students
  FOR UPDATE USING ( auth.uid() = user_id );
-- Allow insert for authenticated user creating their own student row
CREATE POLICY student_insert_self ON public.students
  FOR INSERT WITH CHECK ( auth.uid() = user_id );

-- 4. CERTIFICATES policies --------------------------------------------------
-- Student can see certificates belonging to them
CREATE POLICY certificate_student_select ON public.certificates
  FOR SELECT USING ( auth.uid() = (
    SELECT user_id FROM public.students s WHERE s.id = student_id
  ));
-- Student can insert their own certificates
CREATE POLICY certificate_student_insert ON public.certificates
  FOR INSERT WITH CHECK ( auth.uid() = (
    SELECT user_id FROM public.students s WHERE s.id = student_id
  ));
-- Faculty can see certificates for their classroom
CREATE POLICY certificate_faculty_select ON public.certificates
  FOR SELECT USING (
    auth.uid() = (
      SELECT user_id FROM public.faculty f WHERE f.class_code = class_code
    )
  );
-- Faculty can update status of certificates in their classroom
CREATE POLICY certificate_faculty_update ON public.certificates
  FOR UPDATE USING (
    auth.uid() = (
      SELECT user_id FROM public.faculty f WHERE f.class_code = class_code
    )
  );

-- Done ----------------------------------------------------------------------
-- After running this script, your Supabase project will have the necessary
-- tables with RLS configured.  Next, wire up the front-end to use these tables.
