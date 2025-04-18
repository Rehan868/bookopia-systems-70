
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
  
  return data || [];
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
  
  return data;
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
  
  return data || [];
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
  
  return data || [];
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

// Fixed the type for updateBookingStatus to use a proper enum type
export const updateBookingStatus = async (id: string, status: 'pending' | 'confirmed' | 'checked-in' | 'checked-out' | 'cancelled' | 'no-show'): Promise<void> => {
  const { error } = await supabase
    .from('bookings')
    .update({ status })
    .eq('id', id);
  
  if (error) {
    console.error(`Error updating booking status for ID ${id}:`, error);
    throw error;
  }
};

// Fixed the type for updateRoomStatus to use a proper enum type
export const updateRoomStatus = async (id: string, status: 'available' | 'occupied' | 'cleaning' | 'maintenance' | 'out-of-order'): Promise<void> => {
  const { error } = await supabase
    .from('rooms')
    .update({ status })
    .eq('id', id);
  
  if (error) {
    console.error(`Error updating room status for ID ${id}:`, error);
    throw error;
  }
};

// Fixed the type for updateCleaningTaskStatus to use a proper enum type
export const updateCleaningTaskStatus = async (id: string, status: 'pending' | 'in-progress' | 'completed' | 'verified' | 'issues'): Promise<void> => {
  const { error } = await supabase
    .from('cleaning_tasks')
    .update({ status })
    .eq('id', id);
  
  if (error) {
    console.error(`Error updating cleaning task status for ID ${id}:`, error);
    throw error;
  }
};

// Add functions for creating new data
export const createBooking = async (bookingData: Omit<Booking, 'id' | 'created_at' | 'updated_at'>): Promise<Booking> => {
  const { data, error } = await supabase
    .from('bookings')
    .insert(bookingData)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating booking:', error);
    throw error;
  }
  
  return data;
};

export const createRoom = async (roomData: Omit<Room, 'id' | 'created_at' | 'updated_at'>): Promise<Room> => {
  const { data, error } = await supabase
    .from('rooms')
    .insert(roomData)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating room:', error);
    throw error;
  }
  
  return data;
};

export const createExpense = async (expenseData: Omit<Expense, 'id' | 'created_at' | 'updated_at'>): Promise<Expense> => {
  const { data, error } = await supabase
    .from('expenses')
    .insert(expenseData)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating expense:', error);
    throw error;
  }
  
  return data;
};

export const createCleaningTask = async (taskData: Omit<CleaningTask, 'id' | 'created_at' | 'updated_at'>): Promise<CleaningTask> => {
  const { data, error } = await supabase
    .from('cleaning_tasks')
    .insert(taskData)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating cleaning task:', error);
    throw error;
  }
  
  return data;
};

export const createUser = async (userData: Omit<User, 'id' | 'created_at' | 'updated_at'>): Promise<User> => {
  const { data, error } = await supabase
    .from('users')
    .insert(userData)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating user:', error);
    throw error;
  }
  
  return data;
};

export const createOwner = async (ownerData: Omit<Owner, 'id' | 'created_at' | 'updated_at'>): Promise<Owner> => {
  const { data, error } = await supabase
    .from('owners')
    .insert(ownerData)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating owner:', error);
    throw error;
  }
  
  return data;
};

export const createProperty = async (propertyData: any): Promise<any> => {
  const { data, error } = await supabase
    .from('properties')
    .insert(propertyData)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating property:', error);
    throw error;
  }
  
  return data;
};

export const createEmailTemplate = async (templateData: any): Promise<any> => {
  const { data, error } = await supabase
    .from('email_templates')
    .insert(templateData)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating email template:', error);
    throw error;
  }
  
  return data;
};

export const fetchAuditLogs = async (): Promise<any[]> => {
  const { data, error } = await supabase
    .from('audit_logs')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching audit logs:', error);
    throw error;
  }
  
  return data || [];
};

export const fetchEmailTemplates = async (): Promise<any[]> => {
  const { data, error } = await supabase
    .from('email_templates')
    .select('*');
  
  if (error) {
    console.error('Error fetching email templates:', error);
    throw error;
  }
  
  return data || [];
};

export const fetchProperties = async (): Promise<any[]> => {
  const { data, error } = await supabase
    .from('properties')
    .select('*');
  
  if (error) {
    console.error('Error fetching properties:', error);
    throw error;
  }
  
  return data || [];
};

// Function to update an existing booking
export const updateBooking = async (id: string, bookingData: Partial<Booking>): Promise<void> => {
  const { error } = await supabase
    .from('bookings')
    .update(bookingData)
    .eq('id', id);
  
  if (error) {
    console.error(`Error updating booking with ID ${id}:`, error);
    throw error;
  }
};

// Function to update an existing room
export const updateRoom = async (id: string, roomData: Partial<Room>): Promise<void> => {
  const { error } = await supabase
    .from('rooms')
    .update(roomData)
    .eq('id', id);
  
  if (error) {
    console.error(`Error updating room with ID ${id}:`, error);
    throw error;
  }
};

// Function to update an existing expense
export const updateExpense = async (id: string, expenseData: Partial<Expense>): Promise<void> => {
  const { error } = await supabase
    .from('expenses')
    .update(expenseData)
    .eq('id', id);
  
  if (error) {
    console.error(`Error updating expense with ID ${id}:`, error);
    throw error;
  }
};

// Function to update an existing user
export const updateUser = async (id: string, userData: Partial<User>): Promise<void> => {
  const { error } = await supabase
    .from('users')
    .update(userData)
    .eq('id', id);
  
  if (error) {
    console.error(`Error updating user with ID ${id}:`, error);
    throw error;
  }
};

// Function to update an existing owner
export const updateOwner = async (id: string, ownerData: Partial<Owner>): Promise<void> => {
  const { error } = await supabase
    .from('owners')
    .update(ownerData)
    .eq('id', id);
  
  if (error) {
    console.error(`Error updating owner with ID ${id}:`, error);
    throw error;
  }
};
