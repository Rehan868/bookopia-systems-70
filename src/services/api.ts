
import { supabase } from "@/integrations/supabase/client";
import { 
  Room, 
  Booking, 
  User, 
  Owner, 
  Expense, 
  CleaningTask,
  PropertyOwnership,
  Property,
  EmailTemplate,
  AuditLog
} from './supabase-types';

// Room related functions
export const fetchRooms = async (): Promise<Room[]> => {
  const { data, error } = await supabase
    .from('rooms')
    .select('*');
  
  if (error) {
    console.error('Error fetching rooms:', error);
    throw error;
  }
  
  return data as Room[];
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
  
  return data as Room;
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
  
  return data as Room;
};

// Booking related functions
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

// User related functions
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

// Owner related functions
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

// Expense related functions
export const fetchExpenses = async (): Promise<Expense[]> => {
  const { data, error } = await supabase
    .from('expenses')
    .select('*')
    .order('date', { ascending: false });
  
  if (error) {
    console.error('Error fetching expenses:', error);
    throw error;
  }
  
  return data as Expense[] || [];
};

// Cleaning tasks related functions
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

// Property ownership related functions
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

// Status update functions
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

// Create functions
export const createBooking = async (bookingData: Omit<Booking, 'id' | 'created_at' | 'updated_at'>): Promise<Booking> => {
  // Ensure payment_status is one of the allowed enum values
  const payload = {
    ...bookingData,
    payment_status: bookingData.payment_status || 'pending'
  };

  const { data, error } = await supabase
    .from('bookings')
    .insert(payload)
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
  // Map any custom fields to the database fields
  const dbExpense = {
    description: expenseData.description,
    amount: expenseData.amount,
    date: expenseData.date,
    category: expenseData.category,
    payment_method: expenseData.payment_method || expenseData.paymentMethod,
    status: expenseData.status,
    property_id: expenseData.property_id
  };

  const { data, error } = await supabase
    .from('expenses')
    .insert(dbExpense)
    .select()
    .single();
  
  if (error) {
    console.error('Error creating expense:', error);
    throw error;
  }
  
  return data;
};

export const createCleaningTask = async (taskData: Omit<CleaningTask, 'id' | 'created_at' | 'updated_at'>): Promise<CleaningTask> => {
  // Ensure status is one of the allowed enum values
  const payload = {
    ...taskData,
    status: taskData.status || 'pending'
  };

  const { data, error } = await supabase
    .from('cleaning_tasks')
    .insert(payload)
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

export const createProperty = async (propertyData: Omit<Property, 'id' | 'created_at' | 'updated_at'>): Promise<Property> => {
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

export const createEmailTemplate = async (templateData: Omit<EmailTemplate, 'id' | 'created_at' | 'updated_at'>): Promise<EmailTemplate> => {
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

export const fetchAuditLogs = async (): Promise<AuditLog[]> => {
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

export const fetchEmailTemplates = async (): Promise<EmailTemplate[]> => {
  const { data, error } = await supabase
    .from('email_templates')
    .select('*');
  
  if (error) {
    console.error('Error fetching email templates:', error);
    throw error;
  }
  
  return data || [];
};

export const fetchProperties = async (): Promise<Property[]> => {
  const { data, error } = await supabase
    .from('properties')
    .select('*');
  
  if (error) {
    console.error('Error fetching properties:', error);
    throw error;
  }
  
  return data || [];
};

// Update functions
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

export const updateExpense = async (id: string, expenseData: Partial<Expense>): Promise<void> => {
  // Map any custom fields to the database fields
  const dbExpense: any = { ...expenseData };
  
  if (expenseData.paymentMethod) {
    dbExpense.payment_method = expenseData.paymentMethod;
    delete dbExpense.paymentMethod;
  }

  const { error } = await supabase
    .from('expenses')
    .update(dbExpense)
    .eq('id', id);
  
  if (error) {
    console.error(`Error updating expense with ID ${id}:`, error);
    throw error;
  }
};

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
