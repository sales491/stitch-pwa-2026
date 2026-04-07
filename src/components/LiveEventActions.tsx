'use client';
import { useState, useRef, useEffect } from 'react';
import { deleteLiveEvent } from '@/app/live-selling/actions';
import { useRouter } from 'next/navigation';

export default function LiveEventActions({ eventId }: { eventId: string }) {
    const [isOpen, setIsOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();
    const menuRef = useRef<HTMLDivElement>(null);

    // Close menu when clicking outside
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleDelete = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation(); // prevent card click
        if (!window.confirm("Are you sure you want to delete this live stream?")) return;
        setIsDeleting(true);
        try {
            await deleteLiveEvent(eventId);
            setIsOpen(false);
        } catch (error) {
            console.error(error);
            setIsDeleting(false);
            alert("Failed to delete event.");
        }
    };

    const handleEdit = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation(); // prevent card click
        router.push(`/live-selling/${eventId}/edit`);
    };

    const toggleMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation(); // prevent card click
        setIsOpen(!isOpen);
    };

    return (
        <div className="relative z-20 flex-shrink-0" ref={menuRef}>
            <button 
                onClick={toggleMenu}
                className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors border ${isOpen ? 'bg-slate-100 border-slate-200 dark:bg-zinc-800 dark:border-zinc-700 text-slate-800 dark:text-zinc-200' : 'bg-white border-slate-200 dark:bg-zinc-900 dark:border-zinc-700 text-slate-600 hover:bg-slate-50 dark:text-zinc-400 dark:hover:bg-zinc-800'} text-[11px] font-bold tracking-wide`}
                aria-label="Manage Event"
            >
                <span className="material-symbols-outlined text-[14px]">settings</span>
                MANAGE
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-1 w-36 bg-white dark:bg-zinc-800 rounded-xl shadow-xl shadow-slate-200/50 dark:shadow-black/50 border border-slate-100 dark:border-zinc-700 py-1 overflow-hidden origin-top-right animate-in fade-in zoom-in-95 duration-100">
                    <button 
                        onClick={handleEdit}
                        className="w-full text-left px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-zinc-200 hover:bg-slate-50 dark:hover:bg-zinc-700 flex items-center gap-2.5 transition-colors"
                    >
                        <span className="material-symbols-outlined text-[18px]">edit</span> Edit
                    </button>
                    <button 
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="w-full text-left px-4 py-2.5 text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 flex items-center gap-2.5 transition-colors disabled:opacity-50"
                    >
                        <span className="material-symbols-outlined text-[18px]">delete</span> 
                        {isDeleting ? 'Deleting...' : 'Delete'}
                    </button>
                </div>
            )}
        </div>
    );
}
