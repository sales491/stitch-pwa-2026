'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { useAuth } from '@/components/AuthProvider';
import Image from 'next/image';
import { formatRelativeTime } from '@/utils/dateUtils';
import FlagButton from '@/components/FlagButton';
import SuccessToast from '@/components/SuccessToast';

/* ─── Types ─────────────────────────────────────────── */
type BusinessReviewsProps = {
    businessId: string;
};

interface Review {
    id: number;
    author_id: string | null;
    author_name: string;
    author_avatar?: string | null;
    rating: number;
    created_at: string;
    comment: string;
    color: string;
    initials: string;
}

/* ─── Helpers ────────────────────────────────────────── */
const AVATAR_COLORS = [
    'bg-violet-100 text-violet-700',
    'bg-sky-100 text-sky-700',
    'bg-emerald-100 text-emerald-700',
    'bg-pink-100 text-pink-700',
    'bg-amber-100 text-amber-700',
];

function getInitials(name: string) {
    if (!name) return '?';
    return name
        .trim()
        .split(' ')
        .map((w) => w[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
}

function StarRow({ rating, max = 5, size = 'text-[18px]' }: { rating: number; max?: number; size?: string }) {
    return (
        <div className="flex text-amber-400">
            {Array.from({ length: max }).map((_, i) => (
                <span
                    key={i}
                    className={`material-symbols-outlined ${size}`}
                    style={{ fontVariationSettings: i < rating ? '"FILL" 1' : '"FILL" 0' }}
                >
                    star
                </span>
            ))}
        </div>
    );
}

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
    const [hover, setHover] = useState(0);
    return (
        <div className="flex gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    onClick={() => onChange(star)}
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(0)}
                    className="transition-transform hover:scale-125 active:scale-110"
                >
                    <span
                        className="material-symbols-outlined text-[36px] text-amber-400 transition-all"
                        style={{ fontVariationSettings: (hover || value) >= star ? '"FILL" 1' : '"FILL" 0' }}
                    >
                        star
                    </span>
                </button>
            ))}
        </div>
    );
}

/* ─── Main Component ─────────────────────────────────── */
export default function BusinessReviews({ businessId }: BusinessReviewsProps) {
    const { profile } = useAuth();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [showForm, setShowForm] = useState(false);
    
    // Form State
    const [draftRating, setDraftRating] = useState(0);
    const [draftText, setDraftText] = useState('');
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const supabase = useMemo(() => createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    ), []);

    const isModOrAdmin = profile?.role === 'admin' || profile?.role === 'moderator';

    useEffect(() => {
        async function fetchReviews() {
            const { data, error } = await supabase
                .from('business_reviews')
                .select(`
                    id, rating, comment, created_at, author_id, author_name,
                    author:profiles(id, full_name, avatar_url)
                `)
                .eq('business_id', businessId)
                .order('created_at', { ascending: false });

            if (data && !error) {
                const mappedReviews: Review[] = data.map((r: any) => {
                    // Supabase joins can sometimes return arrays for 1-to-1 depending on FK setup. Safe extraction:
                    const authorData = Array.isArray(r.author) ? r.author[0] : r.author;
                    const displayName = authorData?.full_name || r.author_name || 'Marinduque Local';
                    
                    return {
                        id: r.id,
                        author_id: r.author_id,
                        author_name: displayName,
                        author_avatar: authorData?.avatar_url,
                        initials: getInitials(displayName),
                        color: AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)],
                        rating: r.rating,
                        created_at: r.created_at,
                        comment: r.comment,
                    };
                });
                setReviews(mappedReviews);
            }
        }
        fetchReviews();
    }, [supabase, businessId]);

    const submitReview = async () => {
        if (!profile || !draftRating || !draftText.trim()) return;
        setIsSubmitting(true);

        try {
            const newReviewData = {
                business_id: businessId,
                author_id: profile.id,
                author_name: profile.full_name || 'Anonymous', // We can still store this for legacy, but we join profiles
                rating: draftRating,
                comment: draftText.trim(),
            };

            const { data, error } = await supabase
                .from('business_reviews')
                .insert([newReviewData])
                .select(`
                    id, rating, comment, created_at, author_id, author_name,
                    author:profiles(id, full_name, avatar_url)
                `)
                .single();

            if (error) throw error;

            if (data) {
                // Supabase joins can sometimes return arrays for 1-to-1 depending on FK setup. Safe extraction:
                const authorData = Array.isArray(data.author) ? data.author[0] : data.author;
                const displayName = authorData?.full_name || data.author_name || 'Marinduque Local';
                
                const newReview: Review = {
                    id: data.id,
                    author_id: data.author_id,
                    author_name: displayName,
                    author_avatar: authorData?.avatar_url,
                    initials: getInitials(displayName),
                    color: AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)],
                    rating: data.rating,
                    created_at: data.created_at,
                    comment: data.comment,
                };

                setReviews((prev) => [newReview, ...prev]);
                
                // Clear Form
                setDraftRating(0);
                setDraftText('');
                setShowForm(false);
                
                // Show Success
                setShowSuccess(true);
            }
        } catch (err: any) {
            console.error('Error submitting review:', err);
            alert('Failed to submit review. Error details: ' + JSON.stringify(err, null, 2) + '\nMessage: ' + err.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteReview = async (reviewId: number) => {
        if (!window.confirm('Are you sure you want to permanently delete this review?')) return;

        const { error } = await supabase.from('business_reviews').delete().eq('id', reviewId);

        if (!error) {
            setReviews(reviews.filter(r => r.id !== reviewId));
        } else {
            console.error('Delete error:', error);
            alert(`Failed: ${error?.message || 'Unknown error'} (Code: ${error?.code || 'None'})`);
        }
    };

    return (
        <div className="mt-8 border-t border-slate-100 dark:border-zinc-800 pt-8">
            <SuccessToast visible={showSuccess} message="Your review was posted. Thank you!" autoDismiss={3000} onDismiss={() => setShowSuccess(false)} />
            
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <h3 className="font-black text-xl tracking-tight text-slate-900 dark:text-white">Community Reviews</h3>
                    <span className="bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-500 dark:text-zinc-400 px-3 py-1 rounded-full text-xs font-black shrink-0">
                        {reviews.length}
                    </span>
                </div>
                {profile ? (
                    <button
                        onClick={() => setShowForm((v) => !v)}
                        className="flex items-center gap-1.5 bg-teal-700 hover:bg-teal-600 text-white font-semibold text-sm px-4 py-2 rounded-full transition-all active:scale-95 shrink-0"
                    >
                        <span className="material-symbols-outlined text-[16px]">{showForm ? 'close' : 'edit'}</span>
                        {showForm ? 'Cancel' : 'Write a Review'}
                    </button>
                ) : (
                    <a
                        href="/login"
                        className="flex items-center gap-1.5 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-600 dark:text-slate-400 font-semibold text-sm px-4 py-2 rounded-full transition-all active:scale-95 shrink-0"
                    >
                        <span className="material-symbols-outlined text-[16px]">login</span>
                        Sign in to Review
                    </a>
                )}
            </div>

            {/* Write-a-review form */}
            {showForm && profile && (
                <div className="bg-slate-50 dark:bg-zinc-800/50 rounded-3xl border border-slate-200 dark:border-zinc-700 p-6 mb-8 space-y-5 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 rounded-full bg-teal-600 overflow-hidden relative shadow-md shrink-0">
                            {profile.avatar_url ? (
                                <Image src={profile.avatar_url} alt="You" fill className="object-cover" />
                            ) : (
                                <div className="flex items-center justify-center h-full text-white font-black text-sm">
                                    {profile.full_name?.charAt(0)}
                                </div>
                            )}
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-900 dark:text-white leading-tight">{profile.full_name}</p>
                            <p className="text-xs text-slate-500 dark:text-zinc-400">Public review</p>
                        </div>
                    </div>

                    {/* Star picker */}
                    <div className="bg-white dark:bg-zinc-900 rounded-2xl p-4 border border-slate-100 dark:border-zinc-800">
                        <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Rate your experience</label>
                        <StarPicker value={draftRating} onChange={setDraftRating} />
                        <div className="h-4 mt-1 text-xs font-bold text-amber-500">
                           {draftRating > 0 && ['Poor', 'Fair', 'Good', 'Very Good', 'Excellent!'][draftRating - 1]}
                        </div>
                    </div>

                    {/* Review text */}
                    <div>
                        <div className="flex justify-between items-end mb-2">
                            <label className="block text-xs font-black uppercase tracking-widest text-slate-400">
                                Share the details
                            </label>
                            <span className="text-[10px] font-bold text-slate-400">{draftText.length}/500</span>
                        </div>
                        <textarea
                            placeholder="What did you enjoy? Anything to improve? Be specific to help others."
                            value={draftText}
                            onChange={(e) => setDraftText(e.target.value.slice(0, 500))}
                            rows={4}
                            disabled={isSubmitting}
                            className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-2xl px-4 py-3 text-sm text-slate-900 dark:text-white outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/20 placeholder-slate-400 resize-none transition-all disabled:opacity-50"
                        />
                    </div>

                    {/* Submit */}
                    <button
                        onClick={submitReview}
                        disabled={!draftRating || !draftText.trim() || isSubmitting}
                        className={`w-full py-3.5 rounded-2xl font-black uppercase tracking-widest text-[11px] transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${draftRating && draftText.trim() && !isSubmitting
                            ? 'bg-teal-700 hover:bg-teal-600 text-white shadow-md shadow-teal-700/20'
                            : 'bg-slate-200 dark:bg-zinc-800 text-slate-400 cursor-not-allowed'
                            }`}
                    >
                        {isSubmitting ? (
                            <>
                                <span className="material-symbols-outlined animate-spin text-[16px]">progress_activity</span>
                                Posting...
                            </>
                        ) : (
                            <>
                                <span className="material-symbols-outlined text-[16px]">send</span>
                                Post Review
                            </>
                        )}
                    </button>
                </div>
            )}

            {/* Review list */}
            <div className="space-y-6">
                {reviews.map((r) => {
                    const canDelete = isModOrAdmin || profile?.id === r.author_id;

                    return (
                        <div key={r.id} className="flex gap-4 group">
                            {/* Avatar */}
                            <div className={`w-12 h-12 rounded-full overflow-hidden relative shadow-sm border border-slate-100 dark:border-zinc-800 flex items-center justify-center text-sm font-bold shrink-0 ${r.author_avatar ? '' : r.color} bg-white dark:bg-zinc-900`}>
                                {r.author_avatar ? (
                                    <Image src={r.author_avatar} alt="Avatar" fill className="object-cover" />
                                ) : (
                                    r.initials
                                )}
                            </div>
                            
                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-1 gap-1">
                                    <div>
                                        <h4 className="font-bold text-slate-900 dark:text-white text-[15px]">{r.author_name}</h4>
                                        <div className="flex items-center gap-2 mt-0.5">
                                            <StarRow rating={r.rating} size="text-[14px]" />
                                            <span className="text-[11px] font-semibold text-slate-400">
                                                {formatRelativeTime(r.created_at)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-1 mt-2 sm:mt-0">
                                        <FlagButton contentType="review" contentId={r.id.toString()} />
                                        {canDelete && (
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    handleDeleteReview(r.id);
                                                }}
                                                className="w-8 h-8 rounded-full bg-slate-50 dark:bg-zinc-800 text-slate-400 hover:text-moriones-red hover:bg-moriones-red/10 transition-all sm:opacity-0 sm:group-hover:opacity-100 flex items-center justify-center shrink-0 shadow-sm"
                                                title="Delete Review"
                                            >
                                                <span className="material-symbols-outlined text-[16px]">delete</span>
                                            </button>
                                        )}
                                    </div>
                                </div>
                                <p className="text-slate-600 dark:text-zinc-300 text-sm leading-relaxed whitespace-pre-wrap mt-2">
                                    {r.comment}
                                </p>
                            </div>
                        </div>
                    );
                })}

                {reviews.length === 0 && (
                    <div className="bg-slate-50 dark:bg-zinc-900/50 rounded-3xl p-10 border-2 border-dashed border-slate-200 dark:border-zinc-800 flex flex-col items-center justify-center text-center">
                        <span className="material-symbols-outlined text-teal-600/20 text-5xl mb-3">rate_review</span>
                        <p className="text-slate-600 dark:text-slate-400 text-sm font-bold">No reviews yet. Be the first to share your experience!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
