import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import UniversalComments from '@/components/UniversalComments';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export default async function TheHiddenForeignerBlogDetail({ params }: { params: { id: string } }) {
    const supabase = await createClient();

    const { data: post, error } = await supabase
        .from('foreigner_blog')
        .select('*')
        .eq('id', params.id)
        .single();

    if (error || !post) return notFound();

    return (
        <div className="relative flex h-full min-h-screen w-full flex-col overflow-x-hidden max-w-md mx-auto shadow-2xl bg-surface-light dark:bg-surface-dark pb-24">
            {/* Sticky Header */}
            <header className="sticky top-0 z-50 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 px-4 py-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link href="/blog" className="flex items-center justify-center size-10 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                            <span className="material-symbols-outlined text-text-main dark:text-slate-100">arrow_back</span>
                        </Link>
                        <div>
                            <h1 className="font-display font-bold text-lg text-text-main dark:text-slate-100 leading-none truncate w-48">Entry #{post.id.slice(0, 4).toUpperCase()}</h1>
                        </div>
                    </div>
                </div>
            </header>

            {/* Immersive Hero Cover */}
            <div className="w-full h-80 relative bg-zinc-900 group">
                {post.cover_image ? (
                    <Image
                        src={post.cover_image}
                        alt={post.title}
                        fill
                        className="object-cover opacity-90 transition-opacity duration-[2s]"
                        priority
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-slate-500/50 text-6xl font-black">UNSEEN</div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-surface-light dark:from-surface-dark via-transparent to-transparent"></div>

                {/* Title Engine */}
                <div className="absolute bottom-0 left-0 w-full p-6">
                    <div className="max-w-3xl mx-auto">
                        <div className="flex items-center gap-2 mb-3">
                            <span className="bg-moriones-red text-white font-black uppercase tracking-widest text-[10px] px-2 py-0.5 rounded shadow-sm">
                                📍 {post.location_tag || 'Undisclosed'}
                            </span>
                        </div>

                        <h1 className="text-3xl font-display font-bold text-slate-900 dark:text-white leading-tight drop-shadow-sm mb-4">
                            {post.title}
                        </h1>

                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full border-2 border-moriones-red/50 p-0.5 shadow-sm bg-white dark:bg-zinc-800">
                                <div className="w-full h-full bg-slate-100 dark:bg-zinc-700 rounded-full flex items-center justify-center text-lg">🕵️‍♂️</div>
                            </div>
                            <div className="flex flex-col drop-shadow-sm">
                                <span className="text-slate-900 dark:text-white font-bold uppercase tracking-wider text-[10px]">The Hidden Foreigner</span>
                                <span className="text-text-muted dark:text-slate-400 font-medium text-[10px] uppercase">
                                    {new Date(post.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <main className="px-6 pt-6 mb-12 flex-1">
                {/* Main Narrative Engine */}
                <article className="prose prose-slate dark:prose-invert mb-12">
                    <div className="text-text-main dark:text-slate-200 leading-relaxed text-base space-y-6 whitespace-pre-wrap">
                        {post.content}
                    </div>
                </article>

                {/* Narrative Authentication (Sign-off) */}
                <div className="p-8 bg-gray-50 dark:bg-zinc-800/50 rounded-2xl border border-gray-100 dark:border-zinc-800 shadow-sm mb-12 flex flex-col items-center text-center gap-4">
                    <div className="w-12 h-12 bg-slate-900 dark:bg-slate-950 rounded-full flex items-center justify-center text-xl shadow-inner border border-moriones-red/20">
                        🕵️‍♂️
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-text-muted dark:text-slate-500 uppercase tracking-widest mb-1 leading-none">Intelligence Subscribed</p>
                        <h4 className="font-medium text-lg text-slate-900 dark:text-white italic">"Observations for those who know where to look."</h4>
                    </div>
                </div>

                {/* Intelligence Hub (Comments) */}
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800">
                    <div className="mb-6 border-b border-gray-100 dark:border-zinc-800 pb-4">
                        <h2 className="text-xl font-display font-bold text-slate-900 dark:text-white tracking-tight mb-1">Reader Intelligence</h2>
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Contribute your observations.</p>
                    </div>

                    <UniversalComments entityId={post.id} entityType="blog" />
                </div>
            </main>
        </div>
    );
}
