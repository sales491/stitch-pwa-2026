'use client';

import { notFound } from 'next/navigation';
import { getGroup, assignRotatingWinners } from '@/app/actions/paluwagan';
import PaluwaganCycleRow from '@/components/PaluwaganCycleRow';
import GroupDetailClient from '@/components/PaluwaganGroupDetailClient';
import BackButton from '@/components/BackButton';

export const dynamic = 'force-dynamic';

type Props = { params: Promise<{ id: string }> };

export default async function PaluwaganGroupPage({ params }: Props) {
    const { id } = await params;
    const group = await getGroup(id);

    if (!group) notFound();

    // Access check — must be member or organizer
    if (!group.my_member_id && !group.is_organizer) notFound();

    // Auto-assign rotating winners if all members have joined
    if (group.winner_order === 'rotating' && group.members.length === group.total_cycles) {
        const hasUnassigned = group.cycles.some(c => !c.winner_member_id);
        if (hasUnassigned) {
            await assignRotatingWinners(id);
            const refreshed = await getGroup(id);
            if (refreshed) Object.assign(group, refreshed);
        }
    }

    const currentCycleIndex = group.cycles.findIndex(c => !c.completed_at);
    const currentCycle = currentCycleIndex !== -1 ? group.cycles[currentCycleIndex] : null;
    const myMember = group.members.find(m => m.id === group.my_member_id);

    const totalPot = group.amount * group.total_cycles;
    const completedCycles = group.cycles.filter(c => !!c.completed_at).length;

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-[#0F0F10] pb-32">
            {/* Sticky header */}
            <header className="sticky top-0 z-30 flex items-center gap-3 bg-white/80 dark:bg-[#0F0F10]/80 backdrop-blur-md border-b border-slate-100 dark:border-white/[0.03] px-4 pt-3 pb-3">
                <BackButton />
                <div>
                    <p className="text-lg font-black leading-tight tracking-tight text-moriones-red pl-1 truncate">{group.name}</p>
                    <p className="text-[10px] text-slate-400 dark:text-white/30 font-black uppercase tracking-[0.15em] pl-1">Paluwagan</p>
                </div>
            </header>
            {/* Header */}
            <div className="bg-gradient-to-br from-amber-500 via-yellow-500 to-orange-500 px-4 pt-5 pb-6 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 20% 80%, white 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                        <h1 className="text-xl font-black text-white leading-tight">{group.name}</h1>
                        <p className="text-yellow-100 text-xs mt-0.5">
                            ₱{group.amount.toLocaleString('en-PH')} · {group.cycle === 'biweekly' ? 'Bi-weekly' : group.cycle.charAt(0).toUpperCase() + group.cycle.slice(1)} · {group.members.length}/{group.total_cycles} members
                        </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                        <p className="text-[22px] font-black text-white">₱{totalPot.toLocaleString('en-PH')}</p>
                        <p className="text-yellow-200 text-[10px]">per cycle</p>
                    </div>
                </div>

                {/* Progress */}
                <div className="mt-4">
                    <div className="flex justify-between text-[10px] font-bold text-white/70 mb-1.5">
                        <span>Cycle {completedCycles + 1} of {group.total_cycles}</span>
                        <span>{Math.round((completedCycles / group.total_cycles) * 100)}% done</span>
                    </div>
                    <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-white rounded-full transition-all"
                            style={{ width: `${(completedCycles / group.total_cycles) * 100}%` }}
                        />
                    </div>
                </div>
            </div>

            {/* Invite code (organizer only) */}
            {group.is_organizer && group.status === 'active' && (
                <div className="mx-4 mt-4 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 rounded-2xl px-4 py-3 flex items-center justify-between">
                    <div>
                        <p className="text-[10px] font-black text-amber-700 dark:text-amber-400 uppercase tracking-wider">Invite Code</p>
                        <p className="text-[22px] font-black tracking-[0.2em] text-amber-900 dark:text-amber-300">{group.invite_code}</p>
                    </div>
                    <GroupDetailClient inviteCode={group.invite_code} groupId={group.id} />
                </div>
            )}

            {/* Members summary */}
            <div className="px-4 mt-4">
                <p className="text-[11px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-wider mb-2">Members ({group.members.length}/{group.total_cycles})</p>
                <div className="flex flex-wrap gap-2">
                    {group.members.map(m => (
                        <div key={m.id} className="flex items-center gap-1.5 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-full px-3 py-1.5">
                            <div className="w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 text-[9px] font-black flex items-center justify-center flex-shrink-0">
                                {m.slot_number}
                            </div>
                            <p className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">
                                {m.profile?.full_name?.split(' ')[0] ?? `Member ${m.slot_number}`}
                                {m.id === group.my_member_id ? ' (you)' : ''}
                                {m.user_id === group.organizer_id ? ' 👑' : ''}
                            </p>
                        </div>
                    ))}
                    {group.members.length < group.total_cycles && (
                        <div className="flex items-center gap-1 border border-dashed border-slate-300 dark:border-zinc-700 rounded-full px-3 py-1.5">
                            <p className="text-[11px] text-slate-400 dark:text-zinc-500">{group.total_cycles - group.members.length} open slots</p>
                        </div>
                    )}
                </div>
            </div>

            {/* My slot info */}
            {myMember && (
                <div className="mx-4 mt-4 bg-sky-50 dark:bg-sky-950/20 border border-sky-200 dark:border-sky-800/40 rounded-2xl px-4 py-3">
                    <p className="text-[10px] font-black text-sky-700 dark:text-sky-400 uppercase tracking-wider">Your Slot</p>
                    <p className="text-[16px] font-black text-sky-900 dark:text-sky-300">
                        Slot #{myMember.slot_number}
                        {group.winner_order === 'rotating' && (
                            <span className="ml-2 text-[12px] font-semibold text-sky-600 dark:text-sky-400">
                                — You win Cycle {myMember.slot_number}
                            </span>
                        )}
                    </p>
                </div>
            )}

            {/* Cycles */}
            <div className="px-4 mt-5 space-y-3">
                <p className="text-[11px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-wider">Cycles</p>
                {group.cycles.map(cycle => (
                    <PaluwaganCycleRow
                        key={cycle.id}
                        cycle={cycle}
                        members={group.members}
                        isOrganizer={group.is_organizer}
                        isCurrent={currentCycle?.id === cycle.id}
                        winnerOrder={group.winner_order}
                        groupId={group.id}
                    />
                ))}
            </div>

            {/* Leave / Cancel */}
            <div className="px-4 mt-6">
                {group.is_organizer && group.status === 'active' ? (
                    <GroupDetailClient inviteCode={group.invite_code} groupId={group.id} showCancel />
                ) : !group.is_organizer && group.my_member_id && group.status === 'active' ? (
                    <GroupDetailClient inviteCode={group.invite_code} groupId={group.id} showLeave />
                ) : null}
            </div>
        </main>
    );
}
