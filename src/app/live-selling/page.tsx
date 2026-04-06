import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { getLiveSellingFeed } from '@/lib/live-selling';
import BackButton from '@/components/BackButton';
import PageHeader from '@/components/PageHeader';
import LiveEventActions from '@/components/LiveEventActions';
import { createClient } from '@/utils/supabase/server';

export const metadata: Metadata = {
    title: 'Live Selling Radar | Marinduque Market Hub',
    description: 'Find local Marinduqueños selling live on TikTok, Shopee, YouTube, and Facebook. Support your local online sellers!',
};

// Revalidate every 60 seconds so the "Live Now" list is frequently updated
export const revalidate = 60;

function LiveCard({ event, isLiveNow, currentUserId }: { event: any, isLiveNow: boolean, currentUserId?: string | null }) {
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

    return (
        <a 
            href={event.stream_link} 
            target="_blank" 
            rel="noopener noreferrer"
            className="block relative w-full rounded-2xl bg-white dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 shadow-sm hover:shadow-md hover:border-red-200 dark:hover:border-red-900/50 transition-all group overflow-hidden"
        >
            {currentUserId === event.seller_id && (
                <LiveEventActions eventId={event.id} />
            )}
            <div className="p-4 flex gap-4">
                <div className="flex-shrink-0">
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-100 dark:bg-zinc-800 border-2 border-slate-200 dark:border-zinc-700">
                        {event.profiles?.avatar_url ? (
                            <img src={event.profiles.avatar_url} alt={event.profiles.full_name || 'Seller'} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-slate-200 dark:bg-zinc-800">
                                <span className="material-symbols-outlined text-slate-400">person</span>
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
                                {event.profiles?.full_name || 'Local Seller'} 
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
                    
                    <div className="mt-3">
                        <span className={`inline-block px-2.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider ${getPlatformColor(event.platform)}`}>
                            {event.platform}
                        </span>
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
        <div className="bg-surface-light dark:bg-surface-dark min-h-screen pb-24">
            <BackButton />
            <div className="px-4 pt-12 pb-6">
                <div className="flex justify-between items-start mb-2">
                    <h1 className="text-3xl font-black text-text-main tracking-tight leading-none">
                        Live Selling<br />Radar
                    </h1>
                    <Link
                        href="/live-selling/new"
                        className="bg-red-600 hover:bg-red-700 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-lg active:scale-95 transition-transform shrink-0"
                        aria-label="Post a live stream"
                    >
                        <span className="material-symbols-outlined text-[20px]">add</span>
                    </Link>
                </div>
                <p className="text-text-muted text-[13px] font-medium leading-relaxed max-w-sm">
                    Support local Marinduqueños selling on TikTok, Shopee, YouTube and FB.
                </p>
            </div>

            <div className="px-4 space-y-8">
                {/* 🔴 LIVE NOW SECTION */}
                <section>
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
                                <span className="material-symbols-outlined text-[32px] text-slate-300 dark:text-zinc-600 mb-2">videocam_off</span>
                                <p className="text-[13px] font-bold text-slate-600 dark:text-zinc-400">No one is live right now</p>
                                <p className="text-[11px] text-slate-400 dark:text-zinc-500 mt-1">Check the upcoming schedule below</p>
                            </div>
                        )}
                    </div>
                </section>

                <hr className="border-slate-100 dark:border-zinc-800" />

                {/* 📅 UPCOMING SECTION */}
                <section>
                    <div className="flex items-center gap-2 mb-4 pl-1">
                        <span className="material-symbols-outlined text-[16px] text-slate-500">calendar_month</span>
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
                    <span className="material-symbols-outlined absolute -right-4 -bottom-4 text-[120px] opacity-10 rotate-[-15deg] pointer-events-none">podcast</span>
                </div>
            </div>
        </div>
    );
}
