import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { HubItem } from '@/data/hub-items';

// Use a plain anon client — no cookies() call, so Next.js can ISR-render this route
// All queries here are public data (no RLS auth required)
function getPublicClient() {
    return createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
}

const SUPABASE_HOST = 'rhrkxuoybkdfdrknckjd.supabase.co';

/**
 * For images stored in Supabase Storage, rewrite the URL to use
 * Supabase's image transform API (/render/image/public/...) which actually
 * resizes and re-encodes the image server-side.
 *
 * Original: https://[project].supabase.co/storage/v1/object/public/[bucket]/[path]
 * Transform: https://[project].supabase.co/storage/v1/render/image/public/[bucket]/[path]?width=400&quality=75
 *
 * Non-Supabase URLs (Unsplash, Google, etc.) are returned unchanged.
 */
function thumbUrl(url: string | null | undefined, width = 400): string | undefined {
    if (!url) return undefined;
    if (url.includes(SUPABASE_HOST) && url.includes('/storage/v1/object/public/')) {
        const transformed = url.replace('/storage/v1/object/public/', '/storage/v1/render/image/public/');
        return `${transformed}?width=${width}&quality=75&resize=contain`;
    }
    return url;
}

export async function getLiveHubItems(): Promise<HubItem[]> {
    const supabase = getPublicClient();

    // Fire all 8 queries in parallel — reduces TTFB from ~2.3s to ~300-500ms
    const [
        { data: listings },
        { data: jobs },
        { data: gems },
        { data: businesses },
        { data: transport },
        { data: events },
        { data: roro },
    ] = await Promise.all([
        supabase.from('listings').select('*').eq('status', 'active').limit(4).order('created_at', { ascending: false }),
        supabase.from('jobs').select('*').eq('status', 'active').limit(4).order('created_at', { ascending: false }),
        supabase.from('gems').select('*').limit(4).order('created_at', { ascending: false }),
        supabase.from('business_profiles').select('*').limit(4).order('is_verified', { ascending: false }).order('business_name', { ascending: true }),
        supabase.from('transport_services').select('*').eq('is_available', true).limit(2),
        supabase.from('events').select('*').limit(1).order('event_date', { ascending: true }),
        supabase.from('port_updates').select('*').limit(1).order('created_at', { ascending: false }),
    ]);

    const items: HubItem[] = [];

    listings?.forEach(l => items.push({
        id: l.id, type: 'classifieds', categoryLabel: 'CLASSIFIEDS',
        title: l.title, subtitle: l.town,
        image: thumbUrl(l.images?.[0]) || thumbUrl(l.img) || 'https://images.unsplash.com/photo-1523474253046-2cd2c78b681e?w=400&q=75',
        link: `/listing/${l.slug || l.id}`,
        extraInfo: l.price ? `₱${l.price}` : undefined,
    }));

    jobs?.forEach(j => items.push({
        id: j.id, type: 'jobs', categoryLabel: 'JOBS',
        title: j.title, subtitle: `${j.company_name} • ${j.location}`,
        image: thumbUrl(j.images?.[0]) || thumbUrl(j.logo_url) || '/images/hub/store_manager.webp',
        link: `/job/${j.slug || j.id}`,
        extraInfo: j.salary_range,
    }));

    gems?.forEach(g => items.push({
        id: g.id, type: 'gems', categoryLabel: 'LOCAL GEMS',
        title: g.title, subtitle: g.town,
        image: thumbUrl(g.images?.[0]) || '',
        link: `/gem/${g.id}`,
        extraInfo: 'Trending',
    }));

    businesses?.forEach(b => items.push({
        id: b.id, type: 'businesses', categoryLabel: 'BUSINESS',
        title: b.business_name, subtitle: `${b.location} • ${b.business_type}`,
        image: thumbUrl(b.gallery_image) || '',
        link: `/directory/${b.id}`,
        extraInfo: b.average_rating ? `${b.average_rating.toFixed(1)} ★` : undefined,
    }));

    transport?.forEach(t => items.push({
        id: t.id, type: 'transport', categoryLabel: 'TRANSPORT',
        title: `${t.vehicle_type}: ${t.base_town || 'Marinduque'}`, subtitle: t.driver_name,
        image: t.images?.[0] || '/images/hub/delivery_rider.webp',
        link: '/commuter-delivery-hub',
        extraInfo: undefined,
    }));

    events?.forEach(e => items.push({
        id: e.id, type: 'event', categoryLabel: 'EVENTS',
        title: e.title, subtitle: e.location,
        image: thumbUrl(e.image_url) || '',
        link: `/events/${e.id}`,
        extraInfo: 'Featured',
    }));

    roro?.forEach(r => items.push({
        id: r.id, type: 'roro', categoryLabel: 'RORO PORT',
        title: `Port Status: ${r.port_name}`, subtitle: r.message,
        image: '/images/hub/cawit_port.webp',
        link: '/roro-port-information-hub',
        extraInfo: r.status,
    }));



    return items;
}
