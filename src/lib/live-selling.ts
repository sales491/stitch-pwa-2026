import { createClient } from '@/utils/supabase/server';

export interface LiveSellingEvent {
    id: string;
    seller_id: string;
    platform: 'TikTok' | 'Shopee' | 'Facebook' | 'YouTube' | 'Instagram';
    stream_link: string;
    title: string;
    scheduled_start: string;
    estimated_duration: number; // in minutes
    created_at: string;
    // Joined profile data
    profiles?: {
        full_name: string | null;
        avatar_url: string | null;
    };
}

/**
 * Fetches all live selling events that have not yet expired 
 * (scheduled_start + estimated_duration has not passed)
 * Separates them into 'liveNow' and 'upcoming'
 */
export async function getLiveSellingFeed() {
    const supabase = await createClient();

    // Fetch all events that were scheduled within the last 4 hours or in the future
    // We use a simple timestamp boundary: 4 hours ago. Let's say max duration is roughly 4 hours.
    // Realistically, we'll pull anything starting from the last 12 hours up to future,
    // and let Javascript do the precise filtering and sorting to avoid complex Postgrest syntax.
    
    // Calculate 12 hours ago
    const twelveHoursAgo = new Date();
    twelveHoursAgo.setHours(twelveHoursAgo.getHours() - 12);

    const { data: events, error } = await supabase
        .from('live_selling_events')
        .select(`
            *,
            profiles (full_name, avatar_url)
        `)
        .gte('scheduled_start', twelveHoursAgo.toISOString())
        .order('scheduled_start', { ascending: true })
        .returns<LiveSellingEvent[]>();

    if (error || !events) {
        console.error('Error fetching live selling events:', error);
        return { liveNow: [], upcoming: [] };
    }

    const now = new Date();
    const liveNow: LiveSellingEvent[] = [];
    const upcoming: LiveSellingEvent[] = [];

    events.forEach(event => {
        const startTime = new Date(event.scheduled_start);
        const endTime = new Date(startTime.getTime() + event.estimated_duration * 60000);

        if (now > endTime) {
            // Already ended, skip
            return;
        }

        // We consider someone "Live Now" from 15 minutes BEFORE the start time, until the endTime
        const streamActiveStart = new Date(startTime.getTime() - 15 * 60000);

        if (now >= streamActiveStart && now <= endTime) {
            liveNow.push(event);
        } else if (now < streamActiveStart) {
            upcoming.push(event);
        }
    });

    return { liveNow, upcoming };
}
