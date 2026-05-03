'use client';

import { useState, useTransition } from 'react';
import Link from 'next/link';
import { resolveFlag } from '@/app/actions/listings';
import PageHeader from '@/components/PageHeader';
import {
    adminApproveBusiness,
    adminRejectBusiness,
    adminApproveClaimRequest,
    adminRejectClaimRequest,
} from '@/app/actions/admin';

// ─── Types ───────────────────────────────────────────────────────────────────

type CommunityFlag = {
    id: string; content_type: string; content_id: string;
    reason: string; details: string; created_at: string;
    resolved: boolean | null;
    reporter?: { full_name: string | null; avatar_url: string | null } | null;
};

type PendingBusiness = {
    id: string; name: string; category: string; town: string;
    description: string | null; created_at: string; owner_id: string;
};

type ClaimRequest = {
    id: string; business_id: string; requester_name: string;
    requester_email: string; requester_phone: string;
    message: string | null; created_at: string; status: string;
    business?: { name: string; category: string; town: string } | null;
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function timeAgo(dateStr: string) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
}

const CONTENT_TYPE_META: Record<string, { label: string; icon: string; color: string; path?: (id: string) => string }> = {
    listing:  { label: 'Marketplace Listing',  icon: 'sell',       color: 'text-moriones-red',  path: (id) => `/marketplace/${id}` },
    commute:  { label: 'Transport Operator',    icon: 'commute',    color: 'text-blue-500',       path: () => `/commuter-delivery-hub` },
    post:     { label: 'Community Post',        icon: 'forum',      color: 'text-violet-500',     path: () => `/community` },
    comment:  { label: 'Comment',               icon: 'chat_bubble',color: 'text-slate-500' },
    review:   { label: 'Business Review',       icon: 'star',       color: 'text-amber-500' },
    job:      { label: 'Job Listing',           icon: 'work',       color: 'text-emerald-500',    path: (id) => `/jobs/${id}` },
    business: { label: 'Business',              icon: 'storefront', color: 'text-orange-500',     path: (id) => `/directory/${id}` },
};

// ─── Approve/Reject button pair ───────────────────────────────────────────────

function ActionButtons({ onApprove, onReject, isPending }: {
    onApprove: () => void; onReject: () => void; isPending: boolean;
}) {
    return (
        <div className="flex items-center gap-3">
            <button onClick={onReject} disabled={isPending}
                className="w-11 h-11 flex items-center justify-center rounded-full bg-white dark:bg-zinc-800 text-red-500 hover:bg-red-50 border border-slate-200 dark:border-zinc-700 shadow-sm transition-all active:scale-90"
                title="Reject">
                {isPending ? <div className="w-4 h-4 border-2 border-slate-300 border-t-transparent rounded-full animate-spin" /> : <span className="material-symbols-outlined">close</span>}
            </button>
            <button onClick={onApprove} disabled={isPending}
                className="w-11 h-11 flex items-center justify-center rounded-full bg-teal-500 text-white hover:bg-teal-600 shadow-lg shadow-teal-500/20 transition-all active:scale-90"
                title="Approve">
                {isPending ? <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" /> : <span className="material-symbols-outlined">check</span>}
            </button>
        </div>
    );
}

// ─── Community Flag Card ──────────────────────────────────────────────────────

function FlagCard({ flag, onDismiss }: { flag: CommunityFlag; onDismiss: () => void }) {
    const [isPending, startTransition] = useTransition();
    const [done, setDone] = useState(false);
    const meta = CONTENT_TYPE_META[flag.content_type] ?? { label: flag.content_type, icon: 'flag', color: 'text-slate-500' };

    if (done) return <DoneCard label="Flag dismissed" />;

    return (
        <div className={`bg-white dark:bg-zinc-900 rounded-[1.75rem] border border-red-100 dark:border-red-900/30 shadow-sm overflow-hidden ${isPending ? 'opacity-60 pointer-events-none' : ''}`}>
            <div className="flex items-center gap-3 px-5 pt-5 pb-3">
                <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center shrink-0">
                    <span className={`material-symbols-outlined ${meta.color}`} style={{ fontVariationSettings: '"FILL" 1' }}>{meta.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                    <p className="font-black text-sm text-slate-800 dark:text-white">{meta.label} Reported</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">by {flag.reporter?.full_name || 'Anonymous'} · {timeAgo(flag.created_at)}</p>
                </div>
                <span className="bg-red-50 dark:bg-red-900/20 text-red-600 text-[10px] font-black px-2.5 py-1 rounded-2xl uppercase tracking-wider shrink-0">Flagged</span>
            </div>
            <div className="px-5 pb-4 space-y-1">
                <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest">{flag.reason}</p>
                <p className="text-sm text-slate-600 dark:text-zinc-300 leading-relaxed">{flag.details}</p>
                <p className="text-[10px] font-mono text-slate-300 dark:text-zinc-600 truncate">ID: {flag.content_id}</p>
            </div>
            <div className="flex items-center justify-between px-5 py-3 bg-slate-50 dark:bg-zinc-800/50 border-t border-slate-100 dark:border-white/5">
                {meta.path ? (
                    <Link href={meta.path(flag.content_id)} target="_blank" className="text-[11px] font-black text-slate-500 hover:text-slate-800 uppercase tracking-widest flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-base">open_in_new</span>View
                    </Link>
                ) : <div />}
                <button onClick={() => startTransition(async () => { await resolveFlag(flag.id); setDone(true); onDismiss(); })}
                    disabled={isPending}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white dark:bg-zinc-800 border border-slate-200 text-[11px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-800 transition-all active:scale-95 shadow-sm">
                    <span className="material-symbols-outlined text-[14px]">check</span>Dismiss
                </button>
            </div>
        </div>
    );
}

// ─── Pending Business Card ────────────────────────────────────────────────────

function BusinessCard({ biz, onAction }: { biz: PendingBusiness; onAction: () => void }) {
    const [isPending, startTransition] = useTransition();
    const [done, setDone] = useState<'approved' | 'rejected' | null>(null);

    if (done) return <DoneCard label={done === 'approved' ? 'Business approved & verified' : 'Business rejected'} approved={done === 'approved'} />;

    return (
        <div className={`bg-white dark:bg-zinc-900 rounded-[1.75rem] border border-slate-100 dark:border-white/5 shadow-sm overflow-hidden ${isPending ? 'opacity-60 pointer-events-none' : ''}`}>
            <div className="flex items-center gap-3 px-5 pt-5 pb-3">
                <div className="w-10 h-10 rounded-xl bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-orange-500" style={{ fontVariationSettings: '"FILL" 1' }}>storefront</span>
                </div>
                <div className="flex-1 min-w-0">
                    <p className="font-black text-sm text-slate-800 dark:text-white truncate">{biz.name}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{biz.category} · {biz.town} · {timeAgo(biz.created_at)}</p>
                </div>
                <span className="bg-amber-50 text-amber-700 text-[10px] font-black px-2.5 py-1 rounded-2xl uppercase tracking-wider shrink-0">New</span>
            </div>
            {biz.description && <p className="px-5 pb-4 text-sm text-slate-500 dark:text-zinc-400 line-clamp-2">{biz.description}</p>}
            <div className="flex items-center justify-between px-5 py-3 bg-slate-50 dark:bg-zinc-800/50 border-t border-slate-100 dark:border-white/5">
                <Link href={`/directory/${biz.id}`} target="_blank" className="text-[11px] font-black text-slate-500 hover:text-slate-800 uppercase tracking-widest flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-base">open_in_new</span>Preview
                </Link>
                <ActionButtons
                    isPending={isPending}
                    onApprove={() => startTransition(async () => { 
                        const res = await adminApproveBusiness(biz.id); 
                        if (res.success) {
                            setDone('approved'); 
                            onAction(); 
                        } else {
                            alert(`Approval failed: ${res.error}`);
                        }
                    })}
                    onReject={() => startTransition(async () => { 
                        const res = await adminRejectBusiness(biz.id); 
                        if (res.success) {
                            setDone('rejected'); 
                            onAction(); 
                        } else {
                            alert(`Rejection failed: ${res.error}`);
                        }
                    })}
                />
            </div>
        </div>
    );
}

// ─── Claim Request Card ───────────────────────────────────────────────────────

function ClaimCard({ claim, onAction }: { claim: ClaimRequest; onAction: () => void }) {
    const [isPending, startTransition] = useTransition();
    const [done, setDone] = useState<'approved' | 'rejected' | null>(null);

    let displayMessage = claim.message;
    if (claim.message) {
        try {
            const parsed = JSON.parse(claim.message);
            if (parsed.original_message !== undefined) {
                displayMessage = parsed.original_message;
            }
        } catch {}
    }

    if (done) return <DoneCard label={done === 'approved' ? 'Claim approved — ownership transferred' : 'Claim rejected'} approved={done === 'approved'} />;

    return (
        <div className={`bg-white dark:bg-zinc-900 rounded-[1.75rem] border border-slate-100 dark:border-white/5 shadow-sm overflow-hidden ${isPending ? 'opacity-60 pointer-events-none' : ''}`}>
            <div className="flex items-center gap-3 px-5 pt-5 pb-3">
                <div className="w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-900/20 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-teal-600" style={{ fontVariationSettings: '"FILL" 1' }}>verified_user</span>
                </div>
                <div className="flex-1 min-w-0">
                    <p className="font-black text-sm text-slate-800 dark:text-white truncate">Claim: {claim.business?.name ?? claim.business_id}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{claim.business?.category} · {claim.business?.town} · {timeAgo(claim.created_at)}</p>
                </div>
                <span className="bg-teal-50 text-teal-700 text-[10px] font-black px-2.5 py-1 rounded-2xl uppercase tracking-wider shrink-0">Claim</span>
            </div>
            <div className="px-5 pb-4 space-y-1.5">
                <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest">Requester</p>
                <p className="text-sm text-slate-800 dark:text-white font-semibold">{claim.requester_name}</p>
                <p className="text-xs text-slate-500">{claim.requester_email} · +63{claim.requester_phone}</p>
                {displayMessage && <p className="text-sm text-slate-500 dark:text-zinc-400 italic leading-relaxed">"{displayMessage}"</p>}
            </div>
            <div className="flex items-center justify-between px-5 py-3 bg-slate-50 dark:bg-zinc-800/50 border-t border-slate-100 dark:border-white/5">
                <Link href={`/directory/${claim.business_id}`} target="_blank" className="text-[11px] font-black text-slate-500 hover:text-slate-800 uppercase tracking-widest flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-base">open_in_new</span>View Biz
                </Link>
                <ActionButtons
                    isPending={isPending}
                    onApprove={() => startTransition(async () => {
                        const res = await adminApproveClaimRequest(claim.id, claim.business_id);
                        if (res.success) {
                            setDone('approved'); 
                            onAction();
                        } else {
                            alert(`Approval failed: ${res.error}`);
                        }
                    })}
                    onReject={() => startTransition(async () => { 
                        const res = await adminRejectClaimRequest(claim.id); 
                        if (res.success) {
                            setDone('rejected'); 
                            onAction();
                        } else {
                            alert(`Rejection failed: ${res.error}`);
                        }
                    })}
                />
            </div>
        </div>
    );
}

// ─── Done state ───────────────────────────────────────────────────────────────

function DoneCard({ label, approved = false }: { label: string; approved?: boolean }) {
    return (
        <div className={`rounded-[1.75rem] border p-5 flex items-center gap-3 animate-in fade-in ${approved ? 'bg-teal-50 border-teal-200' : 'bg-slate-50 border-slate-200'}`}>
            <span className={`material-symbols-outlined text-2xl ${approved ? 'text-teal-500' : 'text-slate-400'}`}>{approved ? 'check_circle' : 'cancel'}</span>
            <p className={`font-black text-sm uppercase tracking-widest ${approved ? 'text-teal-600' : 'text-slate-400'}`}>{label}</p>
        </div>
    );
}

function EmptyState({ message }: { message: string }) {
    return (
        <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 bg-white dark:bg-zinc-800 rounded-full flex items-center justify-center mb-4 shadow-sm border border-slate-100 dark:border-zinc-700">
                <span className="material-symbols-outlined text-teal-500 text-4xl">check_circle</span>
            </div>
            <h3 className="font-black text-slate-800 dark:text-white uppercase tracking-tight">All clear!</h3>
            <p className="text-slate-500 text-[11px] font-black uppercase tracking-widest mt-1">{message}</p>
        </div>
    );
}

// ─── Main Component ───────────────────────────────────────────────────────────

type Tab = 'flags' | 'businesses' | 'claims';

export default function ModerationQueue({
    communityFlags: initialFlags = [],
    pendingBusinesses: initialBiz = [],
    claimRequests: initialClaims = [],
    listings: _unused = [],
}: {
    communityFlags?: CommunityFlag[];
    pendingBusinesses?: PendingBusiness[];
    claimRequests?: ClaimRequest[];
    listings?: any[];
}) {
    const [flags, setFlags] = useState(initialFlags);
    const [bizList, setBizList] = useState(initialBiz);
    const [claims, setClaims] = useState(initialClaims);
    const [tab, setTab] = useState<Tab>(
        initialBiz.length > 0 ? 'businesses' : initialClaims.length > 0 ? 'claims' : 'flags'
    );

    const totalCount = flags.length + bizList.length + claims.length;

    const tabs: { key: Tab; icon: string; label: string; count: number }[] = [
        { key: 'flags',      icon: 'flag',           label: 'Reports',   count: flags.length },
        { key: 'businesses', icon: 'storefront',      label: 'New Biz',   count: bizList.length },
        { key: 'claims',     icon: 'verified_user',   label: 'Claims',    count: claims.length },
    ];

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-zinc-950">
            <PageHeader
                title="Moderation"
                subtitle={`${totalCount} item${totalCount !== 1 ? 's' : ''} need attention`}
                rightAction={
                    totalCount > 0 ? (
                        <span className="bg-moriones-red text-white text-sm font-black w-7 h-7 rounded-full flex items-center justify-center">{totalCount}</span>
                    ) : undefined
                }
            >
                {/* Tabs */}
                <div className="max-w-2xl mx-auto flex gap-2 px-4 pb-3">
                    {tabs.map(t => (
                        <button key={t.key} onClick={() => setTab(t.key)}
                            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all border ${tab === t.key ? 'bg-moriones-red text-white border-moriones-red' : 'bg-slate-100 dark:bg-zinc-800 border-transparent text-slate-500'}`}>
                            <span className="material-symbols-outlined text-[14px]">{t.icon}</span>
                            {t.label}
                            {t.count > 0 && (
                                <span className={`ml-0.5 px-1.5 py-0.5 rounded-full text-[9px] font-black ${tab === t.key ? 'bg-white/30 text-white' : 'bg-moriones-red text-white'}`}>{t.count}</span>
                            )}
                        </button>
                    ))}
                </div>
            </PageHeader>

            <main className="max-w-2xl mx-auto px-4 py-6 pb-24 space-y-4">
                {tab === 'flags' && (
                    flags.length === 0
                        ? <EmptyState message="No community reports" />
                        : flags.map(f => <FlagCard key={f.id} flag={f} onDismiss={() => setFlags(p => p.filter(x => x.id !== f.id))} />)
                )}
                {tab === 'businesses' && (
                    bizList.length === 0
                        ? <EmptyState message="No pending business profiles" />
                        : bizList.map(b => <BusinessCard key={b.id} biz={b} onAction={() => setBizList(p => p.filter(x => x.id !== b.id))} />)
                )}
                {tab === 'claims' && (
                    claims.length === 0
                        ? <EmptyState message="No pending claim requests" />
                        : claims.map(c => <ClaimCard key={c.id} claim={c} onAction={() => setClaims(p => p.filter(x => x.id !== c.id))} />)
                )}
            </main>
        </div>
    );
}
