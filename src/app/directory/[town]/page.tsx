import type { Metadata } from 'next';
import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import PageHeader from '@/components/PageHeader';
import { hreflangAlternates } from '@/utils/seo';

const SLUG_TO_TOWN: Record<string, string> = {
    'boac': 'Boac',
    'gasan': 'Gasan',
    'mogpog': 'Mogpog',
    'santa-cruz': 'Santa Cruz',
    'buenavista': 'Buenavista',
    'torrijos': 'Torrijos',
};

const TOWN_ENTITIES: Record<string, { name: string, url: string }[]> = {
    'Boac': [
        { name: 'Marinduque State College', url: 'https://en.wikipedia.org/wiki/Marinduque_State_College' },
        { name: 'Boac Cathedral', url: 'https://en.wikipedia.org/wiki/Boac_Cathedral' },
        { name: 'Moriones Festival', url: 'https://en.wikipedia.org/wiki/Moriones_Festival' }
    ],
    'Mogpog': [
        { name: 'Luzon Datum of 1911', url: 'https://en.wikipedia.org/wiki/Luzon_Datum_of_1911' },
        { name: 'Moriones Festival', url: 'https://en.wikipedia.org/wiki/Moriones_Festival' }
    ],
    'Gasan': [
        { name: 'Tres Reyes Islands', url: 'https://en.wikipedia.org/wiki/Tres_Reyes_Islands' },
        { name: 'Marinduque Airport', url: 'https://en.wikipedia.org/wiki/Marinduque_Airport' }
    ],
    'Santa Cruz': [
        { name: 'Maniwaya Island', url: 'https://en.wikipedia.org/wiki/Maniwaya_Island' }
    ],
    'Torrijos': [
        { name: 'Poctoy White Beach', url: 'https://en.wikipedia.org/wiki/Torrijos,_Marinduque#Tourism' },
        { name: 'Battle of Pulang Lupa', url: 'https://en.wikipedia.org/wiki/Battle_of_Pulang_Lupa' }
    ],
    'Buenavista': [
        { name: 'Mount Malindig', url: 'https://en.wikipedia.org/wiki/Mount_Malindig' },
        { name: 'Malbog Sulfur Spring', url: 'https://en.wikipedia.org/wiki/Buenavista,_Marinduque#Tourism' }
    ]
};

const CATEGORIES = [
    { label: 'Accommodation', slug: 'accommodation', icon: 'bed' },
    { label: 'Beauty & Care', slug: 'beauty-personal-care', icon: 'content_cut' },
    { label: 'Cafe', slug: 'cafe', icon: 'coffee' },
    { label: 'Hardware', slug: 'hardware', icon: 'construction' },
    { label: 'Education', slug: 'education', icon: 'school' },
    { label: 'Finance', slug: 'finance', icon: 'account_balance' },
    { label: 'Food & Dining', slug: 'food-and-dining', icon: 'restaurant' },
    { label: 'Gas Stations', slug: 'gas-station', icon: 'local_gas_station' },
    { label: 'Healthcare', slug: 'healthcare', icon: 'medical_services' },
    { label: 'Services', slug: 'services', icon: 'build' },
    { label: 'Retail', slug: 'retail', icon: 'shopping_bag' },
];

export async function generateMetadata({
    params,
}: {
    params: Promise<{ town: string }>;
}): Promise<Metadata> {
    const { town } = await params;
    const townName = SLUG_TO_TOWN[town.toLowerCase()];

    if (!townName) return { title: 'Not Found' };

    const title = `Local Businesses in ${townName}, Marinduque | Business Directory`;
    const description = `Find the best restaurants, shops, and services in ${townName}, Marinduque. Browse our verified local directory and support our community.`;

    return {
        title,
        description,
        alternates: hreflangAlternates(`/directory/${town}`),
        openGraph: {
            title,
            description,
            url: `https://marinduquemarket.com/directory/${town}`,
        },
    };
}

export default async function TownHubPage({
    params,
}: {
    params: Promise<{ town: string }>;
}) {
    const { town } = await params;
    const townName = SLUG_TO_TOWN[town.toLowerCase()];

    if (!townName) return notFound();

    const supabase = await createClient();
    
    // Fetch some featured/recent businesses for the town
    const { data: recentBusinesses } = await supabase
        .from('business_profiles')
        .select('*')
        .eq('location', townName)
        .order('is_verified', { ascending: false })
        .limit(5);

    const townEntities = TOWN_ENTITIES[townName] || [];
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: `Business Directory for ${townName}, Marinduque`,
        description: `Explore the local economy of ${townName}. From historic establishments to new favorites, find everything you need in the heart of Marinduque.`,
        url: `https://marinduquemarket.com/directory/${town}`,
        about: {
            '@type': 'City',
            name: townName,
            containedInPlace: {
                '@type': 'Province',
                name: 'Marinduque',
                sameAs: 'https://en.wikipedia.org/wiki/Marinduque'
            }
        },
        mentions: townEntities.map(entity => ({
            '@type': 'Thing',
            name: entity.name,
            sameAs: entity.url
        }))
    };

    return (
        <main className="bg-slate-50 dark:bg-zinc-950 min-h-screen pb-24">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <PageHeader 
                title={townName} 
                subtitle="Marinduque Town Hub" 
            />

            <div className="max-w-2xl mx-auto px-6 py-8">
                <div className="mb-10 text-center">
                    <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tighter mb-4">
                        Discover {townName}
                    </h1>
                    <p className="text-slate-500 dark:text-zinc-400 text-sm font-medium leading-relaxed max-w-md mx-auto">
                        Explore the local economy of {townName}. From historic establishments to new favorites, find everything you need in the heart of Marinduque.
                    </p>
                </div>

                {/* Category Grid */}
                <section className="mb-16">
                    <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">grid_view</span>
                        Browse by Category
                    </h2>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {/* Town Biography Prominent Link */}
                        <Link 
                            href={`/towns/${town}`}
                            className="col-span-2 sm:col-span-3 bg-moriones-red/10 dark:bg-moriones-red/20 p-6 rounded-[2rem] border border-moriones-red/20 text-center hover:border-moriones-red hover:shadow-md transition-all group"
                        >
                            <span className="material-symbols-outlined text-3xl text-moriones-red mb-2">menu_book</span>
                            <p className="text-sm font-black uppercase tracking-widest text-moriones-red mb-1">
                                {townName} Biography & History
                            </p>
                            <p className="text-xs text-moriones-red/70 font-medium">Read the &quot;Total History&quot; deep dive into our town&apos;s origins.</p>
                        </Link>

                        {CATEGORIES.map((cat) => (
                            <Link 
                                key={cat.slug} 
                                href={`/directory/${town}/${cat.slug}`}
                                className="bg-white dark:bg-zinc-900 p-5 rounded-[2rem] border border-slate-100 dark:border-zinc-800 text-center hover:border-moriones-red hover:shadow-md transition-all group"
                            >
                                <span className="material-symbols-outlined text-2xl text-slate-400 group-hover:text-moriones-red mb-2">{cat.icon}</span>
                                <p className="text-[11px] font-black uppercase tracking-wider text-slate-700 dark:text-zinc-300">
                                    {cat.label}
                                </p>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Recent in Town */}
                <section>
                    <h2 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
                        <span className="material-symbols-outlined text-sm">auto_awesome</span>
                        Featured in {townName}
                    </h2>
                    <div className="space-y-4">
                        {recentBusinesses && recentBusinesses.map((biz) => (
                            <Link 
                                key={biz.id} 
                                href={`/directory/b/${biz.id}`}
                                className="flex items-center gap-4 bg-white dark:bg-zinc-900 p-4 rounded-3xl border border-slate-100 dark:border-zinc-800 hover:shadow-sm transition-all"
                            >
                                <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-zinc-800 flex-shrink-0 flex items-center justify-center text-slate-300 overflow-hidden">
                                    {biz.gallery_image ? (
                                        <div className="relative w-full h-full">
                                            <Image
                                                src={biz.gallery_image}
                                                alt={biz.business_name}
                                                fill
                                                className="object-cover"
                                                unoptimized
                                            />
                                        </div>
                                    ) : (
                                        <span className="material-symbols-outlined">storefront</span>
                                    )}
                                </div>
                                <div className="min-w-0 flex-1">
                                    <h3 className="text-sm font-black text-slate-900 dark:text-white truncate tracking-tight">{biz.business_name}</h3>
                                    <p className="text-[10px] text-slate-500 dark:text-zinc-500 font-bold uppercase tracking-wide truncate">{biz.business_type}</p>
                                    <div className="flex items-center gap-1 mt-1">
                                        <span className="text-[10px] font-black text-slate-900 dark:text-white">{(biz.average_rating || 0).toFixed(1)}</span>
                                        <span className="material-symbols-outlined text-[12px] text-amber-400 fill-1">star</span>
                                    </div>
                                </div>
                                <span className="material-symbols-outlined text-slate-300 text-sm">chevron_right</span>
                            </Link>
                        ))}
                    </div>
                </section>

                {/* Local Link Box */}
                <div className="mt-16 bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-moriones-red/20 blur-3xl rounded-full translate-x-10 -translate-y-10"></div>
                    <h3 className="text-xl font-black tracking-tight mb-2">Are you a business owner in {townName}?</h3>
                    <p className="text-xs text-slate-400 mb-6 leading-relaxed max-w-sm">
                        Get your business listed on the Marinduque Market Hub for free. Improve your visibility and reach more customers in your town.
                    </p>
                    <Link href="/directory/create" className="inline-block bg-white text-slate-900 px-6 py-2.5 rounded-full font-black text-[10px] uppercase tracking-widest active:scale-95 transition-all">
                        List Your Business
                    </Link>
                </div>
            </div>
        </main>
    );
}
