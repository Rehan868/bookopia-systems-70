
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchBookings, fetchBookingById, fetchTodayCheckins, fetchTodayCheckouts, createBooking, updateBooking, updateBookingStatus } from '@/services/api';
import { useToast } from './use-toast';
import { Booking } from '@/services/supabase-types';

export const useBookings = () => {
  return useQuery({
    queryKey: ['bookings'],
    queryFn: fetchBookings
  });
};

export const useBooking = (id: string) => {
  return useQuery({
    queryKey: ['booking', id],
    queryFn: () => fetchBookingById(id),
    enabled: !!id,
  });
};

export const useTodayCheckins = () => {
  return useQuery({
    queryKey: ['today-checkins'],
    queryFn: fetchTodayCheckins
  });
};

export const useTodayCheckouts = () => {
  return useQuery({
    queryKey: ['today-checkouts'],
    queryFn: fetchTodayCheckouts
  });
};

export const useCreateBooking = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: (bookingData: Omit<Booking, 'id' | 'created_at' | 'updated_at'>) => {
      return createBooking(bookingData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['today-checkins'] });
      queryClient.invalidateQueries({ queryKey: ['today-checkouts'] });
      toast({
        title: 'Booking created',
        description: 'The booking has been created successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to create booking',
        description: error.message,
        variant: 'destructive',
      });
    }
  });
};

export const useUpdateBooking = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: ({ id, bookingData }: { id: string, bookingData: Partial<Booking> }) => {
      return updateBooking(id, bookingData);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['booking', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['today-checkins'] });
      queryClient.invalidateQueries({ queryKey: ['today-checkouts'] });
      toast({
        title: 'Booking updated',
        description: 'The booking has been updated successfully',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to update booking',
        description: error.message,
        variant: 'destructive',
      });
    }
  });
};

export const useUpdateBookingStatus = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: ({ id, status }: { id: string, status: 'pending' | 'confirmed' | 'checked-in' | 'checked-out' | 'cancelled' | 'no-show' }) => {
      return updateBookingStatus(id, status);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['bookings'] });
      queryClient.invalidateQueries({ queryKey: ['booking', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['today-checkins'] });
      queryClient.invalidateQueries({ queryKey: ['today-checkouts'] });
      toast({
        title: 'Booking status updated',
        description: `The booking status has been updated to ${variables.status}`,
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Failed to update booking status',
        description: error.message,
        variant: 'destructive',
      });
    }
  });
};
