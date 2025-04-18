
import React from 'react';
import { useParams } from 'react-router-dom';
import { AddEditBookingForm } from '@/components/bookings/AddEditBookingForm';
import { useBooking } from '@/hooks/useBookings';

const BookingEdit = () => {
  const { id } = useParams<{ id: string }>();
  const { data: booking, isLoading, error } = useBooking(id || '');
  
  if (isLoading) {
    return <div>Loading booking details...</div>;
  }
  
  if (error || !booking) {
    return <div>Error loading booking details. Please try again.</div>;
  }
  
  // Transform the API data to match the form's expected format
  const bookingData = {
    reference: booking.booking_number,
    guestName: booking.guest_name,
    guestEmail: booking.guestEmail || '',
    guestPhone: booking.guestPhone || '',
    property: booking.property_id || '',
    roomNumber: booking.room_id,
    checkIn: new Date(booking.check_in),
    checkOut: new Date(booking.check_out),
    adults: booking.adults || 2,
    children: booking.children || 0,
    baseRate: booking.baseRate || 0,
    totalAmount: booking.amount,
    securityDeposit: booking.securityDeposit || 0,
    commission: booking.commission || 0,
    tourismFee: booking.tourismFee || 0,
    vat: booking.vat || 0,
    netToOwner: booking.netToOwner || 0,
    notes: booking.special_requests || '',
    status: booking.status,
    paymentStatus: booking.payment_status,
    sendConfirmation: false,
  };
  
  return <AddEditBookingForm mode="edit" bookingData={bookingData} />;
};

export default BookingEdit;
