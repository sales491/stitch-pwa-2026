import { createClient } from '@/utils/supabase/server';
import { createAdminClient } from '@/utils/supabase/admin';
import ModerationQueue from '@/components/ModerationQueue';

export const dynamic = 'force-dynamic';

export default async function ModerationPage() {
    // Verify authentication first (will throw if not logged in)
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Unauthorized');

    // Use admin client to bypass RLS for sensitive queue data
    const adminSupabase = await createAdminClient();

    // ── 1. Community flags (all content types) ───────────────────────────────
    const { data: communityFlags } = await adminSupabase
        .from('content_flags')
        .select(`
            id,
            content_type,
            content_id,
            reason,
            details,
            created_at,
            resolved
        `)
        .or('resolved.is.null,resolved.eq.false')
        .order('created_at', { ascending: true });

    // ── 2. Pending new business profiles ────────────────────────────────────
    const { data: pendingBusinesses } = await adminSupabase
        .from('business_profiles')
        .select('id, name:business_name, category:business_type, town:location, description, created_at, owner_id, is_verified')
        .eq('verification_status', 'pending')
        .order('created_at', { ascending: true });

    // ── 3. Pending business claim requests ───────────────────────────────────
    const { data: claimRequests } = await adminSupabase
        .from('business_claim_requests')
        .select(`
            id,
            business_id,
            requester_name,
            requester_email,
            requester_phone,
            message,
            created_at,
            status,
            business:business_profiles!business_claim_requests_business_id_fkey (
                name:business_name,
                category:business_type,
                town:location
            )
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: true });

    return (
        <ModerationQueue
            communityFlags={(communityFlags as any) || []}
            pendingBusinesses={(pendingBusinesses as any) || []}
            claimRequests={(claimRequests as any) || []}
        />
    );
}
