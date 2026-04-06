'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthProvider';
import { createClient } from '@/utils/supabase/client';
import BackButton from '@/components/BackButton';
import PageHeader from '@/components/PageHeader';

export default function ClientPage() {
    const { profile, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const [form, setForm] = useState({
        platform: 'TikTok',
        title: '',
        stream_link: '',
        date: new Date().toISOString().split('T')[0], // yyyy-mm-dd
        time: '', // HH:mm
        duration: '120', // minutes
    });

    // Protect route
    if (!authLoading && !profile) {
        if (typeof window !== 'undefined') router.replace('/login?redirectTo=/live-selling/new');
        return <div className="p-8 text-center text-text-muted">Redirecting to login...</div>;
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);

        if (!profile) return;
        
        try {
            const supabase = createClient();
            
            // Combine date and time
            if (!form.date || !form.time) {
                throw new Error("Please select both a date and time.");
            }
            
            // Create a proper local Date object and convert to ISO so Postgres handles it nicely UTC
            const localStart = new Date(`${form.date}T${form.time}:00`);
            if (isNaN(localStart.getTime())) {
                throw new Error("Invalid date/time format.");
            }

            const { error: insertError } = await supabase.from('live_selling_events').insert({
                seller_id: profile.id,
                platform: form.platform,
                title: form.title,
                stream_link: form.stream_link,
                scheduled_start: localStart.toISOString(),
                estimated_duration: parseInt(form.duration, 10) || 120,
            });

            if (insertError) throw insertError;

            // Redirect back to radar
            router.push('/live-selling');
            router.refresh();
        } catch (err: any) {
            console.error('Submit error:', err);
            setError(err.message || 'Failed to schedule live stream.');
            setSubmitting(false);
        }
    };

    return (
        <div className="bg-surface-light dark:bg-surface-dark min-h-screen pb-24">
            <BackButton />
            <PageHeader 
                title="Schedule a Live" 
                subtitle="Alert the island before you jump on stream!" 
                emoji="📡" 
            />

            <div className="max-w-md mx-auto px-4 mt-6">
                {error && (
                    <div className="mb-6 rounded-xl bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-900/50 p-4 shadow-sm">
                        <p className="text-sm font-bold text-red-800 dark:text-red-400">{error}</p>
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Platform Selection */}
                    <div className="space-y-1.5">
                        <label className="text-[13px] font-black uppercase tracking-wider text-slate-800 dark:text-zinc-200">
                            Where are you streaming? <span className="text-red-500">*</span>
                        </label>
                        <select
                            required
                            value={form.platform}
                            onChange={(e) => setForm({ ...form, platform: e.target.value })}
                            className="w-full flex-1 rounded-xl bg-white dark:bg-zinc-900 px-4 py-3 border border-slate-200 dark:border-zinc-800 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-moriones-red/50 focus:border-moriones-red/30 transition-all appearance-none"
                        >
                            <option value="TikTok">TikTok Live</option>
                            <option value="Shopee">Shopee Live</option>
                            <option value="Facebook">Facebook Live</option>
                            <option value="YouTube">YouTube Live</option>
                            <option value="Instagram">Instagram Live</option>
                        </select>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[13px] font-black uppercase tracking-wider text-slate-800 dark:text-zinc-200">
                            Stream Link <span className="text-red-500">*</span>
                        </label>
                        <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-tight">
                            Link to your profile so people can find you easily. You can update this right before going live if you need a direct video link!
                        </p>
                        <input
                            type="url"
                            required
                            placeholder="https://tiktok.com/@yourusername"
                            value={form.stream_link}
                            onChange={(e) => setForm({ ...form, stream_link: e.target.value })}
                            className="w-full rounded-xl bg-white dark:bg-zinc-900 px-4 py-3 border border-slate-200 dark:border-zinc-800 text-sm font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-moriones-red/50 transition-all"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[13px] font-black uppercase tracking-wider text-slate-800 dark:text-zinc-200">
                            What are you selling? <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. Ukay-Ukay Jackets, Seafood, Ornaments"
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                            className="w-full rounded-xl bg-white dark:bg-zinc-900 px-4 py-3 border border-slate-200 dark:border-zinc-800 text-sm font-semibold text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-moriones-red/50 transition-all"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[13px] font-black uppercase tracking-wider text-slate-800 dark:text-zinc-200">
                                Start Date <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="date"
                                required
                                value={form.date}
                                onChange={(e) => setForm({ ...form, date: e.target.value })}
                                className="w-full rounded-xl bg-white dark:bg-zinc-900 px-4 py-3 border border-slate-200 dark:border-zinc-800 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-moriones-red/50 transition-all"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[13px] font-black uppercase tracking-wider text-slate-800 dark:text-zinc-200">
                                Start Time <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="time"
                                required
                                value={form.time}
                                onChange={(e) => setForm({ ...form, time: e.target.value })}
                                className="w-full rounded-xl bg-white dark:bg-zinc-900 px-4 py-3 border border-slate-200 dark:border-zinc-800 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-moriones-red/50 transition-all"
                            />
                        </div>
                    </div>
                    
                    <div className="space-y-1.5">
                        <label className="text-[13px] font-black uppercase tracking-wider text-slate-800 dark:text-zinc-200">
                            Estimated Duration
                        </label>
                        <select
                            value={form.duration}
                            onChange={(e) => setForm({ ...form, duration: e.target.value })}
                            className="w-full flex-1 rounded-xl bg-white dark:bg-zinc-900 px-4 py-3 border border-slate-200 dark:border-zinc-800 text-sm font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-moriones-red/50 transition-all appearance-none"
                        >
                            <option value="60">1 Hour</option>
                            <option value="120">2 Hours</option>
                            <option value="180">3 Hours</option>
                            <option value="240">4+ Hours</option>
                        </select>
                        <p className="text-[10px] text-slate-500 dark:text-zinc-400">
                            We will automatically remove your stream from the radar if you go past this time limit.
                        </p>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={submitting || authLoading}
                            className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-white hover:to-white hover:text-red-600 text-white font-black uppercase tracking-widest text-[13px] rounded-xl px-5 py-4 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed border-2 border-transparent hover:border-red-600"
                        >
                            {submitting ? 'Broadcasting to Hub...' : 'Post Schedule'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
