'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';


// ─── Install section ─────────────────────────────────────────────────────────
function InstallSection() {
    const [tab, setTab] = useState<'android' | 'ios'>('android');

    return (
        <section className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-slate-100 dark:border-zinc-800 overflow-hidden mx-4 mb-6">
            {/* Header */}
            <div className="px-5 pt-5 pb-3">
                <div className="flex items-center gap-3 mb-1">
                    <Image src="/icons/icon-192.png" alt="App icon" width={40} height={40} className="rounded-xl" />
                    <div>
                        <h2 className="text-[15px] font-black text-slate-900 dark:text-white">Install the App</h2>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">Add to your home screen for the best experience</p>
                    </div>
                </div>
            </div>

            {/* Tab toggle */}
            <div className="flex border-b border-slate-100 dark:border-zinc-800">
                {(['android', 'ios'] as const).map(t => (
                    <button
                        key={t}
                        onClick={() => setTab(t)}
                        className={`flex-1 py-2.5 text-[12px] font-black tracking-wide transition-colors ${
                            tab === t
                                ? 'text-[#C62828] border-b-2 border-[#C62828]'
                                : 'text-slate-400 dark:text-slate-500'
                        }`}
                    >
                        {t === 'android' ? '🤖 Android' : '🍎 iPhone / iPad'}
                    </button>
                ))}
            </div>

            {/* Android instructions */}
            {tab === 'android' && (
                <div className="px-5 py-4 space-y-3">
                    {[
                        { n: 1, icon: '🌐', text: 'Open marinduquemarket.com in Chrome' },
                        { n: 2, icon: '⋮', text: 'Tap the 3-dot menu in the top right corner' },
                        { n: 3, icon: '📲', text: "Select 'Add to Home Screen'" },
                        { n: 4, icon: '✅', text: "Tap 'Add' — the app icon will appear on your home screen!" },
                    ].map(step => (
                        <div key={step.n} className="flex items-center gap-3">
                            <span className="w-7 h-7 rounded-full bg-[#C62828]/10 text-[#C62828] text-[11px] font-black flex items-center justify-center flex-shrink-0">{step.n}</span>
                            <span className="text-[12px] text-slate-700 dark:text-slate-300">{step.icon} {step.text}</span>
                        </div>
                    ))}
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 pt-1">
                        💡 On some Android devices Chrome will also show an automatic "Add to Home Screen" banner at the bottom of the page.
                    </p>
                </div>
            )}

            {/* iOS instructions */}
            {tab === 'ios' && (
                <div className="px-5 py-4 space-y-3">
                    <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl px-3 py-2 flex items-center gap-2 mb-2">
                        <span className="text-amber-500 text-sm">⚠️</span>
                        <p className="text-[11px] text-amber-700 dark:text-amber-400 font-semibold">Must use Safari browser — Chrome/Firefox on iPhone cannot install PWAs.</p>
                    </div>
                    {[
                        { n: 1, icon: '🧭', text: 'Open Safari and go to marinduquemarket.com' },
                        { n: 2, icon: '⬆️', text: 'Tap the Share button (box with arrow) at the bottom center of the screen' },
                        { n: 3, icon: '➕', text: "Scroll down and tap 'Add to Home Screen'" },
                        { n: 4, icon: '✅', text: "Tap 'Add' in the top right — done!" },
                    ].map(step => (
                        <div key={step.n} className="flex items-center gap-3">
                            <span className="w-7 h-7 rounded-full bg-[#C62828]/10 text-[#C62828] text-[11px] font-black flex items-center justify-center flex-shrink-0">{step.n}</span>
                            <span className="text-[12px] text-slate-700 dark:text-slate-300">{step.icon} {step.text}</span>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}

// ─── About Us page ───────────────────────────────────────────────────────────
export default function AboutUsPage() {
    return (
        <main className="min-h-screen bg-slate-50 dark:bg-[#0F0F10] pb-32">
            {/* Sticky header with back arrow */}
            <header className="sticky top-0 z-30 flex items-center gap-3 bg-white/80 dark:bg-[#0F0F10]/80 backdrop-blur-md border-b border-slate-100 dark:border-white/[0.03] px-4 pt-3 pb-3">
                <Link href="/" className="text-slate-600 dark:text-white/60 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-white/5 transition-colors flex items-center justify-center">
                    <span className="material-symbols-outlined text-[26px]">arrow_back</span>
                </Link>
                <div>
                    <h1 className="text-lg font-black leading-tight tracking-tight text-moriones-red pl-1">About Us</h1>
                    <p className="text-[10px] text-slate-400 dark:text-white/30 font-black uppercase tracking-[0.15em] pl-1">Marinduque Market Hub</p>
                </div>
            </header>

            {/* About blurb */}
            <section className="mx-4 mt-4 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-slate-100 dark:border-zinc-800 px-5 py-5 mb-6">
                <h2 className="text-[14px] font-black text-slate-900 dark:text-white mb-2">What is Marinduque Market Hub?</h2>
                <p className="text-[12px] text-slate-600 dark:text-slate-400 leading-relaxed">
                    A mobile-first community platform built for the people of Marinduque. 
                    Find jobs, buy and sell locally, discover island hopping tours, track RoRo ferry schedules, 
                    explore local businesses, and stay connected with your community — all in one place.
                </p>
                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                    {[
                        { label: 'Boac', emoji: '🏛️' },
                        { label: 'Gasan', emoji: '⛪' },
                        { label: 'Mogpog', emoji: '🌿' },
                        { label: 'Sta. Cruz', emoji: '⛵' },
                        { label: 'Torrijos', emoji: '🏖️' },
                        { label: 'Buenavista', emoji: '🌅' },
                    ].map(m => (
                        <div key={m.label} className="bg-slate-50 dark:bg-zinc-800 rounded-xl py-2 px-1">
                            <div className="text-lg">{m.emoji}</div>
                            <div className="text-[9px] font-bold text-slate-600 dark:text-slate-300 mt-0.5">{m.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Install section */}
            <InstallSection />
        </main>
    );
}
