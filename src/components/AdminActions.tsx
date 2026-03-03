'use client';
import React, { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { isAdmin } from '@/utils/roles';

interface AdminActionsProps {
    contentType: 'listing' | 'job' | 'business' | 'post' | 'comment' | 'commute' | 'user';
    contentId: string;
    onDelete?: () => void;
    onEdit?: () => void;
    className?: string;
    variant?: 'icon' | 'button';
}

export default function AdminActions({
    contentType,
    contentId,
    onDelete,
    onEdit,
    className = '',
    variant = 'icon'
}: AdminActionsProps) {
    const [isUserAdmin, setIsUserAdmin] = useState(false);
    const supabase = createClient();

    useEffect(() => {
        async function checkRole() {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session?.user) return;

            // 1. Check hardcoded admin list for immediate access
            if (isAdmin(session.user.email)) {
                setIsUserAdmin(true);
                return;
            }

            // 2. Check Database profiles table
            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', session.user.id)
                .single();

            if (profile?.role === 'admin' || (profile?.role === 'moderator' && contentType !== 'user')) {
                setIsUserAdmin(true);
            }
        }
        checkRole();
    }, [supabase, contentType]);

    if (!isUserAdmin) return null;

    const handleDelete = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const itemLabel = contentType === 'user' ? 'user account' : contentType;
        const confirmDelete = window.confirm(`Are you sure you want to delete this ${itemLabel}? This action cannot be undone.`);
        if (!confirmDelete) return;

        try {
            // Map content type to table name
            const tableMap: Record<string, string> = {
                'listing': 'listings',
                'job': 'job_posts',
                'business': 'business_profiles',
                'post': 'community_posts',
                'comment': 'reviews',
                'commute': 'commute_listings',
                'user': 'profiles'
            };

            const tableName = tableMap[contentType];
            if (!tableName) throw new Error(`Unknown content type: ${contentType}`);

            // 1. Delete the actual content
            const { error: deleteError } = await supabase
                .from(tableName)
                .delete()
                .eq('id', contentId);

            if (deleteError) throw deleteError;

            // 2. Clean up moderation queue if it was flagged
            if (contentType !== 'user') {
                await supabase
                    .from('moderation_queue')
                    .delete()
                    .eq('content_type', contentType)
                    .eq('content_id', contentId);
            }

            alert(`${contentType} deleted successfully from database.`);

            if (onDelete) onDelete();
            else window.location.reload();

        } catch (error: any) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            console.error('Error deleting content:', error);
            alert(`Failed to delete: ${errorMessage}`);
        }
    };

    const handleEdit = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (onEdit) {
            onEdit();
        } else {
            // Provide specific feedback for businesses vs other types
            const editLabel = contentType === 'business' ? `Business Profile: ${contentId}` : `${contentType} (ID: ${contentId})`;
            alert(`ADMIN ACTION: Opening Edit Mode for ${editLabel}.\n\n(This would normally navigate to an edit form for this specific record)`);
        }
    };

    if (variant === 'button') {
        return (
            <div className={`flex gap-2 ${className}`}>
                <button
                    onClick={handleEdit}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-bold hover:bg-slate-200 transition-colors"
                >
                    <span className="material-symbols-outlined text-[16px]">edit</span>
                    Edit
                </button>
                <button
                    onClick={handleDelete}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-xs font-bold hover:bg-red-200 transition-colors"
                >
                    <span className="material-symbols-outlined text-[16px]">delete</span>
                    Delete
                </button>
            </div>
        );
    }

    return (
        <div className={`flex items-center gap-1 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm p-1 rounded-lg border border-slate-200 dark:border-zinc-700 shadow-sm ${className}`}>
            <button
                onClick={handleEdit}
                className="p-1.5 text-slate-600 dark:text-slate-400 hover:text-primary transition-colors hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-md"
                title="Admin Edit"
            >
                <span className="material-symbols-outlined text-[18px]">edit</span>
            </button>
            <div className="w-px h-4 bg-slate-200 dark:bg-zinc-700" />
            <button
                onClick={handleDelete}
                className="p-1.5 text-slate-600 dark:text-slate-400 hover:text-red-500 transition-colors hover:bg-slate-100 dark:hover:bg-zinc-800 rounded-md"
                title="Admin Delete"
            >
                <span className="material-symbols-outlined text-[18px]">delete</span>
            </button>
        </div>
    );
}
