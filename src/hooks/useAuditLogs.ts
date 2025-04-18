
import { useQuery } from '@tanstack/react-query';
import { fetchAuditLogs } from '@/services/api';
import { AuditLog } from '@/services/supabase-types';

export const useAuditLogs = () => {
  return useQuery<AuditLog[]>({
    queryKey: ['audit-logs'],
    queryFn: fetchAuditLogs
  });
};
