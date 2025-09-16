import { supabase } from './supabase';

/**
 * Generate a random 6-character alphanumeric code (uppercase)
 */
export function generateClassCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

/**
 * Fetch the faculty row for current user or create one (with classroom)
 * Returns the class_code string
 */
export async function createOrGetFacultyClassCode(userId: string) {
  // First, try to find an existing faculty row
  const { data: existingFaculty, error: fetchErr } = await supabase
    .from('faculty')
    .select('id, class_code')
    .eq('user_id', userId)
    .maybeSingle();

  if (fetchErr) throw fetchErr;
  if (existingFaculty) {
    if (existingFaculty.class_code) return existingFaculty.class_code;
    // Faculty row exists but no class code – generate and update
    let classCode = generateClassCode();
    while (true) {
      const { count } = await supabase
        .from('faculty')
        .select('id', { count: 'exact', head: true })
        .eq('class_code', classCode);
      if ((count ?? 0) === 0) break;
      classCode = generateClassCode();
    }
    const { error: upErr } = await supabase
      .from('faculty')
      .update({ class_code: classCode })
      .eq('id', existingFaculty.id);
    if (upErr) throw upErr;

    // Ensure classroom row exists
    await supabase.from('classrooms').insert({ faculty_id: existingFaculty.id, class_code: classCode });
    return classCode;
  }

  // No row found – generate unique code and insert
  let classCode = generateClassCode();
  // Ensure code is unique by checking table
  // (In extremely rare collision, regenerate)
  // eslint-disable-next-line no-await-in-loop
  while (true) {
    const { count } = await supabase
      .from('faculty')
      .select('id', { count: 'exact', head: true })
      .eq('class_code', classCode);
    if ((count ?? 0) === 0) break;
    classCode = generateClassCode();
  }

  // Insert into faculty table
  const { data: newFaculty, error: insertErr } = await supabase
    .from('faculty')
    .insert({ user_id: userId, class_code: classCode })
    .select('id, class_code')
    .single();
  if (insertErr) throw insertErr;

  // Insert classroom row mirroring faculty (optional but keeps schema consistent)
  await supabase
    .from('classrooms')
    .insert({ faculty_id: newFaculty.id, class_code: classCode });

  return newFaculty.class_code;
}

/**
 * Add the current user into students table for a given class code.
 * Creates the student row if it doesn't exist yet.
 */
export async function joinClassByCode(params: {
  userId: string;
  fullName: string;
  collegeId?: string;
  phoneNumber?: string;
  classCode: string;
}) {
  const { userId, fullName, collegeId, phoneNumber, classCode } = params;

  // Verify classroom exists
  const { data: classroom, error: classErr } = await supabase
    .from('classrooms')
    .select('id')
    .eq('class_code', classCode)
    .maybeSingle();
  if (classErr) throw classErr;
  if (!classroom) throw new Error('Invalid class code');

  // Check if student already exists
  const { data: existingStudent, error: studentFetchErr } = await supabase
    .from('students')
    .select('id')
    .eq('user_id', userId)
    .maybeSingle();
  if (studentFetchErr) throw studentFetchErr;
  if (existingStudent) return existingStudent.id;

  // Create student row
  const { data: newStudent, error: insertErr } = await supabase
    .from('students')
    .insert({
      user_id: userId,
      full_name: fullName,
      college_id: collegeId,
      phone_number: phoneNumber,
      class_code: classCode,
    })
    .select('id')
    .single();
  if (insertErr) throw insertErr;

  // Increment faculty.student_count (optional)
  try {
    await supabase.rpc('increment_student_count', { p_class_code: classCode });
  } catch (_) {
    // Function might not exist; ignore
  }

  return newStudent.id;
}
