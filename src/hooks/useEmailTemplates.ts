
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchEmailTemplates, createEmailTemplate } from '@/services/api';
import { useToast } from './use-toast';

export const useEmailTemplates = () => {
  return useQuery({
    queryKey: ['email-templates'],
    queryFn: fetchEmailTemplates
  });
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
    mutationFn: (templateData: any) => {
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
