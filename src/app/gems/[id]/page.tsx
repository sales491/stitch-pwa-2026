import type { Metadata } from 'next';
import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import UniversalComments from '@/components/UniversalComments';
import Image from 'next/image';
import PageHeader from '@/components/PageHeader';
import RelatedItems from '@/components/RelatedItems';
import { hreflangAlternates } from '@/utils/seo';

export async function generateMetadata({
    params,
}: {
    params: Promise<{ id: string }>;
}): Promise<Metadata> {
    const { id } = await params;
    const supabase = await createClient();
    const { data: gem } = await supabase
        .from('gems')
        .select('title, description, town, images, latitude, longitude')
        .eq('id', id)
        .single();

    if (!gem) return { title: 'Gem Not Found' };

    return {
        title: `${gem.title} — Hidden Gem in ${gem.town}, Marinduque`,
        description: gem.description?.slice(0, 155) ?? `Discover ${gem.title}, a hidden gem in ${gem.town}, Marinduque island, Philippines.`,
        keywords: [
            gem.title, gem.town, 'Marinduque', 'hidden gems Philippines',
            `things to do in ${gem.town}`, `${gem.town} tourist spots`,
            'Marinduque travel', 'Philippines travel guide',
        ],
        openGraph: {
            title: `${gem.title} — ${gem.town}, Marinduque`,
            description: gem.description?.slice(0, 155) ?? `A hidden gem in ${gem.town}, Marinduque.`,
            url: `https://marinduquemarket.com/gems/${id}`,
            type: 'article',
            images: gem.images?.[0] ? [{ url: gem.images[0], alt: `${gem.title} — hidden gem in ${gem.town}, Marinduque, Philippines` }] : undefined,
        },
        alternates: hreflangAlternates(`/gems/${id}`),
    };
}


export default async function GemDetail({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;
    const supabase = await createClient();

    const { data: gem, error } = await supabase
        .from('gems')
        .select(`
            *,
            author:profiles(id, full_name, avatar_url)
        `)
        .eq('id', id)
        .single();

    if (error || !gem) return notFound();

    return (
        <div className="bg-slate-50 dark:bg-zinc-950 min-h-screen pb-24 font-display">
            {/* TouristAttraction + BreadcrumbList JSON-LD — Google Rich Results & AI Answer Engines */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify([
                    {
                        '@context': 'https://schema.org',
                        '@type': 'TouristAttraction',
                        name: gem.title,
                        description: gem.description || `${gem.title} — a hidden gem in ${gem.town}, Marinduque, Philippines.`,
                        url: `https://marinduquemarket.com/gems/${gem.id}`,
                        ...(gem.images?.[0] && { image: { '@type': 'ImageObject', url: gem.images[0], description: `${gem.title} — ${gem.town}, Marinduque, Philippines` } }),
                        ...(gem.latitude && gem.longitude && {
                            geo: { '@type': 'GeoCoordinates', latitude: gem.latitude, longitude: gem.longitude },
                        }),
                        address: {
                            '@type': 'PostalAddress',
                            addressLocality: gem.town,
                            addressRegion: 'Marinduque',
                            addressCountry: 'PH',
                        },
                        touristType: 'Hidden Gem',
                        isAccessibleForFree: true,
                        containedInPlace: { '@type': 'AdministrativeArea', name: 'Marinduque Island, Philippines' },
                    },
                    {
                        '@context': 'https://schema.org',
                        '@type': 'BreadcrumbList',
                        itemListElement: [
                            { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://marinduquemarket.com' },
                            { '@type': 'ListItem', position: 2, name: 'Gems', item: 'https://marinduquemarket.com/gems' },
                            { '@type': 'ListItem', position: 3, name: gem.title, item: `https://marinduquemarket.com/gems/${gem.id}` },
                        ],
                    },
                ]) }}
            />

            <PageHeader title="Local Gem" subtitle="Hidden Treasure" />

            {/* Cinematic Hero Engine */}
            <div className="w-full h-[450px] md:h-[600px] relative overflow-hidden rounded-b-[4rem] shadow-2xl">
                {gem.images?.[0] ? (
                    <Image
                        src={gem.images[0]}
                        alt={`${gem.title} — hidden gem in ${gem.town}, Marinduque, Philippines`}
                        fill
                        className="object-cover"
                        priority
                    />
                ) : (
                    <div className="flex items-center justify-center h-full bg-gradient-to-br from-emerald-800 to-teal-900 text-emerald-300 font-black text-3xl">
                        REGISTERED SANCTUARY
                    </div>
                )}

                {/* Visual Intelligence Overlays */}
                <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>

                {/* Primary Data Plane */}
                <div className="absolute bottom-12 left-12 right-12 z-20">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="bg-emerald-500 text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-2xl shadow-2xl shadow-emerald-500/40">
                            📍 {gem.town}
                        </span>
                        <div className="h-0.5 w-12 bg-white/20 rounded-full"></div>
                    </div>
                    <h1 className="text-4xl md:text-7xl font-black text-white tracking-widest leading-none drop-shadow-2xl uppercase">
                        {gem.title}
                    </h1>
                </div>
            </div>

            <div className="max-w-xl mx-auto px-6 -translate-y-8 md:translate-y-0 md:mt-12">

                <div className="space-y-12">

                    {/* Discovery Credit & Logistics */}
                    <div className="bg-white dark:bg-zinc-900 rounded-[3rem] p-8 md:p-10 shadow-sm border border-slate-100 dark:border-zinc-800">
                        <div className="flex items-center gap-4 mb-10 border-b border-slate-50 dark:border-zinc-800 pb-8">
                            <div className="w-16 h-16 rounded-[1.5rem] bg-slate-100 dark:bg-zinc-800 overflow-hidden relative shadow-inner border-2 border-white dark:border-zinc-800">
                                {gem.author?.avatar_url ? (
                                    <Image src={gem.author.avatar_url} alt="Discoverer" fill className="object-cover" />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-emerald-600 font-black text-xl">
                                        {gem.author?.full_name?.charAt(0) || 'G'}
                                    </div>
                                )}
                            </div>
                            <div>
                                <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-1">Explorer Authority</p>
                                <p className="text-lg font-black text-slate-900 dark:text-white leading-none">
                                    {gem.author?.full_name || 'Anonymous Guide'}
                                </p>
                            </div>
                        </div>

                        {/* Interactive Coordinates */}
                        {gem.latitude && gem.longitude && (
                            <div className="mb-10 bg-slate-50 dark:bg-zinc-800/50 rounded-[2rem] p-6 border border-slate-100 dark:border-zinc-700/50 group/map cursor-pointer">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-emerald-500">map</span>
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Coordinate Registry</span>
                                    </div>
                                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest group-hover/map:translate-x-1 transition-transform">Launch Navigation &rarr;</span>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white dark:bg-zinc-800 p-3 rounded-xl border border-slate-100 dark:border-zinc-700">
                                        <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Latitude</p>
                                        <p className="text-xs font-black text-slate-900 dark:text-white font-mono">{gem.latitude}</p>
                                    </div>
                                    <div className="bg-white dark:bg-zinc-800 p-3 rounded-xl border border-slate-100 dark:border-zinc-700">
                                        <p className="text-[8px] font-black text-slate-400 uppercase mb-1">Longitude</p>
                                        <p className="text-xs font-black text-slate-900 dark:text-white font-mono">{gem.longitude}</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Narrative Content */}
                        <div>
                            <h3 className="text-xs font-black uppercase tracking-[0.2em] text-emerald-600 mb-6 flex items-center gap-2">
                                <span className="material-symbols-outlined text-sm">auto_stories</span>
                                Sanctuary Report
                            </h3>
                            <div className="text-slate-700 dark:text-zinc-300 text-lg leading-relaxed font-medium whitespace-pre-wrap">
                                {gem.description}
                            </div>
                        </div>
                    </div>

                    {/* Traveler Intelligence Hub */}
                    <div className="border-t border-slate-100 dark:border-zinc-800 pt-12">
                        <div className="mb-8 flex flex-col gap-1 items-center text-center md:px-10">
                            <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter">Discover {gem.title}</h2>
                            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Share parking logistics, trail conditions, or local sightings specific to {gem.title}.</p>
                        </div>

                        <div className="bg-white dark:bg-zinc-900 rounded-[3rem] p-8 shadow-sm border border-slate-100 dark:border-zinc-800">
                            <UniversalComments entityId={gem.id} entityType="gem" />
                        </div>
                    </div>

                </div>
            </div>

            {/* Internal linking — more gems + nearby businesses */}
            <RelatedItems type="gems" town={gem.town} excludeId={String(gem.id)} />
        </div>
    );
}
