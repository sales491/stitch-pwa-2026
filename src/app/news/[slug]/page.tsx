import { Metadata } from 'next';
import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import BackButton from '@/components/BackButton';
import ShareButton from '@/components/ShareButton';
export const revalidate = 60; // Dynamic route can revalidate safely

interface PageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const supabase = await createClient();
    const { data: article } = await supabase
        .from('news')
        .select('*')
        .eq('slug', slug)
        .single();

    if (!article) return {};

    return {
        title: `${article.title} | Marinduque News`,
        description: article.summary,
        openGraph: {
            title: article.title,
            description: article.summary,
            images: article.image_url ? [article.image_url] : undefined,
        }
    };
}

export default async function NewsArticlePage({ params }: PageProps) {
    const { slug } = await params;
    const supabase = await createClient();
    
    const { data: article } = await supabase
        .from('news')
        .select('*')
        .eq('slug', slug)
        .single();

    if (!article) {
        notFound();
    }

    // Prepare JSON-LD
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'NewsArticle',
        headline: article.title,
        image: article.image_url ? [article.image_url] : [],
        datePublished: article.published_at || article.created_at,
        dateModified: article.published_at || article.created_at,
        description: article.summary,
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `https://marinduquemarket.com/news/${article.slug}`
        }
    };

    const faqJsonLd = (article.faq_json && article.faq_json.length > 0) ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: article.faq_json.map((faq: any) => ({
            '@type': 'Question',
            name: faq.question || faq.q,
            acceptedAnswer: {
                '@type': 'Answer',
                text: faq.answer || faq.a
            }
        }))
    } : null;

    return (
        <div className="relative min-h-screen bg-slate-50 dark:bg-zinc-950 pb-32 md:pb-12">
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            {faqJsonLd && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
                />
            )}

            {/* Header / Hero Image */}
            <div className="relative w-full h-[50vh] md:h-[60vh] bg-slate-200 dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800">
                {article.image_url ? (
                    <Image 
                        src={article.image_url} 
                        alt={article.title} 
                        fill 
                        className="object-cover"
                        priority
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-slate-100 dark:bg-zinc-800">
                        <span className="material-symbols-outlined text-6xl text-slate-300">newspaper</span>
                    </div>
                )}
                
                {/* Back Button Overlay */}
                <BackButton className="absolute top-4 left-4 z-20 bg-black/30 backdrop-blur-md text-white hover:bg-black/50" />
                
                {/* Share Button Overlay */}
                <div className="absolute top-4 right-4 z-20">
                    <ShareButton 
                        title={`${article.title} | Marinduque News`} 
                        text={article.summary} 
                        url={`/news/${article.slug}`} 
                        variant="icon" 
                        className="bg-black/30 backdrop-blur-md text-white border-0 hover:bg-black/50 hover:text-white dark:bg-black/30 dark:hover:bg-black/50"
                    />
                </div>
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-50 dark:from-zinc-950 via-transparent to-transparent opacity-100 h-full w-full" />
            </div>

            {/* Content Container */}
            <div className="max-w-3xl mx-auto px-5 md:px-0 -mt-24 relative z-10">
                <div className="bg-white dark:bg-zinc-900 rounded-[2rem] p-6 md:p-10 shadow-2xl shadow-black/5 dark:shadow-black/20 border border-slate-100 dark:border-zinc-800 mb-8">
                    
                    {/* Timestamp and Share Button */}
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-xs font-bold uppercase tracking-widest text-moriones-red">
                            {new Date(article.published_at || article.created_at).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                        <ShareButton 
                            title={article.title} 
                            text={article.summary} 
                            url={`/news/${article.slug}`} 
                            variant="icon" 
                            className="bg-slate-100 dark:bg-zinc-800"
                        />
                    </div>

                    {/* Headline */}
                    <h1 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white leading-tight mb-4 tracking-tight">
                        {article.title}
                    </h1>

                    {/* Summary */}
                    <p className="text-lg md:text-xl font-medium text-slate-600 dark:text-slate-300 leading-relaxed mb-8 border-l-4 border-moriones-red pl-4">
                        {article.summary}
                    </p>

                    <div className="w-full h-px bg-slate-100 dark:bg-zinc-800 mb-8" />

                    {/* Main HTML Content */}
                    <div 
                        className="max-w-none text-lg leading-relaxed text-slate-700 dark:text-slate-300 [&>h2]:text-2xl md:[&>h2]:text-3xl [&>h2]:font-black [&>h2]:text-slate-900 dark:[&>h2]:text-white [&>h2]:mb-4 [&>h2]:mt-8 [&>p]:mb-6 [&>ul]:list-disc [&>ul]:ml-6 [&>ul]:mb-6 [&>ul>li]:mb-2 [&>ul>li]:text-slate-700 dark:[&>ul>li]:text-slate-300 [&>a]:text-moriones-red hover:[&>a]:underline [&>img]:rounded-2xl [&>img]:my-8"
                        dangerouslySetInnerHTML={{ __html: article.content }} 
                    />

                    {/* Key Takeaways */}
                    {article.key_takeaways && article.key_takeaways.length > 0 && (
                        <div className="mt-12 bg-slate-50 dark:bg-zinc-800/50 p-6 rounded-2xl border border-slate-100 dark:border-zinc-800">
                            <h3 className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                                <span className="material-symbols-outlined text-moriones-red">bolt</span>
                                Key Takeaways
                            </h3>
                            <ul className="space-y-3">
                                {article.key_takeaways.map((point: string, idx: number) => (
                                    <li key={idx} className="flex gap-3 text-slate-700 dark:text-slate-300 text-[15px]">
                                        <span className="shrink-0 w-1.5 h-1.5 mt-2 rounded-full bg-moriones-red" />
                                        <span className="leading-relaxed">{point}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Frequently Asked Questions */}
                    {article.faq_json && article.faq_json.length > 0 && (
                        <div className="mt-12 border-t border-slate-100 dark:border-zinc-800 pt-8">
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-6">
                                Frequently Asked Questions
                            </h3>
                            <div className="space-y-6">
                                {article.faq_json.map((faq: any, idx: number) => (
                                    <div key={idx} className="bg-slate-50 dark:bg-zinc-800/30 rounded-2xl p-6 border border-slate-100 dark:border-zinc-800/50">
                                        <h4 className="text-[17px] font-bold text-slate-900 dark:text-white mb-2">
                                            {faq.question || faq.q}
                                        </h4>
                                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                                            {faq.answer || faq.a}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
