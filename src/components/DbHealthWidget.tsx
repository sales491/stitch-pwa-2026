'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';

interface TableStat {
    name: string;
    rows: number;
    deadRows: number;
    sizeMB: number;
}

interface DbHealthData {
    dbSizeMB: number;
    limitMB: number;
    usedPercent: number;
    tables: TableStat[];
    fetchedAt: string;
}

interface Props {
    /** 'mini' shows a compact card for the dashboard. 'full' shows everything. */
    variant?: 'mini' | 'full';
    /** Auto-refresh interval in seconds (default: 30) */
    refreshInterval?: number;
}

function GaugeArc({ percent }: { percent: number }) {
    // SVG arc gauge — 0..100 maps to 0..180 degrees (half circle)
    const r = 52;
    const cx = 60;
    const cy = 60;
    const circumference = Math.PI * r; // half-circle arc length
    const offset = circumference * (1 - Math.min(percent, 100) / 100);

    const color =
        percent >= 90 ? '#ef4444' :
        percent >= 70 ? '#f59e0b' :
        '#10b981';

    return (
        <svg viewBox="0 0 120 70" className="w-full max-w-[160px]">
            {/* Track */}
            <path
                d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="10"
                strokeLinecap="round"
            />
            {/* Fill */}
            <path
                d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
                fill="none"
                stroke={color}
                strokeWidth="10"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                style={{ transition: 'stroke-dashoffset 0.8s ease, stroke 0.5s ease' }}
            />
            {/* Center label */}
            <text x="60" y="55" textAnchor="middle" fontSize="14" fontWeight="900" fill={color}>
                {percent.toFixed(1)}%
            </text>
        </svg>
    );
}

export default function DbHealthWidget({ variant = 'mini', refreshInterval = 30 }: Props) {
    const [data, setData] = useState<DbHealthData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expanded, setExpanded] = useState(false);

    const fetchData = useCallback(async () => {
        try {
            const res = await fetch('/api/admin/db-health', { cache: 'no-store' });
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            setData(await res.json());
            setError(null);
        } catch (e) {
            setError(e instanceof Error ? e.message : 'Failed to fetch');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
        const interval = setInterval(fetchData, refreshInterval * 1000);
        return () => clearInterval(interval);
    }, [fetchData, refreshInterval]);

    const statusColor =
        !data ? 'text-slate-400' :
        data.usedPercent >= 90 ? 'text-red-600' :
        data.usedPercent >= 70 ? 'text-amber-500' :
        'text-emerald-600';

    const statusBg =
        !data ? 'bg-slate-50 border-slate-200' :
        data.usedPercent >= 90 ? 'bg-red-50 border-red-200' :
        data.usedPercent >= 70 ? 'bg-amber-50 border-amber-200' :
        'bg-emerald-50 border-emerald-200';

    const lastUpdated = data
        ? new Date(data.fetchedAt).toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
        : null;

    // ─── MINI VARIANT (dashboard card) ───────────────────────────────────────
    if (variant === 'mini') {
        return (
            <div className={`rounded-2xl border p-4 flex items-center gap-4 transition-all ${statusBg}`}>
                {/* Left: icon */}
                <div className="shrink-0">
                    <span className={`material-symbols-outlined text-2xl ${statusColor}`}>database</span>
                </div>

                {/* Middle: info */}
                <div className="flex-1 min-w-0">
                    <p className={`text-[10px] font-black uppercase tracking-widest ${statusColor}`}>
                        Database Storage
                    </p>
                    {loading && (
                        /* Skeleton placeholder — same height as final content to prevent CLS */
                        <div className="mt-0.5 space-y-1.5 animate-pulse">
                            <div className="h-5 w-24 rounded bg-slate-200/60" />
                            <div className="h-1.5 w-full rounded-full bg-slate-200/60" />
                        </div>
                    )}
                    {error && <p className="text-sm font-black text-red-500 mt-0.5">Error: {error}</p>}
                    {data && (
                        <>
                            <p className="text-base font-black text-slate-800 mt-0.5 tracking-tight">
                                {data.dbSizeMB.toFixed(1)} <span className="text-slate-400 font-bold text-xs">/ {data.limitMB} MB</span>
                            </p>
                            {/* Progress bar */}
                            <div className="mt-1.5 h-1.5 rounded-full bg-white/60 overflow-hidden border border-white/80">
                                <div
                                    className={`h-full rounded-full transition-all duration-700 ${
                                        data.usedPercent >= 90 ? 'bg-red-500' :
                                        data.usedPercent >= 70 ? 'bg-amber-400' :
                                        'bg-emerald-500'
                                    }`}
                                    style={{ width: `${Math.min(data.usedPercent, 100)}%` }}
                                />
                            </div>
                        </>
                    )}
                </div>

                {/* Right: percent + link */}
                <div className="shrink-0 text-right">
                    {data && (
                        <p className={`text-xl font-black ${statusColor}`}>{data.usedPercent.toFixed(0)}%</p>
                    )}
                    <Link
                        href="/admin/health"
                        className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-700 transition-colors"
                    >
                        Full Report →
                    </Link>
                </div>

                {/* Refresh button */}
                <button
                    onClick={fetchData}
                    title="Refresh now"
                    className="shrink-0 w-7 h-7 rounded-full bg-white/60 border border-white/80 flex items-center justify-center hover:bg-white transition-all"
                >
                    <span className="material-symbols-outlined text-base text-slate-400">refresh</span>
                </button>
            </div>
        );
    }

    // ─── FULL VARIANT (health page) ───────────────────────────────────────────
    return (
        <div className="space-y-8">
            {/* Gauge Card */}
            <div className="bg-white rounded-[2rem] border border-slate-200 p-8 shadow-sm flex flex-col sm:flex-row items-center gap-8">
                <div className="flex flex-col items-center gap-1">
                    <GaugeArc percent={data?.usedPercent ?? 0} />
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">
                        Used of 500MB Free Tier
                    </p>
                </div>

                <div className="flex-1 space-y-4">
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Storage Used</p>
                        {loading && <p className="text-3xl font-black text-slate-300">—</p>}
                        {error && <p className="text-sm font-black text-red-500">Error: {error}</p>}
                        {data && (
                            <p className={`text-3xl font-black tracking-tight ${statusColor}`}>
                                {data.dbSizeMB.toFixed(2)} MB
                                <span className="text-base text-slate-400 font-bold ml-2">/ {data.limitMB} MB</span>
                            </p>
                        )}
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Remaining</p>
                            <p className="text-lg font-black text-slate-800">
                                {data ? (data.limitMB - data.dbSizeMB).toFixed(1) : '—'} <span className="text-xs text-slate-400">MB</span>
                            </p>
                        </div>
                        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Tables</p>
                            <p className="text-lg font-black text-slate-800">{data?.tables.length ?? '—'}</p>
                        </div>
                        <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Total Rows</p>
                            <p className="text-lg font-black text-slate-800">
                                {data ? data.tables.reduce((s, t) => s + t.rows, 0).toLocaleString() : '—'}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={fetchData}
                            className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-[11px] font-black uppercase tracking-widest text-slate-600 transition-all border border-slate-200"
                        >
                            <span className="material-symbols-outlined text-sm">refresh</span>
                            Refresh Now
                        </button>
                        {lastUpdated && (
                            <p className="text-[10px] text-slate-400 font-bold">
                                Updated {lastUpdated} · auto-refreshes every {refreshInterval}s
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Table Breakdown */}
            {data && (
                <div className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between p-6 border-b border-slate-100">
                        <h3 className="font-black text-xs uppercase tracking-[0.2em] text-slate-600">
                            Table Breakdown
                        </h3>
                        <span className="text-[10px] text-slate-400 font-bold">{data.tables.length} tables</span>
                    </div>

                    <div className="divide-y divide-slate-50">
                        {(expanded ? data.tables : data.tables.slice(0, 10)).map((table, i) => {
                            const maxRows = data.tables[0]?.rows || 1;
                            const barWidth = (table.rows / maxRows) * 100;
                            return (
                                <div key={`${i}-${table.name}`} className="flex items-center gap-4 px-6 py-3 hover:bg-slate-50/60 transition-colors">
                                    <span className="text-[10px] font-black text-slate-300 w-5 shrink-0">{i + 1}</span>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-black text-slate-700 truncate font-mono">{table.name}</p>
                                        <div className="mt-1 h-1 rounded-full bg-slate-100 overflow-hidden">
                                            <div
                                                className="h-full rounded-full bg-blue-400 transition-all duration-500"
                                                style={{ width: `${barWidth}%` }}
                                            />
                                        </div>
                                    </div>
                                    <div className="text-right shrink-0 space-y-0.5">
                                        <p className="text-sm font-black text-slate-800">{table.rows.toLocaleString()}</p>
                                        <p className="text-[10px] text-slate-400 font-bold">{table.sizeMB} MB</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {data.tables.length > 10 && (
                        <button
                            onClick={() => setExpanded(e => !e)}
                            className="w-full py-4 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-700 hover:bg-slate-50 transition-all border-t border-slate-100"
                        >
                            {expanded ? 'Show Less' : `Show All ${data.tables.length} Tables`}
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
