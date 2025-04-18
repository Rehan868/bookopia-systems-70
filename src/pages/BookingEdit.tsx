
import React from 'react';
import { useParams } from 'react-router-dom';
import { AddEditBookingForm } from '@/components/bookings/AddEditBookingForm';

const BookingEdit = () => {
  const { id } = useParams<{ id: string }>();
  
  // In a real app, the booking data would be fetched using the ID
  console.log('Editing booking with ID:', id);
  
  // Mocked data for an existing booking
  const bookingData = {
    reference: 'BK-2023-0012',
    guestName: 'John Smith',
    guestEmail: 'john.smith@example.com',
    guestPhone: '+1 (555) 123-4567',
    property: 'Marina Tower',
    roomNumber: '101',
    checkIn: new Date('2023-11-18'),
    checkOut: new Date('2023-11-21'),
    adults: 2,
    children: 0,
    baseRate: 150,
    totalAmount: 450,
    notes: 'Guest requested a high floor with ocean view. Prefers quiet room away from elevator.',
    status: 'confirmed',
    paymentStatus: 'paid',
    sendConfirmation: true,
  };
  
  return <AddEditBookingForm mode="edit" bookingData={bookingData} />;
};

export default BookingEdit;
