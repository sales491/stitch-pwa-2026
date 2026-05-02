import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import Image from 'next/image';

/**
 * PopularOnMarketHub — Server-rendered section showing fresh content from across the platform.
 * 
 * Displays: recent listings, upcoming events, and verified businesses.
 * Provides internal links from the home page to deep content — critical for SEO.
 */

interface QuickCard {
    href: string;
    title: string;
    subtitle: string;
    image?: string;
}

export default async function PopularOnMarketHub() {
    const supabase = await createClient();

    // Fetch recent listings
    const { data: listings } = await supabase
        .from('listings')
        .select('id, title, price_value, town, images')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(3);

    // Fetch upcoming events
    const { data: events } = await supabase
        .from('events')
        .select('id, title, location, event_date')
        .gte('event_date', new Date().toISOString().split('T')[0])
        .order('event_date', { ascending: true })
        .limit(3);

    // Fetch top verified businesses
    const { data: businesses } = await supabase
        .from('business_profiles')
        .select('id, business_name, business_type, location, gallery_image')
        .eq('is_verified', true)
        .order('average_rating', { ascending: false })
        .limit(3);

    const listingCards: QuickCard[] = (listings ?? []).map(l => ({
        href: `/marketplace/${l.id}`,
        title: l.title,
        subtitle: l.price_value ? `₱${l.price_value.toLocaleString()} · ${l.town}` : l.town || 'Marinduque',
        image: l.images?.[0],
    }));

    const eventCards: QuickCard[] = (events ?? []).map(e => ({
        href: `/events/${e.id}`,
        title: e.title,
        subtitle: `${e.location} · ${new Date(e.event_date).toLocaleDateString('en-PH', { month: 'short', day: 'numeric' })}`,
    }));

    const bizCards: QuickCard[] = (businesses ?? []).map(b => ({
        href: `/directory/${b.id}`,
        title: b.business_name,
        subtitle: `${b.business_type || 'Business'} · ${b.location}`,
        image: b.gallery_image,
    }));

    // Don't render if all empty
    if (listingCards.length === 0 && eventCards.length === 0 && bizCards.length === 0) return null;

    return (
        <nav className="px-4 py-6" aria-label="Popular on MarketHub">
            <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-300 dark:text-zinc-600 mb-4 px-2">
                Popular on MarketHub
            </h2>

            {/* Sections */}
            {listingCards.length > 0 && (
                <QuickSection title="New Listings" cards={listingCards} seeAllHref="/marketplace" seeAllLabel="View All" />
            )}
            {eventCards.length > 0 && (
                <QuickSection title="Upcoming Events" cards={eventCards} seeAllHref="/events" seeAllLabel="View All" />
            )}
            {bizCards.length > 0 && (
                <QuickSection title="Featured Businesses" cards={bizCards} seeAllHref="/directory" seeAllLabel="View All" />
            )}

            {/* SEO landing page links */}
            <div className="flex flex-wrap gap-2 mt-4 px-2">
                {[
                    { href: '/ferry-schedule', label: '⛴️ Ferry Schedule' },
                    { href: '/things-to-do', label: '🏝️ Things to Do' },
                    { href: '/moriones-festival', label: '🎭 Moriones Festival' },
                    { href: '/moriones-festival/artisans', label: '🪓 Artisan Directory' },
                ].map(link => (
                    <Link
                        key={link.href}
                        href={link.href}
                        className="text-[10px] font-black bg-slate-50 dark:bg-zinc-900 text-slate-500 dark:text-zinc-400 px-3 py-1.5 rounded-full border border-slate-100 dark:border-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors uppercase tracking-wider"
                    >
                        {link.label}
                    </Link>
                ))}
            </div>
        </nav>
    );
}

function QuickSection({
    title,
    cards,
    seeAllHref,
    seeAllLabel,
}: {
    title: string;
    cards: QuickCard[];
    seeAllHref: string;
    seeAllLabel: string;
}) {
    return (
        <div className="mb-4">
            <div className="flex items-center justify-between px-2 mb-2">
                <p className="text-xs font-black text-slate-500 dark:text-zinc-400">{title}</p>
                <Link href={seeAllHref} className="text-[10px] font-black text-moriones-red uppercase tracking-widest hover:underline">
                    {seeAllLabel}
                </Link>
            </div>
            <div className="space-y-1.5">
                {cards.map(card => (
                    <Link
                        key={card.href}
                        href={card.href}
                        className="flex items-center gap-3 bg-white dark:bg-zinc-900 rounded-2xl p-3 border border-slate-100 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors group"
                    >
                        {card.image && (
                            <div className="relative w-9 h-9 rounded-lg bg-slate-100 dark:bg-zinc-800 overflow-hidden flex-shrink-0">
                                <Image src={card.image} alt="" className="object-cover" fill sizes="40px" />
                            </div>
                        )}
                        <div className="flex-1 min-w-0">
                            <p className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-moriones-red transition-colors">{card.title}</p>
                            <p className="text-[10px] text-slate-400 dark:text-zinc-500 truncate">{card.subtitle}</p>
                        </div>
                        <span className="material-symbols-outlined text-slate-200 dark:text-zinc-700 text-sm flex-shrink-0">chevron_right</span>
                    </Link>
                ))}
            </div>
        </div>
    );
}
