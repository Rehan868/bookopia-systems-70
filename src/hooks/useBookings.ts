
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Booking } from '@/services/supabase-types';

// Mock data for bookings
const mockBookings = [
  {
    id: '1',
    booking_number: 'BK-2023-0001',
    guest_name: 'John Smith',
    check_in: '2023-06-15',
    check_out: '2023-06-18',
    status: 'confirmed',
    amount: 450,
    rooms: { number: '101', property: 'Marina Tower' }
  },
  {
    id: '2',
    booking_number: 'BK-2023-0002',
    guest_name: 'Emma Johnson',
    check_in: '2023-06-14',
    check_out: '2023-06-16',
    status: 'checked-in',
    amount: 350,
    rooms: { number: '205', property: 'Downtown Heights' }
  },
  {
    id: '3',
    booking_number: 'BK-2023-0003',
    guest_name: 'Michael Chen',
    check_in: '2023-06-12',
    check_out: '2023-06-13',
    status: 'checked-out',
    amount: 175,
    rooms: { number: '304', property: 'Marina Tower' }
  },
  {
    id: '4',
    booking_number: 'BK-2023-0004',
    guest_name: 'Sarah Davis',
    check_in: '2023-06-18',
    check_out: '2023-06-20',
    status: 'confirmed',
    amount: 300,
    rooms: { number: '102', property: 'Downtown Heights' }
  },
  {
    id: '5',
    booking_number: 'BK-2023-0005',
    guest_name: 'David Wilson',
    check_in: '2023-06-10',
    check_out: '2023-06-15',
    status: 'checked-out',
    amount: 625,
    rooms: { number: '401', property: 'Marina Tower' }
  },
];

export function useBookings() {
  const [data, setData] = useState<any[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setIsLoading(true);
        
        // Try to fetch from Supabase first
        const { data: bookingsData, error: bookingsError } = await supabase
          .from('bookings')
          .select('*, rooms(number, property:type)');
          
        if (bookingsError) {
          console.warn('Error fetching from Supabase, using mock data:', bookingsError);
          // Fallback to mock data
          setData(mockBookings);
        } else if (bookingsData && bookingsData.length > 0) {
          setData(bookingsData);
        } else {
          // If Supabase returns empty data, use mock data
          setData(mockBookings);
        }
      } catch (err) {
        console.error('Error in useBookings:', err);
        setError(err);
        setData(mockBookings); // Fallback to mock data on error
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, []);

  return { data, isLoading, error };
}

// Hook for individual booking data
export function useBooking(id: string) {
  const [data, setData] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchBooking = async () => {
      if (!id) {
        setIsLoading(false);
        setError(new Error('No booking ID provided'));
        return;
      }
      
      try {
        setIsLoading(true);
        
        // Try to fetch from Supabase first
        const { data: bookingData, error: bookingError } = await supabase
          .from('bookings')
          .select('*, rooms(number, property:type)')
          .eq('id', id)
          .single();
          
        if (bookingError) {
          console.warn(`Error fetching booking ${id} from Supabase, using mock data:`, bookingError);
          // Fallback to mock data
          const booking = mockBookings.find(booking => booking.id === id);
          
          if (booking) {
            // Add financial details for the mock data
            const mockFinancialDetails = {
              baseRate: 150,
              commission: Number(booking.amount) * 0.1,
              tourismFee: Number(booking.amount) * 0.03,
              vat: Number(booking.amount) * 0.05,
              netToOwner: Number(booking.amount) * 0.82,
              securityDeposit: 100,
              guestEmail: 'guest@example.com',
              guestPhone: '+1 (555) 123-4567',
              special_requests: 'No special requests.',
              payment_status: 'paid'
            };
            
            setData({ ...booking, ...mockFinancialDetails });
          } else {
            throw new Error('Booking not found');
          }
        } else if (bookingData) {
          // Ensure all numeric fields are properly formatted
          // For real data that may not have all the financial fields, provide defaults
          const formattedData = {
            ...bookingData,
            amount: Number(bookingData.amount || 0),
            commission: Number(bookingData.commission || 0),
            tourismFee: Number(bookingData.tourismFee || 0),
            vat: Number(bookingData.vat || 0),
            netToOwner: Number(bookingData.netToOwner || 0),
            securityDeposit: Number(bookingData.securityDeposit || 0),
            baseRate: Number(bookingData.baseRate || 0),
            adults: Number(bookingData.adults || 0),
            children: Number(bookingData.children || 0)
          };
          
          setData(formattedData);
        } else {
          throw new Error('Booking not found');
        }
      } catch (err) {
        console.error(`Error in useBooking for ID ${id}:`, err);
        setError(err instanceof Error ? err : new Error('Failed to fetch booking'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchBooking();
  }, [id]);

  return { data, isLoading, error };
}

export function useTodayCheckins() {
  const [data, setData] = useState<any[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const today = new Date().toISOString().split('T')[0];
        const checkins = mockBookings.filter(
          booking => booking.check_in.split('T')[0] === today && booking.status === 'confirmed'
        );
        
        setData(checkins);
        setIsLoading(false);
      } catch (err) {
        setError(err);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, isLoading, error };
}

export function useTodayCheckouts() {
  const [data, setData] = useState<any[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const today = new Date().toISOString().split('T')[0];
        const checkouts = mockBookings.filter(
          booking => booking.check_out.split('T')[0] === today && booking.status === 'checked-in'
        );
        
        setData(checkouts);
        setIsLoading(false);
      } catch (err) {
        setError(err);
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, isLoading, error };
}
