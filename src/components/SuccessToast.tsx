'use client';

import { useEffect, useState } from 'react';

type Props = {
    message: string;
    visible: boolean;
    /** If set (ms), toast auto-dismisses after this duration. Omit for redirect flows. */
    autoDismiss?: number;
    /** Optional callback when dismissed */
    onDismiss?: () => void;
};

/**
 * Animated slide-in green banner shown after successful form submissions.
 * - No autoDismiss: shows a spinner + "Redirecting you now…" (navigation flows)
 * - autoDismiss set: shows a checkmark + auto-hides (in-place inline forms)
 */
export default function SuccessToast({ message, visible, autoDismiss, onDismiss }: Props) {
    const [show, setShow] = useState(false);

    useEffect(() => {
        if (visible) {
            const t = setTimeout(() => setShow(true), 10);
            return () => clearTimeout(t);
        } else {
            setTimeout(() => setShow(false), 0);
        }
    }, [visible]);

    // Auto-dismiss: slide out first, then call onDismiss
    useEffect(() => {
        if (visible && autoDismiss) {
            const slideOutAt = autoDismiss - 300; // start slide-out 300ms before dismiss
            const t1 = setTimeout(() => setShow(false), slideOutAt > 0 ? slideOutAt : autoDismiss);
            const t2 = setTimeout(() => { onDismiss?.(); }, autoDismiss);
            return () => { clearTimeout(t1); clearTimeout(t2); };
        }
    }, [visible, autoDismiss, onDismiss]);

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
                        <p className="text-emerald-100 text-[11px] mt-0.5">
                            {autoDismiss ? 'Done!' : 'Redirecting you now…'}
                        </p>
                    </div>
                    {autoDismiss ? (
                        <button
                            onClick={() => { setShow(false); setTimeout(() => onDismiss?.(), 300); }}
                            className="w-5 h-5 flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity shrink-0"
                            aria-label="Dismiss"
                        >
                            <span className="material-symbols-outlined text-[16px]">close</span>
                        </button>
                    ) : (
                        <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin shrink-0" />
                    )}
                </div>
            </div>
        </div>
    );
}
