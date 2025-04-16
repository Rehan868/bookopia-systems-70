
import { useState, useEffect } from 'react';

// Mock data for rooms
const mockRooms = [
  {
    id: '1',
    number: '101',
    name: 'Ocean View Suite',
    property: 'Marina Tower',
    type: 'Suite',
    capacity: 2,
    status: 'available',
    rate: 150
  },
  {
    id: '2',
    number: '102',
    name: 'Garden View Suite',
    property: 'Marina Tower',
    type: 'Suite',
    capacity: 2,
    status: 'occupied',
    rate: 120
  },
  {
    id: '3',
    number: '201',
    name: 'Deluxe Room',
    property: 'Marina Tower',
    type: 'Standard',
    capacity: 2,
    status: 'cleaning',
    rate: 100
  },
  {
    id: '4',
    number: '301',
    name: 'Family Suite',
    property: 'Downtown Heights',
    type: 'Suite',
    capacity: 4,
    status: 'available',
    rate: 180
  },
  {
    id: '5',
    number: '302',
    name: 'Executive Suite',
    property: 'Downtown Heights',
    type: 'Executive',
    capacity: 2,
    status: 'maintenance',
    rate: 200
  },
];

export function useRooms() {
  const [data, setData] = useState<any[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    // Simulate API call with a delay
    const fetchData = async () => {
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));
        setData(mockRooms);
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
