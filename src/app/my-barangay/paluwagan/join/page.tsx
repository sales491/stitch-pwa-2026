'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { joinGroup } from '@/app/actions/paluwagan';
import { Suspense } from 'react';
import SuccessToast from '@/components/SuccessToast';

function JoinForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [code, setCode] = useState(searchParams.get('code') ?? '');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showSuccess, setShowSuccess] = useState(false);

    // Auto-submit if code came from URL
    useEffect(() => {
        const urlCode = searchParams.get('code');
        if (urlCode && urlCode.length === 6) {
            handleJoin(urlCode);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function handleJoin(joinCode = code) {
        if (!joinCode.trim()) return setError('Enter a 6-character invite code.');
        setError('');
        setLoading(true);
        const res = await joinGroup(joinCode.trim().toUpperCase());
        setLoading(false);
        if (!res.success) return setError(res.error ?? 'Invalid code.');
        setShowSuccess(true);
        setTimeout(() => router.push(`/my-barangay/paluwagan/${res.groupId}`), 2000);
    }

    return (
        <div className="px-4 pt-8 space-y-4">
            <SuccessToast visible={showSuccess} message="Successfully joined the group!" />
            <div>
                <label className="block text-[11px] font-black text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-1.5">Invite Code</label>
                <input
                    type="text"
                    placeholder="e.g. AB3X9Z"
                    maxLength={6}
                    value={code}
                    onChange={e => setCode(e.target.value.toUpperCase())}
                    className="w-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl px-4 py-4 text-[22px] font-black text-center tracking-[0.3em] text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-400 uppercase"
                />
                <p className="text-[10px] text-slate-400 dark:text-zinc-500 text-center mt-1.5">Ask the group organizer for the 6-character code</p>
            </div>

            {error && (
                <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/40 rounded-xl px-4 py-3 text-[12px] text-red-700 dark:text-red-400 text-center">
                    {error}
                </div>
            )}

            <button
                onClick={() => handleJoin()}
                disabled={loading || code.length !== 6}
                className="w-full bg-amber-500 text-white font-black text-[14px] uppercase tracking-wider py-4 rounded-2xl shadow-md hover:bg-amber-600 active:scale-[0.98] transition-all disabled:opacity-60"
            >
                {loading ? 'Joining…' : '👥 Join Group'}
            </button>
        </div>
    );
}

export default function JoinPaluwaganPage() {
    return (
        <main className="min-h-screen bg-slate-50 dark:bg-[#0F0F10] pb-32">
            <div className="bg-gradient-to-br from-amber-500 via-yellow-500 to-orange-500 px-4 pt-10 pb-6 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 80%, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                <Link href="/my-barangay/paluwagan" className="inline-flex items-center gap-1 text-white/70 hover:text-white text-xs font-bold mb-4 transition-colors">
                    <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                    Paluwagan
                </Link>
                <h1 className="text-2xl font-black text-white">Join a Group</h1>
                <p className="text-yellow-100 text-xs mt-1">Enter the invite code from your organizer</p>
            </div>
            <Suspense fallback={<div className="px-4 pt-8 text-center text-slate-400">Loading…</div>}>
                <JoinForm />
            </Suspense>
        </main>
    );
}
