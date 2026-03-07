'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { useAuth } from '@/components/AuthProvider';

type PostProps = {
    id: string;
    authorId: string;
    authorName: string;
    authorAvatar: string | null;
    content: string;
    type: string;
    createdAt: string;
};

// Tactical color-coding for community intelligence
const getTypeStyles = (type: string) => {
    switch (type) {
        case 'emergency': return 'bg-red-500/10 text-red-500 border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.1)]';
        case 'official': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
        case 'news': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
        case 'request': return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
        case 'cultural': return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
        default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
};

const getTypeIcon = (type: string) => {
    switch (type) {
        case 'emergency': return 'error';
        case 'official': return 'verified_user';
        case 'news': return 'newspaper';
        case 'request': return 'help_center';
        case 'cultural': return 'festival';
        default: return 'chat_bubble';
    }
};

export default function PostCard({ id, authorId, authorName, authorAvatar, content, type, createdAt }: PostProps) {
    const { profile } = useAuth();
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);

    const isOwnerOrMod = profile?.id === authorId || profile?.role === 'admin' || profile?.role === 'moderator';

    const handleDelete = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!window.confirm('Are you sure you want to permanently delete this community post?')) return;
        setIsDeleting(true);

        const supabase = createBrowserClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        const { error } = await supabase.from('posts').delete().eq('id', id);
        if (!error) {
            router.refresh();
        } else {
            alert('Failed to delete post.');
            setIsDeleting(false);
        }
    };

    return (
        <div className={`group bg-white dark:bg-zinc-900 rounded-[2.5rem] p-6 mb-6 shadow-sm border border-slate-100 dark:border-zinc-800 transition-all hover:shadow-xl hover:shadow-blue-500/5 ${isDeleting ? 'opacity-50 grayscale' : 'opacity-100'}`}>

            {/* 1. Identity Header */}
            <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-zinc-800 overflow-hidden relative shadow-inner border border-slate-50 dark:border-zinc-700">
                        {authorAvatar ? (
                            <Image src={authorAvatar} alt={authorName} fill className="object-cover" />
                        ) : (
                            <div className="flex items-center justify-center h-full text-slate-400">
                                <span className="material-symbols-outlined">person</span>
                            </div>
                        )}
                    </div>
                    <div>
                        <p className="font-black text-slate-900 dark:text-white leading-none mb-1 flex items-center gap-1.5">
                            {authorName || 'Local User'}
                            {type === 'official' && <span className="material-symbols-outlined text-blue-500 text-sm fill-1">verified</span>}
                        </p>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{new Date(createdAt).toLocaleDateString()}</p>
                    </div>
                </div>

                {/* Tactical Classification Badge */}
                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-[10px] font-black uppercase tracking-widest ${getTypeStyles(type)}`}>
                    <span className="material-symbols-outlined text-sm">{getTypeIcon(type)}</span>
                    {type}
                </div>
            </div>

            {/* 2. Intelligence Content */}
            <Link href={`/community/${id}`} className="block">
                <div className="space-y-4">
                    <p className="text-slate-700 dark:text-zinc-300 text-sm leading-relaxed font-medium whitespace-pre-wrap line-clamp-4 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                        {content}
                    </p>

                    <div className="flex items-center justify-between pt-2">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1.5 text-slate-400 group-hover:text-blue-600 transition-colors">
                                <span className="material-symbols-outlined text-base">forum</span>
                                <span className="text-[10px] font-black uppercase tracking-widest">Discuss</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-slate-400">
                                <span className="material-symbols-outlined text-base">share</span>
                                <span className="text-[10px] font-black uppercase tracking-widest">Signal</span>
                            </div>
                        </div>

                        <span className="text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                            Read Report <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        </span>
                    </div>
                </div>
            </Link>

            {/* 3. God-Mode Authorization */}
            {isOwnerOrMod && (
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="w-8 h-8 rounded-xl bg-slate-50 dark:bg-zinc-800 text-slate-300 hover:text-moriones-red hover:bg-moriones-red/10 flex items-center justify-center transition-all disabled:opacity-50"
                        title="Nuke Post"
                    >
                        <span className="material-symbols-outlined text-lg">delete</span>
                    </button>
                </div>
            )}
        </div>
    );
}
