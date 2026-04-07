'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

// ─── Types ───────────────────────────────────────────────────────────────────
type Platform = 'android' | 'ios' | 'ios-non-safari' | 'none';

// ─── Helpers ─────────────────────────────────────────────────────────────────
function detectPlatform(): Platform {
    if (typeof window === 'undefined') return 'none';
    const ua = navigator.userAgent;
    const isIOS = /iPhone|iPad|iPod/i.test(ua);
    const isAndroid = /Android/i.test(ua);
    const isStandalone =
        ('standalone' in navigator && (navigator as any).standalone) ||
        window.matchMedia('(display-mode: standalone)').matches;

    if (isStandalone) return 'none'; // already installed

    if (isIOS) {
        // Check if running in Safari (not Chrome/Firefox on iOS)
        const isSafari = /Safari/i.test(ua) && !/CriOS|FxiOS|OPiOS|mercury/i.test(ua);
        return isSafari ? 'ios' : 'ios-non-safari';
    }
    if (isAndroid) return 'android';
    return 'none';
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function PWAInstallPrompt() {
    const [platform, setPlatform] = useState<Platform>('none');
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [dismissed, setDismissed] = useState(true); // start hidden to avoid flash

    useEffect(() => {
        const alreadyDismissed = localStorage.getItem('pwa-install-dismissed');
        if (alreadyDismissed) return;

        const p = detectPlatform();
        setPlatform(p);
        if (p !== 'none') setDismissed(false);

        // Capture the Android beforeinstallprompt event
        const handler = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e);
        };
        window.addEventListener('beforeinstallprompt', handler);
        return () => window.removeEventListener('beforeinstallprompt', handler);
    }, []);

    function dismiss() {
        localStorage.setItem('pwa-install-dismissed', '1');
        setDismissed(true);
    }

    async function handleAndroidInstall() {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') localStorage.setItem('pwa-install-dismissed', '1');
        }
        setDismissed(true);
    }

    if (dismissed || platform === 'none') return null;

    // ── iOS Non-Safari ────────────────────────────────────────────────────────
    if (platform === 'ios-non-safari') {
        return (
            <div className="fixed bottom-20 inset-x-4 z-50 animate-slide-up">
                <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-slate-200 dark:border-zinc-700 px-4 py-3 flex items-center gap-3">
                    <span className="text-2xl">🧭</span>
                    <p className="flex-1 text-[12px] text-slate-700 dark:text-slate-300 leading-snug">
                        <span className="font-black text-slate-900 dark:text-white block mb-0.5">Open in Safari to install</span>
                        This app can only be added to your home screen from Safari.
                    </p>
                    <button onClick={dismiss} className="text-slate-400 hover:text-slate-600 text-lg leading-none">✕</button>
                </div>
            </div>
        );
    }

    // ── iOS Safari — Compact bottom sheet ────────────────────────────────────
    if (platform === 'ios') {
        return (
            <div className="fixed bottom-20 inset-x-4 z-50 animate-slide-up">
                <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-slate-200 dark:border-zinc-700 overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 pt-3 pb-2 border-b border-slate-100 dark:border-zinc-800">
                        <div className="flex items-center gap-2">
                            <Image src="/icons/icon-192.png" alt="App icon" width={32} height={32} className="rounded-xl" />
                            <div>
                                <p className="text-[12px] font-black text-slate-900 dark:text-white leading-none">Install this App</p>
                                <p className="text-[10px] text-slate-500 dark:text-slate-400">Add to your home screen</p>
                            </div>
                        </div>
                        <button onClick={dismiss} className="text-slate-400 hover:text-slate-600 text-lg leading-none p-1">✕</button>
                    </div>
                    {/* Steps */}
                    <div className="px-4 py-3 space-y-2">
                        {[
                            { icon: '⬆️', text: 'Tap the Share button in your Safari toolbar' },
                            { icon: '＋', text: "Select 'Add to Home Screen'" },
                            { icon: '✅', text: "Tap 'Add' — done!" },
                        ].map((step, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-[11px] font-black text-slate-600 flex-shrink-0">
                                    {i + 1}
                                </span>
                                <span className="text-[11px] text-slate-700 dark:text-slate-300">{step.text}</span>
                            </div>
                        ))}
                    </div>
                    {/* Arrow hint */}
                    <div className="px-4 pb-3 flex items-center gap-2 text-[10px] text-slate-400 dark:text-slate-500">
                        <span>↓</span>
                        <span>Share button is at the bottom center of Safari</span>
                    </div>
                </div>
            </div>
        );
    }

    // ── Android — Bottom banner ───────────────────────────────────────────────
    return (
        <div className="fixed bottom-20 inset-x-4 z-50 animate-slide-up">
            <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-slate-200 dark:border-zinc-700 px-4 py-3 flex items-center gap-3">
                <Image src="/icons/icon-192.png" alt="App icon" width={40} height={40} className="rounded-xl flex-shrink-0" />
                <div className="flex-1 min-w-0">
                    <p className="text-[12px] font-black text-slate-900 dark:text-white leading-none mb-0.5">Install Marinduque Market Hub</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-snug">Add to home screen for the best experience</p>
                </div>
                <div className="flex flex-col gap-1.5 flex-shrink-0">
                    <button
                        onClick={handleAndroidInstall}
                        className="bg-[#C62828] text-white text-[11px] font-black px-3 py-1.5 rounded-xl leading-none"
                    >
                        Install
                    </button>
                    <button
                        onClick={dismiss}
                        className="text-slate-500 dark:text-zinc-400 text-[10px] font-bold hover:text-slate-700 dark:hover:text-zinc-300 text-center leading-none transition-colors"
                    >
                        Not now
                    </button>
                </div>
            </div>
        </div>
    );
}
