
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchEmailTemplates, createEmailTemplate } from '@/services/api';
import { useToast } from './use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useEffect } from 'react';
import { EmailTemplate } from '@/services/supabase-types';

export const useEmailTemplates = () => {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ['email-templates'],
    queryFn: fetchEmailTemplates
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
          table: 'email_templates'
        },
        () => {
          console.log('Email templates table changed, invalidating query cache');
          queryClient.invalidateQueries({ queryKey: ['email-templates'] });
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
  
  return query;
};

export const useEmailTemplate = (id: string) => {
  return useQuery({
    queryKey: ['email-template', id],
    queryFn: async () => {
      if (!id) throw new Error('Email Template ID is required');
      
      const templates = await fetchEmailTemplates();
      const template = templates.find(t => t.id === id);
      
      if (!template) {
        throw new Error(`Email Template with ID ${id} not found`);
      }
      
      return template;
    },
    enabled: !!id,
  });
};

export const useCreateEmailTemplate = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (templateData: Omit<EmailTemplate, 'id' | 'created_at' | 'updated_at'>) => {
      return createEmailTemplate(templateData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['email-templates'] });
      toast({
        title: 'Email Template created',
        description: 'The email template has been created successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to create email template',
        description: error.message,
        variant: 'destructive',
      });
    }
  });
};
