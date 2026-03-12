'use client';

import { useEffect, useState } from 'react';

type Props = {
    message: string;
    visible: boolean;
};

/**
 * Animated slide-in green banner shown after successful form submissions.
 * Parent controls visibility via `visible` prop.
 * The banner slides in from top and stays until parent navigates away.
 */
export default function SuccessToast({ message, visible }: Props) {
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (visible) {
            // Allow paint before triggering animation
            const t = setTimeout(() => setShow(true), 10);
            return () => clearTimeout(t);
        } else {
            setShow(false);
        }
    }, [visible]);

    if (!visible) return null;

    return (
        <div
            className={`fixed top-0 left-0 right-0 z-[9999] flex items-center justify-center transition-transform duration-300 ease-out ${show ? 'translate-y-0' : '-translate-y-full'}`}
        >
            <div className="w-full max-w-md mx-auto px-4 pt-3">
                <div className="flex items-center gap-3 bg-emerald-500 text-white rounded-2xl px-5 py-4 shadow-xl shadow-emerald-500/30">
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-[20px]">check</span>
                    </div>
                    <div className="flex-1">
                        <p className="font-black text-[14px] leading-tight">{message}</p>
                        <p className="text-emerald-100 text-[11px] mt-0.5">Redirecting you now…</p>
                    </div>
                    <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin shrink-0" />
                </div>
            </div>
        </div>
    );
}
