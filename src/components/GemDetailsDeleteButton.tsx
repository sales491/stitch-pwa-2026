'use client';

import React, { useTransition, useState } from 'react';
import { useRouter } from 'next/navigation';
import { deleteGem } from '@/app/actions/gems';

type Props = {
    gemId: string;
    canDelete: boolean;
};

export default function GemDetailsDeleteButton({ gemId, canDelete }: Props) {
    const [isPending, startTransition] = useTransition();
    const [confirming, setConfirming] = useState(false);
    const router = useRouter();

    if (!canDelete) return null;

    const handleDelete = () => {
        setConfirming(false);
        startTransition(async () => {
            try {
                await deleteGem(gemId);
                router.push("/gems");
            } catch (err) {
                alert("Failed to delete gem.");
            }
        });
    };

    if (confirming) {
        return (
            <div className="flex bg-white dark:bg-zinc-800 shadow-md rounded-xl overflow-hidden border border-red-200 dark:border-red-900/50">
                <button
                    onClick={handleDelete}
                    disabled={isPending}
                    className="px-4 py-2 bg-red-500 hover:bg-red-600 active:bg-red-700 text-white text-sm font-bold transition-colors disabled:opacity-50"
                >
                    {isPending ? 'Deleting...' : 'Yes, Delete'}
                </button>
                <button
                    onClick={() => setConfirming(false)}
                    disabled={isPending}
                    className="px-4 py-2 bg-slate-100 dark:bg-zinc-700 hover:bg-slate-200 dark:hover:bg-zinc-600 text-slate-800 dark:text-slate-200 text-sm font-bold transition-colors"
                >
                    Cancel
                </button>
            </div>
        );
    }

    return (
        <button
            onClick={() => setConfirming(true)}
            disabled={isPending}
            className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 border border-red-200/50 transition-colors shadow-sm w-full font-bold"
            title="Delete Gem"
        >
            <span className="material-symbols-outlined text-[20px]">delete</span>
            Delete Post
        </button>
    );
}
