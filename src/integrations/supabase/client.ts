// This file is updated to fix the Auth Lock issue.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    // এখানে storage: localStorage সরিয়ে দিন অথবা ডিফল্ট থাকতে দিন। 
    // Supabase এখন অটোমেটিক সেরা স্টোরেজটি বেছে নেয়।
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    // এই অপশনটি লক রিলিজ করতে সাহায্য করে
    storageKey: 'voboghure-auth-token', 
  }
});