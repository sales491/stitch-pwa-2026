'use client';

import { useState, useEffect, useMemo } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useAuth } from '@/components/AuthProvider';
import Image from 'next/image';
import Link from 'next/link';
import { formatRelativeTime } from '@/utils/dateUtils';
import FlagButton from '@/components/FlagButton';

type CommentProps = {
    entityId: string;
    entityType: 'listing' | 'post' | 'business' | 'gem' | 'event' | 'job' | 'blog';
};

export default function UniversalComments({ entityId, entityType }: CommentProps) {
    const { profile } = useAuth();
    const [comments, setComments] = useState<any[]>([]);
    const [newComment, setNewComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const supabase = useMemo(() => createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    ), []);

    // Check if the current user has God-Mode powers
    const isModOrAdmin = profile?.role === 'admin' || profile?.role === 'moderator';

    // Fetch comments on load and initialize realtime subscription
    useEffect(() => {
        let channel: any;

        async function fetchComments() {
            const { data } = await supabase
                .from('comments')
                .select(`
                  id, content, created_at, author_id,
                  author:profiles(id, full_name, avatar_url)
                `)
                .eq('entity_id', entityId)
                .eq('entity_type', entityType)
                .order('created_at', { ascending: true }); // Oldest first, like FB

            if (data) setComments(data);
        }

        fetchComments();

        // Establish the Realtime connection specific to THIS entity
        channel = supabase
            .channel(`comments-${entityId}`)
            .on('postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'comments',
                    filter: `entity_id=eq.${entityId}`
                },
                async (payload) => {
                    // Fetch the full author details for the new comment
                    const { data: newCommentData } = await supabase
                        .from('comments')
                        .select(`
                            id, content, created_at, author_id,
                            author:profiles(id, full_name, avatar_url)
                        `)
                        .eq('id', payload.new.id)
                        .single();

                    if (newCommentData) {
                        setComments((currentComments) => {
                            // Prevent duplicates if the user themselves just submitted it
                            if (currentComments.some(c => c.id === newCommentData.id)) return currentComments;
                            return [...currentComments, newCommentData];
                        });
                    }
                }
            )
            .on('postgres_changes',
                {
                    event: 'DELETE',
                    schema: 'public',
                    table: 'comments',
                    filter: `entity_id=eq.${entityId}`
                },
                (payload) => {
                    setComments((currentComments) =>
                        currentComments.filter(c => c.id !== payload.old.id)
                    );
                }
            )
            .subscribe();

        // Cleanup function when the component unmounts
        return () => {
            if (channel) {
                supabase.removeChannel(channel);
            }
        };

    }, [entityId, entityType, supabase]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!profile || !newComment.trim()) return;
        setIsSubmitting(true);

        try {
            const { data: insertedComment, error } = await supabase
                .from('comments')
                .insert({
                    entity_id: entityId,
                    entity_type: entityType,
                    author_id: profile.id,
                    content: newComment,
                })
                .select(`id, content, created_at, author_id, author:profiles(id, full_name, avatar_url)`)
                .single();

            if (!error && insertedComment) {
                setComments([...comments, insertedComment]); // Add to UI instantly
                setNewComment(''); // Clear input
            } else if (error) {
                console.error('Comment error:', error);
            }
        } catch (err) {
            console.error('Submit error:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    // The God-Mode Delete Function
    const handleDeleteComment = async (commentId: string) => {
        if (!window.confirm('Are you sure you want to permanently delete this comment?')) return;

        // Supabase RLS will block this if they aren't the owner or a mod!
        const { error } = await supabase.from('comments').delete().eq('id', commentId);

        if (!error) {
            // Remove it from the UI instantly
            setComments(comments.filter(c => c.id !== commentId));
        } else {
            console.error('Delete error:', error);
            alert('Failed to delete comment. You may not have permission.');
        }
    };

    return (
        <div className="mt-8 border-t border-slate-100 dark:border-zinc-800 pt-8">
            <div className="flex items-center gap-3 mb-6">
                <h3 className="font-black text-xl tracking-tight text-text-main">Community Hub</h3>
                <span className="bg-background-main border border-border-main text-text-muted px-3 py-1 rounded-full text-xs font-black">
                    {comments.length} Comments
                </span>
            </div>

            {/* The Comment List */}
            <div className="flex flex-col gap-6 mb-8">
                {comments.map((c) => {
                    // Can this user delete this specific comment?
                    const canDelete = isModOrAdmin || profile?.id === c.author_id;

                    return (
                        <div key={c.id} className="flex gap-4 group">
                            <div className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-zinc-800 overflow-hidden relative flex-shrink-0 shadow-sm">
                                {c.author?.avatar_url ? (
                                    <Image src={c.author.avatar_url} alt="Avatar" fill className="object-cover" />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-text-muted/40 font-black text-xs">
                                        {c.author?.full_name?.charAt(0) || '?'}
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-col flex-1 min-w-0">
                                <div className="flex items-start gap-2">
                                    <div className="bg-background-main border border-border-main rounded-2xl px-5 py-3 text-sm flex-1">
                                        <span className="font-black block text-text-main mb-1">{c.author?.full_name || 'Marinduque Local'}</span>
                                        <span className="text-text-muted font-medium leading-relaxed break-words">{c.content}</span>
                                    </div>

                                    {/* The God-Mode Delete Button - Appears on hover */}
                                    {canDelete && (
                                        <button
                                            onClick={() => handleDeleteComment(c.id)}
                                            className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-zinc-800 text-slate-400 hover:text-moriones-red hover:bg-moriones-red/10 transition-all opacity-0 group-hover:opacity-100 flex items-center justify-center shrink-0 shadow-sm"
                                            title="Delete Comment"
                                        >
                                            <span className="material-symbols-outlined text-[18px]">delete</span>
                                        </button>
                                    )}
                                </div>
                                <div className="flex gap-4 ml-2 mt-1.5 items-center">
                                    <span className="text-[10px] text-text-muted/60 font-black uppercase tracking-wider">
                                        {formatRelativeTime(c.created_at)}
                                    </span>
                                    <button className="text-[10px] text-text-muted font-black uppercase tracking-wider hover:text-blue-600 transition-colors">Reply</button>
                                    <FlagButton contentType="comment" contentId={c.id} />
                                </div>
                            </div>
                        </div>
                    );
                })}

                {comments.length === 0 && (
                    <div className="bg-background-main rounded-3xl p-10 border-2 border-dashed border-border-main/50 flex flex-col items-center justify-center text-center">
                        <span className="material-symbols-outlined text-text-muted/20 text-5xl mb-3">chat_bubble</span>
                        <p className="text-text-muted text-sm font-bold">No comments yet. Be the first to start the conversation!</p>
                    </div>
                )}
            </div>

            {/* The Comment Input Box */}
            {profile ? (
                <form onSubmit={handleSubmit} className="flex gap-4 items-start sticky bottom-20 bg-white dark:bg-zinc-950 p-4 border-t border-slate-100 dark:border-zinc-800 shadow-2xl rounded-t-3xl md:static md:shadow-none md:p-0 md:border-none md:rounded-none">
                    <div className="w-10 h-10 rounded-2xl bg-blue-600 overflow-hidden relative flex-shrink-0 shadow-lg shadow-blue-600/20">
                        {profile.avatar_url ? (
                            <Image src={profile.avatar_url} alt="You" fill className="object-cover" />
                        ) : (
                            <div className="flex items-center justify-center h-full text-white font-black text-sm">
                                {profile.full_name?.charAt(0)}
                            </div>
                        )}
                    </div>
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            className="w-full bg-background-main border-none rounded-2xl px-5 py-3.5 text-sm font-bold focus:ring-2 focus:ring-blue-500/20 transition-all text-text-main placeholder:text-text-muted/40"
                            placeholder="Write a message..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            disabled={isSubmitting}
                        />
                        <button
                            type="submit"
                            disabled={isSubmitting || !newComment.trim()}
                            className="absolute right-2 top-1.5 bottom-1.5 bg-blue-600 text-white font-black px-4 rounded-xl text-[11px] uppercase tracking-widest disabled:bg-slate-200 disabled:text-slate-400 transition-all active:scale-95 shadow-lg shadow-blue-600/10"
                        >
                            {isSubmitting ? '...' : 'Send'}
                        </button>
                    </div>
                </form>
            ) : (
                <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] flex flex-col items-center justify-center gap-4 text-center">
                    <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Restricted Access</p>
                    <h4 className="text-white font-black truncate max-w-xs">Join the community to discuss this.</h4>
                    <Link href="/login" className="bg-blue-600 text-white px-8 py-3 rounded-2xl text-xs font-black uppercase tracking-widest active:scale-95 transition-transform">Sign In to Comment</Link>
                </div>
            )}
        </div>
    );
}
