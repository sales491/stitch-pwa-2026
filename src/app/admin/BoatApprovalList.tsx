'use client';
import { useTransition } from 'react';
import { approveBoatService, rejectBoatService } from './actions';

type BoatService = {
    id: string;
    operator_name: string;
    boat_type: string;
    service_type: string;
    base_municipality: string;
    contact_number: string | null;
    is_approved: boolean;
    created_at: string;
};

export default function BoatApprovalList({ boats }: { boats: BoatService[] }) {
    const pending = boats.filter(b => !b.is_approved);
    const approved = boats.filter(b => b.is_approved);

    return (
        <div className="flex flex-col gap-3 relative z-10">
            {boats.length === 0 && (
                <p className="text-sm text-slate-400 font-medium text-center py-8">No boat listings submitted yet.</p>
            )}

            {pending.length > 0 && (
                <>
                    <p className="text-[10px] font-black uppercase tracking-widest text-amber-500 mb-1">Pending Approval ({pending.length})</p>
                    {pending.map(boat => (
                        <BoatRow key={boat.id} boat={boat} />
                    ))}
                </>
            )}

            {approved.length > 0 && (
                <>
                    <p className="text-[10px] font-black uppercase tracking-widest text-teal-500 mt-2 mb-1">Approved ({approved.length})</p>
                    {approved.map(boat => (
                        <BoatRow key={boat.id} boat={boat} />
                    ))}
                </>
            )}
        </div>
    );
}

function BoatRow({ boat }: { boat: BoatService }) {
    const [isPending, startTransition] = useTransition();

    return (
        <div className={`rounded-2xl border p-4 transition-all ${boat.is_approved
            ? 'bg-teal-50/40 border-teal-200'
            : 'bg-amber-50/60 border-amber-200'
            }`}>
            <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-black text-slate-800 truncate">{boat.operator_name}</p>
                    <p className="text-[11px] text-slate-500 truncate">
                        {boat.boat_type} · {boat.service_type} · {boat.base_municipality}
                    </p>
                    {boat.contact_number && (
                        <p className="text-[11px] text-slate-400 mt-0.5">{boat.contact_number}</p>
                    )}
                </div>
                <div className="shrink-0 flex items-center gap-1.5">
                    {boat.is_approved ? (
                        <span className="px-2 py-1 rounded-lg bg-teal-100 text-teal-700 text-[10px] font-black uppercase tracking-widest">Live</span>
                    ) : (
                        <span className="px-2 py-1 rounded-lg bg-amber-100 text-amber-700 text-[10px] font-black uppercase tracking-widest animate-pulse">Pending</span>
                    )}
                </div>
            </div>

            <div className="flex gap-2 mt-2">
                {!boat.is_approved && (
                    <form action={() => startTransition(() => approveBoatService(boat.id))}>
                        <button
                            type="submit"
                            disabled={isPending}
                            className="px-3 py-1.5 rounded-xl bg-teal-600 text-white text-[11px] font-black hover:bg-teal-700 transition-colors disabled:opacity-50"
                        >
                            {isPending ? 'Approving…' : '✓ Approve'}
                        </button>
                    </form>
                )}
                {boat.is_approved && (
                    <form action={() => startTransition(() => rejectBoatService(boat.id))}>
                        <button
                            type="submit"
                            disabled={isPending}
                            className="px-3 py-1.5 rounded-xl bg-slate-200 text-slate-600 text-[11px] font-black hover:bg-red-100 hover:text-red-600 transition-colors disabled:opacity-50"
                        >
                            {isPending ? 'Revoking…' : '✗ Revoke'}
                        </button>
                    </form>
                )}
                <span className="text-[10px] text-slate-400 font-medium self-center ml-1">
                    Submitted {new Date(boat.created_at).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}
                </span>
            </div>
        </div>
    );
}
