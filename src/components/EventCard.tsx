'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { useAuth } from '@/components/AuthProvider';

type EventProps = {
    id: string;
    title: string;
    date: string; // YYYY-MM-DD
    time: string;
    location: string;
    town: string;
    category: string;
    authorId: string;
};

export default function EventCard({ id, title, date, time, location, town, category, authorId }: EventProps) {
    const { profile } = useAuth();
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);

    const isOwnerOrMod = profile?.id === authorId || profile?.role === 'admin' || profile?.role === 'moderator';

    // Parse the date to get a clean Month and Day for the calendar icon
    const eventDate = new Date(date);
    const month = eventDate.toLocaleString('default', { month: 'short' }).toUpperCase();
    const day = eventDate.getDate();

    const handleDelete = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!window.confirm(`Are you sure you want to cancel and delete the event "${title}"?`)) return;
        setIsDeleting(true);

        try {
            const { deleteEvent } = await import('@/app/actions/events');
            await deleteEvent(id);
            router.refresh();
        } catch (error) {
            console.error('Delete error:', error);
            alert('Failed to delete event.');
            setIsDeleting(false);
        }
    };

    return (
        <div className={`group relative bg-white dark:bg-zinc-900 rounded-[2.5rem] p-5 mb-5 shadow-sm border border-slate-100 dark:border-zinc-800 transition-all hover:shadow-xl hover:shadow-red-500/5 hover:-translate-y-1 ${isDeleting ? 'opacity-50 grayscale' : 'opacity-100'}`}>
            <Link href={`/events/${id}`} className="flex gap-6 items-center">

                {/* Tactical Calendar "Tear-off" Icon */}
                <div className="flex flex-col items-center justify-center bg-slate-50 dark:bg-zinc-800 border border-slate-100 dark:border-zinc-700 w-20 h-20 flex-shrink-0 shadow-inner rounded-[1.5rem] overflow-hidden">
                    <div className="bg-red-500 w-full text-center py-1">
                        <span className="text-white font-black text-[10px] uppercase tracking-widest">{month}</span>
                    </div>
                    <div className="flex-1 flex items-center justify-center">
                        <span className="text-slate-900 dark:text-white font-black text-2xl tracking-tighter">{day}</span>
                    </div>
                </div>

                {/* Intelligence Details */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <span className="bg-red-50 dark:bg-red-900/40 text-red-600 dark:text-red-400 text-[9px] font-black uppercase tracking-[0.2em] px-2 py-1 rounded-lg border border-red-100 dark:border-red-800/50">
                            {category}
                        </span>
                        {/* Visual indicator for time proximity could be added here */}
                    </div>

                    <h3 className="font-bold text-xl text-slate-900 dark:text-white leading-tight mb-2 group-hover:text-red-600 transition-colors truncate">
                        {title}
                    </h3>

                    <div className="flex flex-wrap items-center gap-4 text-slate-500 dark:text-zinc-400 text-[10px] font-black uppercase tracking-widest">
                        <div className="flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-sm">schedule</span>
                            <span>{time || 'Time TBD'}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-sm">location_on</span>
                            <span className="truncate max-w-[150px]">{location}, {town}</span>
                        </div>
                    </div>
                </div>

                {/* Action Pointer */}
                <div className="w-10 h-10 rounded-2xl bg-slate-50 dark:bg-zinc-800 flex items-center justify-center text-slate-300 group-hover:text-red-500 group-hover:bg-red-50 dark:group-hover:bg-red-900/20 transition-all">
                    <span className="material-symbols-outlined">arrow_forward</span>
                </div>
            </Link>

            {/* God-Mode Authorization */}
            {isOwnerOrMod && (
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="w-8 h-8 rounded-xl bg-slate-50 dark:bg-zinc-800 text-slate-400 hover:text-moriones-red hover:bg-moriones-red/10 flex items-center justify-center transition-all disabled:opacity-50"
                        title="Cancel Event"
                    >
                        <span className="material-symbols-outlined text-base">delete</span>
                    </button>
                </div>
            )}
        </div>
    );
}
