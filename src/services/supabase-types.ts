export type Room = {
  id: string;
  number: string;
  type: string;
  capacity: number;
  rate: number;
  status: 'available' | 'occupied' | 'maintenance' | 'cleaning' | 'out-of-order';
  floor: string;
  description: string | null;
  amenities: string[];
  features: any;
  created_at: string;
  updated_at: string;
  property_id?: string; 
  property?: string; 
  maintenance?: boolean; 
  lastCleaned?: string; 
  nextCheckIn?: string | null; 
  room_type_id?: string;
};

export type Booking = {
  id: string;
  room_id: string;
  booking_number: string;
  guest_name: string;
  check_in: string;
  check_out: string;
  amount: number;
  status: 'pending' | 'confirmed' | 'checked-in' | 'checked-out' | 'cancelled' | 'no-show';
  payment_status: 'pending' | 'paid' | 'partial' | 'refunded' | 'failed';
  special_requests: string | null;
  created_at: string;
  updated_at: string;
  rooms?: any; 
  adults?: number;
  children?: number;
  guestEmail?: string;
  guestPhone?: string;
  guestDocument?: string;
  baseRate?: number;
  securityDeposit?: number;
  commission?: number;
  tourismFee?: number;
  vat?: number;
  netToOwner?: number;
  notes?: string;
  property_id?: string;
  guest_id?: string;
  created_by?: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'staff' | 'cleaner' | 'owner' | 'guest';
  status: string;
  avatar_url: string | null;
  last_active: string | null;
  created_at: string;
  updated_at: string;
  avatar?: string; // Added for compatibility with existing components
  lastActive?: string; // Added for compatibility with existing components
};

export type Owner = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  payment_info: any;
  created_at: string;
  updated_at: string;
};

export type Expense = {
  id: string;
  description: string;
  amount: number;
  date: string;
  category: string;
  payment_method: string;
  status: string;
  created_at: string;
  updated_at: string;
  property_id?: string;
  created_by?: string;
  property?: string; // Added for compatibility
  vendor?: string;   // Added for compatibility
  notes?: string;    // Added for compatibility
  paymentMethod?: string; // Added for compatibility with existing components
};

export type CleaningTask = {
  id: string;
  room_id: string;
  date: string;
  assigned_to: string;
  status: 'pending' | 'in-progress' | 'completed' | 'verified' | 'issues';
  notes: string | null;
  created_at: string;
  updated_at: string;
  property_id?: string;
};

export type PropertyOwnership = {
  id: string;
  room_id: string;
  owner_id: string;
  commission_rate: number;
  contract_start_date: string;
  contract_end_date: string | null;
  created_at: string;
  updated_at: string;
};

export type EmailTemplate = {
  id: string;
  name: string;
  subject: string;
  body: string;
  variables: any;
  property_id?: string;
  created_at: string;
  updated_at: string;
};

export type Property = {
  id: string;
  name: string;
  address: string;
  city: string;
  state?: string;
  country: string;
  postal_code?: string;
  phone?: string;
  email?: string;
  website?: string;
  tax_rate?: number;
  timezone?: string;
  check_in_time?: string;
  check_out_time?: string;
  created_at: string;
  updated_at: string;
};

export type AuditLog = {
  id: string;
  action: string;
  resource_type: string;
  resource_id: string;
  user_id: string;
  details: any;
  created_at: string;
  // Additional fields used in components
  user: string;
  ip_address?: string;
  type: string;
  timestamp: string;
};
