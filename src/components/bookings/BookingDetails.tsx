import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useBooking } from '@/hooks/useBookings';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader, FileIcon } from 'lucide-react';

export function BookingDetails() {
  const { id } = useParams<{ id: string }>();
  const { data: booking, isLoading, error } = useBooking(id || '');

  if (!id) {
    return <div className="p-6">No booking ID provided</div>;
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading booking details...</span>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <p className="text-red-500">Failed to load booking details</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => window.location.reload()}
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Booking Details</h1>
          <p className="text-muted-foreground">View booking information</p>
        </div>
        <Button asChild variant="outline">
          <Link to={`/bookings/${id}/edit`}>Edit Booking</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Guest Information */}
        <Card>
          <CardHeader>
            <CardTitle>Guest Information</CardTitle>
            <CardDescription>Guest details and documents</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-medium">Guest Name</h3>
              <p className="text-muted-foreground">{booking.guest_name}</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Booking Number</h3>
              <p className="text-muted-foreground">{booking.booking_number}</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Status</h3>
              <p className="text-muted-foreground">{booking.status}</p>
            </div>

            {/* Display Guest Document */}
            {booking.guestDocument && (
              <div className="mt-4">
                <h3 className="font-medium mb-2">Guest ID/Passport</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileIcon className="h-4 w-4" />
                  <span>{booking.guestDocument}</span>
                  <Button variant="outline" size="sm" asChild>
                    <a href={booking.guestDocument} target="_blank" rel="noopener noreferrer">
                      View Document
                    </a>
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        
        {/* Booking Details */}
        <Card>
          <CardHeader>
            <CardTitle>Booking Details</CardTitle>
            <CardDescription>Information about the booking</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <h3 className="font-medium">Room Number</h3>
              <p className="text-muted-foreground">{booking.rooms?.number}</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Property</h3>
              <p className="text-muted-foreground">{booking.rooms?.property}</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Check-in Date</h3>
              <p className="text-muted-foreground">{booking.check_in}</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Check-out Date</h3>
              <p className="text-muted-foreground">{booking.check_out}</p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Amount</h3>
              <p className="text-muted-foreground">${booking.amount}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
