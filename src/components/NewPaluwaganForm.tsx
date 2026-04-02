'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createGroup } from '@/app/actions/paluwagan';
import SuccessToast from '@/components/SuccessToast';
import BackButton from '@/components/BackButton';

const CYCLES = [
    { value: 'weekly', label: 'Weekly' },
    { value: 'biweekly', label: 'Bi-weekly (every 2 weeks)' },
    { value: 'monthly', label: 'Monthly' },
];

const WINNER_MODES = [
    { value: 'rotating', label: '🔄 Rotating — slot order determines winner (most common)' },
    { value: 'organizer', label: '🎯 Organizer picks — organizer assigns winner each cycle' },
];

export default function NewPaluwaganForm() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);

    const [form, setForm] = useState({
        name: '',
        amount: '',
        cycle: 'monthly' as 'weekly' | 'biweekly' | 'monthly',
        winner_order: 'rotating' as 'rotating' | 'organizer',
        total_cycles: '10',
        started_at: new Date().toISOString().split('T')[0],
    });

    function set(key: string, value: string) {
        setForm(f => ({ ...f, [key]: value }));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError('');
        const amount = parseFloat(form.amount);
        const total_cycles = parseInt(form.total_cycles);
        if (!form.name.trim()) return setError('Group name is required.');
        if (isNaN(amount) || amount <= 0) return setError('Enter a valid contribution amount.');
        if (isNaN(total_cycles) || total_cycles < 2 || total_cycles > 50) return setError('Members must be between 2 and 50.');

        setLoading(true);
        const res = await createGroup({ ...form, amount, total_cycles });
        setLoading(false);

        if (!res.success) return setError(res.error ?? 'Something went wrong.');
        setShowSuccess(true);
        setTimeout(() => router.push(`/my-barangay/paluwagan/${res.groupId}`), 2000);
    }

    const potAmount = parseFloat(form.amount) * parseInt(form.total_cycles);

    return (
        <>
            <SuccessToast visible={showSuccess} message="Paluwagan group created!" />
            {/* Sticky header */}
            <header className="sticky top-0 z-30 flex items-center gap-3 bg-white/80 dark:bg-[#0F0F10]/80 backdrop-blur-md border-b border-slate-100 dark:border-white/[0.03] px-4 pt-3 pb-3">
                <BackButton />
                <div>
                    <p className="text-lg font-black leading-tight tracking-tight text-moriones-red pl-1">Create Group</p>
                    <p className="text-[10px] text-slate-400 dark:text-white/30 font-black uppercase tracking-[0.15em] pl-1">Paluwagan</p>
                </div>
            </header>
            {/* Header */}
            <div className="bg-gradient-to-br from-amber-500 via-yellow-500 to-orange-500 px-4 pt-5 pb-6 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 80%, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                <h1 className="text-2xl font-black text-white">Create Group</h1>
                <p className="text-yellow-100 text-xs mt-1">Set up your paluwagan details below</p>
            </div>

            <form onSubmit={handleSubmit} className="px-4 pt-5 space-y-4 pb-32">
                {/* Group name */}
                <div>
                    <label className="block text-[11px] font-black text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">Group Name</label>
                    <input
                        type="text"
                        placeholder="e.g. Barkada Paluwagan 2025"
                        maxLength={60}
                        value={form.name}
                        onChange={e => set('name', e.target.value)}
                        className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-[14px] font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                </div>

                {/* Amount per member */}
                <div>
                    <label className="block text-[11px] font-black text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">Contribution per Member (₱)</label>
                    <input
                        type="number"
                        placeholder="e.g. 500"
                        min="1"
                        value={form.amount}
                        onChange={e => set('amount', e.target.value)}
                        className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-[14px] font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                </div>

                {/* Number of members */}
                <div>
                    <label className="block text-[11px] font-black text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">Number of Members</label>
                    <input
                        type="number"
                        min="2" max="50"
                        value={form.total_cycles}
                        onChange={e => set('total_cycles', e.target.value)}
                        className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-[14px] font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                    <p className="text-[10px] text-slate-400 dark:text-zinc-500 mt-1">Each member = one cycle. You'll be Slot 1.</p>
                </div>

                {/* Cycle frequency */}
                <div>
                    <label className="block text-[11px] font-black text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">Cycle Frequency</label>
                    <select
                        value={form.cycle}
                        onChange={e => set('cycle', e.target.value)}
                        className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-[14px] font-semibold text-slate-900 dark:text-white focus:outline-none appearance-none"
                    >
                        {CYCLES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                    </select>
                </div>

                {/* Winner order */}
                <div>
                    <label className="block text-[11px] font-black text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">Winner Order</label>
                    <div className="space-y-2">
                        {WINNER_MODES.map(m => (
                            <label key={m.value} className={`flex items-start gap-3 bg-white dark:bg-zinc-900 border rounded-xl px-4 py-3 cursor-pointer transition-all ${
                                form.winner_order === m.value
                                    ? 'border-amber-400 dark:border-amber-600 ring-1 ring-amber-400 dark:ring-amber-600'
                                    : 'border-slate-200 dark:border-zinc-800'
                            }`}>
                                <input
                                    type="radio"
                                    name="winner_order"
                                    value={m.value}
                                    checked={form.winner_order === m.value}
                                    onChange={e => set('winner_order', e.target.value)}
                                    className="mt-0.5 accent-amber-500"
                                />
                                <span className="text-[12px] font-semibold text-slate-700 dark:text-slate-300 leading-snug">{m.label}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Start date */}
                <div>
                    <label className="block text-[11px] font-black text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">First Cycle Due Date</label>
                    <input
                        type="date"
                        value={form.started_at}
                        onChange={e => set('started_at', e.target.value)}
                        className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl px-4 py-3 text-[14px] font-semibold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                    />
                </div>

                {/* Pot preview */}
                {!isNaN(potAmount) && potAmount > 0 && (
                    <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 rounded-2xl px-4 py-4 flex items-center justify-between">
                        <div>
                            <p className="text-[11px] font-black text-amber-800 dark:text-amber-400 uppercase tracking-wider">Pot per cycle</p>
                            <p className="text-[28px] font-black text-amber-600 dark:text-amber-400">₱{potAmount.toLocaleString('en-PH')}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[11px] text-amber-600 dark:text-amber-500">₱{parseFloat(form.amount || '0').toLocaleString('en-PH')} × {form.total_cycles} members</p>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/40 rounded-xl px-4 py-3 text-[12px] text-red-700 dark:text-red-400">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-amber-500 text-white font-black text-[14px] uppercase tracking-wider py-4 rounded-2xl shadow-md hover:bg-amber-600 active:scale-[0.98] transition-all disabled:opacity-60"
                >
                    {loading ? 'Creating…' : '💰 Create Paluwagan'}
                </button>
            </form>
        </>
    );
}
