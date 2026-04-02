'use client';

import { notFound } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { getLostFoundPost, updateLostFoundStatus, deleteLostFoundPost } from '@/app/actions/lost-found';
import { isAdmin } from '@/utils/roles';
import BackButton from '@/components/BackButton';

const CATEGORY_ICONS: Record<string, string> = {
    animal: '🐾', item: '📦', document: '📄', person: '👤',
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
    return new Date(date).toLocaleDateString('en-PH', { month: 'long', day: 'numeric', year: 'numeric' });
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const post = await getLostFoundPost(id);
    if (!post) return { title: 'Not Found' };
    return {
        title: `${post.type === 'lost' ? '🔍 Lost' : '✅ Found'}: ${post.title} — Marinduque Market Hub`,
        description: post.description ?? `${post.type === 'lost' ? 'Lost' : 'Found'} in ${post.municipality ?? 'Marinduque'}`,
    };
}

export default async function LostFoundDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const post = await getLostFoundPost(id);
    if (!post) notFound();

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const { data: profile } = user
        ? await supabase.from('profiles').select('role').eq('id', user.id).single()
        : { data: null };

    const isOwner = user?.id === post.posted_by;
    const isAdminUser = isAdmin(user?.email) || profile?.role === 'admin' || profile?.role === 'moderator';
    const canManage = isOwner || isAdminUser;
    const isResolved = post.status === 'resolved';
    const isLost = post.type === 'lost';

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-[#0F0F10] pb-32">
            {/* Sticky header */}
            <header className="sticky top-0 z-30 flex items-center gap-3 bg-white/80 dark:bg-[#0F0F10]/80 backdrop-blur-md border-b border-slate-100 dark:border-white/[0.03] px-4 pt-3 pb-3">
                <BackButton />
                <div>
                    <p className="text-lg font-black leading-tight tracking-tight text-moriones-red pl-1">{isLost ? '🔍 Lost' : '✅ Found'}</p>
                    <p className="text-[10px] text-slate-400 dark:text-white/30 font-black uppercase tracking-[0.15em] pl-1">Lost & Found</p>
                </div>
            </header>
            {/* Header */}
            <div className={`px-4 pt-5 pb-5 relative overflow-hidden ${
                isResolved
                    ? 'bg-gradient-to-br from-slate-500 to-slate-600'
                    : isLost
                    ? 'bg-gradient-to-br from-rose-600 via-pink-600 to-rose-700'
                    : 'bg-gradient-to-br from-emerald-600 via-green-600 to-teal-700'
            }`}>
                <div
                    className="absolute inset-0 opacity-10"
                    style={{ backgroundImage: 'radial-gradient(circle at 50% 50%, white 1px, transparent 1px)', backgroundSize: '18px 18px' }}
                />

                {/* Status + type badges */}
                <div className="flex items-center gap-2 mb-3">
                    <span className={`text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest ${
                        isResolved ? 'bg-white/20 text-white' : 'bg-white/25 text-white'
                    }`}>
                        {isResolved ? '✅ Resolved' : isLost ? '🔴 Lost' : '🟢 Found'}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-1 rounded-full bg-white/15 text-white/80">
                        {CATEGORY_ICONS[post.category]} {post.category.charAt(0).toUpperCase() + post.category.slice(1)}
                    </span>
                </div>

                <h1 className="text-xl font-black text-white leading-snug">{post.title}</h1>
                <p className="text-white/60 text-[11px] mt-1">{timeAgo(post.created_at)}</p>
            </div>

            <div className="px-4 pt-5 space-y-4">
                {/* Image */}
                {post.image_url && (
                    <div className="rounded-2xl overflow-hidden shadow-sm">
                        <img src={post.image_url} alt={post.title} className="w-full object-cover max-h-72" />
                    </div>
                )}

                {/* Description */}
                {post.description && (
                    <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl px-4 py-4">
                        <p className="text-[11px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-1.5">Description</p>
                        <p className="text-[13px] text-slate-700 dark:text-slate-200 leading-relaxed">{post.description}</p>
                    </div>
                )}

                {/* Location */}
                {(post.location || post.municipality) && (
                    <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl px-4 py-4 flex items-start gap-3">
                        <span className="material-symbols-outlined text-rose-400 text-[22px] mt-0.5">location_on</span>
                        <div>
                            <p className="text-[11px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-0.5">
                                {isLost ? 'Last seen at' : 'Found at'}
                            </p>
                            <p className="text-[13px] font-semibold text-slate-800 dark:text-white">
                                {[post.location, post.municipality].filter(Boolean).join(', ')}
                            </p>
                        </div>
                    </div>
                )}

                {/* Contact */}
                {post.contact && !isResolved && (
                    <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl px-4 py-4">
                        <p className="text-[11px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-2">Contact</p>
                        <a
                            href={`tel:${post.contact.replace(/\s+/g, '')}`}
                            className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-black text-[13px] text-white transition-all active:scale-95 ${
                                isLost ? 'bg-rose-500 hover:bg-rose-600' : 'bg-emerald-500 hover:bg-emerald-600'
                            }`}
                        >
                            <span className="material-symbols-outlined text-[18px]">phone</span>
                            {post.contact}
                        </a>
                    </div>
                )}

                {/* Owner actions */}
                {canManage && (
                    <div className="space-y-2 pt-1">
                        {!isResolved && (
                            <form action={async () => {
                                'use server';
                                await updateLostFoundStatus(id, 'resolved');
                            }}>
                                <button
                                    type="submit"
                                    className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-600 text-white font-black text-[13px] shadow-lg shadow-emerald-500/20 transition-all active:scale-95"
                                >
                                    <span className="material-symbols-outlined text-[18px]">check_circle</span>
                                    Mark as Resolved
                                </button>
                            </form>
                        )}
                        {isResolved && (
                            <form action={async () => {
                                'use server';
                                await updateLostFoundStatus(id, 'open');
                            }}>
                                <button
                                    type="submit"
                                    className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-slate-200 dark:border-zinc-700 text-slate-500 dark:text-slate-400 font-black text-[12px] transition-all hover:bg-slate-50 dark:hover:bg-zinc-900"
                                >
                                    Reopen
                                </button>
                            </form>
                        )}
                        <form action={async () => {
                            'use server';
                            await deleteLostFoundPost(id);
                        }}>
                            <button
                                type="submit"
                                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-rose-200 dark:border-rose-900/50 text-rose-500 dark:text-rose-400 font-black text-[12px] transition-all hover:bg-rose-50 dark:hover:bg-rose-950/20"
                            >
                                <span className="material-symbols-outlined text-[16px]">delete</span>
                                Delete Post
                            </button>
                        </form>
                    </div>
                )}

                {/* Resolved banner */}
                {isResolved && (
                    <div className="bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/40 rounded-2xl px-4 py-4 flex items-center gap-3">
                        <span className="text-2xl">✅</span>
                        <div>
                            <p className="font-black text-emerald-800 dark:text-emerald-300 text-[13px]">This has been resolved</p>
                            <p className="text-[11px] text-emerald-600 dark:text-emerald-400">The poster has marked this as found/returned.</p>
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}
