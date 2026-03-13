'use client';

import { useState, useTransition } from 'react';
import { adminMarkContactMessage } from '@/app/actions/admin';

type Message = {
    id: string;
    name: string;
    email: string;
    subject: string;
    message: string;
    is_read: boolean;
    created_at: string;
};

function MessageCard({ msg }: { msg: Message }) {
    const [isRead, setIsRead] = useState(msg.is_read);
    const [expanded, setExpanded] = useState(false);
    const [isPending, startTransition] = useTransition();

    const toggleRead = () => {
        const nextValue = !isRead;
        startTransition(async () => {
            const res = await adminMarkContactMessage(msg.id, nextValue);
            if (res.success) {
                setIsRead(nextValue);
            }
        });
    };

    return (
        <div className={`rounded-2xl border p-4 transition-all ${isRead ? 'bg-slate-50 border-slate-100' : 'bg-violet-50/60 border-violet-200'}`}>
            <div className="flex items-start justify-between gap-3 mb-1">
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-black text-slate-800 truncate">{msg.name}</p>
                    <p className="text-[11px] text-slate-400 truncate">{msg.email}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                    {!isRead && <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />}
                    <span className="text-[10px] text-slate-400 font-bold whitespace-nowrap">
                        {new Date(msg.created_at).toLocaleDateString('en-PH', { month: 'short', day: 'numeric' })}
                    </span>
                </div>
            </div>

            <p className="text-[11px] font-black uppercase tracking-widest text-violet-600 mb-1">{msg.subject}</p>

            <p className={`text-[13px] text-slate-600 leading-relaxed ${expanded ? 'whitespace-pre-wrap' : 'line-clamp-2'}`}>
                {msg.message}
            </p>

            <div className="flex items-center gap-3 mt-3 pt-3 border-t border-slate-100">
                <button
                    onClick={() => setExpanded(v => !v)}
                    className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-700 transition-colors flex items-center gap-1"
                >
                    <span className="material-symbols-outlined text-sm">{expanded ? 'expand_less' : 'expand_more'}</span>
                    {expanded ? 'Collapse' : 'Read More'}
                </button>
                <button
                    onClick={toggleRead}
                    disabled={isPending}
                    className={`ml-auto text-[10px] font-black uppercase tracking-widest transition-colors flex items-center gap-1 px-2.5 py-1 rounded-lg border ${
                        isRead
                            ? 'border-slate-200 text-slate-400 hover:text-slate-700 hover:border-slate-300'
                            : 'border-violet-200 text-violet-600 hover:bg-violet-100'
                    } ${isPending ? 'opacity-50 pointer-events-none' : ''}`}
                >
                    <span className="material-symbols-outlined text-sm">{isRead ? 'mark_email_unread' : 'mark_email_read'}</span>
                    {isRead ? 'Mark Unread' : 'Mark Read'}
                </button>
            </div>
        </div>
    );
}

export default function ContactInbox({ messages }: { messages: Message[] }) {
    const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

    const filtered = messages.filter(m => {
        if (filter === 'unread') return !m.is_read;
        if (filter === 'read') return m.is_read;
        return true;
    });

    if (messages.length === 0) {
        return <p className="text-sm text-slate-400 font-medium text-center py-8">No messages yet.</p>;
    }

    return (
        <div>
            {/* Filter tabs */}
            <div className="flex gap-2 mb-4">
                {(['all', 'unread', 'read'] as const).map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-colors ${
                            filter === f
                                ? 'bg-violet-600 text-white'
                                : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                        }`}
                    >
                        {f} {f === 'unread' ? `(${messages.filter(m => !m.is_read).length})` : f === 'read' ? `(${messages.filter(m => m.is_read).length})` : `(${messages.length})`}
                    </button>
                ))}
            </div>

            <div className="flex flex-col gap-3">
                {filtered.length === 0 ? (
                    <p className="text-sm text-slate-400 text-center py-6">No {filter} messages.</p>
                ) : (
                    filtered.map(msg => <MessageCard key={msg.id} msg={msg} />)
                )}
            </div>
        </div>
    );
}
