'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { useAuth } from '@/components/AuthProvider';

type BlogProps = {
    id: string;
    title: string;
    excerpt: string;
    coverImage: string;
    locationTag: string;
    createdAt: string;
};

export default function BlogCard({ id, title, excerpt, coverImage, locationTag, createdAt }: BlogProps) {
    const { profile } = useAuth();
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);

    // Strict Admin Check
    const isAdmin = profile?.role === 'admin';

    const handleDelete = async (e: React.MouseEvent) => {
        e.preventDefault();
        if (!window.confirm('Erase this journal entry?')) return;
        setIsDeleting(true);

        const supabase = createBrowserClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        await supabase.from('foreigner_blog').delete().eq('id', id);
        router.refresh();
    };

    return (
        <div className={`group bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden mb-8 shadow-2xl relative transition-all hover:border-amber-500/30 ${isDeleting ? 'opacity-50 grayscale' : 'opacity-100'}`}>
            <Link href={`/foreigner/${id}`} className="block">

                {/* Cinematic Image Header */}
                <div className="w-full h-72 relative bg-slate-950 overflow-hidden">
                    {coverImage ? (
                        <Image
                            src={coverImage}
                            alt={title}
                            fill
                            className="object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-[1.5s] ease-out"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-slate-800 text-6xl">🕵️‍♂️</div>
                    )}

                    {/* Location Tag Overlay */}
                    <div className="absolute top-6 left-6 bg-black/80 backdrop-blur-xl text-white text-[9px] font-black uppercase tracking-[0.2em] px-5 py-2 rounded-full border border-white/10 shadow-lg">
                        📍 {locationTag || 'Undisclosed Location'}
                    </div>

                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
                </div>

                {/* Editorial Content */}
                <div className="p-8 pt-4">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-[1px] w-8 bg-amber-500/50"></div>
                        <p className="text-amber-500 text-[10px] font-black tracking-[0.3em] uppercase">
                            {new Date(createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase()}
                        </p>
                    </div>

                    <h3 className="text-3xl font-black text-white leading-tight mb-4 tracking-tighter group-hover:text-amber-500 transition-colors">
                        {title}
                    </h3>

                    <p className="text-slate-400 text-sm leading-relaxed font-medium line-clamp-3 mb-6 opacity-80 group-hover:opacity-100 transition-opacity">
                        {excerpt}
                    </p>

                    <div className="flex items-center gap-2 text-amber-500 text-[10px] font-black uppercase tracking-[0.2em] group-hover:translate-x-3 transition-transform duration-500">
                        Read Journal Entry <span className="material-symbols-outlined text-sm">arrow_right_alt</span>
                    </div>
                </div>
            </Link>

            {/* Admin Command Deck */}
            {isAdmin && (
                <button
                    onClick={handleDelete}
                    className="absolute top-6 right-6 w-12 h-12 bg-moriones-red hover:bg-red-700 text-white rounded-2xl transition-all z-10 shadow-xl shadow-red-900/40 flex items-center justify-center active:scale-90"
                    title="Delete Post"
                >
                    <span className="material-symbols-outlined">delete</span>
                </button>
            )}
        </div>
    );
}
