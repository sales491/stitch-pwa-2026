import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import BackButton from '@/components/BackButton';
import ShareButton from '@/components/ShareButton';
import { hreflangAlternates } from '@/utils/seo';
import { TOWNS, TownData } from '@/data/towns';

// export const revalidate = 86400; // 1 day (commented out to clear cache)

interface PageProps {
    params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
    return Object.keys(TOWNS).map((slug) => ({
        slug,
    }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const town = TOWNS[slug];
    
    if (!town) return {};

    const url = `https://marinduquemarket.com/towns/${slug}`;

    return {
        title: `${town.name} Marinduque — ${town.tagline} | Tourist Guide`,
        description: town.description,
        keywords: town.keywords,
        alternates: hreflangAlternates(`/towns/${slug}`),
        openGraph: {
            title: `${town.name} — ${town.tagline}`,
            description: town.description,
            url,
            images: town.image_url ? [{ url: `https://marinduquemarket.com${town.image_url}` }] : [],
        }
    };
}

export default async function TownPage({ params }: PageProps) {
    const { slug } = await params;
    const town = TOWNS[slug];

    if (!town) {
        notFound();
    }

    // JSON-LD for the town (AEO Optimized)
    const jsonLd = [
        {
            '@context': 'https://schema.org',
            '@type': 'TouristDestination',
            name: `${town.name}, Marinduque`,
            description: town.description,
            url: `https://marinduquemarket.com/towns/${slug}`,
            ...(town.image_url && { image: `https://marinduquemarket.com${town.image_url}` }),
            touristType: ['City', 'Municipality', 'Cultural Tourism', 'Ecotourism']
        },
        {
            '@context': 'https://schema.org',
            '@type': 'Article',
            headline: `${town.name} Marinduque — ${town.tagline}`,
            description: town.description,
            image: town.image_url ? `https://marinduquemarket.com${town.image_url}` : undefined,
            author: {
                '@type': 'Organization',
                name: 'Marinduque Market'
            },
            publisher: {
                '@type': 'Organization',
                name: 'Marinduque Market',
                logo: {
                    '@type': 'ImageObject',
                    url: 'https://marinduquemarket.com/icon.png'
                }
            },
            datePublished: '2026-04-23T00:00:00Z',
            dateModified: new Date().toISOString()
        }
    ];

    return (
        <div className="relative min-h-screen bg-slate-50 dark:bg-zinc-950 pb-32 md:pb-12">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* Header / Hero Image */}
            <div className="relative w-full h-[40vh] md:h-[50vh] bg-slate-200 dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800">
                {town.image_url ? (
                    <Image 
                        src={town.image_url} 
                        alt={`${town.name} Marinduque`} 
                        fill 
                        className="object-cover opacity-90"
                        priority
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-100 dark:bg-zinc-800">
                        <span className="material-symbols-outlined text-6xl text-slate-300">location_city</span>
                    </div>
                )}
                
                {/* Back Button Overlay */}
                <BackButton className="absolute top-4 left-4 z-20 bg-black/30 backdrop-blur-md text-white hover:bg-black/50" />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-50 dark:from-zinc-950 via-transparent to-transparent opacity-100 h-full w-full" />
            </div>

            {/* Content Container */}
            <div className="max-w-3xl mx-auto px-5 md:px-0 -mt-16 relative z-10">
                <div className="bg-white dark:bg-zinc-900 rounded-[2rem] p-6 md:p-10 shadow-2xl shadow-black/5 dark:shadow-black/20 border border-slate-100 dark:border-zinc-800 mb-8">
                    
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-moriones-red" style={{ fontSize: 20 }}>{town.icon}</span>
                            <p className="text-xs font-bold uppercase tracking-widest text-moriones-red">
                                Municipality of Marinduque
                            </p>
                        </div>
                        <ShareButton 
                            title={`${town.name} — ${town.tagline}`} 
                            text={town.description} 
                            url={`/towns/${town.slug}`} 
                            variant="icon" 
                            className="bg-slate-100 dark:bg-zinc-800"
                        />
                    </div>

                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight mb-3 tracking-tight">
                        {town.name}
                    </h1>

                    <p className="text-xl md:text-2xl font-bold text-slate-500 dark:text-slate-400 mb-8">
                        {town.tagline}
                    </p>

                    <p className="text-lg md:text-xl font-medium text-slate-600 dark:text-slate-300 leading-relaxed mb-8 border-l-4 border-moriones-red pl-4">
                        {town.description}
                    </p>

                    <div className="w-full h-px bg-slate-100 dark:bg-zinc-800 mb-8" />

                    {/* Main HTML Content */}
                    <article 
                        className="max-w-none text-lg leading-relaxed text-slate-700 dark:text-slate-300 [&>h2]:text-2xl md:[&>h2]:text-3xl [&>h2]:font-black [&>h2]:text-slate-900 dark:[&>h2]:text-white [&>h2]:mb-4 [&>h2]:mt-8 [&>h3]:text-xl md:[&>h3]:text-2xl [&>h3]:font-bold [&>h3]:text-slate-800 dark:[&>h3]:text-slate-100 [&>h3]:mb-3 [&>h3]:mt-6 [&>p]:mb-6 [&>ul]:list-disc [&>ul]:ml-6 [&>ul]:mb-6 [&>ul>li]:mb-2 [&>ul>li]:text-slate-700 dark:[&>ul>li]:text-slate-300 [&>strong]:text-moriones-red [&>img]:w-full [&>img]:rounded-2xl [&>img]:shadow-lg [&>img]:my-8 [&>img]:object-cover [&>figure]:my-8 [&>figure>img]:w-full [&>figure>img]:rounded-2xl [&>figure>img]:shadow-lg [&>figure>img]:object-cover [&>figure>figcaption]:text-center [&>figure>figcaption]:text-sm [&>figure>figcaption]:text-slate-500 dark:[&>figure>figcaption]:text-slate-400 [&>figure>figcaption]:mt-3 [&>figure>figcaption]:italic [&>hr]:my-10 [&>hr]:border-slate-200 dark:[&>hr]:border-zinc-800"
                        dangerouslySetInnerHTML={{ __html: town.content }} 
                    />
                    
                    {/* Link back to Directory */}
                    <div className="mt-12 bg-slate-50 dark:bg-zinc-950/50 p-8 rounded-3xl border border-slate-200 dark:border-zinc-800 text-center shadow-inner">
                        <span className="material-symbols-outlined text-4xl text-slate-300 dark:text-zinc-700 mb-3">storefront</span>
                        <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">Explore Local Commerce</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 max-w-sm mx-auto leading-relaxed">
                            Fascinated by {town.name}? Support the local economy by visiting our verified business directory for this town.
                        </p>
                        <Link 
                            href={`/directory/${slug}`}
                            className="inline-flex items-center gap-2 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-6 py-3 rounded-full font-bold text-sm hover:scale-105 transition-transform"
                        >
                            Visit {town.name} Directory
                            <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
