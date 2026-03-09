'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { approveListing, rejectListing } from '@/app/actions/listings';

type PendingListing = {
    id: string;
    title: string;
    description: string;
    price: string;
    price_value: number | null;
    category: string;
    town: string;
    images: string[];
    created_at: string;
    status: string;
    user_id: string;
    seller?: {
        full_name: string | null;
        avatar_url: string | null;
    } | null;
};

function ListingModerationCard({ listing, onAction }: { listing: PendingListing; onAction: () => void }) {
    const [isPending, startTransition] = useTransition();
    const [actionDone, setActionDone] = useState<'approved' | 'rejected' | null>(null);

    const handleApprove = () => {
        startTransition(async () => {
            try {
                await approveListing(listing.id);
                setActionDone('approved');
                onAction();
            } catch (err) {
                console.error(err);
                alert('Failed to approve. Please try again.');
            }
        });
    };

    const handleReject = () => {
        startTransition(async () => {
            try {
                await rejectListing(listing.id);
                setActionDone('rejected');
                onAction();
            } catch (err) {
                console.error(err);
                alert('Failed to reject. Please try again.');
            }
        });
    };

    if (actionDone) {
        return (
            <div className={`rounded-[1.75rem] border p-5 flex items-center gap-3 transition-all animate-in fade-in ${actionDone === 'approved' ? 'bg-teal-50 border-teal-200' : 'bg-slate-50 border-slate-200'}`}>
                <span className={`material-symbols-outlined text-2xl ${actionDone === 'approved' ? 'text-teal-500' : 'text-slate-400'}`}>
                    {actionDone === 'approved' ? 'check_circle' : 'cancel'}
                </span>
                <div>
                    <p className="font-black text-sm text-slate-800">{listing.title}</p>
                    <p className={`text-[11px] font-black uppercase tracking-widest ${actionDone === 'approved' ? 'text-teal-600' : 'text-slate-400'}`}>
                        {actionDone === 'approved' ? 'Approved & Live' : 'Rejected'}
                    </p>
                </div>
            </div>
        );
    }

    const mainImage = listing.images?.[0];
    const sellerName = listing.seller?.full_name || 'Unknown User';
    const avatarUrl = listing.seller?.avatar_url;
    const timeAgo = (() => {
        const diff = Date.now() - new Date(listing.created_at).getTime();
        const mins = Math.floor(diff / 60000);
        if (mins < 60) return `${mins}m ago`;
        const hrs = Math.floor(mins / 60);
        if (hrs < 24) return `${hrs}h ago`;
        return `${Math.floor(hrs / 24)}d ago`;
    })();

    return (
        <div className={`bg-white dark:bg-zinc-900 rounded-[1.75rem] border border-slate-100 dark:border-white/5 shadow-sm overflow-hidden transition-all ${isPending ? 'opacity-60 pointer-events-none' : ''}`}>
            {/* Seller header */}
            <div className="flex items-center gap-3 px-5 pt-5 pb-3">
                <div className="w-10 h-10 rounded-xl bg-slate-200 dark:bg-zinc-700 overflow-hidden shrink-0">
                    {avatarUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={avatarUrl} alt={sellerName} className="w-full h-full object-cover" />
                    ) : (
                        <div className="flex items-center justify-center h-full text-sm font-black text-slate-500 dark:text-slate-300">
                            {sellerName.charAt(0)}
                        </div>
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <p className="font-black text-sm text-slate-800 dark:text-white truncate">{sellerName}</p>
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                        <span className="material-symbols-outlined text-[11px]">location_on</span>
                        <span>{listing.town}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-zinc-600 inline-block mx-0.5" />
                        <span>{timeAgo}</span>
                    </div>
                </div>
                <span className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 text-[10px] font-black px-2.5 py-1 rounded-2xl uppercase tracking-wider shrink-0">
                    {listing.category}
                </span>
            </div>

            {/* Content */}
            <div className="flex gap-4 px-5 pb-4">
                <div className="flex-1 min-w-0">
                    <h3 className="font-black text-base text-slate-900 dark:text-white leading-tight mb-1">{listing.title}</h3>
                    {listing.price && (
                        <p className="text-moriones-red font-black text-sm mb-2">{listing.price}</p>
                    )}
                    <p className="text-slate-500 dark:text-zinc-400 text-sm leading-relaxed line-clamp-3">{listing.description}</p>
                </div>
                {mainImage && (
                    <div className="w-24 h-24 shrink-0 rounded-xl overflow-hidden border border-slate-100 dark:border-white/5 relative">
                        <Image src={mainImage} alt={listing.title} fill className="object-cover" />
                    </div>
                )}
            </div>

            {/* Action Bar */}
            <div className="flex items-center justify-between px-5 py-3 bg-slate-50 dark:bg-zinc-800/50 border-t border-slate-100 dark:border-white/5">
                <Link
                    href={`/marketplace/${listing.id}`}
                    target="_blank"
                    className="text-[11px] font-black text-slate-500 hover:text-slate-800 dark:hover:text-white uppercase tracking-widest flex items-center gap-1.5 transition-colors"
                >
                    <span className="material-symbols-outlined text-base">open_in_new</span>
                    Preview
                </Link>
                <div className="flex items-center gap-3">
                    <button
                        onClick={handleReject}
                        disabled={isPending}
                        className="w-11 h-11 flex items-center justify-center rounded-full bg-white dark:bg-zinc-800 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 border border-slate-200 dark:border-white/10 hover:border-red-300 shadow-sm transition-all active:scale-90"
                        title="Reject listing"
                    >
                        {isPending ? (
                            <div className="w-4 h-4 border-2 border-slate-300 border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <span className="material-symbols-outlined">close</span>
                        )}
                    </button>
                    <button
                        onClick={handleApprove}
                        disabled={isPending}
                        className="w-11 h-11 flex items-center justify-center rounded-full bg-teal-500 text-white hover:bg-teal-600 shadow-lg shadow-teal-500/20 transition-all active:scale-90"
                        title="Approve listing"
                    >
                        {isPending ? (
                            <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                        ) : (
                            <span className="material-symbols-outlined">check</span>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function ModerationClient({ listings: initialListings }: { listings: PendingListing[] }) {
    const [listings, setListings] = useState(initialListings);
    const [approvedCount, setApprovedCount] = useState(0);
    const [rejectedCount, setRejectedCount] = useState(0);

    const handleAction = () => {
        // We don't remove the card (we animate it to done state), 
        // but we track how many were actioned
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-zinc-950">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/95 dark:bg-zinc-900/95 backdrop-blur border-b border-slate-200 dark:border-white/5 px-4 py-4">
                <div className="max-w-2xl mx-auto flex items-center gap-3">
                    <Link href="/admin" className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors text-slate-600 dark:text-slate-300">
                        <span className="material-symbols-outlined">arrow_back</span>
                    </Link>
                    <div className="flex-1">
                        <h1 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Listing Moderation</h1>
                        <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest">
                            {listings.length} pending review
                        </p>
                    </div>
                    {listings.length > 0 && (
                        <span className="bg-moriones-red text-white text-sm font-black w-7 h-7 rounded-full flex items-center justify-center">
                            {listings.length}
                        </span>
                    )}
                </div>
            </header>

            <main className="max-w-2xl mx-auto px-4 py-6 pb-24 space-y-4">
                {listings.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-center">
                        <div className="w-20 h-20 bg-white dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4 shadow-sm border border-slate-100 dark:border-zinc-700">
                            <span className="material-symbols-outlined text-teal-500 text-4xl">check_circle</span>
                        </div>
                        <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-tight">All clear!</h3>
                        <p className="text-slate-500 text-[11px] font-black uppercase tracking-widest mt-1">No pending listings to review</p>
                    </div>
                ) : (
                    listings.map((listing) => (
                        <ListingModerationCard key={listing.id} listing={listing} onAction={handleAction} />
                    ))
                )}
            </main>
        </div>
    );
}
