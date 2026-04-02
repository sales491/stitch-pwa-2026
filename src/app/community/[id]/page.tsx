import { createClient } from '@/utils/supabase/server';
import { notFound } from 'next/navigation';
import UniversalComments from '@/components/UniversalComments';
import Image from 'next/image';
import BackButton from '@/components/BackButton';

export default async function PostDetail({
    params
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;
    const supabase = await createClient();

    const { data: post, error } = await supabase
        .from('posts')
        .select(`
            *,
            author:profiles(id, full_name, avatar_url, role)
        `)
        .eq('id', id)
        .single();

    if (error || !post) return notFound();

    return (
        <div className="bg-slate-50 dark:bg-zinc-950 min-h-screen pb-24 font-display">
            {/* Minimal Header */}
            <div className="bg-white dark:bg-zinc-900 border-b border-slate-100 dark:border-zinc-800 p-6 flex items-center justify-between sticky top-0 md:relative z-20">
                <BackButton />
                <div className="flex flex-col items-center">
                    <h2 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400">Marinduque Signal</h2>
                    <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest">{post.type} • Detailed Report</p>
                </div>
                <button className="w-10 h-10 flex items-center justify-center bg-slate-50 dark:bg-zinc-800 rounded-2xl text-slate-400 active:scale-90 transition-transform">
                    <span className="material-symbols-outlined">share</span>
                </button>
            </div>

            <div className="max-w-xl mx-auto px-6 mt-10">
                {/* 1. High Impact Author Profile */}
                <div className="flex items-center gap-4 mb-8">
                    <div className="w-14 h-14 rounded-3xl bg-slate-100 dark:bg-zinc-800 overflow-hidden relative border-4 border-white dark:border-zinc-800 shadow-xl">
                        {post.author?.avatar_url ? (
                            <Image src={post.author.avatar_url} alt="Avatar" fill className="object-cover" />
                        ) : (
                            <div className="flex items-center justify-center h-full text-blue-600">
                                <span className="material-symbols-outlined text-2xl">person</span>
                            </div>
                        )}
                    </div>
                    <div>
                        <h1 className="text-xl font-black text-slate-900 dark:text-white leading-none mb-1 flex items-center gap-2">
                            {post.author?.full_name || 'Local User'}
                            {post.author?.role === 'admin' && (
                                <span className="bg-moriones-red/10 text-moriones-red border border-moriones-red/20 px-2 py-0.5 rounded-lg text-[10px] uppercase font-black tracking-widest">Command</span>
                            )}
                        </h1>
                        <p className="text-xs font-bold text-slate-500">{new Date(post.created_at).toLocaleString([], { dateStyle: 'long', timeStyle: 'short' })}</p>
                    </div>
                </div>

                {/* 2. Intelligence Content Block */}
                <div className="bg-white dark:bg-zinc-900 rounded-[3rem] p-8 md:p-10 shadow-sm border border-slate-100 dark:border-zinc-800 mb-10">
                    {post.title && <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-6 border-b border-slate-50 dark:border-zinc-800 pb-4 tracking-tighter">{post.title}</h1>}

                    <p className="text-slate-800 dark:text-zinc-200 text-base md:text-lg leading-relaxed font-medium whitespace-pre-wrap mb-8">
                        {post.content}
                    </p>

                    {/* Visual Media Engine */}
                    {post.images && post.images.length > 0 && (
                        <div className="mt-8 rounded-[2.5rem] overflow-hidden relative shadow-2xl border-4 border-slate-50 dark:border-zinc-800 aspect-[4/3]">
                            <Image src={post.images[0]} alt="Signal Visual" fill className="object-cover" />
                        </div>
                    )}
                </div>

                {/* 3. Community Reaction Hub */}
                <div className="border-t border-slate-100 dark:border-zinc-800 pt-10">
                    <div className="flex flex-col gap-1 mb-6 text-center md:text-left">
                        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Intelligence Feedback</h2>
                        <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Discuss requirements, confirm details, or share updates below.</p>
                    </div>

                    {/* WE REUSE OUR TRUSTY UNIVERSAL BOARD! */}
                    <UniversalComments entityId={post.id} entityType="post" />
                </div>
            </div>
        </div>
    );
}
