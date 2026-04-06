import type { Metadata } from 'next';
import { hreflangAlternates, TAGALOG_KEYWORDS_TRAVEL, TAGALOG_KEYWORDS_GEMS } from '@/utils/seo';
import Link from 'next/link';
import PageHeader from '@/components/PageHeader';

export const metadata: Metadata = {
    title: 'Things to Do in Marinduque 2026 — Top Attractions, Activities & Hidden Gems',
    description: 'The ultimate guide to things to do in Marinduque island, Philippines. Island hopping, Moriones Festival, hidden gems, beaches, waterfalls, food, and local culture.',
    keywords: [
        'things to do in Marinduque', 'Marinduque tourist spots', 'Marinduque attractions',
        'Marinduque travel guide', 'what to do in Marinduque', 'Marinduque activities',
        'Marinduque beaches', 'Marinduque itinerary', 'visit Marinduque',
        'Marinduque island Philippines', 'Boac Marinduque', 'Tres Reyes Islands',
        ...TAGALOG_KEYWORDS_TRAVEL, ...TAGALOG_KEYWORDS_GEMS,
    ],
    openGraph: {
        title: 'Things to Do in Marinduque — Travel Guide 2026',
        description: 'Discover the best things to do on Marinduque island: island hopping, festivals, hidden gems, local food, and authentic Filipino island culture.',
        url: 'https://marinduquemarket.com/things-to-do',
        type: 'article',
    },
    alternates: hreflangAlternates('/things-to-do'),
};

const CATEGORIES = [
    {
        id: 'islands',
        emoji: '🏝️',
        title: 'Island Hopping & Beaches',
        color: 'from-cyan-500 to-blue-500',
        bg: 'bg-cyan-50 dark:bg-cyan-950/30',
        description: 'Marinduque\'s crown jewel. Crystal-clear waters, white sand beaches, and some of the most photogenic sandbars in the Philippines.',
        highlights: [
            { name: 'Tres Reyes Islands', desc: 'Three uninhabited islands (Gaspar, Melchor, Baltazar) with pristine beaches and vibrant coral reefs. Named after the Three Kings.' },
            { name: 'Maniwaya Island', desc: 'The most popular beach destination. Long white sand shoreline, budget-friendly resorts, and boat tours to nearby Palad Sandbar.' },
            { name: 'Palad Sandbar', desc: 'A stunning sandspit that emerges during low tide between Maniwaya and Polo islands. One of the most Instagrammed spots in MIMAROPA.' },
            { name: 'Mongpong Island', desc: 'An unspoiled gem off the coast of Santa Cruz. Less touristy than Maniwaya, with excellent snorkeling and a lighthouse trail.' },
        ],
        cta: { label: 'Find Boat Operators', href: '/island-hopping' },
    },
    {
        id: 'culture',
        emoji: '🎭',
        title: 'Festivals & Culture',
        color: 'from-red-500 to-orange-500',
        bg: 'bg-red-50 dark:bg-red-950/30',
        description: 'Marinduque is the cultural heart of the Philippines\' Lenten traditions. The island is world-famous for the Moriones Festival.',
        highlights: [
            { name: 'Moriones Festival', desc: 'Held during Holy Week (March/April). Locals don Roman centurion masks and costumes, reenacting the story of Longinus. A UNESCO-recognized cultural treasure.' },
            { name: 'Boac Cathedral', desc: 'The centuries-old Boac Cathedral (Our Lady of the Immaculate Conception) is the spiritual center of the island, dating back to the Spanish colonial era.' },
            { name: 'Santa Cruz Church', desc: 'Another historic Spanish-era church with well-preserved architecture and a plaza that hosts community events.' },
            { name: 'Poctoy White Beach', desc: 'A 3-kilometer stretch of white sand in Torrijos, often called the "Boracay of Marinduque." Great for swimming and sunset watching.' },
        ],
        cta: { label: 'View Events Calendar', href: '/events' },
    },
    {
        id: 'nature',
        emoji: '🌿',
        title: 'Nature & Adventure',
        color: 'from-emerald-500 to-green-500',
        bg: 'bg-emerald-50 dark:bg-emerald-950/30',
        description: 'Beyond the beaches, Marinduque\'s interior offers caves, hot springs, waterfalls, and hiking trails through lush tropical forest.',
        highlights: [
            { name: 'Bathala Caves', desc: 'A network of limestone caves in central Marinduque with stalactites, underground rivers, and chambers once used as wartime shelters.' },
            { name: 'Malbog Sulfur Springs', desc: 'Natural hot sulfur springs in Buenavista. A unique geothermal area where you can soak in therapeutic mineral water.' },
            { name: 'Mt. Malindig', desc: 'Marinduque\'s highest peak (1,157m). A challenging day hike through grasslands and montane forest with panoramic views of the island.' },
            { name: 'Tarug Falls', desc: 'A multi-tiered waterfall in the interior of Santa Cruz, accessible via a jungle trail. Less crowded than mainstream tourist spots.' },
        ],
        cta: { label: 'Explore Gems', href: '/gems' },
    },
    {
        id: 'food',
        emoji: '🍲',
        title: 'Local Food & Markets',
        color: 'from-amber-500 to-orange-500',
        bg: 'bg-amber-50 dark:bg-amber-950/30',
        description: 'Marinduque cuisine is fresh, simple, and delicious. Seafood straight from the fishermen, traditional kakanin, and the famous Marinduque arrowroot cookies.',
        highlights: [
            { name: 'Palengke (Wet Markets)', desc: 'The public markets in Boac, Gasan, and Santa Cruz are where locals buy the freshest fish, produce, and meat daily. Visit early morning for the best selection.' },
            { name: 'Arrowroot Cookies (Uraro)', desc: 'Marinduque\'s signature delicacy. These crumbly, melt-in-your-mouth cookies made from arrowroot starch are the island\'s most popular pasalubong (souvenir).' },
            { name: 'Fresh Seafood', desc: 'Being an island, Marinduque has exceptional seafood — lapu-lapu, tuna, squid, shrimp, and the local favorite: kinilaw (Filipino ceviche).' },
            { name: 'Local Eateries (Karenderia)', desc: 'Budget-friendly local restaurants serving home-style Filipino dishes. Try the adobo sa gata (adobo with coconut milk), a Marinduque specialty.' },
        ],
        cta: { label: 'Check Palengke Prices', href: '/island-life/palengke' },
    },
    {
        id: 'community',
        emoji: '🤝',
        title: 'Community & Local Experiences',
        color: 'from-violet-500 to-purple-500',
        bg: 'bg-violet-50 dark:bg-violet-950/30',
        description: 'The best way to experience Marinduque is through its people. Join community events, visit local businesses, and explore the barangay life.',
        highlights: [
            { name: 'Business District Tour', desc: 'Walk through the commercial areas of Boac and Santa Cruz to discover local shops, bakeries, pharmacies, and hardware stores.' },
            { name: 'Barangay Fiestas', desc: 'Nearly every barangay celebrates its own fiesta with food, music, games, and religious processions. Check the events calendar for upcoming celebrations.' },
            { name: 'Fishing Villages', desc: 'Visit the coastal fishing barangays to see traditional bangka boats, fish drying, and the daily rhythms of island fishing communities.' },
            { name: 'Paluwagan (Savings Circles)', desc: 'A unique Filipino community tradition of group saving. Visitors can learn about this trust-based financial practice still alive on the island.' },
        ],
        cta: { label: 'Browse Community', href: '/community' },
    },
];

export default function ThingsToDoPage() {
    const jsonLd = [
        {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: 'Things to Do in Marinduque — Complete Travel Guide 2026',
            description: 'The ultimate guide to activities, attractions, and experiences on Marinduque island, Philippines.',
            author: { '@type': 'Organization', name: 'Marinduque Market Hub' },
            publisher: { '@type': 'Organization', name: 'Marinduque Market Hub' },
            url: 'https://marinduquemarket.com/things-to-do',
            about: {
                '@type': 'TouristDestination',
                name: 'Marinduque Island',
                description: 'A heart-shaped island province in the MIMAROPA region of the Philippines, known for the Moriones Festival and pristine island hopping destinations.',
                geo: { '@type': 'GeoCoordinates', latitude: 13.3767, longitude: 122.0252 },
                containedInPlace: { '@type': 'Country', name: 'Philippines' },
            },
        },
        {
            '@context': 'https://schema.org',
            '@type': 'ItemList',
            name: 'Top Things to Do in Marinduque',
            itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Island Hopping — Tres Reyes Islands, Maniwaya, Palad Sandbar' },
                { '@type': 'ListItem', position: 2, name: 'Moriones Festival — Holy Week cultural celebration' },
                { '@type': 'ListItem', position: 3, name: 'Bathala Caves — Limestone cave exploration' },
                { '@type': 'ListItem', position: 4, name: 'Malbog Sulfur Springs — Natural hot springs' },
                { '@type': 'ListItem', position: 5, name: 'Poctoy White Beach — Swimming and sunsets' },
                { '@type': 'ListItem', position: 6, name: 'Local Food — Uraro cookies, kinilaw, adobo sa gata' },
            ],
        },
    ];

    return (
        <div className="bg-white dark:bg-zinc-950 min-h-screen pb-24">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <PageHeader title="Things to Do" subtitle="Marinduque Travel Guide" />

            <div className="max-w-2xl mx-auto px-6 py-6">
                {/* Hero */}
                <article className="mb-10">
                    <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tighter leading-tight mb-4">
                        Things to Do in Marinduque
                    </h1>
                    <p className="text-slate-600 dark:text-zinc-400 text-sm leading-relaxed font-medium mb-3">
                        Marinduque is a heart-shaped island province in the <strong>MIMAROPA region</strong> of the Philippines, located south of Quezon Province and north of Romblon. With a population of roughly 240,000, it remains one of the country's best-kept secrets — offering pristine beaches, world-class island hopping, rich culture, and an authentically Filipino island experience.
                    </p>
                    <p className="text-slate-600 dark:text-zinc-400 text-sm leading-relaxed font-medium mb-4">
                        The island is divided into <strong>six municipalities</strong>: Boac (the capital), Mogpog, Gasan, Santa Cruz, Torrijos, and Buenavista. Each town has its own character, from the commercial center of Boac to the beach paradise of Santa Cruz. Here's everything worth doing on the island.
                    </p>
                    <div className="flex flex-wrap gap-2">
                        <Link href="/ferry-schedule" className="inline-flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-blue-600 transition-colors shadow-sm">
                            <span className="material-symbols-outlined text-sm">sailing</span>
                            How to Get Here
                        </Link>
                        <Link href="/commute" className="inline-flex items-center gap-2 bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 px-4 py-2 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 dark:hover:bg-zinc-700 transition-colors">
                            <span className="material-symbols-outlined text-sm">directions</span>
                            Getting Around
                        </Link>
                    </div>
                </article>

                {/* Categories */}
                {CATEGORIES.map((cat) => (
                    <section key={cat.id} className="mb-10">
                        <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-5 flex items-center gap-2">
                            <span className="text-base">{cat.emoji}</span>
                            {cat.title}
                        </h2>
                        <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed font-medium mb-5">
                            {cat.description}
                        </p>

                        <div className="space-y-3 mb-4">
                            {cat.highlights.map((h) => (
                                <div key={h.name} className={`${cat.bg} rounded-2xl p-4 border border-slate-100 dark:border-zinc-800`}>
                                    <h3 className="font-black text-slate-900 dark:text-white text-sm tracking-tight mb-1">{h.name}</h3>
                                    <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">{h.desc}</p>
                                </div>
                            ))}
                        </div>

                        <Link
                            href={cat.cta.href}
                            className="inline-flex items-center gap-2 text-xs font-black text-moriones-red hover:underline uppercase tracking-widest"
                        >
                            {cat.cta.label}
                            <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </Link>
                    </section>
                ))}

                {/* Quick Facts */}
                <section className="mb-10 bg-slate-50 dark:bg-zinc-900 rounded-3xl p-6 border border-slate-100 dark:border-zinc-800">
                    <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">info</span>
                        Quick Facts — Marinduque
                    </h2>
                    <div className="grid grid-cols-2 gap-3">
                        {[
                            { label: 'Region', value: 'MIMAROPA (Region IV-B)' },
                            { label: 'Capital', value: 'Boac' },
                            { label: 'Area', value: '960 km²' },
                            { label: 'Population', value: '~240,000' },
                            { label: 'Municipalities', value: '6' },
                            { label: 'Major Port', value: 'Balanacan (Mogpog)' },
                            { label: 'Best Season', value: 'March–May' },
                            { label: 'Famous For', value: 'Moriones Festival' },
                        ].map(f => (
                            <div key={f.label}>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{f.label}</p>
                                <p className="text-xs font-bold text-slate-700 dark:text-zinc-300">{f.value}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* CTA */}
                <section className="bg-moriones-red/5 dark:bg-moriones-red/10 rounded-3xl p-6 border border-moriones-red/10 dark:border-moriones-red/20 text-center">
                    <h2 className="font-black text-lg text-slate-900 dark:text-white tracking-tight mb-2">Plan your Marinduque trip</h2>
                    <p className="text-xs text-slate-500 dark:text-zinc-400 mb-4 font-medium">Check ferry schedules, find accommodations, and connect with local guides.</p>
                    <div className="flex flex-wrap justify-center gap-2">
                        <Link href="/ferry-schedule" className="inline-flex items-center gap-2 bg-moriones-red text-white px-5 py-2.5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-700 transition-colors shadow-md">
                            <span className="material-symbols-outlined text-sm">sailing</span>
                            Ferry Schedule
                        </Link>
                        <Link href="/directory" className="inline-flex items-center gap-2 bg-white dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 px-5 py-2.5 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-100 dark:hover:bg-zinc-700 transition-colors border border-slate-200 dark:border-zinc-700">
                            <span className="material-symbols-outlined text-sm">store</span>
                            Find Businesses
                        </Link>
                    </div>
                </section>
            </div>
        </div>
    );
}
