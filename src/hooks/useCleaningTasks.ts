
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchCleaningTasks, updateCleaningTaskStatus, createCleaningTask } from '@/services/api';
import { useToast } from './use-toast';
import { CleaningTask } from '@/services/supabase-types';
import { supabase } from '@/integrations/supabase/client';
import { useEffect } from 'react';

export const useCleaningTasks = () => {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ['cleaning-tasks'],
    queryFn: fetchCleaningTasks
  });
  
  // Set up realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel('table-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'cleaning_tasks'
        },
        () => {
          console.log('Cleaning tasks table changed, invalidating query cache');
          queryClient.invalidateQueries({ queryKey: ['cleaning-tasks'] });
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
  
  return query;
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
