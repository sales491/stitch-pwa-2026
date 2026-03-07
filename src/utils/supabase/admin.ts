import { createClient } from '@supabase/supabase-js'

export async function createAdminClient() {
    // Using the service role key to bypass RLS for administrative actions.
    // Extremely dangerous to expose on client, only use this in Server Actions.
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
            auth: {
                persistSession: false,
                autoRefreshToken: false,
                detectSessionInUrl: false,
            }
        }
    )
}
