import { supabase } from './supabase';
// Certificate type for faculty dashboard
type Certificate = {
  id: string;
  name: string;
  type: string;
  status: 'pending' | 'approved' | 'rejected';
  date: string;
  student_name: string;
  student_email: string;
  class_code: string;
  file_url?: string;
  description?: string;
};

/**
 * Get all pending certificates for faculty review
 */
export async function getPendingCertificates(): Promise<Certificate[]> {
  try {
    console.log('Starting getPendingCertificates...');
    
    // Check if supabase client exists
    if (!supabase) {
      throw new Error('Supabase client not initialized');
    }
    
    console.log('Supabase client exists, attempting query...');
    
    // Try simple query first without joins
    const { data, error } = await supabase
      .from('certificates')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false });
    
    console.log('Query result:', { data, error });
    
    if (error) {
      console.error('Database error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      throw new Error(`Database query failed: ${error.message}`);
    }

    if (!data) {
      console.log('No data returned from query');
      return [];
    }
    
    console.log(`Found ${data.length} pending certificates`);

    const mappedData = data.map(cert => {
      console.log('Mapping certificate:', cert);
      return {
        id: cert.id,
        name: cert.name || 'Untitled Certificate',
        type: cert.type || 'certificate',
        status: (cert.status as 'pending' | 'approved' | 'rejected') || 'pending',
        date: cert.created_at || new Date().toISOString(),
        student_name: cert.student_name || 'Unknown Student',
        student_email: cert.student_email || '',
        class_code: cert.class_code || '',
        file_url: cert.file_url,
        description: cert.description
      };
    });
    
    console.log('Mapped data:', mappedData);
    return mappedData;
  } catch (error) {
    console.error('Error fetching pending certificates:', error);
    console.error('Error type:', typeof error);
    console.error('Error constructor:', error?.constructor?.name);
    
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    throw error;
  }
}

/**
 * Get certificate statistics for faculty dashboard
 */
export async function getCertificateStats() {
  try {
    const { data: pending, error: pendingError } = await supabase
      .from('certificates')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'pending');

    const { data: approved, error: approvedError } = await supabase
      .from('certificates')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'approved');

    const { data: rejected, error: rejectedError } = await supabase
      .from('certificates')
      .select('id', { count: 'exact', head: true })
      .eq('status', 'rejected');

    if (pendingError || approvedError || rejectedError) {
      throw pendingError || approvedError || rejectedError;
    }

    const pendingCount = (pending as any)?.count || 0;
    const approvedCount = (approved as any)?.count || 0;
    const rejectedCount = (rejected as any)?.count || 0;
    
    return {
      pending: pendingCount,
      approved: approvedCount,
      rejected: rejectedCount,
      total: pendingCount + approvedCount + rejectedCount
    };
  } catch (error) {
    console.error('Error fetching certificate stats:', error);
    throw error;
  }
}

/**
 * Approve or reject a certificate
 */
export async function updateCertificateStatus(
  certificateId: string, 
  status: 'approved' | 'rejected',
  // feedback is accepted but ignored unless column exists
  _feedback?: string
): Promise<void> {
  try {
    // Update only the status column to match DB schema and avoid unknown columns
    const updatePayload = { status };

    const { error } = await supabase
      .from('certificates')
      .update(updatePayload)
      .eq('id', certificateId);

    if (error) {
      console.error('Supabase update error message:', error.message);
      console.error('Supabase update error details:', error.details);
      console.error('Supabase update error hint:', error.hint);
      throw error;
    }
    console.log('Certificate status updated successfully');
  } catch (error) {
    console.error('Error updating certificate status:', error);
    throw error;
  }
}
