import { createClient } from '@/utils/supabase/server';
import ModerationQueue from '@/components/ModerationQueue';

export const dynamic = 'force-dynamic';

export default async function ModerationPage() {
    const supabase = await createClient();

    // Fetch pending listings with seller profile info
    const { data: pendingListings, error } = await supabase
        .from('listings')
        .select(`
            id,
            title,
            description,
            price,
            price_value,
            category,
            town,
            images,
            created_at,
            status,
            user_id,
            seller:profiles!listings_user_id_fkey (
                full_name,
                avatar_url
            )
        `)
        .eq('status', 'pending')
        .order('created_at', { ascending: true }); // Oldest first (FIFO queue)

    if (error) {
        console.error('Error fetching pending listings:', error);
    }

    return <ModerationQueue listings={(pendingListings as any) || []} />;
}
