'use client';

import { useState } from 'react';
import { PaluwaganCycle, PaluwaganMember } from '@/app/actions/paluwagan';
import { markPaid, assignWinner, advanceCycle } from '@/app/actions/paluwagan';

type Props = {
    cycle: PaluwaganCycle;
    members: PaluwaganMember[];
    isOrganizer: boolean;
    isCurrent: boolean;
    winnerOrder: 'rotating' | 'organizer';
    groupId: string;
};

export default function PaluwaganCycleRow({ cycle, members, isOrganizer, isCurrent, winnerOrder, groupId }: Props) {
    const [loading, setLoading] = useState<string | null>(null);
    const [advancing, setAdvancing] = useState(false);

    const isCompleted = !!cycle.completed_at;
    const paidIds = new Set((cycle.payments ?? []).map(p => p.member_id));
    const allPaid = members.length > 0 && members.every(m => paidIds.has(m.id));
    const winner = members.find(m => m.id === cycle.winner_member_id);

    async function handleTogglePaid(memberId: string) {
        setLoading(memberId);
        await markPaid(cycle.id, memberId, !paidIds.has(memberId));
        setLoading(null);
    }

    async function handleAssignWinner(memberId: string) {
        setLoading('winner_' + memberId);
        await assignWinner(cycle.id, memberId);
        setLoading(null);
    }

    async function handleAdvance() {
        setAdvancing(true);
        await advanceCycle(groupId, cycle.id);
        setAdvancing(false);
    }

    return (
        <div className={`rounded-2xl border transition-all ${
            isCurrent
                ? 'border-amber-300 dark:border-amber-700/50 bg-amber-50 dark:bg-amber-950/20 shadow-md'
                : isCompleted
                    ? 'border-slate-100 dark:border-zinc-800/60 bg-white dark:bg-zinc-900/50 opacity-60'
                    : 'border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900'
        }`}>
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-black flex-shrink-0 ${
                        isCompleted ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400' :
                        isCurrent ? 'bg-amber-500 text-white' :
                        'bg-slate-100 dark:bg-zinc-800 text-slate-400'
                    }`}>
                        {isCompleted ? '✓' : cycle.cycle_number}
                    </div>
                    <div>
                        <p className="font-black text-slate-900 dark:text-white text-[13px]">
                            Cycle {cycle.cycle_number}
                            {isCurrent && <span className="ml-2 text-[9px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-wider">Current</span>}
                        </p>
                        <p className="text-[10px] text-slate-400 dark:text-zinc-500">Due {new Date(cycle.due_date).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="font-black text-[14px] text-slate-900 dark:text-white">₱{cycle.pot_amount.toLocaleString('en-PH')}</p>
                    {winner && (
                        <p className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                            🏆 {winner.profile?.full_name ?? 'Member ' + winner.slot_number}
                        </p>
                    )}
                    {!winner && winnerOrder === 'organizer' && isOrganizer && isCurrent && (
                        <p className="text-[10px] text-amber-500">Assign winner ↓</p>
                    )}
                </div>
            </div>

            {/* Payment pills */}
            <div className="px-4 pb-3 flex flex-wrap gap-1.5">
                {members.map(m => {
                    const paid = paidIds.has(m.id);
                    const isLoading = loading === m.id;
                    return (
                        <button
                            key={m.id}
                            disabled={!isOrganizer || isCompleted || isLoading}
                            onClick={() => isOrganizer && !isCompleted && handleTogglePaid(m.id)}
                            className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-black transition-all ${
                                paid
                                    ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400'
                                    : 'bg-slate-100 dark:bg-zinc-800 text-slate-400 dark:text-slate-500'
                            } ${isOrganizer && !isCompleted ? 'cursor-pointer active:scale-95' : 'cursor-default'}`}
                        >
                            {isLoading ? '⏳' : paid ? '✓' : '○'}
                            {' '}{m.profile?.full_name?.split(' ')[0] ?? `Slot ${m.slot_number}`}
                        </button>
                    );
                })}
            </div>

            {/* Organizer assign winner (organizer mode) */}
            {isOrganizer && winnerOrder === 'organizer' && isCurrent && !winner && (
                <div className="px-4 pb-3">
                    <select
                        onChange={e => e.target.value && handleAssignWinner(e.target.value)}
                        className="w-full bg-white dark:bg-zinc-900 border border-amber-200 dark:border-amber-800/40 rounded-xl px-3 py-2 text-[12px] font-semibold text-slate-700 dark:text-slate-300 focus:outline-none appearance-none"
                        defaultValue=""
                    >
                        <option value="" disabled>Assign winner…</option>
                        {members.map(m => (
                            <option key={m.id} value={m.id}>
                                Slot {m.slot_number} — {m.profile?.full_name ?? 'Member'}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {/* Advance cycle button */}
            {isOrganizer && isCurrent && !isCompleted && (
                <div className="px-4 pb-4">
                    <button
                        onClick={handleAdvance}
                        disabled={advancing}
                        className={`w-full py-2.5 rounded-xl text-[12px] font-black uppercase tracking-wider transition-all ${
                            allPaid && winner
                                ? 'bg-emerald-500 text-white hover:bg-emerald-600 active:scale-[0.98]'
                                : 'bg-slate-100 dark:bg-zinc-800 text-slate-400 cursor-not-allowed'
                        }`}
                    >
                        {advancing ? 'Completing…' : allPaid && winner ? '✓ Complete This Cycle' : 'Mark all paid + assign winner first'}
                    </button>
                </div>
            )}
        </div>
    );
}
