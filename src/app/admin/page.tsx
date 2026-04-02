'use client';

import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import OperatorManagementPanel from '@/components/OperatorManagementPanel';
import DbHealthWidget from '@/components/DbHealthWidget';
import ContactInbox from '@/components/ContactInbox';
import BackButton from '@/components/BackButton';


export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
    const supabase = await createClient();

    const [
        { data: newUsers },
        { data: newBusinesses },
        { data: recentListings },
        { count: pendingCount },
        { data: contactMessages },
        { data: boatServices },
        { data: transportServices },
        { data: pendingBusinesses },
    ] = await Promise.all([
        supabase.from('profiles').select('id, full_name, avatar_url, role, created_at').order('created_at', { ascending: false }).limit(6),
        supabase.from('business_profiles').select('id, business_name, is_verified, created_at').order('created_at', { ascending: false }).limit(6),
        supabase.from('listings').select('id, title, status, created_at').order('created_at', { ascending: false }).limit(6),
        supabase.from('listings').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('contact_messages').select('id, name, email, subject, message, is_read, created_at').order('created_at', { ascending: false }).limit(20),
        supabase.from('boat_services').select('id, operator_name, boat_type, service_type, base_municipality, contact_number, created_at').order('created_at', { ascending: false }),
        supabase.from('transport_services').select('id, driver_name, vehicle_type, service_type, base_town, contact_number, created_at').order('created_at', { ascending: false }),
        supabase.from('business_profiles').select('id, business_name, business_type, location, gallery_image, created_at').eq('is_verified', false).order('created_at', { ascending: false }),
    ]);

    const unreadMessages = (contactMessages ?? []).filter(m => !m.is_read).length;
    const totalPendingApprovals = (pendingBusinesses ?? []).length;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10 space-y-8 sm:space-y-12 pb-24 font-display">

            {/* ── PENDING APPROVALS — Always at Top ── */}
            <section className={`rounded-[2rem] sm:rounded-[3rem] border p-6 sm:p-8 shadow-sm relative overflow-hidden ${
                totalPendingApprovals > 0
                    ? 'bg-amber-50 border-amber-200'
                    : 'bg-emerald-50 border-emerald-200'
            }`}>
                <div className="absolute top-0 right-0 w-48 h-48 blur-3xl rounded-full pointer-events-none" style={{ background: totalPendingApprovals > 0 ? '#fde68a40' : '#6ee7b740' }} />
                <div className="flex items-center justify-between mb-6 relative z-10">
                    <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                            totalPendingApprovals > 0 ? 'bg-amber-500' : 'bg-emerald-500'
                        }`}>
                            <span className="material-symbols-outlined text-white text-[20px]">
                                {totalPendingApprovals > 0 ? 'pending_actions' : 'task_alt'}
                            </span>
                        </div>
                        <div>
                            <h2 className={`font-black text-sm uppercase tracking-[0.2em] ${
                                totalPendingApprovals > 0 ? 'text-amber-700' : 'text-emerald-700'
                            }`}>Pending Approvals</h2>
                            <p className="text-[10px] font-bold text-slate-500 mt-0.5">
                                {totalPendingApprovals > 0
                                    ? `${totalPendingApprovals} item${totalPendingApprovals !== 1 ? 's' : ''} awaiting your review`
                                    : 'All content is reviewed and approved — great work!'}
                            </p>
                        </div>
                    </div>
                    {totalPendingApprovals > 0 && (
                        <span className="bg-amber-500 text-white text-xs font-black px-3 py-1.5 rounded-full animate-pulse">
                            {totalPendingApprovals} pending
                        </span>
                    )}
                </div>

                {totalPendingApprovals === 0 ? (
                    <div className="flex items-center gap-3 bg-white/70 rounded-2xl px-5 py-4 border border-emerald-200 relative z-10">
                        <span className="material-symbols-outlined text-emerald-500 text-2xl" style={{ fontVariationSettings: '"FILL" 1' }}>check_circle</span>
                        <p className="text-sm font-black text-emerald-700">No items pending approval across all categories.</p>
                    </div>
                ) : (
                    <div className="space-y-6 relative z-10">

                        {/* Business Profiles */}
                        {(pendingBusinesses ?? []).length > 0 && (
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-amber-600 mb-3 flex items-center gap-1.5">
                                    <span className="material-symbols-outlined text-[14px]">storefront</span>
                                    Business Directory Profiles ({pendingBusinesses!.length})
                                </p>
                                <div className="flex flex-col gap-3">
                                    {pendingBusinesses!.map(biz => (
                                        <div key={biz.id} className="bg-white border border-amber-200 rounded-2xl p-4 flex items-center gap-4">
                                            <div className="w-12 h-12 rounded-xl bg-slate-100 shrink-0 overflow-hidden flex items-center justify-center">
                                                {biz.gallery_image
                                                    // eslint-disable-next-line @next/next/no-img-element
                                                    ? <img src={biz.gallery_image} alt={biz.business_name} className="w-full h-full object-cover" />
                                                    : <span className="material-symbols-outlined text-slate-400">store</span>}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-black text-slate-900 text-sm truncate">{biz.business_name}</p>
                                                <p className="text-[11px] text-slate-500 truncate">{biz.business_type} · {biz.location}</p>
                                            </div>
                                            <div className="flex items-center gap-2 shrink-0">
                                                <Link
                                                    href={`/directory/${biz.id}`}
                                                    target="_blank"
                                                    className="px-3 py-1.5 rounded-xl bg-slate-100 text-slate-600 text-[11px] font-black hover:bg-slate-200 transition-colors"
                                                >
                                                    View
                                                </Link>
                                                <Link
                                                    href={`/admin/dashboard`}
                                                    className="px-3 py-1.5 rounded-xl bg-teal-600 text-white text-[11px] font-black hover:bg-teal-700 transition-colors"
                                                >
                                                    Approve →
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <p className="text-[10px] text-slate-400 font-bold mt-2 text-center">
                                    Full approval controls in <Link href="/admin/dashboard" className="text-teal-600 hover:underline">Business Dashboard →</Link>
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </section>

            {/* Dashboard Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-8 sm:pb-10">
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <BackButton />
                    </div>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tighter mb-3">Activity Intelligence</h1>
                    <p className="text-slate-500 font-medium max-w-lg leading-relaxed text-sm sm:text-base">Real-time surveillance across the Marinduque Hub ecosystem.</p>
                </div>
                <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 md:pb-0 hide-scrollbar -mx-4 sm:mx-0 px-4 sm:px-0">
                    <Link href="/admin/users" className="bg-white border border-slate-200 p-4 rounded-3xl min-w-[140px] shadow-sm flex-shrink-0 hover:border-blue-300 hover:shadow-md transition-all">
                        <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase block mb-1">Users</span>
                        <span className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">{(newUsers ?? []).length}+</span>
                    </Link>
                    <Link href="/admin/dashboard" className="bg-white border border-slate-200 p-4 rounded-3xl min-w-[140px] shadow-sm flex-shrink-0 hover:border-teal-300 hover:shadow-md transition-all">
                        <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase block mb-1">Businesses</span>
                        <span className="text-xl sm:text-2xl font-black text-teal-600 tracking-tight">Manage</span>
                    </Link>
                    <Link href="/admin/moderation" className="bg-white border border-slate-200 p-4 rounded-3xl min-w-[140px] shadow-sm flex-shrink-0 hover:border-amber-300 hover:shadow-md transition-all relative">
                        {(pendingCount ?? 0) > 0 && (
                            <span className="absolute -top-1 -right-1 bg-moriones-red text-white text-[9px] font-black w-5 h-5 rounded-full flex items-center justify-center">{pendingCount}</span>
                        )}
                        <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase block mb-1">Listings</span>
                        <span className="text-xl sm:text-2xl font-black text-amber-600 tracking-tight">{pendingCount ?? 0} flagged</span>
                    </Link>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">

                {/* COLUMN 1: User Intelligence */}
                <section className="bg-white rounded-[2rem] sm:rounded-[3rem] border border-slate-200 p-6 sm:p-8 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 blur-3xl rounded-full" />
                    <div className="flex justify-between items-center mb-6 relative z-10">
                        <h3 className="font-black text-xs uppercase tracking-[0.2em] text-blue-600">Identity Registry</h3>
                        <span className="material-symbols-outlined text-slate-300">group_add</span>
                    </div>
                    <div className="flex flex-col gap-3 relative z-10">
                        {newUsers?.map(user => (
                            <div key={user.id} className="flex items-center justify-between bg-slate-50 border border-slate-100 p-3 rounded-2xl hover:border-slate-300 hover:shadow-md transition-all">
                                <div className="flex items-center gap-3 truncate">
                                    <div className="w-9 h-9 rounded-xl bg-slate-200 overflow-hidden relative border border-slate-200 shadow-sm shrink-0">
                                        {user.avatar_url ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={user.avatar_url} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-xs font-black text-slate-500">{user.full_name?.charAt(0) || 'U'}</div>
                                        )}
                                    </div>
                                    <p className="text-sm font-black text-slate-800 truncate">{user.full_name || 'Anonymous'}</p>
                                </div>
                                <span className={`shrink-0 px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${user.role === 'admin' ? 'bg-red-50 text-red-600 border border-red-200' : user.role === 'banned' ? 'bg-orange-50 text-orange-600 border border-orange-200' : 'bg-slate-100 text-slate-500 border border-slate-200'}`}>
                                    {user.role}
                                </span>
                            </div>
                        ))}
                    </div>
                    <Link href="/admin/users" className="relative z-10 mt-6 block text-center py-3 bg-slate-50 border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-800 hover:border-slate-300 hover:bg-slate-100 transition-all shadow-sm">
                        Manage Full Registry
                    </Link>
                </section>

                {/* COLUMN 2: Enterprise */}
                <section className="bg-white rounded-[2rem] sm:rounded-[3rem] border border-slate-200 p-6 sm:p-8 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-teal-50 blur-3xl rounded-full" />
                    <div className="flex justify-between items-center mb-6 relative z-10">
                        <h3 className="font-black text-xs uppercase tracking-[0.2em] text-teal-600">Enterprise Intake</h3>
                        <span className="material-symbols-outlined text-slate-300">storefront</span>
                    </div>
                    <div className="flex flex-col gap-3 relative z-10">
                        {newBusinesses?.map(biz => (
                            <div key={biz.id} className="flex justify-between items-center bg-slate-50 border border-slate-100 p-3 rounded-2xl hover:border-slate-300 hover:shadow-md transition-all">
                                <Link href={`/directory/${biz.id}`} target="_blank" className="text-sm font-black text-slate-800 hover:text-teal-600 transition-colors block truncate flex-1 pr-2">
                                    {biz.business_name}
                                </Link>
                                {biz.is_verified ? (
                                    <span className="material-symbols-outlined text-teal-500 text-lg shrink-0">verified</span>
                                ) : (
                                    <span className="material-symbols-outlined text-slate-400 text-lg shrink-0">hourglass_empty</span>
                                )}
                            </div>
                        ))}
                    </div>
                    <Link href="/admin/dashboard" className="relative z-10 mt-6 block text-center py-3 bg-slate-50 border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-800 hover:border-slate-300 hover:bg-slate-100 transition-all shadow-sm">
                        Review Business Profiles
                    </Link>
                </section>

                {/* COLUMN 3: Market */}
                <section className="bg-white rounded-[2rem] sm:rounded-[3rem] border border-slate-200 p-6 sm:p-8 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 blur-3xl rounded-full" />
                    <div className="flex justify-between items-center mb-6 relative z-10">
                        <h3 className="font-black text-xs uppercase tracking-[0.2em] text-amber-500">Market Surveillance</h3>
                        <div className="flex items-center gap-2">
                            {(pendingCount ?? 0) > 0 && (
                                <span className="bg-moriones-red text-white text-[10px] font-black px-2 py-0.5 rounded-full animate-pulse">{pendingCount} pending</span>
                            )}
                            <span className="material-symbols-outlined text-slate-300">inventory_2</span>
                        </div>
                    </div>
                    <div className="flex flex-col gap-3 relative z-10">
                        {recentListings?.map(item => (
                            <div key={item.id} className="flex justify-between items-center bg-slate-50 border border-slate-100 p-3 rounded-2xl hover:border-slate-300 hover:shadow-md transition-all">
                                <Link href={`/marketplace/${item.id}`} target="_blank" className="text-sm font-black text-slate-800 hover:text-amber-500 transition-colors block truncate flex-1 pr-2">
                                    {item.title}
                                </Link>
                                <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${item.status === 'pending' ? 'bg-amber-400 animate-pulse' : item.status === 'active' ? 'bg-teal-500' : 'bg-slate-300'}`} />
                            </div>
                        ))}
                    </div>
                    <Link href="/admin/moderation" className={`relative z-10 mt-6 flex items-center justify-center gap-2 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm ${(pendingCount ?? 0) > 0 ? 'bg-moriones-red/10 border border-moriones-red/30 text-moriones-red hover:bg-moriones-red hover:text-white' : 'bg-slate-50 border border-slate-200 text-slate-500 hover:text-slate-800 hover:border-slate-300 hover:bg-slate-100'}`}>
                        {(pendingCount ?? 0) > 0 && <span className="material-symbols-outlined text-sm">flag</span>}
                        {(pendingCount ?? 0) > 0 ? `Review ${pendingCount} Flagged` : 'Moderate Marketplace'}
                    </Link>
                </section>
            </div>

            {/* ── Boat Operators (Vouch System) ── */}
            <section className="bg-white rounded-[2rem] sm:rounded-[3rem] border border-slate-200 p-6 sm:p-8 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-50 blur-3xl rounded-full pointer-events-none" />
                <div className="flex justify-between items-center mb-5 relative z-10">
                    <div>
                        <h3 className="font-black text-xs uppercase tracking-[0.2em] text-cyan-600">🏝️ Island Hopping Operators</h3>
                        <p className="text-[10px] text-slate-400 font-bold mt-0.5">Vouch system — Edit or remove profiles</p>
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{(boatServices ?? []).length} registered</span>
                </div>
                <div className="relative z-10">
                    <OperatorManagementPanel
                        operators={boatServices ?? []}
                        table="boat_services"
                        editBasePath="/island-hopping"
                        label="boat operators"
                        icon="sailing"
                    />
                </div>
            </section>

            {/* ── Commute / Delivery Drivers (Vouch System) ── */}
            <section className="bg-white rounded-[2rem] sm:rounded-[3rem] border border-slate-200 p-6 sm:p-8 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-purple-50 blur-3xl rounded-full pointer-events-none" />
                <div className="flex justify-between items-center mb-5 relative z-10">
                    <div>
                        <h3 className="font-black text-xs uppercase tracking-[0.2em] text-purple-600">🚐 Commute & Delivery Drivers</h3>
                        <p className="text-[10px] text-slate-400 font-bold mt-0.5">Vouch system — Edit or remove profiles</p>
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{(transportServices ?? []).length} registered</span>
                </div>
                <div className="relative z-10">
                    <OperatorManagementPanel
                        operators={transportServices ?? []}
                        table="transport_services"
                        editBasePath="/commute"
                        label="drivers"
                        icon="directions_bus"
                    />
                </div>
            </section>

            {/* ── Database Health ── */}
            <section className="bg-white rounded-[2rem] sm:rounded-[3rem] border border-slate-200 p-6 sm:p-8 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-50 blur-3xl rounded-full pointer-events-none" />
                <div className="flex justify-between items-center mb-5 relative z-10">
                    <div>
                        <h3 className="font-black text-xs uppercase tracking-[0.2em] text-emerald-600">Database Storage</h3>
                        <p className="text-[10px] text-slate-400 font-bold mt-0.5">Monitoring 500MB free-tier limit</p>
                    </div>
                    <span className="material-symbols-outlined text-slate-300">database</span>
                </div>
                <div className="relative z-10">
                    <DbHealthWidget variant="mini" refreshInterval={3600} />
                </div>
            </section>

            {/* ── Contact Inbox (Interactive) ── */}
            <section className="bg-white rounded-[2rem] sm:rounded-[3rem] border border-slate-200 p-6 sm:p-8 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-violet-50 blur-3xl rounded-full pointer-events-none" />
                <div className="flex justify-between items-center mb-6 relative z-10">
                    <div>
                        <h3 className="font-black text-xs uppercase tracking-[0.2em] text-violet-600">Contact Inbox</h3>
                        {unreadMessages > 0 && (
                            <span className="text-[10px] font-black text-violet-500">{unreadMessages} unread</span>
                        )}
                    </div>
                    <span className="material-symbols-outlined text-slate-300">mail</span>
                </div>
                <div className="relative z-10">
                    <ContactInbox messages={contactMessages ?? []} />
                </div>
            </section>
        </div>
    );
}
