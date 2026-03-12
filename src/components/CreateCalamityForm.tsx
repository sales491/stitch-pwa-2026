'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createCalamityAlert, CalamityType, CalamitySeverity } from '@/app/actions/calamity';

const MUNICIPALITIES = ['Boac', 'Gasan', 'Mogpog', 'Sta. Cruz', 'Torrijos', 'Buenavista'];

const TYPES: { value: CalamityType; icon: string; label: string }[] = [
    { value: 'typhoon',    icon: '🌀', label: 'Typhoon' },
    { value: 'flood',      icon: '🌊', label: 'Flood' },
    { value: 'earthquake', icon: '🫨', label: 'Earthquake' },
    { value: 'fire',       icon: '🔥', label: 'Fire' },
    { value: 'road',       icon: '🚧', label: 'Road Closure' },
    { value: 'other',      icon: '⚠️', label: 'Other' },
];

const SEVERITIES: { value: CalamitySeverity; label: string; color: string }[] = [
    { value: 'low',      label: 'Low',      color: 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-800' },
    { value: 'moderate', label: 'Moderate', color: 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/40 dark:text-yellow-300 dark:border-yellow-800' },
    { value: 'high',     label: 'High',     color: 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/40 dark:text-orange-300 dark:border-orange-800' },
    { value: 'critical', label: 'Critical', color: 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/40 dark:text-red-300 dark:border-red-800' },
];

export default function CreateCalamityForm() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [type, setType] = useState<CalamityType>('typhoon');
    const [severity, setSeverity] = useState<CalamitySeverity>('moderate');
    const [municipality, setMunicipality] = useState('Boac');
    const [barangay, setBarangay] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [done, setDone] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        startTransition(async () => {
            const result = await createCalamityAlert({
                type,
                severity,
                municipality,
                barangay: barangay.trim() || undefined,
                title,
                description: description.trim() || undefined,
            });
            if (result.success) {
                setDone(true);
                setTimeout(() => router.push('/my-barangay/calamity'), 1200);
            } else {
                setError(result.error ?? 'Something went wrong.');
            }
        });
    };

    if (done) {
        return (
            <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
                <span className="text-5xl mb-4">✅</span>
                <p className="font-black text-slate-900 dark:text-white text-lg">Alert posted!</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Redirecting back to Calamity Board…</p>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="px-4 pt-4 pb-32 space-y-5">
            {/* Type picker */}
            <div>
                <p className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Type of alert</p>
                <div className="grid grid-cols-3 gap-2">
                    {TYPES.map(t => (
                        <button
                            key={t.value}
                            type="button"
                            onClick={() => setType(t.value)}
                            className={`py-3 rounded-2xl font-black text-xs flex flex-col items-center justify-center gap-1 transition-all border ${
                                type === t.value
                                    ? 'bg-red-500 text-white border-red-500 shadow-lg shadow-red-500/25'
                                    : 'bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-slate-500 dark:text-slate-400'
                            }`}
                        >
                            <span className="text-xl">{t.icon}</span>
                            <span>{t.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Severity */}
            <div>
                <p className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Severity</p>
                <div className="grid grid-cols-4 gap-2">
                    {SEVERITIES.map(s => (
                        <button
                            key={s.value}
                            type="button"
                            onClick={() => setSeverity(s.value)}
                            className={`py-2.5 rounded-xl font-black text-[11px] transition-all border ${
                                severity === s.value
                                    ? s.color
                                    : 'bg-white dark:bg-zinc-900 border-slate-200 dark:border-zinc-800 text-slate-400 dark:text-slate-500'
                            }`}
                        >
                            {s.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Title */}
            <div>
                <label className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 block">Alert Title <span className="text-red-400">*</span></label>
                <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    required
                    placeholder="e.g. Typhoon Egay — Boac flooding reported"
                    className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-[13px] text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-400"
                />
            </div>

            {/* Municipality */}
            <div>
                <label className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 block">Municipality</label>
                <select
                    value={municipality}
                    onChange={e => setMunicipality(e.target.value)}
                    className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-[13px] text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-400 appearance-none"
                >
                    {MUNICIPALITIES.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
            </div>

            {/* Barangay */}
            <div>
                <label className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 block">Barangay <span className="text-slate-300 dark:text-zinc-600 font-normal">(optional)</span></label>
                <input
                    type="text"
                    value={barangay}
                    onChange={e => setBarangay(e.target.value)}
                    placeholder="e.g. Barangay Sico, Agot, Laylay…"
                    className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-[13px] text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-400"
                />
            </div>

            {/* Description */}
            <div>
                <label className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 block">Details <span className="text-slate-300 dark:text-zinc-600 font-normal">(optional)</span></label>
                <textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="What's happening? Road passable? Evacuation needed? Any official updates?"
                    rows={4}
                    className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-[13px] text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-red-400 resize-none"
                />
            </div>

            {/* Disclaimer */}
            <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/40 rounded-xl px-4 py-3 text-[11px] text-red-700 dark:text-red-400 leading-relaxed">
                🚨 Only report verified calamities affecting your area. False alarms cause panic and will be removed by moderators. For medical emergencies call <strong>911</strong>.
            </div>

            {error && (
                <div className="bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400 rounded-xl px-4 py-3 text-[12px] font-semibold">
                    {error}
                </div>
            )}

            <button
                type="submit"
                disabled={isPending || !title.trim()}
                className="w-full bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black text-[14px] py-4 rounded-2xl shadow-lg shadow-red-500/20 transition-all active:scale-95"
            >
                {isPending ? 'Posting…' : 'Post Calamity Alert'}
            </button>
        </form>
    );
}
