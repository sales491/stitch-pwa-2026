import type { Metadata } from 'next';
import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import Image from 'next/image';
import SeoTextBlock from '@/components/SeoTextBlock';

export const metadata: Metadata = {
    title: 'Marinduque News | Local Updates & Information',
    description: 'Get the latest automated short-form news and updates from across Marinduque. Daily public updates optimized for fast reading.',
    openGraph: {
        title: 'Marinduque News | Marinduque Connect',
        description: 'Get the latest automated short-form news and updates from across Marinduque.',
        url: 'https://marinduquemarket.com/news',
    },
    keywords: ['Marinduque News', 'Balitang Marinduque', 'Marinduque Updates', 'Marinduque Announcements', 'Boac news', 'Mogpog news']
};

export const revalidate = 60; 

export default async function NewsFeed() {
    const supabase = await createClient();
    
    // Fetch published news
    const { data: articles, error } = await supabase
        .from('news')
        .select('*')
        .eq('status', 'published')
        .order('published_at', { ascending: false });

    if (error) {
        console.error('Failed to fetch news:', error);
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-8 pb-32 md:pb-12">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify({
                    '@context': 'https://schema.org',
                    '@type': 'CollectionPage',
                    name: metadata.openGraph?.title || 'Marinduque News',
                    description: metadata.openGraph?.description,
                    url: 'https://marinduquemarket.com/news'
                }) }}
            />

            <div className="mb-8">
                <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white mb-2">Marinduque News</h1>
                <p className="text-slate-600 dark:text-slate-400">Brief, daily updates and local announcements driven by AI.</p>
            </div>

            {(!articles || articles.length === 0) ? (
                <div className="p-12 text-center text-slate-500 bg-slate-50 dark:bg-zinc-800/50 rounded-3xl border border-slate-100 dark:border-zinc-800">
                    <p>Check back soon. Fresh news is being pulled in.</p>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {articles.map((a: any) => (
                        <Link 
                            href={`/news/${a.slug}`} 
                            key={a.id} 
                            className="flex flex-col group bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-lg hover:border-moriones-red/50 transition-all duration-300 transform hover:-translate-y-1"
                        >
                            <div className="relative h-48 w-full bg-slate-100 dark:bg-zinc-800">
                                {a.image_url ? (
                                    <Image 
                                        src={a.image_url} 
                                        alt={a.title} 
                                        fill 
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        <span className="material-symbols-outlined text-4xl text-slate-300">newspaper</span>
                                    </div>
                                )}
                                <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-widest z-10">
                                    News Update
                                </div>
                            </div>
                            <div className="p-5 flex flex-col flex-grow justify-between">
                                <div>
                                    <h2 className="text-lg font-black text-slate-900 dark:text-white leading-tight mb-2 group-hover:text-moriones-red transition-colors">{a.title}</h2>
                                    <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 mb-4">{a.summary}</p>
                                </div>
                                <div className="text-[11px] font-bold text-slate-400 flex justify-between items-center mt-auto">
                                    <span>{new Date(a.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                    <span className="text-moriones-red group-hover:underline">Read Article &rarr;</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
            
            <div className="mt-12">
                <SeoTextBlock heading="About the AI-Assisted News Feed">
                    <p>The Marinduque News page aggregates and optimizes local public information for quick reading. Using advanced AI agents, we synthesize announcements into a concise format, ensuring high-value takeaways for our users, optimizing images, and keeping you updated directly from your PWA.</p>
                </SeoTextBlock>
            </div>
        </div>
    );
}
