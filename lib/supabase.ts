import { createClient } from "@supabase/supabase-js";

// These come from your .env.local
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;

/**
 * Client for making calls to Supabase from your app.
 * Safe to use in server components and API routes.
 * In the browser, it's also safe as long as Row Level Security (RLS) is enabled
 * and you've defined proper policies in Supabase.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);