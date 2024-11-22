import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://uftxluevyvvmnbdndgyr.supabase.co/';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;

export const supabaseServer = createClient(supabaseUrl, supabaseKey);
