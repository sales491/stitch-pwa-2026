'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { CalamityAlert } from '@/app/actions/calamity';
import type { OutageReport } from '@/app/actions/outages';

// Severity color mapping for calamity
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

export default function HomeAlertBanner() {
    const [calamityAlerts, setCalamityAlerts] = useState<CalamityAlert[]>([]);
    const [outageReports, setOutageReports] = useState<OutageReport[]>([]);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        fetch('/api/alerts')
            .then(r => r.ok ? r.json() : { calamityAlerts: [], outageReports: [] })
            .then(({ calamityAlerts, outageReports }) => {
                setCalamityAlerts(calamityAlerts ?? []);
                setOutageReports(outageReports ?? []);
            })
            .catch(() => {/* silent — no alerts is fine */})
            .finally(() => setLoaded(true));
    }, []);

    // Don't render anything until loaded (avoids layout shift)
    if (!loaded) return null;

    const totalCount = calamityAlerts.length + outageReports.length;
    if (totalCount === 0) return null;

    return (
        <div className="mx-4 mb-4">
            {/* Section header */}
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1.5">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
                    </span>
                    <span className="text-[11px] font-black uppercase tracking-widest text-red-600 dark:text-red-400">
                        Active Alerts
                    </span>
                </div>
                <Link href="/my-barangay" className="text-[10px] font-black text-slate-400 dark:text-zinc-500 hover:text-slate-600 uppercase tracking-wider">
                    View all →
                </Link>
            </div>

            {/* Alert cards — horizontal scroll */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">

                {/* Calamity alerts */}
                {calamityAlerts.map(alert => (
                    <Link
                        key={alert.id}
                        href="/my-barangay/calamity"
                        className={`flex-shrink-0 w-52 rounded-2xl px-3.5 py-3 flex items-start gap-2.5 shadow-sm active:scale-[0.97] transition-transform ${SEVERITY_COLOR[alert.severity] ?? 'bg-red-500 text-white'}`}
                    >
                        <span className="text-lg flex-shrink-0 mt-0.5">
                            {CALAMITY_ICON[alert.type] ?? '⚠️'}
                        </span>
                        <div className="min-w-0">
                            <p className="text-[11px] font-black leading-tight line-clamp-2 opacity-100">
                                {alert.title}
                            </p>
                            <p className="text-[9px] font-semibold opacity-70 mt-0.5 truncate">
                                📍 {[alert.barangay, alert.municipality].filter(Boolean).join(', ')}
                            </p>
                        </div>
                    </Link>
                ))}

                {/* Outage alerts */}
                {outageReports.map(report => (
                    <Link
                        key={report.id}
                        href="/island-life/outages"
                        className={`flex-shrink-0 w-52 rounded-2xl px-3.5 py-3 flex items-start gap-2.5 shadow-sm active:scale-[0.97] transition-transform ${
                            report.type === 'power'
                                ? 'bg-yellow-400 text-yellow-900'
                                : 'bg-blue-500 text-white'
                        }`}
                    >
                        <span className="text-lg flex-shrink-0 mt-0.5">
                            {report.type === 'power' ? '⚡' : '💧'}
                        </span>
                        <div className="min-w-0">
                            <p className="text-[11px] font-black leading-tight">
                                {report.type === 'power' ? 'Power Outage' : 'Water Outage'}
                            </p>
                            <p className="text-[9px] font-semibold opacity-70 mt-0.5 truncate">
                                📍 {[report.barangay, report.municipality].filter(Boolean).join(', ')}
                            </p>
                            {report.description && (
                                <p className="text-[9px] opacity-60 mt-0.5 line-clamp-1">
                                    {report.description}
                                </p>
                            )}
                        </div>
                    </Link>
                ))}

            </div>
        </div>
    );
}
