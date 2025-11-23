import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error("Missing Supabase environment variables!");
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);


const SUPABASE_URL_TWO = process.env.REACT_APP_SUPABASE_URL_TWO;
const SUPABASE_ANON_TWO = process.env.REACT_APP_SUPABASE_ANON_KEY_TWO;

if (!SUPABASE_URL_TWO || !SUPABASE_ANON_TWO) {
  throw new Error("Missing Supabase environment variables!");
}

export const supabase_two = createClient(SUPABASE_URL_TWO, SUPABASE_ANON_TWO);