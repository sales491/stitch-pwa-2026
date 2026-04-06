'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import BackButton from '@/components/BackButton';
import PageHeader from '@/components/PageHeader';
import { updateLiveEvent } from '@/app/live-selling/actions';

export default function ClientPage({ initialData }: { initialData: any }) {
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    // Parse the saved UTC time into local date and time inputs using Javascript Date
    const savedDate = new Date(initialData.scheduled_start);
    // Pad zero helper
    const pad = (n: number) => n.toString().padStart(2, '0');
    
    // YYYY-MM-DD
    const localDateStr = `${savedDate.getFullYear()}-${pad(savedDate.getMonth() + 1)}-${pad(savedDate.getDate())}`;
    // HH:MM (24 hr)
    const localTimeStr = `${pad(savedDate.getHours())}:${pad(savedDate.getMinutes())}`;

    const [form, setForm] = useState({
        platform: initialData.platform,
        title: initialData.title,
        stream_link: initialData.stream_link,
        date: localDateStr,
        time: localTimeStr,
        duration: initialData.estimated_duration?.toString() || '120',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);

        try {
            if (!form.date || !form.time) throw new Error("Please select both a date and time.");
            
            const localStart = new Date(`${form.date}T${form.time}:00`);
            if (isNaN(localStart.getTime())) throw new Error("Invalid date/time format.");

            await updateLiveEvent(initialData.id, {
                platform: form.platform,
                title: form.title,
                stream_link: form.stream_link,
                scheduled_start: localStart.toISOString(),
                estimated_duration: parseInt(form.duration, 10) || 120,
            });

            router.push('/live-selling');
            router.refresh();
        } catch (err: any) {
            console.error('Submit error:', err);
            setError(err.message || 'Failed to update live stream.');
            setSubmitting(false);
        }
    };

    return (
        <div className="bg-surface-light dark:bg-surface-dark min-h-screen pb-24">
            <BackButton />
            <PageHeader 
                title="Edit Live Stream" 
                subtitle="Update your stream details or schedule." 
                emoji="📝" 
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
                            Platform <span className="text-red-500">*</span>
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
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={submitting}
                            className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 font-black uppercase tracking-widest text-[13px] rounded-xl px-5 py-4 transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed border-2 border-transparent"
                        >
                            {submitting ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
