'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { useAuth } from '@/components/AuthProvider';
import { toggleGemLike } from '@/app/actions/gems';

type GemProps = {
    id: string;
    title: string;
    town: string;
    imageUrl: string;
    authorId: string;
    likeCount?: number;
    isLikedByMe?: boolean;
};

export default function GemCard({ id, title, town, imageUrl, authorId, likeCount = 0, isLikedByMe = false }: GemProps) {
    const { profile } = useAuth();
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);

    // ── Vouch / Like state ──────────────────────────────────────
    const [liked, setLiked] = useState(isLikedByMe);
    const [count, setCount] = useState(likeCount);
    const [isPending, setIsPending] = useState(false);

    // God-Mode / Author Check
    const isOwnerOrMod = profile?.id === authorId || profile?.role === 'admin' || profile?.role === 'moderator';

    const handleDelete = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!window.confirm(`Are you sure you want to remove the hidden gem "${title}"?`)) return;
        setIsDeleting(true);

        const supabase = createBrowserClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        const { error } = await supabase.from('gems').delete().eq('id', id);
        if (!error) {
            router.refresh();
        } else {
            alert('Failed to delete gem.');
            setIsDeleting(false);
        }
    };

    const handleVouch = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (isPending) return;
        if (!profile) {
            alert('Sign in to vouch for this gem!');
            return;
        }

        // Optimistic update
        const wasLiked = liked;
        setLiked(!wasLiked);
        setCount(prev => Math.max(0, prev + (wasLiked ? -1 : 1)));
        setIsPending(true);

        try {
            const res = await toggleGemLike(id);
            setLiked(res.liked);
        } catch {
            // Revert on failure
            setLiked(wasLiked);
            setCount(prev => Math.max(0, prev + (wasLiked ? 1 : -1)));
        } finally {
            setIsPending(false);
        }
    };

    return (
        <div className={`group relative h-80 w-full rounded-[2.5rem] overflow-hidden shadow-sm transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 active:scale-[0.98] border border-slate-100 dark:border-zinc-800 ${isDeleting ? 'opacity-50 grayscale' : 'opacity-100'}`}>
            <Link href={`/gems/${id}`} className="block w-full h-full">
                {/* Cinematic Backdrop */}
                {imageUrl ? (
                    <Image
                        src={imageUrl}
                        alt={title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-1000 ease-out"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-200 dark:from-zinc-900 dark:to-zinc-800 flex items-center justify-center">
                        <span className="material-symbols-outlined text-moriones-red text-6xl opacity-10">landscape</span>
                    </div>
                )}

                {/* Professional Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>

                {/* Content Terminal */}
                <div className="absolute bottom-0 left-0 p-8 w-full z-10 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="bg-moriones-red text-white text-[10px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full shadow-lg shadow-moriones-red/20">
                            {town}
                        </span>
                    </div>

                    <h3 className="text-2xl font-black text-white leading-tight tracking-tight drop-shadow-xl group-hover:text-moriones-red transition-colors duration-300">
                        {title}
                    </h3>

                    <div className="flex items-center gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-100 scale-95 group-hover:scale-100 text-white/80">
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Explore Sanctuary</span>
                        <span className="material-symbols-outlined text-[18px] text-moriones-red">arrow_forward</span>
                    </div>
                </div>
            </Link>

            {/* ── Vouch (Thumbs Up) Button ─────────────────────────── */}
            <button
                onClick={handleVouch}
                disabled={isPending}
                title={liked ? 'Un-vouch' : 'Vouch for this gem'}
                className={`absolute top-4 left-4 z-20 flex items-center gap-1.5 px-3 py-2 rounded-2xl backdrop-blur-md border shadow-xl transition-all active:scale-95 ${liked
                        ? 'bg-moriones-red/90 border-moriones-red text-white shadow-moriones-red/30'
                        : 'bg-white/10 border-white/20 text-white/90 hover:bg-white/20'
                    }`}
            >
                <span
                    className="material-symbols-outlined text-[18px] leading-none"
                    style={{ fontVariationSettings: liked ? '"FILL" 1' : '"FILL" 0' }}
                >
                    thumb_up
                </span>
                {count > 0 && (
                    <span className="text-[11px] font-black leading-none">{count}</span>
                )}
            </button>

            {/* Author Management */}
            {isOwnerOrMod && (
                <div className="absolute top-4 right-4 z-20">
                    <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="size-10 rounded-2xl bg-white/10 backdrop-blur-md text-white/70 hover:text-white hover:bg-red-500 flex items-center justify-center transition-all border border-white/10 shadow-xl"
                        title="Remove Gem"
                    >
                        <span className="material-symbols-outlined text-lg">delete</span>
                    </button>
                </div>
            )}
        </div>
    );
}

