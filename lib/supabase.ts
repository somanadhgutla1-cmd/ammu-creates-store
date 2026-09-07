import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xrsnfqielfdywwljemik.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhyc25mcWllbGZkeXd3bGplbWlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg2MDg6MDQ0MDA3M30.BglAXrOH4aQ78IBr_OTP5LpJSmXrSU8BLeP_SizoHQ4'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)