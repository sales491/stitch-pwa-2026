'use client';

import { useMemo } from 'react';
import { createClient } from '@/utils/supabase/client';

/**
 * Returns a memoized Supabase browser client.
 * 
 * Use this instead of calling `createClient()` directly inside components.
 * Without memoization, `createClient()` returns a new object reference on every
 * render, which can trigger infinite useEffect loops if the client is used as a
 * dependency or passed to effects that depend on referential equality.
 * 
 * @example
 * function MyComponent() {
 *   const supabase = useSupabase();
 *   useEffect(() => { ... }, [supabase]); // stable — won't re-trigger
 * }
 */
export function useSupabase() {
    return useMemo(() => createClient(), []);
}
