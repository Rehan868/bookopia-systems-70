
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchOwners, createOwner, updateOwner } from '@/services/api';
import { useToast } from './use-toast';
import { Owner } from '@/services/supabase-types';

export interface OwnerExtended extends Owner {
  properties: number;
  revenue: number;
  occupancy: number;
  avatar?: string;
  paymentDetails: {
    bank: string;
    accountNumber: string;
    routingNumber: string;
  };
  joinedDate: string;
}

export const useOwners = () => {
  return useQuery({
    queryKey: ['owners'],
    queryFn: async () => {
      const owners = await fetchOwners();
      
      // Map database owners to the extended interface
      // In a real app, you would fetch this additional data from the database
      return owners.map(owner => ({
        ...owner,
        properties: 2, // Mock data
        revenue: 15000, // Mock data
        occupancy: 85, // Mock data
        avatar: undefined,
        paymentDetails: {
          bank: 'Sample Bank',
          accountNumber: '****4567',
          routingNumber: '****1234'
        },
        joinedDate: new Date().toISOString().split('T')[0]
      })) as OwnerExtended[];
    }
  });
};

export const useOwner = (id: string) => {
  return useQuery({
    queryKey: ['owner', id],
    queryFn: async () => {
      if (!id) throw new Error('Owner ID is required');
      
      const owners = await fetchOwners();
      const owner = owners.find(o => o.id === id);
      
      if (!owner) {
        throw new Error(`Owner with ID ${id} not found`);
      }
      
      // Map to the extended interface
      return {
        ...owner,
        properties: 2, // Mock data
        revenue: 15000, // Mock data
        occupancy: 85, // Mock data
        avatar: undefined,
        paymentDetails: {
          bank: 'Sample Bank',
          accountNumber: '****4567',
          routingNumber: '****1234'
        },
        joinedDate: new Date().toISOString().split('T')[0]
      } as OwnerExtended;
    },
    enabled: !!id,
  });
};

export const useCreateOwner = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (ownerData: Omit<Owner, 'id' | 'created_at' | 'updated_at'>) => {
      return createOwner(ownerData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['owners'] });
      toast({
        title: 'Owner created',
        description: 'The owner has been created successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to create owner',
        description: error.message,
        variant: 'destructive',
      });
    }
  });
};

export const useUpdateOwner = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: ({ id, ownerData }: { id: string, ownerData: Partial<Owner> }) => {
      return updateOwner(id, ownerData);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['owners'] });
      queryClient.invalidateQueries({ queryKey: ['owner', variables.id] });
      toast({
        title: 'Owner updated',
        description: 'The owner has been updated successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to update owner',
        description: error.message,
        variant: 'destructive',
      });
    }
  });
};
