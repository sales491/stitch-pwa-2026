'use client';

import { useState, useTransition, useRef } from 'react';
import { updateDisplayLabel } from '@/app/actions/spotlight';

type Props = {
    label: string;
    monthYear: string;
    isAdmin: boolean;
};

export default function MonthPill({ label, monthYear, isAdmin }: Props) {
    const [editing, setEditing] = useState(false);
    const [value, setValue] = useState(label);
    const [saved, setSaved] = useState(false);
    const [isPending, startTransition] = useTransition();
    const inputRef = useRef<HTMLInputElement>(null);

    function openEdit() {
        if (!isAdmin) return;
        setEditing(true);
        setTimeout(() => inputRef.current?.select(), 50);
    }

    function handleSave() {
        startTransition(async () => {
            await updateDisplayLabel(monthYear, value.trim() || label);
            setEditing(false);
            setSaved(true);
            setTimeout(() => setSaved(false), 2000);
        });
    }

    function handleKeyDown(e: React.KeyboardEvent) {
        if (e.key === 'Enter') handleSave();
        if (e.key === 'Escape') { setEditing(false); setValue(label); }
    }

    return (
        <div
            className="absolute top-1.5 right-4 z-10 flex items-center gap-1.5 bg-moriones-red text-white rounded-xl px-3 py-1.5 shadow-lg shadow-moriones-red/40"
            style={{ cursor: isAdmin ? 'pointer' : 'default' }}
        >
            {editing ? (
                <>
                    <input
                        ref={inputRef}
                        value={value}
                        onChange={e => setValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        onBlur={handleSave}
                        autoFocus
                        className="bg-transparent text-white text-[10px] font-black uppercase tracking-widest outline-none w-28 placeholder:text-white/50"
                        placeholder="e.g. March 2026"
                        disabled={isPending}
                    />
                    <span className="material-symbols-outlined text-[14px] text-white/70">edit</span>
                </>
            ) : (
                <>
                    <span
                        className="text-[10px] font-black uppercase tracking-widest"
                        onClick={openEdit}
                    >
                        {saved ? '✓ Saved' : value}
                    </span>
                    <span
                        className="material-symbols-outlined text-[16px]"
                        onClick={openEdit}
                    >
                        {isAdmin ? 'edit_calendar' : 'event'}
                    </span>
                </>
            )}
        </div>
    );
}
