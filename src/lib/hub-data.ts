import { createClient } from '@/utils/supabase/server';
import { HubItem } from '@/data/hub-items';

export async function getLiveHubItems(): Promise<HubItem[]> {
    const supabase = await createClient();
    const items: HubItem[] = [];

    // 1. Fetch Listings
    const { data: listings } = await supabase
        .from('listings')
        .select('*')
        .eq('status', 'active')
        .limit(4)
        .order('created_at', { ascending: false });

    if (listings) {
        listings.forEach(l => {
            items.push({
                id: l.id,
                type: 'classifieds',
                categoryLabel: 'CLASSIFIEDS',
                title: l.title,
                subtitle: l.town,
                image: l.images?.[0] || l.img || 'https://images.unsplash.com/photo-1523474253046-2cd2c78b681e?w=800&q=80',
                link: `/listing/${l.slug || l.id}`,
                extraInfo: l.price ? `₱${l.price}` : undefined
            });
        });
    }

    // 2. Fetch Jobs
    const { data: jobs } = await supabase
        .from('jobs')
        .select('*')
        .eq('status', 'active')
        .limit(4)
        .order('created_at', { ascending: false });

    if (jobs) {
        jobs.forEach(j => {
            items.push({
                id: j.id,
                type: 'jobs',
                categoryLabel: 'JOBS',
                title: j.title,
                subtitle: `${j.company_name} • ${j.location}`,
                image: j.images?.[0] || j.logo_url || '/images/hub/store_manager.png',
                link: `/job/${j.slug || j.id}`,
                extraInfo: j.salary_range
            });
        });
    }

    // 3. Fetch Gems
    const { data: gems } = await supabase
        .from('gems')
        .select('*')
        .limit(4)
        .order('created_at', { ascending: false });

    if (gems) {
        gems.forEach(g => {
            items.push({
                id: g.id,
                type: 'gems',
                categoryLabel: 'LOCAL GEMS',
                title: g.title,
                subtitle: g.town,
                image: g.images?.[0] || '',
                link: `/gem/${g.id}`,
                extraInfo: 'Trending'
            });
        });
    }

    // 4. Fetch Businesses
    const { data: businesses } = await supabase
        .from('business_profiles')
        .select('*')
        .limit(4)
        .order('is_verified', { ascending: false })
        .order('business_name', { ascending: true });

    if (businesses) {
        businesses.forEach(b => {
            items.push({
                id: b.id,
                type: 'businesses',
                categoryLabel: 'BUSINESS',
                title: b.business_name,
                subtitle: `${b.location} • ${b.business_type}`,
                image: b.gallery_image || '',
                link: `/directory/${b.id}`,
                extraInfo: b.average_rating ? `${b.average_rating.toFixed(1)} ★` : undefined
            });
        });
    }

    // 5. Fetch Transport
    const { data: transport } = await supabase
        .from('transport_services')
        .select('*')
        .eq('is_available', true)
        .limit(2);

    if (transport) {
        transport.forEach(t => {
            items.push({
                id: t.id,
                type: 'transport',
                categoryLabel: 'TRANSPORT',
                title: `${t.vehicle_type}: ${t.base_town || 'Marinduque'}`,
                subtitle: t.driver_name,
                image: t.images?.[0] || '/images/hub/delivery_rider.png',
                link: '/commuter-delivery-hub',
                extraInfo: (t.price_per_seat || t.base_fare) ? `From ₱${t.price_per_seat || t.base_fare}` : undefined
            });
        });
    }

    // 6. Fetch Events
    const { data: events } = await supabase
        .from('events')
        .select('*')
        .limit(1)
        .order('event_date', { ascending: true });

    if (events) {
        events.forEach(e => {
            items.push({
                id: e.id,
                type: 'event',
                categoryLabel: 'EVENTS',
                title: e.title,
                subtitle: e.location,
                image: e.image_url || '',
                link: `/events/${e.id}`,
                extraInfo: 'Featured'
            });
        });
    }

    // 7. Fetch RoRo
    const { data: roro } = await supabase
        .from('port_updates')
        .select('*')
        .limit(1)
        .order('created_at', { ascending: false });

    if (roro) {
        roro.forEach(r => {
            items.push({
                id: r.id,
                type: 'roro',
                categoryLabel: 'RORO PORT',
                title: `Port Status: ${r.port_name}`,
                subtitle: r.message,
                image: '/images/hub/cawit_port.png',
                link: '/roro-port-information-hub',
                extraInfo: r.status
            });
        });
    }

    // 8. Fetch Blog (Hidden Foreigner)
    const { data: blog } = await supabase
        .from('foreigner_blog')
        .select('*')
        .eq('status', 'published')
        .limit(1)
        .order('created_at', { ascending: false });

    if (blog) {
        blog.forEach(b => {
            items.push({
                id: b.id,
                type: 'blog',
                categoryLabel: 'THE HIDDEN FOREIGNER',
                title: b.title,
                subtitle: b.location_tag || 'Undisclosed',
                image: b.cover_image || 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=800&q=80',
                link: `/the-hidden-foreigner-blog-feed/${b.id}`,
                extraInfo: 'New'
            });
        });
    }

    return items;
}
