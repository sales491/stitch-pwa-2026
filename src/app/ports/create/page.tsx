'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { useAuth } from '@/components/AuthProvider';
import Link from 'next/link';

export default function CreatePortUpdate() {
    const { profile, isLoading: authLoading } = useAuth();
    const router = useRouter();

    // Form State
    const [formData, setFormData] = useState({
        port_name: 'Balanacan',
        status: 'info',
        message: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const CHARACTER_LIMIT = 150;

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    if (authLoading) return <div className="p-20 text-center font-black animate-pulse uppercase tracking-widest text-slate-400">Synchronizing Comms Channels...</div>;
    if (!profile) {
        router.push('/login');
        return null;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.message.trim()) return setError('Please provide a quick update message.');

        setIsSubmitting(true);
        setError(null);

        const { error: submitError } = await supabase
            .from('port_updates')
            .insert({
                ...formData,
                author_id: profile.id
            });

        if (submitError) {
            setError(submitError.message);
            setIsSubmitting(false);
        } else {
            router.push('/ports');
            router.refresh();
        }
    };

    return (
        <div className="bg-slate-50 dark:bg-zinc-950 min-h-screen pb-24 font-display">

            {/* Visual Hub Header */}
            <div className="bg-white dark:bg-zinc-900 px-6 py-10 border-b border-slate-100 dark:border-zinc-800 mb-8 rounded-b-[3rem] shadow-xl shadow-slate-200/50 dark:shadow-none">
                <div className="max-w-xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-5">
                        <Link href="/ports" className="w-14 h-14 flex items-center justify-center bg-slate-100 dark:bg-zinc-800 rounded-2xl text-slate-600 dark:text-zinc-400 active:scale-90 transition-transform shadow-inner border border-slate-50 dark:border-zinc-700">
                            <span className="material-symbols-outlined">arrow_back</span>
                        </Link>
                        <div>
                            <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tighter uppercase">Report Status</h1>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Field Intel Transmission</p>
                        </div>
                    </div>

                    <button
                        onClick={() => router.back()}
                        className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </div>

            <div className="max-w-xl mx-auto px-6">
                {error && (
                    <div className="mb-6 p-5 bg-red-50 text-red-600 rounded-[2rem] text-[10px] font-black uppercase tracking-widest border border-red-100 flex items-center gap-3">
                        <span className="material-symbols-outlined text-base">error</span>
                        Transmission Error: {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Step 1: Target Port */}
                    <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-zinc-800 shadow-sm space-y-4">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-600 mb-2 flex items-center gap-2">
                            <span className="material-symbols-outlined text-sm">location_on</span>
                            1. Select Port Target
                        </h3>
                        <div className="relative">
                            <select
                                required
                                className="w-full appearance-none bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl p-5 text-sm font-black focus:ring-4 focus:ring-blue-500/10 transition-all dark:text-white cursor-pointer"
                                value={formData.port_name}
                                onChange={(e) => setFormData({ ...formData, port_name: e.target.value })}
                            >
                                <option value="Balanacan">⚓ Balanacan Port (Mogpog)</option>
                                <option value="Cawit">⚓ Cawit Port (Boac)</option>
                                <option value="Buyabod">⚓ Buyabod Port (Santa Cruz)</option>
                                <option value="Lucena (Mainland)">🚢 Lucena (Mainland)</option>
                            </select>
                            <span className="material-symbols-outlined absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
                        </div>
                    </div>

                    {/* Step 2: Status Classification */}
                    <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-zinc-800 shadow-sm space-y-4">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 mb-2 flex items-center gap-2">
                            <span className="material-symbols-outlined text-sm">analytics</span>
                            2. Status Classification
                        </h3>
                        <div className="relative">
                            <select
                                required
                                className="w-full appearance-none bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl p-5 text-sm font-black focus:ring-4 focus:ring-emerald-500/10 transition-all dark:text-white cursor-pointer"
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            >
                                <option value="info">ℹ️ General Info / Update</option>
                                <option value="boarding">🟢 Boarding Now</option>
                                <option value="long_lines">🚶‍♂️ Long Lines / Crowded</option>
                                <option value="delayed">⏳ Delayed</option>
                                <option value="departed">🚢 Ship Departed</option>
                                <option value="arrived">⚓ Ship Arrived</option>
                                <option value="cancelled">❌ Cancelled Trip</option>
                            </select>
                            <span className="material-symbols-outlined absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">expand_more</span>
                        </div>
                    </div>

                    {/* Step 3: Intelligence Narrative */}
                    <div className="bg-white dark:bg-zinc-900 p-8 rounded-[2.5rem] border border-slate-100 dark:border-zinc-800 shadow-sm space-y-2 relative">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 flex items-center gap-2">
                            <span className="material-symbols-outlined text-sm">campaign</span>
                            3. Quick Intelligence Details
                        </h3>
                        <textarea
                            required
                            maxLength={CHARACTER_LIMIT}
                            className="w-full h-32 bg-slate-50 dark:bg-zinc-800 border-none rounded-2xl p-6 text-sm font-medium leading-relaxed focus:ring-4 focus:ring-blue-500/10 transition-all dark:text-white resize-none"
                            placeholder="e.g. Starhorse 1 is boarding now. Traffic is light."
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        />
                        {/* Tactical Character Counter */}
                        <div className="absolute bottom-6 right-8 flex items-center gap-2">
                            <div className={`h-1.5 w-1.5 rounded-full ${formData.message.length > 130 ? 'bg-red-500 animate-pulse' : 'bg-slate-300 dark:bg-zinc-600'}`}></div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                {formData.message.length} / {CHARACTER_LIMIT}
                            </span>
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting || !formData.message.trim()}
                        className="w-full bg-blue-600 text-white font-black py-6 rounded-[2.5rem] shadow-2xl shadow-blue-600/20 hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-4 disabled:opacity-50"
                    >
                        {isSubmitting ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                TRANSMITTING...
                            </>
                        ) : (
                            <>
                                <span className="material-symbols-outlined">send</span>
                                ACTIVATE BROADCAST
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
