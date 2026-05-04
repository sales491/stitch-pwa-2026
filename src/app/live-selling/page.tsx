import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { getLiveSellingFeed, type LiveSellingEvent } from '@/lib/live-selling';
import BackButton from '@/components/BackButton';
import LiveEventActions from '@/components/LiveEventActions';
import SeoTextBlock from '@/components/SeoTextBlock';
import { createClient } from '@/utils/supabase/server';
import { hreflangAlternates, TAGALOG_KEYWORDS_LIVE_SELLING } from '@/utils/seo';

const BASE = 'https://marinduquemarket.com';

export const metadata: Metadata = {
    title: 'Live Selling Radar — Marinduque Sellers on TikTok, Shopee, FB & YouTube',
    description: 'Panoorin ang mga Marinduqueño na live selling ngayon sa TikTok, Shopee, Facebook at YouTube. Support local online entrepreneurs — watch, shop, and share!',
    keywords: [
        'live selling Marinduque', 'TikTok live Philippines', 'Shopee live seller Marinduque',
        'Facebook live selling Boac', 'YouTube live selling Philippines', 'online seller Marinduque',
        'live stream shopping Philippines', 'local sellers Marinduque island',
        'buy local Marinduque', 'live commerce Philippines 2026',
        ...TAGALOG_KEYWORDS_LIVE_SELLING,
    ],
    openGraph: {
        title: 'Live Selling Radar — Marinduque Market Hub',
        description: "Find local Marinduqueño sellers streaming live on TikTok, Shopee, Facebook, YouTube, and Instagram. Support your island's online entrepreneurs!",
        url: `${BASE}/live-selling`,
        type: 'website',
    },
    alternates: hreflangAlternates('/live-selling'),
};

// Revalidate every 60 seconds so the "Live Now" list is frequently updated
export const revalidate = 60;

// ── JSON-LD Structured Data — SEO / AEO / AIO ──────────────────────────────
const PAGE_SCHEMA = [
    {
        '@context': 'https://schema.org',
        '@type': 'CollectionPage',
        name: 'Live Selling Radar — Marinduque Market Hub',
        description: 'A community directory of local Marinduque sellers who are currently live or scheduled to go live on TikTok, Shopee, Facebook, YouTube, and Instagram.',
        url: `${BASE}/live-selling`,
        breadcrumb: {
            '@type': 'BreadcrumbList',
            itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: BASE },
                { '@type': 'ListItem', position: 2, name: 'Live Selling Radar', item: `${BASE}/live-selling` },
            ],
        },
    },
    {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
            {
                '@type': 'Question',
                name: 'What is the Live Selling Radar on Marinduque Market Hub?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'The Live Selling Radar is a free community tool that shows local Marinduque sellers who are currently streaming live or scheduled to stream on TikTok, Shopee, Facebook, YouTube, and Instagram. Buyers can browse active streams and upcoming schedules to support local entrepreneurs.',
                },
            },
            {
                '@type': 'Question',
                name: 'How do I post my live selling schedule on Marinduque Market Hub?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Log in to your Marinduque Market Hub account, go to the Live Selling Radar page, and tap the "+" button or "Post Schedule". Select your platform (TikTok, Shopee, Facebook, YouTube, or Instagram), paste your stream link, choose a date and time, and submit. Your listing will appear on the radar automatically.',
                },
            },
            {
                '@type': 'Question',
                name: 'Is it free to post a live selling schedule?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Yes, posting your live selling schedule on the Marinduque Market Hub is 100% free. There are no fees, subscriptions, or hidden charges. The platform is built to support local Marinduque entrepreneurs.',
                },
            },
            {
                '@type': 'Question',
                name: 'What live selling platforms are supported?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'The Live Selling Radar currently supports TikTok Live, Shopee Live, Facebook Live, YouTube Live, and Instagram Live. Sellers can post their stream link from any of these platforms.',
                },
            },
            {
                '@type': 'Question',
                name: 'Can I edit or delete my live selling post?',
                acceptedAnswer: {
                    '@type': 'Answer',
                    text: 'Yes. If you are logged in, a "Manage" button will appear on your event card. Clicking it reveals options to edit your stream details (platform, link, time, title) or delete the listing entirely. Only the original poster can manage their own listings.',
                },
            },
        ],
    },
];

// LiveSellingEvent type imported from '@/lib/live-selling'

function LiveCard({ event, isLiveNow, currentUserId }: { event: LiveSellingEvent, isLiveNow: boolean, currentUserId?: string | null }) {
    const formatTime = (dateStr: string) => {
        return new Date(dateStr).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    };

    const getPlatformColor = (platform: string) => {
        switch (platform) {
            case 'TikTok': return 'bg-black text-white';
            case 'Shopee': return 'bg-[#EE4D2D] text-white';
            case 'Facebook': return 'bg-[#1877F2] text-white';
            case 'YouTube': return 'bg-[#FF0000] text-white';
            case 'Instagram': return 'bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCAF45] text-white';
            default: return 'bg-slate-800 text-white';
        }
    };

    const sellerName = event.profiles?.full_name || 'Local Seller';

    return (
        <a 
            href={event.stream_link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="block relative w-full rounded-2xl bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 shadow-sm hover:shadow-md hover:border-red-200 dark:hover:border-red-900/50 transition-all group"
        >
            <div className="p-4 flex gap-4">
                <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-100 dark:bg-zinc-800 border-2 border-slate-200 dark:border-zinc-700 relative">
                        {event.profiles?.avatar_url ? (
                            <Image src={event.profiles.avatar_url} alt={`${sellerName} — live seller on Marinduque`} fill className="object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-slate-200 dark:bg-zinc-800">
                                <span className="material-symbols-outlined text-slate-400" aria-hidden="true">person</span>
                            </div>
                        )}
                    </div>
                </div>
                
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                            <h3 className="font-bold text-slate-900 dark:text-white text-[15px] leading-tight truncate group-hover:text-red-600 transition-colors">
                                {event.title}
                            </h3>
                            <p className="text-[12px] font-medium text-slate-500 dark:text-zinc-400 mt-0.5 truncate">
                                {sellerName} 
                            </p>
                        </div>
                        
                        {isLiveNow ? (
                            <div className="flex items-center gap-1.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-2 py-0.5 rounded-full border border-red-200 dark:border-red-800 shrink-0">
                                <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                <span className="text-[10px] font-black uppercase tracking-wider">LIVE</span>
                            </div>
                        ) : (
                            <div className="flex items-center bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 px-2.5 py-1 rounded-md shrink-0">
                                <span className="text-[11px] font-bold">{formatTime(event.scheduled_start)}</span>
                            </div>
                        )}
                    </div>
                    
                    <div className="mt-3 flex items-center justify-between">
                        <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${getPlatformColor(event.platform)}`}>
                            {event.platform}
                        </span>
                        {currentUserId === event.seller_id && (
                            <div className="z-20 relative">
                                <LiveEventActions eventId={event.id} />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </a>
    );
}

export default async function LiveSellingRadarPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    const { liveNow, upcoming } = await getLiveSellingFeed();

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(PAGE_SCHEMA) }}
            />
            <main className="bg-surface-light dark:bg-surface-dark min-h-screen pb-24">
                <BackButton />
                <div className="px-4 pt-12 pb-6">
                    <div className="flex justify-between items-start mb-2">
                        <h1 className="text-3xl font-black text-text-main tracking-tight leading-none">
                            Live Selling<br />Radar
                        </h1>
                        <Link
                            href="/live-selling/new"
                            className="bg-red-600 hover:bg-red-700 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg active:scale-95 transition-transform shrink-0"
                            aria-label="Post a live selling stream schedule"
                        >
                            <span className="material-symbols-outlined text-[20px]" aria-hidden="true">add</span>
                        </Link>
                    </div>
                    <p className="text-text-muted text-[13px] font-medium leading-relaxed max-w-sm">
                        Support local Marinduqueños selling on TikTok, Shopee, YouTube and FB.
                    </p>
                </div>

                <div className="px-4 space-y-8">
                    {/* 🔴 LIVE NOW SECTION */}
                    <section aria-label="Live streams happening now">
                        <div className="flex items-center gap-2 mb-4 pl-1">
                            <div className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
                            </div>
                            <h2 className="text-[14px] font-black uppercase tracking-widest text-red-600 dark:text-red-400">
                                Happening Now
                            </h2>
                        </div>
                        
                        <div className="space-y-3">
                            {liveNow.length > 0 ? (
                                liveNow.map((event) => (
                                    <LiveCard key={event.id} event={event} isLiveNow={true} currentUserId={user?.id} />
                                ))
                            ) : (
                                <div className="bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
                                    <span className="material-symbols-outlined text-[32px] text-slate-300 dark:text-zinc-600 mb-2" aria-hidden="true">videocam_off</span>
                                    <p className="text-[13px] font-bold text-slate-600 dark:text-zinc-400">No one is live right now</p>
                                    <p className="text-[11px] text-slate-400 dark:text-zinc-500 mt-1">Check the upcoming schedule below</p>
                                </div>
                            )}
                        </div>
                    </section>

                    <hr className="border-slate-100 dark:border-zinc-800" />

                    {/* 📅 UPCOMING SECTION */}
                    <section aria-label="Upcoming scheduled live streams">
                        <div className="flex items-center gap-2 mb-4 pl-1">
                            <span className="material-symbols-outlined text-[16px] text-slate-500" aria-hidden="true">calendar_month</span>
                            <h2 className="text-[14px] font-black uppercase tracking-widest text-slate-800 dark:text-zinc-200">
                                Upcoming Streams
                            </h2>
                        </div>

                        <div className="space-y-3">
                            {upcoming.length > 0 ? (
                                upcoming.map((event) => (
                                    <LiveCard key={event.id} event={event} isLiveNow={false} currentUserId={user?.id} />
                                ))
                            ) : (
                                <div className="p-8 text-center bg-white dark:bg-zinc-900 rounded-2xl shadow-sm">
                                    <p className="text-slate-500 dark:text-zinc-400 text-sm font-medium">No upcoming streams scheduled yet.</p>
                                </div>
                            )}
                        </div>
                    </section>

                    <hr className="border-slate-100 dark:border-zinc-800" />

                    {/* 📘 HOW IT WORKS — SEO/AIO instructional content */}
                    <section aria-label="How live selling works on Marinduque Market Hub">
                        <div className="flex items-center gap-2 mb-5 pl-1">
                            <span className="material-symbols-outlined text-[16px] text-slate-500" aria-hidden="true">help</span>
                            <h2 className="text-[14px] font-black uppercase tracking-widest text-slate-800 dark:text-zinc-200">
                                How It Works
                            </h2>
                        </div>

                        <div className="grid grid-cols-3 gap-3">
                            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-100 dark:border-zinc-800 p-4 text-center">
                                <div className="text-2xl mb-2">📝</div>
                                <h3 className="text-[11px] font-black text-slate-800 dark:text-zinc-200 uppercase tracking-wider mb-1">Schedule</h3>
                                <p className="text-[10px] text-slate-500 dark:text-zinc-400 leading-snug">Post your platform, link, date & time</p>
                            </div>
                            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-100 dark:border-zinc-800 p-4 text-center">
                                <div className="text-2xl mb-2">📡</div>
                                <h3 className="text-[11px] font-black text-slate-800 dark:text-zinc-200 uppercase tracking-wider mb-1">Go Live</h3>
                                <p className="text-[10px] text-slate-500 dark:text-zinc-400 leading-snug">Your listing appears on the radar automatically</p>
                            </div>
                            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-100 dark:border-zinc-800 p-4 text-center">
                                <div className="text-2xl mb-2">🧹</div>
                                <h3 className="text-[11px] font-black text-slate-800 dark:text-zinc-200 uppercase tracking-wider mb-1">Auto-Clean</h3>
                                <p className="text-[10px] text-slate-500 dark:text-zinc-400 leading-snug">Expired streams are removed automatically</p>
                            </div>
                        </div>
                    </section>
                    
                    {/* Call to action card */}
                    <div className="bg-gradient-to-br from-red-600 to-red-800 rounded-2xl p-5 text-white shadow-lg mt-8 relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="text-lg font-black mb-1">Are you a seller?</h3>
                            <p className="text-xs text-red-100 mb-4 opacity-90 max-w-[200px]">Post your scheduled stream here for free to get more local viewers.</p>
                            <Link 
                                href="/live-selling/new" 
                                className="inline-block bg-white text-red-700 text-[11px] font-black uppercase tracking-wider px-4 py-2.5 rounded-lg active:scale-95 transition-transform"
                            >
                                Post Schedule
                            </Link>
                        </div>
                        <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-[120px] opacity-10 rotate-[-15deg] pointer-events-none" aria-hidden="true">podcast</span>
                    </div>
                </div>

                {/* 🔍 SEO / AIO — Crawlable About Section */}
                <SeoTextBlock heading="About the Live Selling Radar">
                    <p>The Live Selling Radar is a free community tool for Marinduque online sellers. Local entrepreneurs from Boac, Mogpog, Gasan, Santa Cruz, Torrijos, and Buenavista can post their upcoming TikTok, Shopee, Facebook, YouTube, and Instagram live selling schedules so the community knows exactly when to tune in. Whether you sell ukay-ukay jackets, fresh seafood, handmade ornaments, or agricultural products — this is your stage to reach local buyers.</p>
                    <p>Buyers can browse the &quot;Happening Now&quot; section to join active streams, or check &quot;Upcoming Streams&quot; to plan ahead. All sellers must log in with their Marinduque Market Hub account to post. Listings automatically expire after the stream&apos;s estimated duration ends, keeping the radar fresh and accurate. Editing and deleting your own listings is easy — just tap the &quot;Manage&quot; button on your card.</p>
                </SeoTextBlock>
            </main>
        </>
    );
}
