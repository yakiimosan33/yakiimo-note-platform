import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  
  if (!supabaseUrl || !supabaseAnonKey) {
    // During build time, return a dummy client to prevent errors
    if (typeof window === 'undefined') {
      console.warn('Supabase environment variables not set during build')
      return createBrowserClient('https://dummy.supabase.co', 'dummy-key')
    }
    throw new Error(
      'Missing Supabase environment variables. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your environment variables.'
    )
  }
  
  return createBrowserClient(supabaseUrl, supabaseAnonKey)
}