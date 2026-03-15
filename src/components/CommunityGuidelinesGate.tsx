"use client";

import React, { useState } from 'react';
import Link from 'next/link';

interface CommunityGuidelinesGateProps {
    onAccept: () => void;
    onDismiss: () => void;
    isAccepting?: boolean;
}

const GUIDELINES = [
    {
        icon: 'location_on',
        color: 'bg-sky-500',
        title: 'Be Local',
        description: 'Keep all posts relevant to Marinduque — news, events, and updates for our community.',
    },
    {
        icon: 'handshake',
        color: 'bg-emerald-500',
        title: 'Be Respectful',
        description: 'No hate speech or harassment. Treat every Marinduqueño with the warmth we are known for.',
    },
    {
        icon: 'block',
        color: 'bg-amber-500',
        title: 'No Spam',
        description: "Don't flood the board with the same ad or off-topic content. One clear post goes a long way.",
    },
    {
        icon: 'gavel',
        color: 'bg-moriones-red',
        title: '3-Strike Policy',
        description: 'If your post gets flagged 3 times, it is automatically hidden and sent for admin review.',
    },
];

export default function CommunityGuidelinesGate({
    onAccept,
    onDismiss,
    isAccepting = false,
}: CommunityGuidelinesGateProps) {
    const [checked, setChecked] = useState(false);

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-[998] bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
                onClick={onDismiss}
            />

            {/* Bottom Sheet */}
            <div className="fixed bottom-0 left-0 right-0 z-[999] flex justify-center">
                <div className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-t-[2.5rem] shadow-2xl animate-in slide-in-from-bottom-8 duration-300 flex flex-col max-h-[90vh]">

                    {/* Handle bar */}
                    <div className="flex justify-center pt-3 pb-1 shrink-0">
                        <div className="w-10 h-1 rounded-full bg-slate-200 dark:bg-zinc-700" />
                    </div>

                    {/* Header */}
                    <div className="px-6 pt-4 pb-5 text-center border-b border-slate-100 dark:border-zinc-800 shrink-0">
                        <div className="size-14 rounded-2xl bg-moriones-red/10 flex items-center justify-center mx-auto mb-3">
                            <span className="material-symbols-outlined text-[32px] text-moriones-red">forum</span>
                        </div>
                        <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                            Community Guidelines
                        </h2>
                        <p className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mt-1">
                            Before your first post — review our ground rules
                        </p>
                    </div>

                    {/* Rules — scrollable middle section */}
                    <div className="px-5 py-4 space-y-3 overflow-y-auto no-scrollbar">
                        {GUIDELINES.map((rule, i) => (
                            <div
                                key={i}
                                className="flex items-start gap-3 bg-slate-50 dark:bg-zinc-800 rounded-2xl p-3.5"
                            >
                                <div className={`${rule.color} size-9 rounded-xl flex items-center justify-center shrink-0 shadow-sm`}>
                                    <span className="material-symbols-outlined text-[18px] text-white">{rule.icon}</span>
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[12px] font-black text-slate-800 dark:text-white">{rule.title}</p>
                                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{rule.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Agree checkbox + CTA — sticky footer */}
                    <div className="px-5 pb-6 pt-3 space-y-3 border-t border-slate-100 dark:border-zinc-800 shrink-0" style={{ paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom, 1.5rem))' }}>
                        {/* Checkbox */}
                        <button
                            onClick={() => setChecked(c => !c)}
                            className="flex items-center gap-3 w-full text-left"
                        >
                            <div className={`size-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-colors ${checked
                                    ? 'bg-moriones-red border-moriones-red'
                                    : 'border-slate-300 dark:border-zinc-600'
                                }`}>
                                {checked && (
                                    <span className="material-symbols-outlined text-[14px] text-white" style={{ fontVariationSettings: '"FILL" 1' }}>check</span>
                                )}
                            </div>
                            <span className="text-[11px] font-bold text-slate-600 dark:text-slate-300 leading-relaxed">
                                I have read and agree to the Community Guidelines
                            </span>
                        </button>

                        {/* CTA Button */}
                        <button
                            onClick={onAccept}
                            disabled={!checked || isAccepting}
                            className="w-full py-3.5 bg-moriones-red text-white rounded-2xl text-sm font-black shadow-lg shadow-moriones-red/25 active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isAccepting ? (
                                <>
                                    <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <span className="material-symbols-outlined text-[18px]">check_circle</span>
                                    I Understand &amp; Agree — Let Me Post
                                </>
                            )}
                        </button>

                        <Link
                            href="/help-community-guidelines"
                            className="block text-center text-[10px] font-bold text-slate-400 hover:text-moriones-red transition-colors uppercase tracking-widest"
                        >
                            Read full guidelines →
                        </Link>
                    </div>

                </div>
            </div>
        </>
    );
}
