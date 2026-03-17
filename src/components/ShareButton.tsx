'use client';

import React, { useState } from 'react';

type ShareButtonProps = {
    title: string;
    text: string;
    url: string;
    variant?: 'icon' | 'full' | 'subtle';
    className?: string;
};

export default function ShareButton({ title, text, url, variant = 'icon', className = '' }: ShareButtonProps) {
    const [copied, setCopied] = useState(false);

    const handleShare = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        // Ensure the URL is fully qualified
        const shareUrl = url.startsWith('http') ? url : `${window.location.origin}${url.startsWith('/') ? url : `/${url}`}`;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: title,
                    text: text,
                    url: shareUrl,
                });
                return;
            } catch (error: any) {
                // If the user cancelled the share, don't fallback to copy
                if (error.name === 'AbortError') return;
                console.error('Error sharing:', error);
            }
        }

        // Fallback: Copy to clipboard
        try {
            await navigator.clipboard.writeText(shareUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy text: ', err);
            alert('Could not copy link. Try copying the URL manually.');
        }
    };

    if (variant === 'icon') {
        return (
            <button
                onClick={handleShare}
                aria-label="Share"
                className={`p-2 rounded-full transition-all active:scale-95 flex items-center justify-center ${
                    copied
                        ? 'bg-emerald-500 text-white shadow-[0_0_10px_rgba(16,185,129,0.5)]'
                        : 'bg-white/90 dark:bg-zinc-800/90 text-slate-600 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-cyan-400 border border-slate-200 dark:border-zinc-700 backdrop-blur-md shadow-sm'
                } ${className}`}
                title={copied ? "Link Copied!" : "Share"}
            >
                <span className="material-symbols-outlined text-[18px]">
                    {copied ? 'check' : 'share'}
                </span>
            </button>
        );
    }

    if (variant === 'subtle') {
        return (
             <button
                onClick={handleShare}
                className={`flex items-center gap-1.5 p-1 rounded-md transition-all ${
                    copied ? 'text-emerald-500' : 'text-slate-500 hover:text-cyan-600'
                } ${className}`}
            >
                <span className="material-symbols-outlined text-[14px]">
                    {copied ? 'check' : 'share'}
                </span>
                <span className="text-[10px] uppercase font-black tracking-widest leading-none mt-0.5">
                    {copied ? 'Copied' : 'Share'}
                </span>
            </button>
        );
    }

    // Default 'full' variant
    return (
        <button
            onClick={handleShare}
            className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 shadow-sm border ${
                copied
                    ? 'bg-emerald-500 text-white border-emerald-500 shadow-emerald-500/20'
                    : 'bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-zinc-700 border-slate-200 dark:border-zinc-700'
            } ${className}`}
        >
            <span className="material-symbols-outlined text-[16px]">
                {copied ? 'check' : 'share'}
            </span>
            {copied ? 'Copied Link!' : 'Share'}
        </button>
    );
}
