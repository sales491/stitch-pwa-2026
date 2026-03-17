'use client';
import React, { useState } from 'react';
import { createClient } from '@/utils/supabase/client';

interface FlagButtonProps {
    contentType: 'listing' | 'job' | 'post' | 'comment' | 'business' | 'commute' | 'review';
    contentId: string;
    className?: string;
}

const REPORT_REASONS = [
    'Spam or misleading',
    'Prohibited or inappropriate content',
    'Scam / Fraud',
    'Offensive language',
    'Wrong category',
    'Duplicate listing',
    'Other',
] as const;

export default function FlagButton({ contentType, contentId, className = '' }: FlagButtonProps) {
    const [open, setOpen] = useState(false);
    const [reason, setReason] = useState<string>('');
    const [details, setDetails] = useState<string>('');
    const [submitting, setSubmitting] = useState(false);
    const [done, setDone] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async () => {
        if (!reason || !details.trim()) {
            setError('Please provide a reason and description.');
            return;
        }
        if (details.trim().length < 10) {
            setError('Please provide more details (at least 10 characters).');
            return;
        }
        setSubmitting(true);
        setError(null);

        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            setError('You must be signed in to report content.');
            setSubmitting(false);
            return;
        }

        const { error: insertError } = await supabase.from('content_flags').insert({
            content_type: contentType,
            content_id: contentId,
            flagged_by: user.id,
            reason,
            details,
        });

        if (insertError) {
            if (insertError.code === '23505') {
                // Unique constraint — user already flagged this
                setError('You have already reported this content.');
            } else {
                setError('Something went wrong. Please try again.');
            }
            setSubmitting(false);
            return;
        }

        // For operator/commute flags: also push directly to moderation_queue
        // (transport_services doesn't have a flag_count column, so the DB
        //  trigger won't fire — we write the queue row ourselves instead)
        if (contentType === 'commute') {
            await supabase.from('moderation_queue' as any).upsert({
                content_type: contentType,
                content_id: contentId,
                status: 'pending',
                queued_at: new Date().toISOString(),
            }, { onConflict: 'content_type,content_id', ignoreDuplicates: false });
        }

        setDone(true);
        setSubmitting(false);
        setTimeout(() => {
            setOpen(false);
            setDone(false);
            setReason('');
            setDetails('');
        }, 2000);
    };

    return (
        <>
            {/* Flag trigger button */}
            <button
                onClick={() => setOpen(true)}
                title="Report this content"
                className={`p-2 rounded-full transition-all active:scale-95 flex items-center justify-center bg-white/90 dark:bg-zinc-800/90 text-slate-400 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-400 border border-slate-200 dark:border-zinc-700 backdrop-blur-md shadow-sm ${className}`}
            >
                <span className="material-symbols-outlined text-[16px]">flag</span>
                <span className="sr-only">Report</span>
            </button>

            {/* Modal overlay */}
            {open && (
                <div
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-end justify-center"
                    onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}
                >
                    <div className="bg-white dark:bg-zinc-900 rounded-t-3xl w-full max-w-md p-6 pb-10 space-y-4 shadow-2xl">
                        {done ? (
                            <div className="flex flex-col items-center py-8 text-center">
                                <span className="material-symbols-outlined text-[48px] text-green-500 mb-3">check_circle</span>
                                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Report Submitted</h3>
                                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
                                    Thank you. Our moderators will review this content.
                                </p>
                            </div>
                        ) : (
                            <>
                                {/* Header */}
                                <div className="flex items-center justify-between">
                                    <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                                        <span className="material-symbols-outlined text-red-500">flag</span>
                                        Report Content
                                    </h3>
                                    <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                                        <span className="material-symbols-outlined">close</span>
                                    </button>
                                </div>

                                <p className="text-sm text-slate-500 dark:text-slate-400">
                                    Why are you reporting this? If content is flagged <strong>3 or more times</strong>, it is automatically hidden until a moderator reviews it.
                                </p>

                                {/* Reason picker */}
                                <div className="space-y-2">
                                    {REPORT_REASONS.map((r) => (
                                        <button
                                            key={r}
                                            onClick={() => setReason(r)}
                                            className={`w-full text-left px-4 py-2 rounded-xl border-2 text-xs font-medium transition-all ${reason === r
                                                ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                                                : 'border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                                                }`}
                                        >
                                            {r}
                                        </button>
                                    ))}
                                </div>

                                <div className="space-y-1">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Incident Details (Mandatory)</label>
                                    <textarea
                                        value={details}
                                        onChange={(e) => setDetails(e.target.value)}
                                        placeholder="Please describe exactly what happened..."
                                        className="w-full bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl p-3 text-sm text-slate-900 dark:text-white outline-none focus:border-red-500 min-h-[80px] resize-none"
                                    />
                                </div>

                                {error && (
                                    <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-xl">
                                        {error}
                                    </p>
                                )}

                                {/* Submit */}
                                <button
                                    onClick={handleSubmit}
                                    disabled={!reason || !details.trim() || submitting}
                                    className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${reason && details.trim() && !submitting
                                        ? 'bg-red-500 hover:bg-red-400 text-white'
                                        : 'bg-slate-200 dark:bg-zinc-800 text-slate-400 cursor-not-allowed'
                                        }`}
                                >
                                    {submitting ? 'Submitting...' : 'Submit Report'}
                                </button>
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
