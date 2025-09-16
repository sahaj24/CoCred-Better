import { supabase } from './supabase';
import { joinClassByCode } from './classroom';

export type CertificateStatus = 'pending' | 'approved' | 'rejected';

export interface CertificateRow {
  id: string;
  student_id: string;
  class_code: string;
  file_path: string;
  public_url: string;
  issued_name: string;
  status: CertificateStatus;
  uploaded_at: string;
}

/**
 * Insert a certificate row for the given student.
 */
export async function addCertificate(params: {
  studentId: string;
  classCode: string;
  filePath: string;
  publicUrl: string;
  issuedName: string;
}): Promise<CertificateRow> {
  const { data, error } = await supabase
    .from('certificates')
    .insert({
      student_id: params.studentId,
      class_code: params.classCode,
      file_path: params.filePath,
      public_url: params.publicUrl,
      issued_name: params.issuedName,
      status: 'pending',
    })
    .select('*')
    .single();
  if (error) throw error;
  return data as CertificateRow;
}

/**
 * List certificates for the current student user (by auth UID)
 */
export async function listStudentCertificates(userId: string): Promise<CertificateRow[]> {
  // find student row
  const { data: student, error } = await supabase
    .from('students')
    .select('id')
    .eq('user_id', userId)
    .maybeSingle();
  if (error) throw error;
  if (!student) return [];

  const { data: certs, error: certErr } = await supabase
    .from('certificates')
    .select('*')
    .eq('student_id', student.id)
    .order('uploaded_at', { ascending: false });
  if (certErr) throw certErr;
  return certs as CertificateRow[];
}

/**
 * Faculty: list pending certificates for their class.
 */
export async function listFacultyPendingCertificates(userId: string): Promise<CertificateRow[]> {
  const { data: faculty, error } = await supabase
    .from('faculty')
    .select('class_code')
    .eq('user_id', userId)
    .maybeSingle();
  if (error) throw error;
  if (!faculty) return [];

  const { data: certs, error: certErr } = await supabase
    .from('certificates')
    .select('*')
    .eq('class_code', faculty.class_code)
    .eq('status', 'pending')
    .order('uploaded_at', { ascending: false });
  if (certErr) throw certErr;
  return certs as CertificateRow[];
}

/**
 * Faculty updates certificate status.
 */
export async function updateCertificateStatus(certId: string, status: CertificateStatus) {
  const { error } = await supabase
    .from('certificates')
    .update({ status })
    .eq('id', certId);
  if (error) throw error;
}
