import { createClient } from '@supabase/supabase-js';

const envUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseUrl = envUrl && envUrl.startsWith('http') ? envUrl : 'https://hvoubbgzntldqoxqyoij.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_yW2C8tVBgw3ynn510Jc6FQ_pHtwGg4v';

export const supabase = createClient(supabaseUrl, supabaseKey);
