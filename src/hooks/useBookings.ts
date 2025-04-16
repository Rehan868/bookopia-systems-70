
import { useState, useEffect } from 'react';

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
    // Simulate API call with a delay
    const fetchData = async () => {
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        setData(mockBookings);
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
