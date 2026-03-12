'use client';

import { useState } from 'react';
import { deleteBarangayPost, BarangayPost } from '@/app/actions/barangay-board';

function timeAgo(date: string) {
    const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    const m = Math.floor(seconds / 60); if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60); if (h < 24) return `${h}h ago`;
    const d = Math.floor(h / 24); return `${d}d ago`;
}

type Props = {
    post: BarangayPost;
    canManage?: boolean;
    onDeleted?: (id: string) => void;
};

export default function BarangayPostCard({ post, canManage, onDeleted }: Props) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!confirm('Remove this post?')) return;
        setIsDeleting(true);
        await deleteBarangayPost(post.id);
        onDeleted?.(post.id);
    };

    const initials = post.author?.full_name
        ? post.author.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
        : '?';

    return (
        <div className={`bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl px-4 py-4 shadow-sm transition-all ${isDeleting ? 'opacity-40' : ''}`}>
            <div className="flex items-start gap-3">
                {/* Avatar */}
                {post.author?.avatar_url ? (
                    <img src={post.author.avatar_url} alt={post.author.full_name ?? ''} className="w-9 h-9 rounded-full object-cover flex-shrink-0" referrerPolicy="no-referrer" />
                ) : (
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-500 to-blue-500 flex items-center justify-center text-white text-[11px] font-black flex-shrink-0">
                        {initials}
                    </div>
                )}

                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                        <p className="text-[12px] font-black text-slate-900 dark:text-white">
                            {post.author?.full_name ?? 'Community member'}
                        </p>
                        <span className="text-[10px] text-slate-400 dark:text-zinc-500 flex-shrink-0 ml-2">
                            {timeAgo(post.created_at)}
                        </span>
                    </div>

                    <p className="text-[13px] text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                        {post.content}
                    </p>

                    {canManage && (
                        <div className="mt-2 flex justify-end">
                            <button
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="text-[10px] font-black text-rose-400 hover:underline disabled:opacity-40"
                            >
                                Remove
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
