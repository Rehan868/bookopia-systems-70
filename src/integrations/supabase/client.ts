// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://fvftehqekggopyriamwy.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZ2ZnRlaHFla2dnb3B5cmlhbXd5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ3MzI2MzIsImV4cCI6MjA2MDMwODYzMn0.hZG2ep33dSXIrAxcoXFeEY1j7hQ30H-50WST9JuBcko";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);