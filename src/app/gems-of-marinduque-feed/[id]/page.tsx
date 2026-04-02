import React from 'react';
import { notFound } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import GemLikeButton from '@/components/GemLikeButton';
import GemCommentsSection from '@/components/GemCommentsSection';
import GemDetailsDeleteButton from '@/components/GemDetailsDeleteButton';
import { isAdmin } from '@/utils/roles';
import { Metadata } from 'next';
import BackButton from '@/components/BackButton';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const resolvedParams = await params;
    const supabase = await createClient();

    const { data: gem } = await supabase
        .from('gems')
        .select('title, description, images')
        .eq('id', resolvedParams.id)
        .single();

    if (!gem) {
        return {
            title: 'Gem Not Found | Local Gems'
        };
    }

    return {
        title: `${gem.title} | Local Gems`,
        description: gem.description,
        openGraph: {
            title: gem.title,
            description: gem.description,
            images: gem.images && gem.images.length > 0 ? [{ url: gem.images[0] }] : [],
        },
    };
}

export default async function GemDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // Fetch gem details
    const { data: gem } = await supabase
        .from('gems')
        .select(`
            id,
            title,
            town,
            description,
            images,
            latitude,
            longitude,
            created_at,
            author_id,
            likes_count,
            comments_count,
            author:profiles!gems_author_id_fkey(
                id,
                full_name,
                avatar_url
            )
        `)
        .eq('id', resolvedParams.id)
        .single();

    if (!gem) {
        notFound();
    }

    // Fetch user like
    let isLikedByMe = false;
    if (user) {
        const { data: myLike } = await supabase
            .from('gem_likes')
            .select('id')
            .eq('gem_id', gem.id)
            .eq('user_id', user.id)
            .maybeSingle();
        if (myLike) {
            isLikedByMe = true;
        }
    }

    // Fetch comments
    const { data: comments } = await supabase
        .from('gem_comments')
        .select(`
            id,
            content,
            created_at,
            author:profiles(
                full_name,
                avatar_url
            )
        `)
        .eq('gem_id', gem.id)
        .order('created_at', { ascending: true });

    // Determine if the current user is an admin
    let userIsAdmin = false;
    if (user) {
        if (isAdmin(user.email)) {
            userIsAdmin = true;
        } else {
            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .single();
            if (profile?.role === 'admin' || profile?.role === 'moderator') {
                userIsAdmin = true;
            }
        }
    }

    const canDelete = user ? (gem.author_id === user.id || userIsAdmin) : false;

    // Format data
    const authorData: any = gem.author || {};
    const formattedAuthor = {
        name: authorData.full_name || 'Anonymous',
        avatar: authorData.avatar_url || null,
        initials: (authorData.full_name || 'A')[0].toUpperCase(),
    };

    const formattedComments = (comments || []).map((c: any) => ({
        id: c.id,
        content: c.content,
        createdAt: c.created_at,
        author: {
            name: c.author?.full_name || 'Anonymous',
            avatar: c.author?.avatar_url || null,
        }
    }));

    const mainImage = gem.images && gem.images.length > 0 ? gem.images[0] : 'https://placehold.co/600x400?text=No+Photo';

    return (
        <div className="flex flex-col min-h-screen bg-white dark:bg-zinc-950 mx-auto max-w-md shadow-2xl overflow-x-hidden">
            {/* Premium Sticky Header */}
            <header className="sticky top-0 z-40 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-b border-slate-100 dark:border-zinc-800">
                <div className="px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <BackButton />
                        <div className="flex flex-col">
                            <h1 className="text-lg font-black tracking-tight text-moriones-red leading-none">Local Gem</h1>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 mt-1">Discovery Details</p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-1">
                {/* Hero Image */}
                <div className="relative aspect-square w-full overflow-hidden">
                    <img
                        src={mainImage}
                        alt={gem.title}
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

                    {/* Floating Action Badge */}
                    <div className="absolute bottom-6 right-6 z-10 flex flex-col gap-3">
                        <div className="bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md rounded-2xl shadow-2xl p-2 border border-white/20">
                            <GemLikeButton
                                gemId={gem.id}
                                initialLiked={isLikedByMe}
                                initialCount={gem.likes_count || 0}
                                iconSize={24}
                            />
                        </div>
                    </div>
                </div>

                <div className="px-6 py-8">
                    {/* Town & Title */}
                    <div className="flex items-center gap-2 mb-2 group">
                        <span className="material-symbols-outlined text-moriones-red text-[18px] font-black">location_on</span>
                        <span className="text-xs font-black text-moriones-red uppercase tracking-widest transition-transform group-hover:translate-x-1">{gem.town}</span>
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white leading-tight mb-6 tracking-tight">{gem.title}</h1>

                    {/* Author Section */}
                    <div className="flex items-center gap-4 p-4 rounded-3xl bg-slate-50 dark:bg-zinc-900 border border-slate-100 dark:border-zinc-800 mb-8 transition-all hover:bg-slate-100 dark:hover:bg-zinc-800/80">
                        <div className="size-12 rounded-2xl ring-4 ring-white dark:ring-zinc-950 overflow-hidden shrink-0 shadow-lg">
                            {formattedAuthor.avatar ? (
                                <img alt={formattedAuthor.name} className="w-full h-full object-cover" src={formattedAuthor.avatar} />
                            ) : (
                                <div className="w-full h-full bg-moriones-red/10 flex items-center justify-center text-moriones-red text-xl font-black">
                                    {formattedAuthor.initials}
                                </div>
                            )}
                        </div>
                        <div className="flex-1">
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mb-1">Shared by</p>
                            <p className="text-base font-black text-slate-900 dark:text-white leading-tight">{formattedAuthor.name}</p>
                        </div>
                        <button className="px-5 py-2 rounded-xl bg-moriones-red text-white font-black tracking-widest text-[10px] uppercase shadow-lg shadow-moriones-red/20 hover:scale-105 active:scale-95 transition-all">
                            FOLLOW
                        </button>
                    </div>

                    {/* Description Section */}
                    <div className="space-y-4 mb-10">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="size-8 rounded-lg bg-moriones-red/10 flex items-center justify-center">
                                <span className="material-symbols-outlined text-moriones-red text-[18px]">info</span>
                            </div>
                            <h3 className="font-black text-xs uppercase tracking-widest text-slate-400">About this Gem</h3>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-base font-medium whitespace-pre-wrap select-text">
                            {gem.description}
                        </p>
                    </div>

                    {/* Pin Location Badge (If exists) */}
                    {gem.latitude && (
                        <div className="mb-10 p-4 rounded-3xl bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 flex items-center gap-4 group">
                            <div className="size-10 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center group-hover:rotate-12 transition-transform">
                                <span className="material-symbols-outlined text-amber-600 font-black">pin_drop</span>
                            </div>
                            <div>
                                <h4 className="text-xs font-black text-amber-700 dark:text-amber-500 uppercase tracking-widest">Pin Location Available</h4>
                                <p className="text-[10px] font-bold text-amber-600/70 dark:text-amber-500/50 mt-0.5">Precise coordinates saved for this sanctuary.</p>
                            </div>
                        </div>
                    )}

                    <div className="h-px w-full bg-slate-100 dark:bg-zinc-800 mb-10" />

                    {/* Comments Section */}
                    <GemCommentsSection
                        gemId={gem.id}
                        initialComments={formattedComments}
                        currentUserId={user?.id || null}
                    />

                    {/* Manage Section */}
                    {canDelete && (
                        <div className="mt-12 pt-10 border-t border-slate-100 dark:border-zinc-800">
                            <div className="flex items-center gap-3 mb-6">
                                <span className="material-symbols-outlined text-red-500">settings</span>
                                <h3 className="font-black text-xs uppercase tracking-widest text-slate-400">Management Corner</h3>
                            </div>
                            <GemDetailsDeleteButton gemId={gem.id} canDelete={canDelete} />
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
