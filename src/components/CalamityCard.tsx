'use client';

import { useState } from 'react';
import { CalamityAlert, resolveCalamityAlert, deleteCalamityAlert } from '@/app/actions/calamity';
import { expiryLabel } from '@/lib/alert-expiry';

const TYPE_META: Record<string, { icon: string; label: string }> = {
    typhoon:    { icon: '🌀', label: 'Typhoon' },
    flood:      { icon: '🌊', label: 'Flood' },
    earthquake: { icon: '🫨', label: 'Earthquake' },
    fire:       { icon: '🔥', label: 'Fire' },
    road:       { icon: '🚧', label: 'Road Closure' },
    other:      { icon: '⚠️', label: 'Alert' },
};

const SEVERITY_STYLE: Record<string, string> = {
    low:      'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400',
    moderate: 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-400',
    high:     'bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-400',
    critical: 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400',
};

const SEVERITY_BORDER: Record<string, string> = {
    low:      'border-blue-200 dark:border-blue-900/40',
    moderate: 'border-yellow-200 dark:border-yellow-900/40',
    high:     'border-orange-200 dark:border-orange-900/40',
    critical: 'border-red-300 dark:border-red-800/60',
};

const SEVERITY_ICON_BG: Record<string, string> = {
    low:      'bg-blue-100 dark:bg-blue-900/30',
    moderate: 'bg-yellow-100 dark:bg-yellow-900/30',
    high:     'bg-orange-100 dark:bg-orange-900/30',
    critical: 'bg-red-100 dark:bg-red-900/30',
};

function timeAgo(date: string) {
    const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    const m = Math.floor(seconds / 60); if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60); if (h < 24) return `${h}h ago`;
    const d = Math.floor(h / 24); if (d < 7) return `${d}d ago`;
    return new Date(date).toLocaleDateString('en-PH', { month: 'short', day: 'numeric' });
}

type Props = {
    alert: CalamityAlert;
    canManage?: boolean;
    isOwner?: boolean;
};

export default function CalamityCard({ alert, canManage, isOwner }: Props) {
    const meta = TYPE_META[alert.type] ?? TYPE_META.other;
    const isResolved = alert.status === 'resolved';
    const borderClass = isResolved ? 'border-slate-200 dark:border-zinc-800' : SEVERITY_BORDER[alert.severity] ?? 'border-slate-200';
    const iconBgClass = isResolved ? 'bg-slate-100 dark:bg-zinc-800' : SEVERITY_ICON_BG[alert.severity] ?? 'bg-slate-100';
    const [actionError, setActionError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const handleResolve = async () => {
        setLoading(true); setActionError(null);
        const res = await resolveCalamityAlert(alert.id);
        if (!res.success) setActionError(res.error ?? 'Could not resolve.');
        setLoading(false);
    };
    const handleDelete = async () => {
        if (!confirm('Delete this alert?')) return;
        setLoading(true); setActionError(null);
        const res = await deleteCalamityAlert(alert.id);
        if (!res.success) setActionError(res.error ?? 'Could not delete.');
        setLoading(false);
    };

    return (
        <div className={`bg-white dark:bg-zinc-900 border rounded-2xl px-4 py-4 shadow-sm transition-all ${borderClass} ${isResolved ? 'opacity-60' : ''}`}>
            <div className="flex items-start gap-3">
                {/* Icon */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${iconBgClass}`}>
                    {isResolved ? '✅' : meta.icon}
                </div>

                <div className="flex-1 min-w-0">
                    {/* Badges */}
                    <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                        <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-widest ${
                            isResolved
                                ? 'bg-slate-100 dark:bg-zinc-700 text-slate-400'
                                : SEVERITY_STYLE[alert.severity] ?? 'bg-slate-100 text-slate-500'
                        }`}>
                            {isResolved ? 'Resolved' : `${alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)} · ${meta.label}`}
                        </span>
                    </div>

                    {/* Title */}
                    <p className="font-black text-slate-900 dark:text-white text-[13px] leading-snug">
                        {alert.title}
                    </p>

                    {/* Location */}
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        📍 {[alert.barangay, alert.municipality].filter(Boolean).join(', ')}
                    </p>

                    {/* Description */}
                    {alert.description && (
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-snug">
                            {alert.description}
                        </p>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between mt-2">
                        <div className="flex flex-col gap-0.5">
                            <span className="text-[10px] text-slate-400 dark:text-zinc-500">
                                {timeAgo(alert.created_at)}
                            </span>
                            {alert.expires_at && !isResolved && (
                                <span className="text-[9px] font-bold text-slate-400 dark:text-zinc-600">
                                    ⏱ {expiryLabel(alert.expires_at)}
                                </span>
                            )}
                        </div>
                        {(canManage || isOwner) && (
                            <div className="flex flex-col items-end gap-1">
                                <div className="flex gap-2">
                                    {!isResolved && (
                                        <button
                                            onClick={handleResolve}
                                            disabled={loading}
                                            className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 hover:underline disabled:opacity-50"
                                        >
                                            Mark Resolved
                                        </button>
                                    )}
                                    <button
                                        onClick={handleDelete}
                                        disabled={loading}
                                        className="text-[10px] font-black text-rose-400 hover:underline disabled:opacity-50"
                                    >
                                        Delete
                                    </button>
                                </div>
                                {actionError && (
                                    <p className="text-[10px] text-rose-500 dark:text-rose-400 font-semibold">{actionError}</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
