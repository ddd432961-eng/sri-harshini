import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from '@/types/database';

/**
 * Cookieless server client for reading public catalog data.
 * Uses the anon key — RLS still applies. Safe to call outside
 * a request lifecycle (e.g. during static generation) because
 * it does NOT call cookies().
 */
export function createReadClient() {
  return createSupabaseClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );
}

/**
 * Server-side Supabase client with cookie-based auth.
 * ONLY call this inside a Server Component, Route Handler,
 * or Server Action — anywhere within a valid Next.js request
 * lifecycle where `cookies()` is available.
 */
export function createClient() {
  const cookieStore = cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Server Component — safe to ignore
          }
        },
      },
    },
  );
}
