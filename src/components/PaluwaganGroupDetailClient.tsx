'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { leaveGroup, cancelGroup } from '@/app/actions/paluwagan';

type Props = {
    inviteCode: string;
    groupId: string;
    showCancel?: boolean;
    showLeave?: boolean;
};

export default function PaluwaganGroupDetailClient({ inviteCode, groupId, showCancel, showLeave }: Props) {
    const router = useRouter();
    const [copied, setCopied] = useState(false);
    const [confirming, setConfirming] = useState(false);
    const [loading, setLoading] = useState(false);

    async function handleCopy() {
        const url = `${window.location.origin}/my-barangay/paluwagan/join?code=${inviteCode}`;
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    async function handleLeave() {
        if (!confirming) return setConfirming(true);
        setLoading(true);
        await leaveGroup(groupId);
        router.push('/my-barangay/paluwagan');
    }

    async function handleCancel() {
        if (!confirming) return setConfirming(true);
        setLoading(true);
        await cancelGroup(groupId);
        router.push('/my-barangay/paluwagan');
    }

    // Shown as part of the invite code block — copy + share button only
    if (!showCancel && !showLeave) {
        return (
            <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 bg-amber-500 text-white px-3 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all active:scale-95"
            >
                <span className="material-symbols-outlined text-[14px]">{copied ? 'check' : 'content_copy'}</span>
                {copied ? 'Copied!' : 'Copy Link'}
            </button>
        );
    }

    return (
        <div className="space-y-2">
            {showCancel && (
                <button
                    onClick={handleCancel}
                    disabled={loading}
                    className={`w-full py-3 rounded-xl text-[12px] font-black uppercase tracking-wider transition-all ${
                        confirming
                            ? 'bg-red-500 text-white active:scale-[0.98]'
                            : 'bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-slate-400'
                    }`}
                >
                    {loading ? 'Cancelling…' : confirming ? 'Tap again to confirm cancel' : 'Cancel Group'}
                </button>
            )}
            {showLeave && (
                <button
                    onClick={handleLeave}
                    disabled={loading}
                    className={`w-full py-3 rounded-xl text-[12px] font-black uppercase tracking-wider transition-all ${
                        confirming
                            ? 'bg-red-500 text-white active:scale-[0.98]'
                            : 'bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-slate-400'
                    }`}
                >
                    {loading ? 'Leaving…' : confirming ? 'Tap again to confirm leave' : 'Leave Group'}
                </button>
            )}
            {confirming && (
                <button onClick={() => setConfirming(false)} className="w-full py-2 text-[11px] text-slate-400 dark:text-zinc-500">
                    Cancel
                </button>
            )}
        </div>
    );
}
