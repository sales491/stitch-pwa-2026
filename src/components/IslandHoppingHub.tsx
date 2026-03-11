'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import FlagButton from './FlagButton';
import AdminActions from './AdminActions';
import { formatPhPhoneForLink } from '@/utils/phoneUtils';
import { createClient } from '@/utils/supabase/client';
import { useAuth } from './AuthProvider';

export type BoatType = 'Outrigger Bangka' | 'Motorboat' | 'Speedboat' | 'Passenger Ferry';
export type BoatServiceType = 'Island Hopping' | 'Point-to-Point' | 'Charter' | 'All';

export interface BoatOperator {
    id: string;
    operator_name: string;
    boat_type: BoatType;
    service_type: BoatServiceType;
    destinations: string[];
    base_municipality: string;
    price_per_head: number;
    charter_rate?: number;
    charter_avail: boolean;
    charter_details?: { min_pax?: number; notes?: string };
    schedule?: { day: string; time: string }[];
    contact_number?: string;
    contact_details?: { fb_username?: string; email?: string };
    images?: string[];
    notes?: string;
    is_available: boolean;
    provider_id?: string;
    vouchCount?: number;
    hasVouched?: boolean;
    trust_score?: number;
}

const BOAT_META: Record<string, { emoji: string; label: string }> = {
    'Outrigger Bangka': { emoji: '🚤', label: 'Bangka' },
    'Motorboat': { emoji: '⛵', label: 'Motorboat' },
    'Speedboat': { emoji: '💨', label: 'Speedboat' },
    'Passenger Ferry': { emoji: '🛳️', label: 'Ferry' },
};

const SERVICE_META: Record<string, { label: string; icon: string }> = {
    'Island Hopping': { label: 'Island Hopping', icon: 'mode_of_travel' },
    'Point-to-Point': { label: 'Point-to-Point', icon: 'swap_horiz' },
    'Charter': { label: 'Charter', icon: 'anchor' },
    'All': { label: 'All Services', icon: 'water' },
};

function BoatOperatorCard({ op }: { op: BoatOperator }) {
    const { user } = useAuth();
    const [isAvailable, setIsAvailable] = useState(op.is_available);
    const [vouchCount, setVouchCount] = useState(op.vouchCount || 0);
    const [hasVouched, setHasVouched] = useState(op.hasVouched || false);
    const [isToggling, setIsToggling] = useState(false);
    const [isVouching, setIsVouching] = useState(false);
    const bm = BOAT_META[op.boat_type] || { emoji: '🚤', label: op.boat_type };
    const svc = SERVICE_META[op.service_type] || { label: op.service_type, icon: 'water' };
    const isOwner = user?.id === op.provider_id;

    const toggleAvailability = async () => {
        if (!isOwner) return;
        setIsToggling(true);
        const supabase = createClient();
        try {
            const nextStatus = !isAvailable;
            const { error } = await supabase.from('boat_services').update({ is_available: nextStatus }).eq('id', op.id);
            if (error) throw error;
            setIsAvailable(nextStatus);
        } catch (err: any) {
            alert(err.message || 'Failed to update status');
        } finally {
            setIsToggling(false);
        }
    };

    const toggleVouch = async () => {
        const supabase = createClient();
        const { data: { user: cu } } = await supabase.auth.getUser();
        if (!cu) { alert('Sign in to vouch for this operator.'); return; }
        setIsVouching(true);
        try {
            if (hasVouched) {
                await supabase.from('boat_vouches').delete().eq('user_id', cu.id).eq('service_id', op.id);
                setVouchCount(p => Math.max(0, p - 1)); setHasVouched(false);
            } else {
                await supabase.from('boat_vouches').insert({ user_id: cu.id, service_id: op.id });
                setVouchCount(p => p + 1); setHasVouched(true);
            }
        } catch (err: any) {
            if (err.code !== '23505') alert('Failed to update vouch.');
        } finally { setIsVouching(false); }
    };

    return (
        <div className={`relative bg-white dark:bg-zinc-900 rounded-[2.5rem] overflow-hidden border transition-all duration-300 ${isOwner ? 'border-cyan-400/30 shadow-xl shadow-cyan-500/5 ring-1 ring-cyan-400/10' : 'border-slate-100 dark:border-zinc-800 shadow-sm'}`}>
            {isOwner && (
                <div className="absolute top-4 left-4 z-40 bg-cyan-600 text-white text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest shadow-lg flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[12px]">person</span>Your Listing
                </div>
            )}
            <div className="relative">
                <div className="h-3 bg-gradient-to-r from-cyan-500 to-blue-500" />
                <div className="absolute top-3 right-3">
                    <button onClick={toggleAvailability} disabled={isToggling || !isOwner}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider shadow-sm border transition-all active:scale-95 ${isAvailable ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400' : 'bg-slate-50 dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 text-slate-500 dark:text-slate-400'} ${isToggling ? 'opacity-50 cursor-wait' : ''} ${!isOwner ? 'pointer-events-none' : ''}`}>
                        <span className={`w-2 h-2 rounded-full ${isAvailable ? 'bg-emerald-500 animate-pulse' : 'bg-slate-400'}`} />
                        {isAvailable ? 'Active' : 'Offline'}
                    </button>
                </div>
                <div className="p-4 flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-slate-50 dark:bg-zinc-800 flex items-center justify-center shrink-0 border border-slate-100 dark:border-zinc-700 overflow-hidden">
                        {op.images && op.images.length > 0 ? <img src={op.images[0]} className="w-full h-full object-cover" alt={op.operator_name} /> : <span className="text-3xl">{bm.emoji}</span>}
                    </div>
                    <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-slate-900 dark:text-white text-base truncate pr-20">{op.operator_name}</h3>
                        <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-[10px] bg-cyan-500/10 text-cyan-700 dark:text-cyan-400 font-bold px-1.5 py-0.5 rounded uppercase tracking-tight">{bm.label}</span>
                            <span className="text-[10px] bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-slate-400 font-bold px-1.5 py-0.5 rounded uppercase tracking-tight flex items-center gap-1">
                                <span className="material-symbols-outlined text-[12px]">{svc.icon}</span>{svc.label}
                            </span>
                        </div>
                        <p className="text-[10px] text-slate-400 font-medium mt-0.5 flex items-center gap-1">
                            <span className="material-symbols-outlined text-[11px]">anchor</span>{op.base_municipality}
                        </p>
                    </div>
                </div>
            </div>

            <div className="px-4 pb-4 space-y-3">
                <div className="flex items-center justify-between">
                    <div>
                        <span className="text-cyan-600 dark:text-cyan-400 font-black text-lg">₱{op.price_per_head}</span>
                        <span className="text-[11px] text-slate-400 font-medium"> / head</span>
                        {op.charter_avail && op.charter_rate && <div className="text-[10px] text-slate-500">Charter: ₱{op.charter_rate}</div>}
                    </div>
                    <div className="flex items-center gap-2">
                        <button onClick={toggleVouch} disabled={isVouching}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-black uppercase tracking-wide transition-all active:scale-95 border shadow-sm ${hasVouched ? 'bg-sky-500 border-sky-500 text-white' : 'bg-white dark:bg-zinc-800 border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-slate-300 hover:border-sky-300 hover:text-sky-600'} ${isVouching ? 'opacity-50 animate-pulse' : ''}`}>
                            <div className="relative">
                                <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: hasVouched ? '"FILL" 1' : '"FILL" 0' }}>thumb_up</span>
                                {vouchCount > 0 && <span className={`absolute -top-2 -right-2 min-w-[16px] h-4 px-0.5 rounded-full text-[9px] font-black flex items-center justify-center leading-none ${hasVouched ? 'bg-white text-sky-600' : 'bg-sky-500 text-white'}`}>{vouchCount}</span>}
                            </div>
                            {hasVouched ? 'Vouched' : 'Vouch'}
                        </button>
                        <div className={`flex items-center gap-1 p-1 rounded-2xl transition-all ${isOwner ? 'bg-cyan-500/5 ring-1 ring-cyan-500/20 pr-2' : ''}`}>
                            <AdminActions contentType="boat" contentId={op.id} authorId={op.provider_id} variant="icon" className={`${isOwner ? 'scale-90' : 'scale-75'} origin-right`} />
                            {isOwner && <span className="text-[10px] font-black text-cyan-600 uppercase tracking-tight -ml-1">Manage</span>}
                        </div>
                        <FlagButton contentType="commute" contentId={op.id.toString()} />
                    </div>
                </div>

                {op.destinations && op.destinations.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                        {op.destinations.map(d => (
                            <span key={d} className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-600 dark:text-slate-400 bg-cyan-50 dark:bg-cyan-900/10 px-2 py-1 rounded-md border border-cyan-100 dark:border-cyan-900/30">
                                <span className="material-symbols-outlined text-[12px] text-cyan-500">location_on</span>{d}
                            </span>
                        ))}
                    </div>
                )}

                {op.schedule && op.schedule.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                        {op.schedule.map((s, i) => <span key={i} className="px-2 py-1 bg-white dark:bg-zinc-800 border border-border-main rounded-lg text-[10px] font-bold text-text-main">{s.day} @ {s.time}</span>)}
                    </div>
                )}

                {op.charter_avail && (
                    <div className="flex items-center gap-2 py-2 px-3 bg-cyan-500/5 dark:bg-cyan-900/10 rounded-xl border border-cyan-200/50 dark:border-cyan-900/30">
                        <span className="material-symbols-outlined text-[18px] text-cyan-600">anchor</span>
                        <div>
                            <span className="text-[11px] font-bold text-cyan-700 dark:text-cyan-400 uppercase tracking-wide">Private Charter Available</span>
                            {op.charter_details?.min_pax && <span className="text-[10px] text-slate-400 block">Min. {op.charter_details.min_pax} pax</span>}
                        </div>
                    </div>
                )}

                {op.notes && <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-zinc-800/50 rounded-xl px-3 py-2">{op.notes}</p>}

                <div className="flex gap-2 pt-2">
                    {op.contact_number && (
                        <a href={`tel:${formatPhPhoneForLink(op.contact_number)}`} className="flex-1 flex items-center justify-center gap-1.5 bg-cyan-600 hover:bg-cyan-700 text-white font-black py-2.5 rounded-xl text-[11px] transition-all active:scale-95 shadow-md shadow-cyan-600/20">
                            <span className="material-symbols-outlined text-[16px]">call</span>Call
                        </a>
                    )}
                    {op.contact_number && (
                        <a href={`sms:${formatPhPhoneForLink(op.contact_number)}`} className="flex-1 flex items-center justify-center gap-1.5 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-slate-300 font-black py-2.5 rounded-xl text-[11px] transition-all active:scale-95 border border-slate-200 dark:border-zinc-700">
                            <span className="material-symbols-outlined text-[16px]">sms</span>Text
                        </a>
                    )}
                    {op.contact_details?.fb_username && (
                        <a href={op.contact_details.fb_username.includes('facebook.com') ? op.contact_details.fb_username : `https://m.me/${op.contact_details.fb_username}`} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-1.5 bg-[#0084FF] hover:bg-[#0074E0] text-white font-black py-2.5 rounded-xl text-[11px] transition-all active:scale-95">
                            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.477 2 2 6.145 2 11.259c0 2.88 1.424 5.45 3.655 7.13.19.14.304.371.31.62l.063 1.937a.5.5 0 00.703.44l2.16-.952a.527.527 0 01.354-.032c.904.247 1.863.38 2.855.38 5.523 0 10-4.145 10-9.259S17.523 2 12 2z" /></svg>
                            Messenger
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function IslandHoppingHub() {
    const [boatFilter, setBoatFilter] = useState<string>('all');
    const [serviceFilter, setServiceFilter] = useState<string>('all');
    const [municipalityFilter, setMunicipalityFilter] = useState<string>('All');
    const [operators, setOperators] = useState<BoatOperator[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    React.useEffect(() => {
        async function fetchOperators() {
            setLoading(true);
            const { data: { user } } = await supabase.auth.getUser();
            const { data: services } = await supabase.from('boat_services').select(`*, provider:profiles!boat_services_provider_id_fkey(trust_score, is_verified, phone)`);
            if (services) {
                const { data: vouchesData } = await supabase.from('boat_vouches').select('service_id');
                const counts: Record<string, number> = {};
                vouchesData?.forEach(v => { counts[v.service_id] = (counts[v.service_id] || 0) + 1; });
                let userVouches = new Set<string>();
                if (user) {
                    const { data: uv } = await supabase.from('boat_vouches').select('service_id').eq('user_id', user.id);
                    uv?.forEach(v => userVouches.add(v.service_id));
                }
                const mapped: BoatOperator[] = services
                    .filter((d: any) => d.is_approved === true || d.provider_id === user?.id)
                    .map((d: any) => ({
                        id: d.id, operator_name: d.operator_name, boat_type: d.boat_type, service_type: d.service_type,
                        destinations: d.destinations || [], base_municipality: d.base_municipality,
                        price_per_head: d.price_per_head || 0, charter_rate: d.charter_rate, charter_avail: d.charter_avail,
                        charter_details: d.charter_details, schedule: d.schedule,
                        contact_number: d.contact_number || d.provider?.phone || '', contact_details: d.contact_details,
                        images: d.images, notes: d.notes, is_available: d.is_available, provider_id: d.provider_id,
                        vouchCount: counts[d.id] || 0, hasVouched: userVouches.has(d.id), trust_score: d.provider?.trust_score ?? 0,
                    }))
                    .sort((a, b) => (b.trust_score ?? 0) - (a.trust_score ?? 0));
                setOperators(mapped);
            }
            setLoading(false);
        }
        fetchOperators();
    }, []);

    const municipalities = ['All', 'Boac', 'Buenavista', 'Gasan', 'Mogpog', 'Sta. Cruz', 'Torrijos'];
    const filtered = operators.filter(op => {
        const boatMatch = boatFilter === 'all' || op.boat_type === boatFilter;
        const svcMatch = serviceFilter === 'all' || op.service_type === serviceFilter || op.service_type === 'All';
        const munMatch = municipalityFilter === 'All' || op.base_municipality === municipalityFilter;
        return boatMatch && svcMatch && munMatch;
    });

    return (
        <>
            <div className="relative w-full max-w-md mx-auto bg-slate-50 dark:bg-zinc-950 shadow-2xl">
                <header className="sticky top-0 z-30 flex flex-col bg-white dark:bg-zinc-900 border-b border-slate-100 dark:border-zinc-800">
                    <div className="flex items-center justify-between px-4 pt-4 pb-2">
                        <div className="flex items-center gap-2">
                            <Link href="/" className="text-slate-800 dark:text-slate-200 p-1 rounded-full hover:bg-slate-50 dark:hover:bg-zinc-800 transition-colors flex items-center justify-center">
                                <span className="material-symbols-outlined text-[28px]">arrow_back</span>
                            </Link>
                            <div>
                                <h1 className="text-lg font-bold leading-tight tracking-tight text-cyan-600 dark:text-cyan-400 pl-1">🏝️ Island Hopping</h1>
                                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-black uppercase tracking-widest pl-1">Boat Operators & Tour Services</p>
                            </div>
                        </div>
                        <div className="flex gap-1 bg-slate-100 dark:bg-zinc-800 rounded-xl p-0.5 shadow-inner">
                            {[{ key: 'all', label: 'All' }, { key: 'Island Hopping', label: 'Tours' }, { key: 'Charter', label: 'Charter' }].map(f => (
                                <button key={f.key} onClick={() => setServiceFilter(f.key)}
                                    className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${serviceFilter === f.key ? 'bg-white dark:bg-zinc-700 text-cyan-600 shadow-sm' : 'text-slate-500 dark:text-slate-400'}`}>
                                    {f.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-5 gap-1.5 px-4 pb-3 pt-2">
                        {[{ key: 'all', emoji: '🗂️', label: 'All' }, { key: 'Outrigger Bangka', emoji: '🚤', label: 'Bangka' }, { key: 'Motorboat', emoji: '⛵', label: 'Motor' }, { key: 'Speedboat', emoji: '💨', label: 'Speed' }, { key: 'Passenger Ferry', emoji: '🛳️', label: 'Ferry' }].map(f => (
                            <button key={f.key} onClick={() => setBoatFilter(f.key)}
                                className={`flex flex-col items-center justify-center gap-1 h-14 px-1 rounded-xl text-[10px] font-bold transition-all border ${boatFilter === f.key ? 'bg-cyan-600 border-cyan-600 text-white shadow-lg shadow-cyan-600/20' : 'bg-white dark:bg-zinc-900 border-slate-100 dark:border-zinc-800 text-slate-600 dark:text-slate-400'}`}>
                                <span className="text-xl">{f.emoji}</span>
                                <span className="truncate w-full text-center leading-none">{f.label}</span>
                            </button>
                        ))}
                    </div>

                    <div className="flex justify-between items-center w-full px-4 pb-3 pt-1 border-t border-slate-50 dark:border-zinc-800/50">
                        {municipalities.map(m => (
                            <button key={m} onClick={() => setMunicipalityFilter(m)}
                                className={`flex shrink-0 items-center gap-1 text-[11px] font-bold transition-all relative py-1 ${municipalityFilter === m ? 'text-cyan-600 dark:text-cyan-400' : 'text-slate-400 dark:text-slate-500 hover:text-slate-600'}`}>
                                {m}
                                {municipalityFilter === m && <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-cyan-500 rounded-full" />}
                            </button>
                        ))}
                    </div>
                </header>

                <div className="bg-slate-50/50 dark:bg-zinc-950/50 px-4 pt-3 pb-32 space-y-4">
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest">
                        {filtered.length} operator{filtered.length !== 1 ? 's' : ''} found
                        {municipalityFilter !== 'All' && <span className="ml-2 bg-cyan-500/10 text-cyan-600 px-2 py-0.5 rounded text-[9px]">IN {municipalityFilter}</span>}
                    </p>
                    {loading ? (
                        <div className="space-y-4 animate-pulse">{[1, 2, 3].map(i => <div key={i} className="h-48 bg-white dark:bg-zinc-900 rounded-2xl border border-slate-100 dark:border-zinc-800" />)}</div>
                    ) : filtered.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                            <div className="w-20 h-20 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center mb-4"><span className="text-4xl">🏝️</span></div>
                            <p className="text-slate-500 dark:text-slate-400 font-bold">No boat operators found</p>
                            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Try adjusting filters or add your service!</p>
                        </div>
                    ) : filtered.map(op => <BoatOperatorCard key={op.id} op={op} />)}
                </div>

                <div className="fixed bottom-28 left-1/2 -translate-x-1/2 w-full max-w-md pointer-events-none z-[60] flex justify-end px-4">
                    <Link href="/island-hopping/list" className="flex items-center gap-1 bg-cyan-600 text-white font-black px-3.5 py-2.5 rounded-full shadow-2xl shadow-cyan-600/40 transition-all hover:scale-105 active:scale-95 whitespace-nowrap border-[1.5px] border-white/20 pointer-events-auto">
                        <span className="material-symbols-outlined font-black text-lg">add_circle</span>
                        <span className="text-[9px] tracking-widest uppercase text-white/90">List Your Boat</span>
                    </Link>
                </div>
            </div>
        </>
    );
}
