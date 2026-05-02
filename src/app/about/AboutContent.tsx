"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import PageHeader from '@/components/PageHeader';

export default function AboutContent() {
    const [tab, setTab] = useState<'android' | 'ios'>('android');

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-[#0F0F10] pb-32">
            <PageHeader title="About" subtitle="Marinduque Market Hub" />

            <div className="max-w-2xl mx-auto px-4 space-y-6">
                {/* Mission */}
                <section className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-slate-100 dark:border-zinc-800 p-5">
                    <h2 className="text-lg font-black text-slate-900 dark:text-white mb-2">Our Mission</h2>
                    <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                        Marinduque Market Hub is a digital community platform built for the people of Marinduque island.
                        We connect locals and visitors through a hyperlocal marketplace, business directory, job board,
                        community forum, and island life tools — all in one place.
                    </p>
                </section>

                {/* What We Offer */}
                <section className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-slate-100 dark:border-zinc-800 p-5">
                    <h2 className="text-lg font-black text-slate-900 dark:text-white mb-3">What We Offer</h2>
                    <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                        <li className="flex items-start gap-2">
                            <span className="text-[#C62828] mt-0.5">🛒</span>
                            <span><strong>Marketplace</strong> — Buy and sell items locally across all six municipalities</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-[#C62828] mt-0.5">💼</span>
                            <span><strong>Jobs</strong> — Find and post job opportunities in Marinduque</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-[#C62828] mt-0.5">🏪</span>
                            <span><strong>Business Directory</strong> — Discover local businesses by town and category</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-[#C62828] mt-0.5">🗓️</span>
                            <span><strong>Events</strong> — Stay updated on community events and festivals</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-[#C62828] mt-0.5">💎</span>
                            <span><strong>Hidden Gems</strong> — Share and discover Marinduque's best-kept spots</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-[#C62828] mt-0.5">🏘️</span>
                            <span><strong>My Barangay</strong> — Hyperlocal community tools for your barangay</span>
                        </li>
                        <li className="flex items-start gap-2">
                            <span className="text-[#C62828] mt-0.5">🌴</span>
                            <span><strong>Island Life</strong> — Daily living tools: palengke prices, tides, gas prices, outages</span>
                        </li>
                    </ul>
                </section>

                {/* Install section */}
                <section className="bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-slate-100 dark:border-zinc-800 overflow-hidden">
                    <div className="px-5 pt-5 pb-3">
                        <div className="flex items-center gap-3 mb-1">
                            <Image src="/icons/icon-192.png" alt="App icon" width={40} height={40} className="rounded-xl" />
                            <div>
                                <h2 className="text-[15px] font-black text-slate-900 dark:text-white">Install the App</h2>
                                <p className="text-[11px] text-slate-500 dark:text-slate-400">Add to your home screen for the best experience</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex border-b border-slate-100 dark:border-zinc-800">
                        {(['android', 'ios'] as const).map(t => (
                            <button
                                key={t}
                                onClick={() => setTab(t)}
                                className={`flex-1 py-2.5 text-[12px] font-black tracking-wide transition-colors ${tab === t
                                    ? 'text-[#C62828] border-b-2 border-[#C62828]'
                                    : 'text-slate-400 dark:text-slate-500'
                                    }`}
                            >
                                {t === 'android' ? '🤖 Android' : '🍎 iPhone / iPad'}
                            </button>
                        ))}
                    </div>

                    <div className="p-5 text-sm text-slate-600 dark:text-slate-300">
                        {tab === 'android' ? (
                            <ol className="list-decimal list-inside space-y-1">
                                <li>Tap the menu icon (⋮) in Chrome</li>
                                <li>Select <strong>"Add to Home screen"</strong></li>
                                <li>Tap <strong>"Install"</strong></li>
                            </ol>
                        ) : (
                            <ol className="list-decimal list-inside space-y-1">
                                <li>Tap the <strong>Share</strong> button in Safari</li>
                                <li>Scroll down and tap <strong>"Add to Home Screen"</strong></li>
                                <li>Tap <strong>"Add"</strong> in the top right</li>
                            </ol>
                        )}
                    </div>
                </section>

            </div>
        </div>
    );
}
