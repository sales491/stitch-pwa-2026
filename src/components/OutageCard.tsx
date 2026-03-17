'use client';

import { OutageReport, resolveOutageReport, deleteOutageReport } from '@/app/actions/outages';
import ShareButton from './ShareButton';

function timeAgo(date: string) {
    const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    const m = Math.floor(seconds / 60); if (m < 60) return `${m}m ago`;
    const h = Math.floor(m / 60); if (h < 24) return `${h}h ago`;
    const d = Math.floor(h / 24); if (d < 7) return `${d}d ago`;
    return new Date(date).toLocaleDateString('en-PH', { month: 'short', day: 'numeric' });
}

type Props = {
    report: OutageReport;
    canManage?: boolean;
};

export default function OutageCard({ report, canManage }: Props) {
    const isPower = report.type === 'power';
    const isResolved = report.status === 'resolved';

    const handleResolve = async () => {
        await resolveOutageReport(report.id);
    };

    const handleDelete = async () => {
        if (!confirm('Delete this report?')) return;
        await deleteOutageReport(report.id);
    };

    return (
        <div className={`bg-white dark:bg-zinc-900 border rounded-2xl px-4 py-4 shadow-sm transition-all ${
            isResolved ? 'border-slate-200 dark:border-zinc-800 opacity-60' : isPower
                ? 'border-yellow-200 dark:border-yellow-900/40'
                : 'border-blue-200 dark:border-blue-900/40'
        }`}>
            <div className="flex items-start gap-3">
                {/* Icon */}
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${
                    isResolved ? 'bg-slate-100 dark:bg-zinc-800' : isPower
                        ? 'bg-yellow-100 dark:bg-yellow-900/30'
                        : 'bg-blue-100 dark:bg-blue-900/30'
                }`}>
                    {isResolved ? '✅' : isPower ? '⚡' : '💧'}
                </div>

                <div className="flex-1 min-w-0">
                    {/* Badges */}
                    <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                        <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-widest ${
                            isResolved
                                ? 'bg-slate-100 dark:bg-zinc-700 text-slate-400'
                                : isPower
                                ? 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-400'
                                : 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400'
                        }`}>
                            {isResolved ? 'Resolved' : isPower ? 'Power Outage' : 'Water Outage'
                            }</span>
                    </div>

                    {/* Location */}
                    <p className="font-black text-slate-900 dark:text-white text-[13px] leading-snug">
                        {[report.barangay, report.municipality].filter(Boolean).join(', ')}
                    </p>

                    {/* Description */}
                    {report.description && (
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2 leading-snug">
                            {report.description}
                        </p>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-100 dark:border-zinc-800/50">
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-medium">
                                {isResolved ? `Resolved · ` : ''}{timeAgo(report.created_at)}
                            </span>
                            {!isResolved && (
                                <ShareButton 
                                    title={`${isPower ? 'Power Outage' : 'Water Interruption'} in ${report.barangay}`}
                                    text={`Reported: ${isPower ? 'Power Outage' : 'Water Interruption'} in ${report.barangay}, ${report.municipality}.`}
                                    url="/my-barangay"
                                    variant="subtle"
                                />
                            )}
                        </div>
                        {canManage && !isResolved && (
                            <div className="flex gap-2">
                                <button
                                    onClick={handleResolve}
                                    className="text-[10px] font-black text-emerald-600 dark:text-emerald-400 hover:underline"
                                >
                                    Mark Resolved
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="text-[10px] font-black text-rose-400 hover:underline"
                                >
                                    Delete
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
