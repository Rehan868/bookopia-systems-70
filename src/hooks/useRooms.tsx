
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchRooms, fetchRoomById, fetchRoomByNumber, createRoom, updateRoom, updateRoomStatus } from '@/services/api';
import { useToast } from './use-toast';
import { Room } from '@/services/supabase-types';

export const useRooms = () => {
  return useQuery({
    queryKey: ['rooms'],
    queryFn: fetchRooms
  });
};

export const useRoom = (id: string) => {
  return useQuery({
    queryKey: ['room', id],
    queryFn: () => fetchRoomById(id),
    enabled: !!id,
  });
};

export const useRoomByNumber = (number: string) => {
  return useQuery({
    queryKey: ['room-by-number', number],
    queryFn: () => fetchRoomByNumber(number),
    enabled: !!number,
  });
};

export const useCreateRoom = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (roomData: Omit<Room, 'id' | 'created_at' | 'updated_at'>) => {
      return createRoom(roomData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      toast({
        title: 'Room created',
        description: 'The room has been created successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to create room',
        description: error.message,
        variant: 'destructive',
      });
    }
  });
};

export const useUpdateRoom = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: ({ id, roomData }: { id: string, roomData: Partial<Room> }) => {
      return updateRoom(id, roomData);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      queryClient.invalidateQueries({ queryKey: ['room', variables.id] });
      toast({
        title: 'Room updated',
        description: 'The room has been updated successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to update room',
        description: error.message,
        variant: 'destructive',
      });
    }
  });
};

export const useUpdateRoomStatus = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: ({ id, status }: { id: string, status: 'available' | 'occupied' | 'cleaning' | 'maintenance' | 'out-of-order' }) => {
      return updateRoomStatus(id, status);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      queryClient.invalidateQueries({ queryKey: ['room', variables.id] });
      toast({
        title: 'Room status updated',
        description: `The room status has been updated to ${variables.status}`,
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to update room status',
        description: error.message,
        variant: 'destructive',
      });
    }
  });
};
