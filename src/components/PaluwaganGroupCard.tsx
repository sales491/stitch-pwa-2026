'use client';

import Link from 'next/link';
import { MyGroupSummary } from '@/app/actions/paluwagan';

const CYCLE_LABELS = { weekly: 'Weekly', biweekly: 'Bi-weekly', monthly: 'Monthly' };

function cycleProgressPercent(current: number | null, total: number) {
    if (!current) return 0;
    return Math.round(((current - 1) / total) * 100);
}

export default function PaluwaganGroupCard({ group }: { group: MyGroupSummary }) {
    const progress = cycleProgressPercent(group.current_cycle, group.total_cycles);
    const isComplete = group.status === 'completed';
    const isCancelled = group.status === 'cancelled';

    return (
        <Link
            href={`/my-barangay/paluwagan/${group.id}`}
            className="block bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl px-4 py-4 shadow-sm hover:shadow-md active:scale-[0.98] transition-all"
        >
            <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                        <p className="font-black text-slate-900 dark:text-white text-[15px] truncate">{group.name}</p>
                        {group.is_organizer && (
                            <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 flex-shrink-0 uppercase tracking-wider">
                                Organizer
                            </span>
                        )}
                        {isComplete && (
                            <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 flex-shrink-0 uppercase tracking-wider">
                                Done
                            </span>
                        )}
                        {isCancelled && (
                            <span className="text-[9px] font-black px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-400 flex-shrink-0 uppercase tracking-wider">
                                Cancelled
                            </span>
                        )}
                    </div>
                    <p className="text-[12px] text-slate-500 dark:text-slate-400">
                        ₱{group.amount.toLocaleString('en-PH')} · {CYCLE_LABELS[group.cycle]} · {group.member_count}/{group.total_cycles} members
                    </p>
                </div>
                <div className="text-right flex-shrink-0">
                    <p className="text-[20px] font-black text-amber-600 dark:text-amber-400">
                        ₱{(group.amount * group.total_cycles).toLocaleString('en-PH')}
                    </p>
                    <p className="text-[9px] text-slate-400 dark:text-zinc-500">total pot</p>
                </div>
            </div>

            {/* Progress bar */}
            {!isCancelled && (
                <div>
                    <div className="flex justify-between items-center mb-1">
                        <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500">
                            {isComplete ? 'Completed' : `Cycle ${group.current_cycle ?? 1} of ${group.total_cycles}`}
                        </p>
                        <p className="text-[10px] font-bold text-slate-400 dark:text-zinc-500">{isComplete ? 100 : progress}%</p>
                    </div>
                    <div className="h-1.5 bg-slate-100 dark:bg-zinc-800 rounded-full overflow-hidden">
                        <div
                            className={`h-full rounded-full transition-all ${isComplete ? 'bg-emerald-500' : 'bg-amber-500'}`}
                            style={{ width: `${isComplete ? 100 : progress}%` }}
                        />
                    </div>
                </div>
            )}
        </Link>
    );
}
