'use client';

import { useState, useTransition } from 'react';
import { getBarangayPosts, BarangayPost } from '@/app/actions/barangay-board';
import BarangayPostCard from './BarangayPostCard';
import CreateBarangayPostForm from './CreateBarangayPostForm';
import { useAuth } from './AuthProvider';

type Props = {
    initialPosts: BarangayPost[];
    barangay: string;
    municipality: string;
    currentUserId?: string | null;
};

export default function BarangayFeed({ initialPosts, barangay, municipality, currentUserId }: Props) {
    const { profile } = useAuth() as any;
    const [posts, setPosts] = useState<BarangayPost[]>(initialPosts);
    const [hasMore, setHasMore] = useState(initialPosts.length >= 20);
    const [page, setPage] = useState(0);
    const [isPending, startTransition] = useTransition();

    const canManage = (authorId: string) =>
        currentUserId === authorId || profile?.role === 'admin' || profile?.role === 'moderator';

    const handlePosted = () => {
        startTransition(async () => {
            const fresh = await getBarangayPosts(barangay, municipality, 0);
            setPosts(fresh);
            setPage(0);
            setHasMore(fresh.length >= 20);
        });
    };

    const handleDeleted = (id: string) => {
        setPosts(p => p.filter(post => post.id !== id));
    };

    const loadMore = () => {
        const next = page + 1;
        startTransition(async () => {
            const more = await getBarangayPosts(barangay, municipality, next);
            setPosts(p => [...p, ...more]);
            setPage(next);
            setHasMore(more.length >= 20);
        });
    };

    return (
        <div className="px-4 pt-4 space-y-3">
            {/* Post compose box */}
            {currentUserId && (
                <CreateBarangayPostForm
                    barangay={barangay}
                    municipality={municipality}
                    onPosted={handlePosted}
                />
            )}

            {/* Feed */}
            {isPending && <p className="text-center py-6 text-slate-400 animate-pulse text-sm">Loading…</p>}
            {!isPending && posts.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-4xl mb-3">🌿</p>
                    <p className="font-black text-slate-700 dark:text-white text-sm">No posts yet</p>
                    <p className="text-[12px] text-slate-400 dark:text-zinc-500 mt-1">Be the first to post something for {barangay}.</p>
                </div>
            )}
            {!isPending && posts.map(post => (
                <BarangayPostCard
                    key={post.id}
                    post={post}
                    canManage={canManage(post.author_id)}
                    onDeleted={handleDeleted}
                />
            ))}
            {!isPending && hasMore && (
                <button onClick={loadMore} className="w-full py-3 rounded-xl border border-slate-200 dark:border-zinc-800 text-[12px] font-black text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-zinc-900 transition-all">
                    Load more
                </button>
            )}
        </div>
    );
}
