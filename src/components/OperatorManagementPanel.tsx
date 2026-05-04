'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { adminDeleteOperator } from '@/app/actions/admin';

type Operator = {
    id: string;
    operator_name?: string;
    driver_name?: string;
    boat_type?: string;
    vehicle_type?: string;
    service_type?: string;
    base_municipality?: string;
    municipality?: string;
    base_town?: string;
    contact_number?: string;
    created_at: string;
};

type TableName = 'boat_services' | 'transport_services';

function OperatorCard({
    op,
    table,
    editHref,
    onDeleted,
}: {
    op: Operator;
    table: TableName;
    editHref: string;
    onDeleted: (id: string) => void;
}) {
    const [isPending, startTransition] = useTransition();
    const [deleted, setDeleted] = useState(false);

    const name = op.operator_name || op.driver_name || 'Unknown Operator';
    const location = op.base_municipality || op.base_town || op.municipality || '—';
    const detail = op.boat_type || op.vehicle_type || op.service_type || '—';

    const handleDelete = () => {
        if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
        startTransition(async () => {
            const res = await adminDeleteOperator(table, op.id);
            if (res.success) {
                setDeleted(true);
                setTimeout(() => onDeleted(op.id), 500);
            } else {
                alert(res.error || 'Failed to delete operator.');
            }
        });
    };

    if (deleted) {
        return (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 flex items-center gap-3 opacity-50 animate-out fade-out">
                <span className="material-symbols-outlined text-slate-400">delete</span>
                <p className="text-sm text-slate-400 font-bold">Operator deleted.</p>
            </div>
        );
    }

    return (
        <div className={`rounded-2xl border border-slate-100 bg-white p-4 flex items-center justify-between gap-4 shadow-sm hover:shadow-md transition-all ${isPending ? 'opacity-50 pointer-events-none' : ''}`}>
            <div className="flex-1 min-w-0">
                <p className="font-black text-slate-800 text-sm truncate">{name}</p>
                <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                    <span className="material-symbols-outlined text-[11px]">location_on</span>
                    <span>{location}</span>
                    {detail !== '—' && (
                        <>
                            <span className="w-1 h-1 rounded-full bg-slate-300 inline-block" />
                            <span>{detail}</span>
                        </>
                    )}
                </div>
                {op.contact_number && (
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">{op.contact_number}</p>
                )}
            </div>
            <div className="flex items-center gap-2 shrink-0">
                <Link
                    href={editHref}
                    className="flex items-center gap-1 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-700 text-xs font-black uppercase tracking-wider hover:bg-slate-100 transition-colors"
                >
                    <span className="material-symbols-outlined text-sm">edit</span>
                    Edit
                </Link>
                <button
                    onClick={handleDelete}
                    disabled={isPending}
                    className="flex items-center gap-1 px-3 py-2 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs font-black uppercase tracking-wider hover:bg-red-100 transition-colors"
                >
                    <span className="material-symbols-outlined text-sm">delete</span>
                    Delete
                </button>
            </div>
        </div>
    );
}

export default function OperatorManagementPanel({
    operators,
    table,
    label,
    icon,
}: {
    operators: Operator[];
    table: TableName;
    label: string;
    icon: string;
}) {
    const [list, setList] = useState(operators);

    const handleDeleted = (id: string) => {
        setList(prev => prev.filter(op => op.id !== id));
    };

    if (list.length === 0) {
        return (
            <div className="text-center py-10">
                <span className="material-symbols-outlined text-slate-300 text-4xl">{icon}</span>
                <p className="text-slate-400 font-bold text-sm mt-2">No {label} registered yet.</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-3">
            {list.map(op => (
                <OperatorCard
                    key={op.id}
                    op={op}
                    table={table}
                    editHref={table === 'boat_services' ? `/island-hopping/list?id=${op.id}` : `/post-commute-or-delivery-listing?id=${op.id}`}
                    onDeleted={handleDeleted}
                />
            ))}
        </div>
    );
}
