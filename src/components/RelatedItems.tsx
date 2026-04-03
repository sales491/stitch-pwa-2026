import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';

/**
 * RelatedItems — Server-rendered internal linking component.
 * 
 * Fetches related items from the same town/category and displays them
 * as a compact card list. Used at the bottom of detail pages for SEO
 * internal linking and user discovery.
 * 
 * Supports: jobs, listings, events, gems, businesses
 */

type ItemType = 'jobs' | 'listings' | 'events' | 'gems' | 'businesses';

interface RelatedItemsProps {
    type: ItemType;
    town?: string;
    category?: string;
    excludeId: string;
    heading?: string;
    limit?: number;
}

// Cross-link config: what other types to show alongside
const CROSS_LINKS: Partial<Record<ItemType, { type: ItemType; heading: string }[]>> = {
    events: [{ type: 'businesses', heading: 'Businesses Nearby' }],
    gems: [{ type: 'businesses', heading: 'Businesses Nearby' }],
};

async function fetchRelated(
    type: ItemType,
    town: string | undefined,
    category: string | undefined,
    excludeId: string,
    limit: number
) {
    const supabase = await createClient();

    switch (type) {
        case 'jobs': {
            let q = supabase
                .from('jobs')
                .select('slug, title, company_name, location, employment_type')
                .neq('slug', excludeId)
                .gt('expires_at', new Date().toISOString())
                .order('created_at', { ascending: false })
                .limit(limit);
            if (town) q = q.ilike('location', `%${town}%`);
            const { data } = await q;
            return (data ?? []).map(j => ({
                id: j.slug,
                href: `/jobs/${j.slug}`,
                title: j.title,
                subtitle: `${j.company_name} · ${j.location}`,
                badge: j.employment_type,
            }));
        }

        case 'listings': {
            let q = supabase
                .from('listings')
                .select('id, title, price_value, town, category, images')
                .neq('id', excludeId)
                .eq('status', 'active')
                .order('created_at', { ascending: false })
                .limit(limit);
            if (category) q = q.eq('category', category);
            else if (town) q = q.eq('town', town);
            const { data } = await q;
            return (data ?? []).map(l => ({
                id: String(l.id),
                href: `/marketplace/${l.id}`,
                title: l.title,
                subtitle: l.price_value ? `₱${l.price_value.toLocaleString()} · ${l.town}` : l.town || '',
                badge: l.category,
                image: l.images?.[0],
            }));
        }

        case 'events': {
            let q = supabase
                .from('events')
                .select('id, title, location, event_date, category')
                .neq('id', excludeId)
                .gte('event_date', new Date().toISOString().split('T')[0])
                .order('event_date', { ascending: true })
                .limit(limit);
            if (town) q = q.ilike('location', `%${town}%`);
            const { data } = await q;
            return (data ?? []).map(e => ({
                id: String(e.id),
                href: `/events/${e.id}`,
                title: e.title,
                subtitle: `${e.location} · ${new Date(e.event_date).toLocaleDateString('en-PH', { month: 'short', day: 'numeric' })}`,
                badge: e.category,
            }));
        }

        case 'gems': {
            let q = supabase
                .from('gems')
                .select('id, title, town, images')
                .neq('id', excludeId)
                .order('created_at', { ascending: false })
                .limit(limit);
            if (town) q = q.eq('town', town);
            const { data } = await q;
            return (data ?? []).map(g => ({
                id: String(g.id),
                href: `/gems/${g.id}`,
                title: g.title,
                subtitle: g.town || 'Marinduque',
                image: g.images?.[0],
            }));
        }

        case 'businesses': {
            let q = supabase
                .from('business_profiles')
                .select('id, business_name, business_type, location, is_verified, gallery_image')
                .neq('id', excludeId)
                .eq('is_verified', true)
                .order('average_rating', { ascending: false })
                .limit(limit);
            if (town) q = q.ilike('location', `%${town}%`);
            const { data } = await q;
            return (data ?? []).map(b => ({
                id: String(b.id),
                href: `/directory/${b.id}`,
                title: b.business_name,
                subtitle: `${b.business_type || 'Local Business'} · ${b.location}`,
                badge: b.is_verified ? '✓ Verified' : undefined,
                image: b.gallery_image,
            }));
        }
    }
}

interface RelatedItem {
    id: string;
    href: string;
    title: string;
    subtitle?: string;
    badge?: string;
    image?: string;
}

export default async function RelatedItems({
    type,
    town,
    category,
    excludeId,
    heading,
    limit = 3,
}: RelatedItemsProps) {
    const items = await fetchRelated(type, town, category, excludeId, limit);
    
    // Also fetch cross-linked content (e.g. businesses near an event)
    const crossLinks = CROSS_LINKS[type] || [];
    const crossResults: { heading: string; items: RelatedItem[] }[] = [];
    
    for (const cl of crossLinks) {
        const clItems = await fetchRelated(cl.type, town, undefined, '', limit);
        if (clItems.length > 0) {
            crossResults.push({ heading: cl.heading, items: clItems });
        }
    }

    if (items.length === 0 && crossResults.length === 0) return null;

    const defaultHeadings: Record<ItemType, string> = {
        jobs: 'Other Jobs Nearby',
        listings: 'Similar Listings',
        events: 'Upcoming Events Nearby',
        gems: 'More Gems to Explore',
        businesses: 'Businesses Nearby',
    };

    return (
        <>
            {items.length > 0 && (
                <RelatedSection
                    heading={heading || defaultHeadings[type]}
                    items={items}
                />
            )}
            {crossResults.map(cr => (
                <RelatedSection
                    key={cr.heading}
                    heading={cr.heading}
                    items={cr.items}
                />
            ))}
        </>
    );
}

function RelatedSection({ heading, items }: { heading: string; items: RelatedItem[] }) {
    return (
        <nav className="px-6 py-6 max-w-2xl mx-auto" aria-label={heading}>
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 dark:text-zinc-600 mb-3">
                {heading}
            </h2>
            <div className="space-y-2">
                {items.map(item => (
                    <Link
                        key={item.id}
                        href={item.href}
                        className="flex items-center gap-3 bg-slate-50 dark:bg-zinc-900 rounded-2xl p-3 border border-slate-100 dark:border-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors group"
                    >
                        {item.image && (
                            <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-zinc-800 overflow-hidden flex-shrink-0">
                                <img
                                    src={item.image}
                                    alt=""
                                    className="w-full h-full object-cover"
                                    loading="lazy"
                                />
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-900 dark:text-white truncate group-hover:text-moriones-red transition-colors">
                                {item.title}
                            </p>
                            {item.subtitle && (
                                <p className="text-[11px] text-slate-400 dark:text-zinc-500 truncate">{item.subtitle}</p>
                            )}
                        </div>
                        {item.badge && (
                            <span className="text-[9px] font-black bg-slate-100 dark:bg-zinc-800 text-slate-400 px-2 py-0.5 rounded-full uppercase tracking-wider flex-shrink-0">
                                {item.badge}
                            </span>
                        )}
                        <span className="material-symbols-outlined text-slate-300 dark:text-zinc-600 text-sm flex-shrink-0">chevron_right</span>
                    </Link>
                ))}
            </div>
        </nav>
    );
}
