
import { useQuery } from '@tanstack/react-query';
import { fetchAuditLogs } from '@/services/api';

export const useAuditLogs = () => {
  return useQuery({
    queryKey: ['audit-logs'],
    queryFn: fetchAuditLogs
  });
};
