'use client';

import { useRouter } from 'next/navigation';

/**
 * Universal back button using router.back() for consistent browser-history navigation.
 * Use this on EVERY sub-page for PWA standalone mode where there's no browser back button.
 * 
 * @param className - Optional extra classes for positioning (e.g. "absolute top-4 left-4 z-20")
 */
export default function BackButton({ className = '' }: { className?: string }) {
    const router = useRouter();

    return (
        <button
            onClick={() => router.back()}
            aria-label="Go back"
            className={`p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 transition-colors flex items-center justify-center text-slate-600 dark:text-white/60 ${className}`}
        >
            <span className="material-symbols-outlined text-[26px]">arrow_back</span>
        </button>
    );
}
