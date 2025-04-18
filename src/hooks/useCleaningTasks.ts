
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchCleaningTasks, updateCleaningTaskStatus, createCleaningTask } from '@/services/api';
import { useToast } from './use-toast';
import { CleaningTask } from '@/services/supabase-types';

export const useCleaningTasks = () => {
  return useQuery({
    queryKey: ['cleaning-tasks'],
    queryFn: fetchCleaningTasks
  });
};

export const useUpdateCleaningTaskStatus = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: 'pending' | 'in-progress' | 'completed' | 'verified' | 'issues' }) => {
      return updateCleaningTaskStatus(id, status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cleaning-tasks'] });
      toast({
        title: 'Cleaning task updated',
        description: 'The cleaning task status has been updated successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to update cleaning task',
        description: error.message,
        variant: 'destructive',
      });
    }
  });
};

export const useCreateCleaningTask = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (taskData: Omit<CleaningTask, 'id' | 'created_at' | 'updated_at'>) => {
      return createCleaningTask(taskData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cleaning-tasks'] });
      toast({
        title: 'Cleaning task created',
        description: 'The cleaning task has been created successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to create cleaning task',
        description: error.message,
        variant: 'destructive',
      });
    }
  });
};
