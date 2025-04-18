
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchProperties, createProperty } from '@/services/api';
import { useToast } from './use-toast';
import { Property } from '@/services/supabase-types';
import { supabase } from '@/integrations/supabase/client';
import { useEffect } from 'react';

export const useProperties = () => {
  const queryClient = useQueryClient();
  const query = useQuery({
    queryKey: ['properties'],
    queryFn: fetchProperties
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
          table: 'properties'
        },
        () => {
          console.log('Properties table changed, invalidating query cache');
          queryClient.invalidateQueries({ queryKey: ['properties'] });
        }
      )
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
  
  return query;
};

export const useCreateProperty = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (propertyData: Omit<Property, 'id' | 'created_at' | 'updated_at'>) => {
      return createProperty(propertyData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
      toast({
        title: 'Property created',
        description: 'The property has been created successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to create property',
        description: error.message,
        variant: 'destructive',
      });
    }
  });
};
