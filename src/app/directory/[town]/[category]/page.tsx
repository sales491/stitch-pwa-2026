import type { Metadata } from 'next';
import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
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

// Map URL slugs back to database category names
const SLUG_TO_CAT: Record<string, string> = {
    'accommodation': 'Accommodation',
    'beauty-personal-care': 'Beauty / Personal Care',
    'cafe': 'Cafe',
    'hardware': 'Construction / Hardware',
    'education': 'Education / School',
    'finance': 'Finance / Banking',
    'food-and-dining': 'Food & Dining',
    'gas-station': 'Gas / Fuel Station',
    'healthcare': 'Healthcare / Medical',
    'restaurant': 'Restaurant',
    'retail': 'Retail / Shop',
    'services': 'Services / Repair',
    'sports': 'Sports & Fitness',
};

export async function generateMetadata({
    params,
}: {
    params: Promise<{ town: string; category: string }>;
}): Promise<Metadata> {
    const { town, category } = await params;
    const townName = SLUG_TO_TOWN[town.toLowerCase()];
    const catName = SLUG_TO_CAT[category.toLowerCase()];

    if (!townName || !catName) return { title: 'Not Found' };

    const title = `${catName} in ${townName}, Marinduque | Local Directory`;
    const description = `Looking for ${catName.toLowerCase()} in ${townName}? Browse the best local businesses, read reviews, and get contact details on the Marinduque Market Hub.`;

    return {
        title,
        description,
        alternates: hreflangAlternates(`/directory/${town}/${category}`),
        openGraph: {
            title,
            description,
            url: `https://marinduquemarket.com/directory/${town}/${category}`,
        },
    };
}

export default async function TownCategoryPage({
    params,
}: {
    params: Promise<{ town: string; category: string }>;
}) {
    const { town, category } = await params;
    const townName = SLUG_TO_TOWN[town.toLowerCase()];
    const catName = SLUG_TO_CAT[category.toLowerCase()];

    if (!townName || !catName) return notFound();

    const supabase = await createClient();
    const { data: businesses, error } = await supabase
        .from('business_profiles')
        .select('*')
        .eq('location', townName)
        .contains('categories', [catName])
        .order('is_verified', { ascending: false })
        .order('average_rating', { ascending: false });

    if (error) {
        console.error("Error fetching pSEO data:", error);
    }

    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        name: `${catName} in ${townName}`,
        description: `Directory of ${catName.toLowerCase()} in ${townName}, Marinduque`,
        itemListElement: (businesses || []).map((biz, i) => ({
            '@type': 'ListItem',
            position: i + 1,
            item: {
                '@type': 'LocalBusiness',
                name: biz.business_name,
                url: `https://marinduquemarket.com/directory/b/${biz.id}`,
                address: {
                    '@type': 'PostalAddress',
                    addressLocality: biz.location,
                    addressRegion: 'Marinduque',
                    addressCountry: 'PH'
                }
            }
        }))
    };

    return (
        <main className="bg-slate-50 dark:bg-zinc-950 min-h-screen pb-24">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            
            <PageHeader 
                title={catName} 
                subtitle={`${townName}, Marinduque`} 
            />

            <div className="max-w-2xl mx-auto px-6 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter mb-2">
                        Best {catName} in {townName}
                    </h1>
                    <p className="text-slate-500 dark:text-zinc-400 text-sm font-medium leading-relaxed">
                        Discover top-rated {catName.toLowerCase()} and local services in {townName}, Marinduque. 
                        Showing {businesses?.length || 0} verified listings.
                    </p>
                </div>

                <div className="space-y-4">
                    {businesses && businesses.length > 0 ? (
                        businesses.map((biz) => (
                            <Link 
                                key={biz.id} 
                                href={`/directory/b/${biz.id}`}
                                className="block bg-white dark:bg-zinc-900 rounded-3xl p-5 border border-slate-100 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all group"
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <h2 className="text-lg font-black text-slate-900 dark:text-white tracking-tight group-hover:text-moriones-red transition-colors">
                                        {biz.business_name}
                                    </h2>
                                    {biz.is_verified && (
                                        <span className="material-symbols-outlined text-teal-500 fill-1 text-xl">verified</span>
                                    )}
                                </div>
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="text-sm font-black text-slate-900 dark:text-white">{(biz.average_rating || 0).toFixed(1)}</span>
                                    <div className="flex text-amber-400">
                                        <span className="material-symbols-outlined text-[16px] font-variation-settings-fill" style={{ fontVariationSettings: '"FILL" 1' }}>star</span>
                                    </div>
                                    <span className="text-[11px] font-bold text-slate-400">({biz.review_count || 0} reviews)</span>
                                </div>
                                <p className="text-xs text-slate-500 dark:text-zinc-400 line-clamp-2 mb-4 leading-relaxed font-medium">
                                    {biz.description}
                                </p>
                                <div className="flex items-center gap-2">
                                    <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest bg-slate-50 dark:bg-zinc-800 px-2.5 py-1 rounded-full">
                                        {biz.business_type}
                                    </span>
                                    <span className="text-[9px] font-black uppercase text-slate-400 tracking-widest bg-slate-50 dark:bg-zinc-800 px-2.5 py-1 rounded-full">
                                        {biz.location}
                                    </span>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <div className="text-center py-20 bg-slate-50 dark:bg-zinc-900/50 rounded-[3rem] border border-dashed border-slate-200 dark:border-zinc-800">
                            <span className="material-symbols-outlined text-4xl text-slate-300 mb-4">search_off</span>
                            <p className="text-slate-500 font-bold">No {catName.toLowerCase()} found in {townName} yet.</p>
                            <p className="text-xs text-slate-400 mt-1">Be the first to add a business!</p>
                            <Link href="/directory/create" className="inline-block mt-6 bg-moriones-red text-white px-6 py-2.5 rounded-full font-black text-[10px] uppercase tracking-widest shadow-lg">
                                Add Listing
                            </Link>
                        </div>
                    )}
                </div>

                {/* Internal Linking: Other categories in this town */}
                <div className="mt-16 pt-10 border-t border-slate-200 dark:border-zinc-800">
                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6">Explore more in {townName}</h3>
                    <div className="flex flex-wrap gap-2">
                        {Object.entries(SLUG_TO_CAT).map(([slug, label]) => (
                            label !== catName && (
                                <Link 
                                    key={slug} 
                                    href={`/directory/${town}/${slug}`}
                                    className="px-4 py-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl text-xs font-bold text-slate-600 dark:text-zinc-400 hover:border-moriones-red hover:text-moriones-red transition-all"
                                >
                                    {label}
                                </Link>
                            )
                        ))}
                    </div>
                </div>
            </div>
        </main>
    );
}
