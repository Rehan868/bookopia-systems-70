import { supabase } from "@/integrations/supabase/client";
import { 
  Room, 
  Booking, 
  User, 
  Owner, 
  Expense, 
  CleaningTask,
  PropertyOwnership
} from './supabase-types';

export const fetchRooms = async (): Promise<Room[]> => {
  const { data, error } = await supabase
    .from('rooms')
    .select('*');
  
  if (error) {
    console.error('Error fetching rooms:', error);
    throw error;
  }
  
  return (data || []).map(room => ({
    ...room,
    status: room.status as 'available' | 'occupied' | 'maintenance'
  })) as Room[];
};

export const fetchRoomById = async (id: string): Promise<Room> => {
  const { data, error } = await supabase
    .from('rooms')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error(`Error fetching room with ID ${id}:`, error);
    throw error;
  }
  
  return {
    ...data,
    status: data.status as 'available' | 'occupied' | 'maintenance'
  } as Room;
};

export const fetchRoomByNumber = async (number: string): Promise<Room> => {
  const { data, error } = await supabase
    .from('rooms')
    .select('*')
    .eq('number', number)
    .single();
  
  if (error) {
    console.error(`Error fetching room with number ${number}:`, error);
    throw error;
  }
  
  return {
    ...data,
    status: data.status as 'available' | 'occupied' | 'maintenance'
  } as Room;
};

export const fetchBookings = async (): Promise<Booking[]> => {
  const { data, error } = await supabase
    .from('bookings')
    .select('*, rooms(number, property:type)');
  
  if (error) {
    console.error('Error fetching bookings:', error);
    throw error;
  }
  
  const transformedData = (data || []).map(booking => {
    const enhancedBooking = {
      ...booking,
      commission: booking.commission || Number(booking.amount) * 0.1,
      tourismFee: booking.tourismFee || Number(booking.amount) * 0.03,
      vat: booking.vat || Number(booking.amount) * 0.05,
      netToOwner: booking.netToOwner || Number(booking.amount) * 0.82,
      securityDeposit: booking.securityDeposit || 100,
      baseRate: booking.baseRate || Number(booking.amount) * 0.8,
      adults: booking.adults || 1,
      children: booking.children || 0,
      guestEmail: booking.guestEmail || '',
      guestPhone: booking.guestPhone || '',
      guestDocument: booking.guestDocument || '',
      amountPaid: booking.amountPaid || 0,
      pendingAmount: booking.pendingAmount || booking.amount
    };
    return enhancedBooking as unknown as Booking;
  });
  
  return transformedData;
};

export const fetchBookingById = async (id: string): Promise<Booking> => {
  const { data, error } = await supabase
    .from('bookings')
    .select('*, rooms(number, property:type)')
    .eq('id', id)
    .single();
  
  if (error) {
    console.error(`Error fetching booking with ID ${id}:`, error);
    throw error;
  }
  
  const formattedData = {
    ...data,
    commission: data.commission || Number(data.amount) * 0.1,
    tourismFee: data.tourismFee || Number(data.amount) * 0.03,
    vat: data.vat || Number(data.amount) * 0.05,
    netToOwner: data.netToOwner || Number(data.amount) * 0.82,
    securityDeposit: data.securityDeposit || 100,
    baseRate: data.baseRate || Number(data.amount) * 0.8,
    adults: data.adults || 1,
    children: data.children || 0,
    guestEmail: data.guestEmail || '',
    guestPhone: data.guestPhone || '',
    guestDocument: data.guestDocument || '',
    amountPaid: data.amountPaid || 0,
    pendingAmount: data.pendingAmount || data.amount
  } as unknown as Booking;
  
  return formattedData;
};

export const fetchTodayCheckins = async (): Promise<Booking[]> => {
  const today = new Date().toISOString().split('T')[0];
  
  const { data, error } = await supabase
    .from('bookings')
    .select('*, rooms(number, property:type)')
    .eq('check_in', today)
    .eq('status', 'confirmed');
  
  if (error) {
    console.error('Error fetching today\'s check-ins:', error);
    throw error;
  }
  
  const transformedData = (data || []).map(booking => {
    const enhancedBooking = {
      ...booking,
      commission: booking.commission || Number(booking.amount) * 0.1,
      tourismFee: booking.tourismFee || Number(booking.amount) * 0.03,
      vat: booking.vat || Number(booking.amount) * 0.05,
      netToOwner: booking.netToOwner || Number(booking.amount) * 0.82,
      securityDeposit: booking.securityDeposit || 100,
      baseRate: booking.baseRate || Number(booking.amount) * 0.8,
      adults: booking.adults || 1,
      children: booking.children || 0,
      guestEmail: booking.guestEmail || '',
      guestPhone: booking.guestPhone || '',
      guestDocument: booking.guestDocument || '',
      amountPaid: booking.amountPaid || 0,
      pendingAmount: booking.pendingAmount || booking.amount
    };
    return enhancedBooking as unknown as Booking;
  });
  
  return transformedData;
};

export const fetchTodayCheckouts = async (): Promise<Booking[]> => {
  const today = new Date().toISOString().split('T')[0];
  
  const { data, error } = await supabase
    .from('bookings')
    .select('*, rooms(number, property:type)')
    .eq('check_out', today)
    .eq('status', 'checked-in');
  
  if (error) {
    console.error('Error fetching today\'s check-outs:', error);
    throw error;
  }
  
  const transformedData = (data || []).map(booking => {
    const enhancedBooking = {
      ...booking,
      commission: booking.commission || Number(booking.amount) * 0.1,
      tourismFee: booking.tourismFee || Number(booking.amount) * 0.03,
      vat: booking.vat || Number(booking.amount) * 0.05,
      netToOwner: booking.netToOwner || Number(booking.amount) * 0.82,
      securityDeposit: booking.securityDeposit || 100,
      baseRate: booking.baseRate || Number(booking.amount) * 0.8,
      adults: booking.adults || 1,
      children: booking.children || 0,
      guestEmail: booking.guestEmail || '',
      guestPhone: booking.guestPhone || '',
      guestDocument: booking.guestDocument || '',
      amountPaid: booking.amountPaid || 0,
      pendingAmount: booking.pendingAmount || booking.amount
    };
    return enhancedBooking as unknown as Booking;
  });
  
  return transformedData;
};

export const fetchUsers = async (): Promise<User[]> => {
  const { data, error } = await supabase
    .from('users')
    .select('*');
  
  if (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
  
  return data || [];
};

export const fetchOwners = async (): Promise<Owner[]> => {
  const { data, error } = await supabase
    .from('owners')
    .select('*');
  
  if (error) {
    console.error('Error fetching owners:', error);
    throw error;
  }
  
  return data || [];
};

export const fetchExpenses = async (): Promise<Expense[]> => {
  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .order('date', { ascending: false });
  
  if (error) {
    console.error('Error fetching expenses:', error);
    throw error;
  }
  
  return data || [];
};

export const fetchCleaningTasks = async (): Promise<CleaningTask[]> => {
  const { data, error } = await supabase
    .from('cleaning_tasks')
    .select('*, rooms(number, property:type), users(name)');
  
  if (error) {
    console.error('Error fetching cleaning tasks:', error);
    throw error;
  }
  
  return data || [];
};

export const fetchPropertyOwnership = async (): Promise<PropertyOwnership[]> => {
  const { data, error } = await supabase
    .from('property_ownership')
    .select('*, rooms(number), owners(name)');
  
  if (error) {
    console.error('Error fetching property ownership:', error);
    throw error;
  }
  
  return data || [];
};

export const updateBookingStatus = async (id: string, status: string): Promise<void> => {
  const validStatus = status as "pending" | "confirmed" | "checked-in" | "checked-out" | "cancelled" | "no-show";
  
  const { error } = await supabase
    .from('bookings')
    .update({ status: validStatus })
    .eq('id', id);
  
  if (error) {
    console.error(`Error updating booking status for ID ${id}:`, error);
    throw error;
  }
};

export const updateRoomStatus = async (id: string, status: string): Promise<void> => {
  const validStatus = status as "available" | "occupied" | "cleaning" | "maintenance" | "out-of-order";
  
  const { error } = await supabase
    .from('rooms')
    .update({ status: validStatus })
    .eq('id', id);
  
  if (error) {
    console.error(`Error updating room status for ID ${id}:`, error);
    throw error;
  }
};

export const updateCleaningTaskStatus = async (id: string, status: string): Promise<void> => {
  const validStatus = status as "pending" | "in-progress" | "completed" | "verified" | "issues";
  
  const { error } = await supabase
    .from('cleaning_tasks')
    .update({ status: validStatus })
    .eq('id', id);
  
  if (error) {
    console.error(`Error updating cleaning task status for ID ${id}:`, error);
    throw error;
  }
};
