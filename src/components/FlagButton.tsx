'use client';
import React, { useState } from 'react';
import { createClient } from '@/utils/supabase/client';

interface FlagButtonProps {
    contentType: 'listing' | 'job' | 'post' | 'business' | 'commute' | 'review';
    contentId: string;
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

export default function FlagButton({ contentType, contentId }: FlagButtonProps) {
    const [open, setOpen] = useState(false);
    const [reason, setReason] = useState<string>('');
    const [submitting, setSubmitting] = useState(false);
    const [done, setDone] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async () => {
        if (!reason) return;
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

        setDone(true);
        setSubmitting(false);
        setTimeout(() => {
            setOpen(false);
            setDone(false);
            setReason('');
        }, 2000);
    };

    return (
        <>
            {/* Flag trigger button */}
            <button
                onClick={() => setOpen(true)}
                title="Report this content"
                className="flex items-center gap-1 text-slate-400 hover:text-red-500 transition-colors text-xs"
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
                                            className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${reason === r
                                                    ? 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
                                                    : 'border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                                                }`}
                                        >
                                            {r}
                                        </button>
                                    ))}
                                </div>

                                {error && (
                                    <p className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-xl">
                                        {error}
                                    </p>
                                )}

                                {/* Submit */}
                                <button
                                    onClick={handleSubmit}
                                    disabled={!reason || submitting}
                                    className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${reason && !submitting
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
