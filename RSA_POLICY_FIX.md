# RSA Policy Violation Fix

## Problem
When students try to add new activities in the student portal, they encounter an RSA policy violation error. This happens because the database is missing an INSERT policy for students on the `certificates` table.

## Root Cause
The Row Level Security (RLS) policies in the `supabase_classroom_schema.sql` file included SELECT and UPDATE policies for the `certificates` table, but was missing the INSERT policy that allows students to create their own certificate records.

## Solution
Run the following SQL command in your Supabase SQL editor to add the missing policy:

```sql
-- Add INSERT policy for students to insert their own certificates
CREATE POLICY certificate_student_insert ON public.certificates
  FOR INSERT WITH CHECK ( auth.uid() = (
    SELECT user_id FROM public.students s WHERE s.id = student_id
  ));
```

## How to Apply the Fix

1. Log into your Supabase dashboard
2. Go to the SQL Editor
3. Run the SQL command above, or execute the `fix_certificate_insert_policy.sql` file
4. Test the student portal by trying to add a new activity

## Verification
After applying the fix, students should be able to:
- Add new activities without getting RSA policy violations
- See their activities appear in the dashboard
- Have their activities properly saved with "pending" status

## Files Modified
- `supabase_classroom_schema.sql` - Updated to include the missing INSERT policy
- `fix_certificate_insert_policy.sql` - New migration script to apply the fix