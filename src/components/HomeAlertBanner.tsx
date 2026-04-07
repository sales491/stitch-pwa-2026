'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { expiryLabel } from '@/lib/alert-expiry';

// Unified alert type from the API
type UnifiedAlert = {
    id: string;
    _source: 'calamity' | 'outage';
    type: string;
    severity?: string;
    title?: string;
    barangay?: string | null;
    municipality: string;
    expires_at?: string | null;
    created_at: string;
};

// ─── Color maps ───────────────────────────────────────────────────────────────
const SEVERITY_COLOR: Record<string, string> = {
    critical: 'bg-red-500 text-white',
    high:     'bg-orange-500 text-white',
    moderate: 'bg-yellow-400 text-yellow-900',
    low:      'bg-blue-500 text-white',
};

const CALAMITY_ICON: Record<string, string> = {
    typhoon:    '🌀',
    flood:      '🌊',
    earthquake: '🫨',
    fire:       '🔥',
    road:       '🚧',
    other:      '⚠️',
};

const OUTAGE_COLOR: Record<string, string> = {
    power: 'bg-yellow-400 text-yellow-900',
    water: 'bg-blue-500 text-white',
};

function AlertCard({ alert }: { alert: UnifiedAlert }) {
    const isCalamity = alert._source === 'calamity';
    const icon = isCalamity ? (CALAMITY_ICON[alert.type] ?? '⚠️') : (alert.type === 'power' ? '⚡' : '💧');
    const colorClass = isCalamity
        ? (SEVERITY_COLOR[alert.severity ?? 'low'] ?? 'bg-red-500 text-white')
        : (OUTAGE_COLOR[alert.type] ?? 'bg-yellow-400 text-yellow-900');
    const href = isCalamity ? '/my-barangay/calamity' : '/island-life/outages';
    const label = isCalamity
        ? (alert.title ?? alert.type)
        : (alert.type === 'power' ? 'Power Outage' : 'Water Interruption');
    const location = [alert.barangay, alert.municipality].filter(Boolean).join(', ');
    const expiry = expiryLabel(alert.expires_at);

    return (
        <Link
            href={href}
            className={`flex-shrink-0 w-52 rounded-2xl px-3.5 py-3 flex flex-col gap-1 shadow-sm active:scale-[0.97] transition-transform ${colorClass}`}
        >
            <div className="flex items-start gap-2">
                <span className="text-lg flex-shrink-0 mt-0.5">{icon}</span>
                <div className="min-w-0">
                    <p className="text-[11px] font-black leading-tight line-clamp-2">{label}</p>
                    <p className="text-[9px] font-semibold opacity-70 mt-0.5 truncate">📍 {location}</p>
                </div>
            </div>
            {expiry && (
                <p className="text-[9px] font-bold opacity-60 pl-0.5">
                    ⏱ {expiry}
                </p>
            )}
        </Link>
    );
}

export default function HomeAlertBanner() {
    const [alerts, setAlerts] = useState<UnifiedAlert[]>([]);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        fetch('/api/alerts')
            .then(r => r.ok ? r.json() : { alerts: [] })
            .then(({ alerts }) => setAlerts(alerts ?? []))
            .catch(() => {/* silent */})
            .finally(() => setLoaded(true));
    }, []);

    if (!loaded) return null;

    // ── All-clear zero-state (idea C) ────────────────────────────────────────
    if (alerts.length === 0) {
        return (
            <div className="mx-4 mb-2">
                <div className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800/40">
                    <span className="text-base">✅</span>
                    <p className="text-[11px] font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-widest flex-1">
                        No active alerts
                    </p>
                    <Link href="/island-life/outages" className="text-[11px] font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-wide hover:text-emerald-900 transition-colors whitespace-nowrap">💡 Outages</Link>
                    <span className="text-emerald-700/50 dark:text-emerald-400/50 text-[11px]">·</span>
                    <Link href="/my-barangay/calamity" className="text-[11px] font-black text-emerald-700 dark:text-emerald-400 uppercase tracking-wide hover:text-emerald-900 transition-colors whitespace-nowrap">🚨 Calamity</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="mx-4 mb-2">
            {/* Section header with live count pill (idea A) */}
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                    </span>
                    <span className="text-[11px] font-black uppercase tracking-widest text-red-600 dark:text-red-400">
                        Active Alerts
                    </span>
                    <span className="px-1.5 py-0.5 rounded-full bg-red-500 text-white text-[9px] font-black leading-none">
                        {alerts.length}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <Link href="/island-life/outages" className="text-[11px] font-black text-slate-500 dark:text-zinc-400 hover:text-yellow-600 uppercase tracking-wide transition-colors whitespace-nowrap">💡 Outages</Link>
                    <span className="text-slate-400 dark:text-zinc-500 text-[11px]">·</span>
                    <Link href="/my-barangay/calamity" className="text-[11px] font-black text-slate-500 dark:text-zinc-400 hover:text-red-700 uppercase tracking-wide transition-colors whitespace-nowrap">🚨 Calamity</Link>
                    <span className="text-slate-400 dark:text-zinc-500 text-[11px]">·</span>
                    <Link href="/my-barangay" className="text-[11px] font-black text-slate-500 dark:text-zinc-400 hover:text-slate-700 uppercase tracking-wider">View all →</Link>
                </div>
            </div>

            {/* Alert cards — horizontal scroll, priority sorted */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                {alerts.map(alert => (
                    <AlertCard key={`${alert._source}-${alert.id}`} alert={alert} />
                ))}
            </div>
        </div>
    );
}
