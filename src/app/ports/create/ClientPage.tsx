'use client';
export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { useAuth } from '@/components/AuthProvider';
import Link from 'next/link';

const STATUS_OPTIONS = [
    { value: 'info', emoji: 'ℹ️', label: 'General info / update' },
    { value: 'boarding', emoji: '🟢', label: 'Boarding now' },
    { value: 'long_lines', emoji: '🚶', label: 'Long lines / crowded' },
    { value: 'delayed', emoji: '⏳', label: 'Delayed' },
    { value: 'departed', emoji: '🚢', label: 'Ship just left' },
    { value: 'arrived', emoji: '⚓', label: 'Ship just arrived' },
    { value: 'cancelled', emoji: '❌', label: 'Trip cancelled' },
];

const PORT_OPTIONS = [
    { value: 'Balanacan', label: '⚓ Balanacan Port (Mogpog)' },
    { value: 'Cawit', label: '⚓ Cawit Port (Boac)' },
    { value: 'Buyabod', label: '⚓ Buyabod Port (Santa Cruz)' },
    { value: 'Lucena (Mainland)', label: '🚢 Lucena / Dalahican (Mainland)' },
];

const CHAR_LIMIT = 200;

const EXAMPLE_TIPS = [
    'Starhorse 1 naka-dock na, boarding na!',
    'Montenegro Lines delayed ng 1 oras dahil sa alon.',
    'Malakas ang agos ngayon, mag-ingat.',
    'Walang pila sa Balanacan ngayon, go na!',
];

export default function CreatePortUpdate() {
    const { profile, isLoading: authLoading } = useAuth();
    const router = useRouter();

    const [formData, setFormData] = useState({
        port_name: 'Balanacan',
        status: 'info',
        message: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    if (authLoading) {
        return (
            <div className="flex flex-col items-center justify-center h-64 gap-3">
                <div className="w-8 h-8 border-4 border-moriones-red/30 border-t-moriones-red rounded-full animate-spin" />
                <p className="text-xs font-black text-text-muted uppercase tracking-widest">Loading...</p>
            </div>
        );
    }

    if (!profile) {
        router.push('/login');
        return null;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.message.trim()) return setError('Please write a quick update first.');
        setIsSubmitting(true);
        setError(null);

        const { error: err } = await supabase.from('port_updates').insert({
            ...formData,
            author_id: profile.id,
        });

        if (err) {
            setError(err.message);
            setIsSubmitting(false);
        } else {
            router.push('/ports');
            router.refresh();
        }
    };

    const charsLeft = CHAR_LIMIT - formData.message.length;

    return (
        <div className="flex flex-col w-full bg-background-light dark:bg-background-dark min-h-screen pb-28">

            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark sticky top-0 z-20">
                <Link href="/ports" className="p-1 rounded-full hover:bg-background-light dark:hover:bg-background-dark transition-colors">
                    <span className="material-symbols-outlined text-[24px] text-text-main dark:text-text-main-dark">arrow_back</span>
                </Link>
                <div>
                    <h1 className="text-base font-black text-text-main dark:text-text-main-dark leading-none">
                        Share a Port Update
                    </h1>
                    <p className="text-[10px] text-text-muted dark:text-text-muted-dark mt-0.5">
                        Help fellow commuters know what&apos;s happening
                    </p>
                </div>
            </div>

            <div className="px-4 py-5 space-y-5">

                {/* Who's posting */}
                <div className="flex items-center gap-3 bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-2xl p-4 shadow-sm">
                    {profile.avatar_url
                        ? <img src={profile.avatar_url} alt="" className="w-10 h-10 rounded-full object-cover border border-border-light shrink-0" />
                        : <div className="w-10 h-10 rounded-full bg-moriones-red flex items-center justify-center text-white font-black text-sm shrink-0">{profile.full_name?.[0] ?? 'C'}</div>
                    }
                    <div>
                        <p className="text-sm font-black text-text-main dark:text-text-main-dark">{profile.full_name ?? 'Fellow Commuter'}</p>
                        <p className="text-[10px] text-text-muted dark:text-text-muted-dark">Posting as yourself · tips are community-sourced</p>
                    </div>
                </div>

                {error && (
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-2xl text-xs font-bold border border-red-100 dark:border-red-800 flex items-center gap-2">
                        <span className="material-symbols-outlined text-[16px]">error</span>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* Which port */}
                    <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-2xl p-4 shadow-sm space-y-2">
                        <label className="text-[10px] font-black text-moriones-red uppercase tracking-widest flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-[13px]">location_on</span>
                            Which port are you at?
                        </label>
                        <div className="relative">
                            <select
                                required
                                className="w-full appearance-none bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-xl px-4 py-3 text-sm font-bold text-text-main dark:text-text-main-dark focus:ring-2 focus:ring-moriones-red/30 focus:border-moriones-red/50 outline-none cursor-pointer"
                                value={formData.port_name}
                                onChange={(e) => setFormData({ ...formData, port_name: e.target.value })}
                            >
                                {PORT_OPTIONS.map(o => (
                                    <option key={o.value} value={o.value}>{o.label}</option>
                                ))}
                            </select>
                            <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none text-[18px]">expand_more</span>
                        </div>
                    </div>

                    {/* What's happening */}
                    <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-2xl p-4 shadow-sm space-y-2">
                        <label className="text-[10px] font-black text-emerald-600 uppercase tracking-widest flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-[13px]">help</span>
                            What&apos;s the situation?
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {STATUS_OPTIONS.map(opt => (
                                <button
                                    key={opt.value}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, status: opt.value })}
                                    className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all active:scale-95 ${formData.status === opt.value
                                            ? 'bg-moriones-red text-white border-moriones-red shadow-sm shadow-moriones-red/20'
                                            : 'bg-background-light dark:bg-background-dark text-text-muted dark:text-text-muted-dark border-border-light dark:border-border-dark hover:border-moriones-red/30'
                                        }`}
                                >
                                    {opt.emoji} {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Message */}
                    <div className="bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark rounded-2xl p-4 shadow-sm space-y-2">
                        <label className="text-[10px] font-black text-text-muted dark:text-text-muted-dark uppercase tracking-widest flex items-center gap-1.5">
                            <span className="material-symbols-outlined text-[13px]">chat_bubble</span>
                            Tell us what you see
                        </label>
                        <textarea
                            required
                            maxLength={CHAR_LIMIT}
                            className="w-full h-28 bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-xl px-4 py-3 text-sm font-medium text-text-main dark:text-text-main-dark leading-relaxed focus:ring-2 focus:ring-moriones-red/30 focus:border-moriones-red/50 outline-none resize-none transition-all placeholder:text-text-muted"
                            placeholder="e.g. Starhorse 1 naka-dock na, boarding na! Walang matagal na pila."
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        />
                        {/* Char count */}
                        <div className="flex items-center justify-between">
                            <p className={`text-[10px] font-bold ${charsLeft < 30 ? 'text-red-500' : 'text-text-muted dark:text-text-muted-dark'}`}>
                                {charsLeft} characters left
                            </p>
                        </div>

                        {/* Example tips */}
                        <div>
                            <p className="text-[10px] font-black text-text-muted dark:text-text-muted-dark uppercase tracking-widest mb-1.5">Quick examples:</p>
                            <div className="flex flex-wrap gap-1.5">
                                {EXAMPLE_TIPS.map(tip => (
                                    <button
                                        key={tip}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, message: tip })}
                                        className="text-[10px] font-medium text-moriones-red border border-moriones-red/20 bg-moriones-red/5 px-2.5 py-1 rounded-lg hover:bg-moriones-red/10 active:scale-95 transition-all text-left"
                                    >
                                        &ldquo;{tip}&rdquo;
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={isSubmitting || !formData.message.trim()}
                        className="w-full bg-moriones-red text-white font-black py-4 rounded-2xl shadow-xl shadow-moriones-red/20 hover:bg-red-700 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed text-sm uppercase tracking-widest"
                    >
                        {isSubmitting ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                Posting...
                            </>
                        ) : (
                            <>
                                <span className="material-symbols-outlined text-[20px]">send</span>
                                Post Update
                            </>
                        )}
                    </button>

                    <p className="text-center text-[10px] text-text-muted dark:text-text-muted-dark leading-relaxed">
                        Your update will be visible to everyone on the app. <br />
                        Please only share what you personally see or know. 🙏
                    </p>
                </form>
            </div>
        </div>
    );
}


