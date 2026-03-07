'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { useAuth } from '@/components/AuthProvider';

type UpdateProps = {
    id: string;
    port: string;
    status: string;
    message: string;
    createdAt: string;
    authorId: string;
    authorName: string;
};

const getStatusConfig = (status: string) => {
    switch (status) {
        case 'boarding': return {
            style: 'bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-800/50',
            label: 'Boarding',
            icon: 'directions_run',
            accent: 'border-l-emerald-500'
        };
        case 'delayed': return {
            style: 'bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 border-orange-100 dark:border-orange-800/50',
            label: 'Delayed',
            icon: 'schedule',
            accent: 'border-l-orange-500'
        };
        case 'departed': return {
            style: 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-800/50',
            label: 'Departed',
            icon: 'sailing',
            accent: 'border-l-blue-500'
        };
        case 'arrived': return {
            style: 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-800/50',
            label: 'Arrived',
            icon: 'anchor',
            accent: 'border-l-indigo-500'
        };
        case 'long_lines': return {
            style: 'bg-yellow-50 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400 border-yellow-100 dark:border-yellow-800/50',
            label: 'Long Lines',
            icon: 'groups',
            accent: 'border-l-yellow-500'
        };
        case 'cancelled': return {
            style: 'bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 border-red-100 dark:border-red-800/50',
            label: 'Cancelled',
            icon: 'block',
            accent: 'border-l-red-500'
        };
        default: return {
            style: 'bg-slate-50 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 border-slate-100 dark:border-zinc-700',
            label: 'Info',
            icon: 'info',
            accent: 'border-l-slate-400'
        };
    }
};

const getRelativeTime = (dateString: string) => {
    const now = new Date();
    const past = new Date(dateString);
    const diffInMinutes = Math.floor((now.getTime() - past.getTime()) / 60000);

    if (diffInMinutes < 1) return 'JUST NOW';
    if (diffInMinutes < 60) return `${diffInMinutes}M AGO`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}H AGO`;
    return past.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase();
};

export default function PortUpdateCard({ id, port, status, message, createdAt, authorId, authorName }: UpdateProps) {
    const { profile } = useAuth();
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);

    const isOwnerOrMod = profile?.id === authorId || profile?.role === 'admin' || profile?.role === 'moderator';
    const config = getStatusConfig(status);

    const handleDelete = async () => {
        if (!window.confirm('Erase this port transmission?')) return;
        setIsDeleting(true);

        const supabase = createBrowserClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );

        const { error } = await supabase.from('port_updates').delete().eq('id', id);
        if (!error) {
            router.refresh();
        } else {
            setIsDeleting(false);
        }
    };

    return (
        <div className={`group bg-white dark:bg-zinc-900 border-l-4 ${config.accent} rounded-r-3xl p-6 mb-4 shadow-sm relative transition-all hover:shadow-lg hover:translate-x-1 ${isDeleting ? 'opacity-50 grayscale' : 'opacity-100'} border-y border-r border-slate-100 dark:border-zinc-800`}>

            <div className="flex justify-between items-start mb-4">
                <div className="flex flex-col gap-1">
                    <h4 className="font-black text-[10px] text-slate-400 uppercase tracking-[0.2em]">Transmission Source</h4>
                    <span className="font-black text-lg text-slate-900 dark:text-white tracking-tighter">{port}</span>
                </div>
                <div className="flex flex-col items-end gap-1">
                    <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border ${config.style} flex items-center gap-1.5`}>
                        <span className="material-symbols-outlined text-xs">{config.icon}</span>
                        {config.label}
                    </span>
                    <span className="text-[9px] font-black text-slate-400 tracking-[0.1em]">{getRelativeTime(createdAt)}</span>
                </div>
            </div>

            <p className="text-slate-700 dark:text-zinc-300 text-sm font-medium leading-relaxed bg-slate-50 dark:bg-zinc-800/50 p-4 rounded-2xl border border-slate-50 dark:border-zinc-700/50">
                {message}
            </p>

            <div className="flex justify-between items-center mt-4 pt-4 border-t border-slate-100 dark:border-zinc-800">
                <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-md bg-slate-100 dark:bg-zinc-800 flex items-center justify-center">
                        <span className="material-symbols-outlined text-xs text-slate-400 font-bold">person</span>
                    </div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black">
                        Agent: {authorName || 'Field Commuter'}
                    </p>
                </div>

                {isOwnerOrMod && (
                    <button
                        onClick={handleDelete}
                        className="w-8 h-8 rounded-xl bg-slate-50 dark:bg-zinc-800 text-slate-400 hover:text-moriones-red hover:bg-moriones-red/10 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                        title="Terminate Update"
                    >
                        <span className="material-symbols-outlined text-base">delete</span>
                    </button>
                )}
            </div>
        </div>
    );
}
