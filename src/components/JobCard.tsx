'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { useAuth } from '@/components/AuthProvider';

type JobProps = {
    id: string;
    title: string;
    company: string;
    location: string;
    type: string;
    salary: string;
    employerId: string;
};

export default function JobCard({ id, title, company, location, type, salary, employerId }: JobProps) {
    const { profile } = useAuth();
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);

    // God-Mode / Owner Check
    const isOwnerOrMod = profile?.id === employerId || profile?.role === 'admin' || profile?.role === 'moderator';

    const handleDelete = async (e: React.MouseEvent) => {
        e.preventDefault();
        if (!window.confirm(`Are you sure you want to delete the job posting for "${title}"?`)) return;
        setIsDeleting(true);

        const supabase = createBrowserClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        const { error } = await supabase.from('jobs').delete().eq('id', id);
        if (!error) {
            router.refresh();
        } else {
            alert('Failed to delete job.');
            setIsDeleting(false);
        }
    };

    return (
        <div className={`group relative bg-white dark:bg-zinc-900 rounded-[2rem] p-6 mb-4 shadow-sm border border-slate-100 dark:border-zinc-800 transition-all hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1 ${isDeleting ? 'opacity-50 grayscale' : 'opacity-100'}`}>
            <Link href={`/jobs/${id}`} className="block">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight leading-tight group-hover:text-blue-600 transition-colors truncate">
                            {title}
                        </h3>
                        <p className="text-sm font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest mt-1">
                            {company}
                        </p>
                    </div>
                    <span className="bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 text-[10px] px-3 py-1.5 rounded-xl font-black uppercase tracking-widest border border-blue-100 dark:border-blue-800/50 flex-shrink-0">
                        {type}
                    </span>
                </div>

                <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2 text-slate-500 dark:text-zinc-400">
                        <span className="material-symbols-outlined text-base">location_on</span>
                        <span className="text-xs font-bold">{location}</span>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                        {salary ? (
                            <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 px-3 py-1.5 rounded-xl border border-emerald-100 dark:border-emerald-800/50">
                                <span className="material-symbols-outlined text-base">payments</span>
                                <span className="text-[10px] font-black uppercase tracking-widest">{salary}</span>
                            </div>
                        ) : (
                            <div className="h-8"></div>
                        )}

                        <div className="flex items-center gap-1 text-slate-400 group-hover:text-blue-600 transition-colors">
                            <span className="text-[10px] font-black uppercase tracking-widest">Detail</span>
                            <span className="material-symbols-outlined text-base">arrow_forward</span>
                        </div>
                    </div>
                </div>
            </Link>

            {/* Admin/Owner Controls */}
            {isOwnerOrMod && (
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="w-8 h-8 rounded-xl bg-slate-50 dark:bg-zinc-800 text-slate-400 hover:text-moriones-red hover:bg-moriones-red/10 flex items-center justify-center transition-all disabled:opacity-50"
                        title="Delete Post"
                    >
                        <span className="material-symbols-outlined text-lg">delete</span>
                    </button>
                </div>
            )}
        </div>
    );
}
