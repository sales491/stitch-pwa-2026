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

    return (
        <main className="bg-slate-50 dark:bg-zinc-950 min-h-screen pb-24">
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
                                        <img src={biz.gallery_image} alt={biz.business_name} className="w-full h-full object-cover" />
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
