// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://omlippsflxidjbdsyjbo.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9tbGlwcHNmbHhpZGpiZHN5amJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIxOTY0ODYsImV4cCI6MjA1Nzc3MjQ4Nn0.fnzw4owURDInEckmp4CiBmS-dWRj5N3dS1Ui36DaIhI";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);