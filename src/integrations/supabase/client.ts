
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://bpsvtzimgfbqmtwujubm.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJwc3Z0emltZ2ZicW10d3VqdWJtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYzNDQ1OTIsImV4cCI6MjA2MTkyMDU5Mn0.Lg3gP-diib2NdOV5-RfQyV_wGVYh08oX2RoYTfGcdBI";

// Configure the Supabase client with auth settings
export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    storage: localStorage
  }
});
