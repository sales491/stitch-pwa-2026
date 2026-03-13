'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { createOutageReport } from '@/app/actions/outages';
import SuccessToast from '@/components/SuccessToast';
import BarangayPicker from '@/components/BarangayPicker';

const MUNICIPALITIES = ['Boac', 'Gasan', 'Mogpog', 'Sta. Cruz', 'Torrijos', 'Buenavista'];

export default function CreateOutageForm() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [type, setType] = useState<'power' | 'water'>('power');
    const [municipality, setMunicipality] = useState('Boac');
    const [barangay, setBarangay] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (!description.trim()) {
            setError('Please describe the outage — when did it start and what areas are affected?');
            return;
        }

        startTransition(async () => {
            const result = await createOutageReport({
                type,
                municipality,
                barangay: barangay.trim() || undefined,
                description: description.trim() || undefined,
            });
            if (result.success) {
                setShowSuccess(true);
                setTimeout(() => router.push('/island-life/outages'), 2000);
            } else {
                setError(result.error ?? 'Something went wrong.');
            }
        });
    };


    return (
        <form onSubmit={handleSubmit} className="px-4 pt-4 pb-32 space-y-4">
            <SuccessToast visible={showSuccess} message="Outage report submitted!" />
            {/* Type picker */}
            <div>
                <p className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Type of outage</p>
                <div className="grid grid-cols-2 gap-2">
                    {(['power', 'water'] as const).map(t => (
                        <button
                            key={t}
                            type="button"
                            onClick={() => setType(t)}
                            className={`py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition-all ${
                                type === t
                                    ? t === 'power'
                                        ? 'bg-yellow-400 text-yellow-900 shadow-lg shadow-yellow-400/25'
                                        : 'bg-blue-500 text-white shadow-lg shadow-blue-500/25'
                                    : 'bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-slate-500 dark:text-slate-400'
                            }`}
                        >
                            {t === 'power' ? '⚡ Power' : '💧 Water'}
                        </button>
                    ))}
                </div>
            </div>

            {/* Municipality */}
            <div>
                <label className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 block">Municipality</label>
                <select
                    value={municipality}
                    onChange={e => { setMunicipality(e.target.value); setBarangay(''); }}
                    className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-[13px] text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-400 appearance-none"
                >
                    {MUNICIPALITIES.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
            </div>

            {/* Barangay */}
            <BarangayPicker
                value={barangay}
                onChange={setBarangay}
                municipality={municipality}
                accentColor="yellow"
                label="Barangay"
                optional
            />

            {/* Description */}
            <div>
                <label className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 block">Details <span className="text-rose-400">*</span></label>
                <textarea
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="When did it start? Any updates from MARELCO/water utility?"
                    rows={3}
                    maxLength={800}
                    required
                    className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-[13px] text-slate-800 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 resize-none"
                />
                <p className="text-[10px] text-slate-400 dark:text-zinc-600 text-right mt-1">{description.length}/800</p>
            </div>

            {/* Disclaimer */}
            <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 rounded-xl px-4 py-3 text-[11px] text-amber-700 dark:text-amber-400 leading-relaxed">
                ⚠️ Please only report confirmed outages in your area. False reports may be removed by moderators.
            </div>

            {error && (
                <div className="bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-400 rounded-xl px-4 py-3 text-[12px] font-semibold">
                    {error}
                </div>
            )}

            <button
                type="submit"
                disabled={isPending}
                className="w-full bg-yellow-400 hover:bg-yellow-500 disabled:opacity-50 disabled:cursor-not-allowed text-yellow-900 font-black text-[14px] py-4 rounded-2xl shadow-lg shadow-yellow-400/20 transition-all active:scale-95"
            >
                {isPending ? 'Submitting…' : 'Submit Outage Report'}
            </button>
        </form>
    );
}
