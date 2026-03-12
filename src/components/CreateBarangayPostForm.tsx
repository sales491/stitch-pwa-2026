'use client';

import { useState, useTransition } from 'react';
import { createBarangayPost } from '@/app/actions/barangay-board';

type Props = {
    barangay: string;
    municipality: string;
    onPosted?: () => void;
};

export default function CreateBarangayPostForm({ barangay, municipality, onPosted }: Props) {
    const [content, setContent] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();
    const [showSuccess, setShowSuccess] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        startTransition(async () => {
            const result = await createBarangayPost({ content, barangay, municipality });
            if (result.success) {
                setContent('');
                setShowSuccess(true);
                setTimeout(() => setShowSuccess(false), 2000);
                onPosted?.();
            } else {
                setError(result.error ?? 'Something went wrong.');
            }
        });
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl px-4 py-4 shadow-sm">
            <textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                placeholder={`Share something with ${barangay}…`}
                rows={3}
                className="w-full bg-transparent text-[13px] text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:outline-none resize-none leading-relaxed"
            />
            {error && (
                <p className="text-[11px] text-rose-500 mt-1">{error}</p>
            )}
            <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 dark:border-zinc-800">
                <span className="text-[10px] text-slate-400 dark:text-zinc-500">
                    Visible to {barangay} residents
                </span>
                <button
                    type="submit"
                    disabled={isPending || !content.trim()}
                    className={`font-black text-[12px] px-4 py-2 rounded-xl transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-white ${
                        showSuccess
                            ? 'bg-green-500'
                            : 'bg-indigo-600 hover:bg-indigo-700'
                    }`}
                >
                    {showSuccess ? '✓ Posted!' : isPending ? 'Posting…' : 'Post'}
                </button>
            </div>
        </form>
    );
}
