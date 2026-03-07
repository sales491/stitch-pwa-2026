'use client';
import React, { useState, useTransition } from 'react';
import { addGemComment } from '@/app/actions/gems';

type Comment = {
    id: string;
    content: string;
    createdAt: string;
    author: {
        name: string;
        avatar: string | null;
    };
};

type Props = {
    gemId: string;
    initialComments: Comment[];
    currentUserId: string | null;
};

export default function GemCommentsSection({ gemId, initialComments, currentUserId }: Props) {
    const [commentText, setCommentText] = useState('');
    const [isPending, startTransition] = useTransition();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentText.trim() || isPending) return;

        const text = commentText;
        setCommentText('');

        startTransition(async () => {
            try {
                await addGemComment(gemId, text);
            } catch (error) {
                alert("Failed to post comment. Please try again.");
                setCommentText(text); // Restore text on failure
            }
        });
    };

    return (
        <div className="w-full mt-8 border-t border-gray-100 dark:border-zinc-800 pt-6">
            <h3 className="font-bold text-lg text-text-main dark:text-gray-100 mb-4">
                Comments ({initialComments.length})
            </h3>

            {currentUserId ? (
                <form onSubmit={handleSubmit} className="mb-6 flex gap-3">
                    <input
                        type="text"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        disabled={isPending}
                        placeholder="Add a comment..."
                        className="flex-1 bg-background-light dark:bg-white/5 border-none rounded-full px-4 py-2 text-sm text-text-main dark:text-gray-100 placeholder:text-gray-400 focus:ring-2 focus:ring-moriones-red focus:bg-white dark:focus:bg-black/20 transition-all"
                    />
                    <button
                        type="submit"
                        disabled={!commentText.trim() || isPending}
                        className="bg-moriones-red hover:bg-moriones-red/90 text-white font-black px-6 py-2 rounded-full text-xs uppercase tracking-widest disabled:opacity-50 transition-all shadow-lg shadow-moriones-red/20 active:scale-95"
                    >
                        Post
                    </button>
                </form>
            ) : (
                <p className="text-sm text-text-secondary dark:text-gray-400 mb-6 bg-background-light dark:bg-white/5 p-3 rounded-xl border border-dashed border-gray-200 dark:border-zinc-700">
                    Please log in to leave a comment.
                </p>
            )}

            <div className="space-y-4">
                {initialComments.length === 0 ? (
                    <p className="text-sm text-text-secondary dark:text-gray-500 italic">No comments yet. Be the first!</p>
                ) : (
                    initialComments.map(comment => (
                        <div key={comment.id} className="flex gap-3">
                            {comment.author.avatar ? (
                                <img src={comment.author.avatar} alt={comment.author.name} className="w-8 h-8 rounded-full object-cover shrink-0" />
                            ) : (
                                <div className="w-8 h-8 rounded-full bg-moriones-red/10 text-moriones-red flex items-center justify-center font-black text-xs shrink-0">
                                    {comment.author.name[0]?.toUpperCase() || 'A'}
                                </div>
                            )}
                            <div className="flex-1">
                                <div className="flex items-baseline gap-2">
                                    <span className="font-bold text-sm text-text-main dark:text-gray-200">{comment.author.name}</span>
                                    <span className="text-xs text-text-secondary dark:text-gray-500">
                                        {new Date(comment.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <p className="text-sm text-text-main/90 dark:text-gray-300 mt-0.5">{comment.content}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
