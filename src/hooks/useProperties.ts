
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchProperties, createProperty } from '@/services/api';
import { useToast } from './use-toast';

export const useProperties = () => {
  return useQuery({
    queryKey: ['properties'],
    queryFn: fetchProperties
  });
};

export const useProperty = (id: string) => {
  return useQuery({
    queryKey: ['property', id],
    queryFn: async () => {
      if (!id) throw new Error('Property ID is required');
      
      const properties = await fetchProperties();
      const property = properties.find(p => p.id === id);
      
      if (!property) {
        throw new Error(`Property with ID ${id} not found`);
      }
      
      return property;
    },
    enabled: !!id,
  });
};

export const useCreateProperty = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (propertyData: any) => {
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
