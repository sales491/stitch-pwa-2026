'use client';

import Link from 'next/link';
import { LostFoundPost } from '@/app/actions/lost-found';
import ShareButton from './ShareButton';

const CATEGORY_ICONS: Record<string, string> = {
    animal: '🐾',
    item: '📦',
    document: '📄',
    person: '👤',
};

const CATEGORY_LABELS: Record<string, string> = {
    animal: 'Animal',
    item: 'Item',
    document: 'Document',
    person: 'Person',
};

function timeAgo(date: string) {
    const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return new Date(date).toLocaleDateString('en-PH', { month: 'short', day: 'numeric' });
}

export default function LostFoundCard({ post }: { post: LostFoundPost }) {
    const isLost = post.type === 'lost';
    const isResolved = post.status === 'resolved';

    return (
        <Link
            href={`/my-barangay/lost-found/${post.id}`}
            className={`relative flex gap-3 bg-white dark:bg-zinc-900 border rounded-2xl overflow-hidden shadow-sm hover:shadow-md active:scale-[0.99] transition-all ${
                isResolved ? 'border-slate-200 dark:border-zinc-800 opacity-60' : 'border-slate-200 dark:border-zinc-800'
            }`}
        >
            {/* Photo strip */}
            {post.image_url ? (
                <div className="w-24 h-full flex-shrink-0 bg-slate-100 dark:bg-zinc-800">
                    <img
                        src={post.image_url}
                        alt={post.title}
                        className="w-24 h-full object-cover"
                        style={{ minHeight: '96px' }}
                    />
                </div>
            ) : (
                <div className="w-16 flex-shrink-0 flex items-center justify-center bg-slate-50 dark:bg-zinc-800 text-3xl">
                    {CATEGORY_ICONS[post.category] ?? '🔍'}
                </div>
            )}

            {/* Content */}
            <div className="flex-1 min-w-0 py-3 pr-3">
                {/* Badges row */}
                <div className="flex items-center gap-1.5 mb-1.5 flex-wrap">
                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest ${
                        isResolved
                            ? 'bg-slate-100 dark:bg-zinc-700 text-slate-400 dark:text-slate-500'
                            : isLost
                            ? 'bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-400'
                            : 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400'
                    }`}>
                        {isResolved ? 'Resolved' : isLost ? 'Lost' : 'Found'}
                    </span>
                    <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-slate-400">
                        {CATEGORY_ICONS[post.category]} {CATEGORY_LABELS[post.category]}
                    </span>
                </div>

                {/* Title */}
                <p className="font-black text-slate-900 dark:text-white text-[13px] leading-snug line-clamp-1 mb-0.5">
                    {post.title}
                </p>

                {/* Description */}
                {post.description && (
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-snug mb-2">
                        {post.description}
                    </p>
                )}

                {/* Location + time */}
                <div className="flex items-center gap-1 text-[10px] text-slate-400 dark:text-zinc-500 flex-wrap">
                    {(post.location || post.municipality) && (
                        <span className="flex items-center gap-0.5">
                            <span className="material-symbols-outlined text-[11px]">location_on</span>
                            {[post.location, post.municipality].filter(Boolean).join(', ')}
                        </span>
                    )}
                    <span className="text-slate-300 dark:text-zinc-700">·</span>
                    <span>{timeAgo(post.created_at)}</span>
                </div>
            </div>

            {/* Action Column */}
            <div className="flex-shrink-0 flex flex-col items-center justify-between py-3 pr-3">
                <div onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
                    <ShareButton 
                        title={`Stitch: ${isLost ? 'Missing' : 'Found'} ${CATEGORY_LABELS[post.category]}`}
                        text={`Help spread the word! ${isLost ? 'Missing' : 'Found'}: ${post.title}`}
                        url={`/my-barangay/lost-found/${post.id}`}
                        variant="icon"
                        className="w-8 h-8 rounded-full border-none shadow-none text-slate-400 hover:text-rose-500 dark:hover:text-rose-400"
                    />
                </div>
                <div className="flex items-center justify-center w-8 h-8 bg-slate-50 dark:bg-zinc-800 rounded-full group-hover:bg-slate-100 dark:group-hover:bg-zinc-700 transition-colors">
                    <span className="material-symbols-outlined text-slate-300 dark:text-zinc-500 text-[18px]">chevron_right</span>
                </div>
            </div>
        </Link>
    );
}
