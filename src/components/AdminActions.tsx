'use client';
import React, { useEffect, useState, useMemo } from 'react';
import { createClient } from '@/utils/supabase/client';
import { isAdmin } from '@/utils/roles';
import { adminDeleteContent } from '@/app/actions/admin';
import { useRouter } from 'next/navigation';

interface AdminActionsProps {
    contentType: 'listing' | 'job' | 'business' | 'post' | 'comment' | 'commute' | 'user' | 'gem' | 'event';
    contentId: string;
    authorId?: string;
    onDelete?: () => void;
    onEdit?: () => void;
    className?: string;
    variant?: 'icon' | 'button';
}

export default function AdminActions({
    contentType,
    contentId,
    authorId,
    onDelete,
    onEdit,
    className = '',
    variant = 'icon'
}: AdminActionsProps) {
    const [isUserAdmin, setIsUserAdmin] = useState(false);
    const [confirming, setConfirming] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const supabase = useMemo(() => createClient(), []);
    const router = useRouter();

    useEffect(() => {
        async function checkRole() {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session?.user) return;

            // 1. If user is the author, allow access
            if (authorId && session.user.id === authorId) {
                console.log('[AdminActions] Author identified by authorId match.');
                setIsUserAdmin(true);
                return;
            }

            // 2. Check hardcoded admin list
            if (isAdmin(session.user.email)) {
                console.log('[AdminActions] Admin identified by hardcoded email list:', session.user.email);
                setIsUserAdmin(true);
                return;
            }

            // 3. Check DB role
            const { data: profile, error } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', session.user.id)
                .single();

            if (error) console.warn('[AdminActions] Profile fetch error:', error.message);

            if (profile?.role === 'admin' || (profile?.role === 'moderator' && contentType !== 'user')) {
                console.log('[AdminActions] Admin identified by DB role:', profile.role);
                setIsUserAdmin(true);
            } else {
                console.log('[AdminActions] Not admin nor author:', { email: session.user.email, role: profile?.role });
            }
        }
        checkRole();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [supabase, authorId, contentType]);

    if (!isUserAdmin) return null;

    const handleDeleteConfirm = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDeleting(true);

        try {
            const result = await adminDeleteContent(contentType, contentId);

            if (!result.success) {
                throw new Error(result.error || 'Deletion failed on server');
            }

            console.log('[AdminActions] Deleted successfully via server action:', contentType, contentId);
            setConfirming(false);

            if (onDelete) onDelete();
            else router.refresh();

        } catch (error: any) {
            console.error('[AdminActions] Delete error raw:', error);
            const detail = error?.message || 'Unknown error';
            alert(`Delete failed: ${detail}`);

        } finally {
            setIsDeleting(false);
        }
    };

    const handleEditClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (onEdit) {
            onEdit();
            return;
        }

        switch (contentType) {
            case 'listing':
                router.push(`/create-new-listing?id=${contentId}`);
                break;
            case 'business':
                router.push(`/directory/${contentId}/edit`);
                break;
            case 'commute':
                router.push(`/post-commute-or-delivery-listing?id=${contentId}`);
                break;
            case 'post':
                // Most posts are currently handled via community [id] or special pages
                router.push(`/community/create?id=${contentId}`);
                break;
            case 'gem':
                router.push(`/share-alocal-gem-screen?id=${contentId}`);
                break;
            case 'event':
                router.push(`/create-event-post-screen?id=${contentId}`);
                break;
            case 'job':
                router.push(`/create-new-job-post-screen?id=${contentId}`);
                break;
            default:
                alert(`Editing for ${contentType} is currently managed through your User Dashboard.`);
                break;
        }
    };

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setConfirming(true);
    };

    const handleCancelDelete = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setConfirming(false);
    };

    // Inline confirmation UI
    if (confirming) {
        return (
            <div
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                className={`flex flex-col gap-1 bg-white dark:bg-zinc-900 border border-red-200 dark:border-red-800 rounded-xl p-2 shadow-lg z-50 ${className}`}
            >
                <p className="text-[10px] font-bold text-red-600 text-center px-1">Delete this {contentType}?</p>
                <div className="flex gap-1">
                    <button
                        type="button"
                        onClick={handleDeleteConfirm}
                        disabled={isDeleting}
                        className="flex-1 px-2 py-1 bg-red-500 hover:bg-red-600 text-white text-[10px] font-bold rounded-lg transition-colors"
                    >
                        {isDeleting ? '...' : 'Yes'}
                    </button>
                    <button
                        type="button"
                        onClick={handleCancelDelete}
                        className="flex-1 px-2 py-1 bg-background-main text-text-muted text-[10px] font-bold rounded-lg transition-colors"
                    >
                        No
                    </button>
                </div>
            </div>
        );
    }

    if (variant === 'button') {
        return (
            <div
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
                className={`flex gap-2 ${className}`}
            >
                <button
                    type="button"
                    onClick={handleEditClick}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-background-main text-text-muted rounded-lg text-xs font-bold hover:opacity-80 transition-opacity"
                >
                    <span className="material-symbols-outlined text-[16px]">edit</span>
                    Edit
                </button>
                <button
                    type="button"
                    onClick={handleDeleteClick}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-xs font-bold hover:bg-red-200 transition-colors"
                >
                    <span className="material-symbols-outlined text-[16px]">delete</span>
                    Delete
                </button>
            </div>
        );
    }

    return (
        <div
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
            className={`flex items-center gap-1 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-sm p-1 rounded-lg border border-slate-200 dark:border-zinc-700 shadow-md ${className}`}
        >
            <button
                type="button"
                onClick={handleEditClick}
                className="p-1.5 text-text-muted hover:text-teal-600 transition-colors hover:bg-background-main rounded-md"
                title="Admin Edit"
            >
                <span className="material-symbols-outlined text-[18px]">edit</span>
            </button>
            <div className="w-px h-4 bg-border-main" />
            <button
                type="button"
                onClick={handleDeleteClick}
                className="p-1.5 text-text-muted hover:text-red-500 transition-colors hover:bg-background-main rounded-md"
                title="Admin Delete"
            >
                <span className="material-symbols-outlined text-[18px]">delete</span>
            </button>
        </div>
    );
}
