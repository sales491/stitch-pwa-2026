import { createClient } from '@/utils/supabase/server';
import Link from 'next/link';
import BoatApprovalList from './BoatApprovalList';
import DbHealthWidget from '@/components/DbHealthWidget';

export default async function AdminDashboard() {
    const supabase = await createClient();

    // Fetch the latest platform activity concurrently for speed
    const [
        { data: newUsers },
        { data: newBusinesses },
        { data: recentListings },
        { count: pendingCount },
        { data: contactMessages },
        { data: boatServices },
    ] = await Promise.all([
        supabase.from('profiles').select('id, full_name, avatar_url, role, created_at').order('created_at', { ascending: false }).limit(6),
        supabase.from('business_profiles').select('id, business_name, is_verified, created_at').order('created_at', { ascending: false }).limit(6),
        supabase.from('listings').select('id, title, status, created_at').order('created_at', { ascending: false }).limit(6),
        supabase.from('listings').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('contact_messages').select('id, name, email, subject, message, is_read, created_at').order('created_at', { ascending: false }).limit(20),
        supabase.from('boat_services').select('id, operator_name, boat_type, service_type, base_municipality, contact_number, is_approved, created_at').order('created_at', { ascending: false }),
    ]);

    // Show pending listings first, then recent active ones
    const newListings = recentListings;
    const pendingBoats = (boatServices ?? []).filter((b: { is_approved: boolean }) => !b.is_approved).length;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10 space-y-8 sm:space-y-12 pb-24 font-display">
            {/* Dashboard Executive Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200 pb-8 sm:pb-10">
                <div>
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tighter mb-3">Activity Intelligence</h1>
                    <p className="text-slate-500 font-medium max-w-lg leading-relaxed text-sm sm:text-base">Real-time surveillance across the Marinduque Hub ecosystem. Reviewing newest users, local enterprise claims, and marketplace liquidity.</p>
                </div>
                <div className="flex gap-3 sm:gap-4 overflow-x-auto pb-4 md:pb-0 hide-scrollbar -mx-4 sm:mx-0 px-4 sm:px-0">
                    <div className="bg-white border border-slate-200 p-4 rounded-3xl min-w-[140px] shadow-sm flex-shrink-0">
                        <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase block mb-1">Global Users</span>
                        <span className="text-xl sm:text-2xl font-black text-slate-800 tracking-tight">Active</span>
                    </div>
                    <div className="bg-white border border-slate-200 p-4 rounded-3xl min-w-[140px] shadow-sm flex-shrink-0">
                        <span className="text-[10px] font-black tracking-widest text-slate-400 uppercase block mb-1">Server Latency</span>
                        <span className="text-xl sm:text-2xl font-black text-teal-600 tracking-tight">Optimized</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">

                {/* COLUMN 1: User Intelligence */}
                <section className="bg-white rounded-[2rem] sm:rounded-[3rem] border border-slate-200 p-6 sm:p-8 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 blur-3xl rounded-full"></div>

                    <div className="flex justify-between items-center mb-6 sm:mb-8 relative z-10">
                        <h3 className="font-black text-xs uppercase tracking-[0.2em] text-blue-600">Identity Registry</h3>
                        <span className="material-symbols-outlined text-slate-300">group_add</span>
                    </div>

                    <div className="flex flex-col gap-3 sm:gap-4 relative z-10">
                        {newUsers?.map(user => (
                            <div key={user.id} className="flex items-center justify-between bg-slate-50 border border-slate-100 p-3 sm:p-4 rounded-2xl transition-all hover:border-slate-300 hover:shadow-md cursor-default">
                                <div className="flex items-center gap-3 truncate">
                                    <div className="w-10 h-10 rounded-xl bg-slate-200 overflow-hidden relative border border-slate-200 shadow-sm shrink-0">
                                        {user.avatar_url ? (
                                            // eslint-disable-next-line @next/next/no-img-element
                                            <img src={user.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-xs font-black text-slate-500">
                                                {user.full_name?.charAt(0) || 'U'}
                                            </div>
                                        )}
                                    </div>
                                    <div className="truncate">
                                        <p className="text-sm font-black text-slate-800 truncate">{user.full_name || 'Anonymous'}</p>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Joined today</p>
                                    </div>
                                </div>
                                <span className={`shrink-0 px-2 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${user.role === 'admin' ? 'bg-red-50 text-red-600 border border-red-200' : 'bg-slate-100 text-slate-500 border border-slate-200'}`}>
                                    {user.role}
                                </span>
                            </div>
                        ))}
                    </div>

                    <Link href="/admin/users" className="relative z-10 mt-6 sm:mt-8 block text-center py-3 sm:py-4 bg-slate-50 border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-800 hover:border-slate-300 hover:bg-slate-100 transition-all shadow-sm">
                        Manage Full Registry
                    </Link>
                </section>

                {/* COLUMN 2: Enterprise Growth */}
                <section className="bg-white rounded-[2rem] sm:rounded-[3rem] border border-slate-200 p-6 sm:p-8 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-teal-50 blur-3xl rounded-full"></div>

                    <div className="flex justify-between items-center mb-6 sm:mb-8 relative z-10">
                        <h3 className="font-black text-xs uppercase tracking-[0.2em] text-teal-600">Enterprise Intake</h3>
                        <span className="material-symbols-outlined text-slate-300">storefront</span>
                    </div>

                    <div className="flex flex-col gap-3 sm:gap-4 relative z-10">
                        {newBusinesses?.map(biz => (
                            <div key={biz.id} className="flex justify-between items-center bg-slate-50 border border-slate-100 p-3 sm:p-4 rounded-2xl transition-all hover:border-slate-300 hover:shadow-md group/item">
                                <div className="truncate flex-1 pr-2">
                                    <Link href={`/directory/${biz.id}`} target="_blank" className="text-sm font-black text-slate-800 group-hover/item:text-teal-600 transition-colors block truncate">
                                        {biz.business_name}
                                    </Link>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">Application Pending</p>
                                </div>
                                <div className="flex items-center gap-2 shrink-0">
                                    {biz.is_verified ? (
                                        <span className="material-symbols-outlined text-teal-500 text-lg">verified</span>
                                    ) : (
                                        <span className="material-symbols-outlined text-slate-400 text-lg">hourglass_empty</span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <Link href="/admin/dashboard" className="relative z-10 mt-6 sm:mt-8 block text-center py-3 sm:py-4 bg-slate-50 border border-slate-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-800 hover:border-slate-300 hover:bg-slate-100 transition-all shadow-sm">
                        Review Business Profiles
                    </Link>
                </section>

                {/* COLUMN 3: Market Liquidity */}
                <section className="bg-white rounded-[2rem] sm:rounded-[3rem] border border-slate-200 p-6 sm:p-8 shadow-sm relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50 blur-3xl rounded-full"></div>

                    <div className="flex justify-between items-center mb-6 sm:mb-8 relative z-10">
                        <h3 className="font-black text-xs uppercase tracking-[0.2em] text-amber-500">Market Surveillance</h3>
                        <div className="flex items-center gap-2">
                            {(pendingCount ?? 0) > 0 && (
                                <span className="bg-moriones-red text-white text-[10px] font-black px-2 py-0.5 rounded-full animate-pulse">
                                    {pendingCount} pending
                                </span>
                            )}
                            <span className="material-symbols-outlined text-slate-300">inventory_2</span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 sm:gap-4 relative z-10">
                        {newListings?.map(item => (
                            <div key={item.id} className="flex justify-between items-center bg-slate-50 border border-slate-100 p-3 sm:p-4 rounded-2xl transition-all hover:border-slate-300 hover:shadow-md group/item">
                                <div className="truncate flex-1 pr-2">
                                    <Link href={`/marketplace/${item.id}`} target="_blank" className="text-sm font-black text-slate-800 group-hover/item:text-amber-500 transition-colors block truncate">
                                        {item.title}
                                    </Link>
                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-0.5">{new Date(item.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} •&nbsp;
                                        {item.status === 'pending' ? (
                                            <span className="text-amber-500 font-black">Awaiting Review</span>
                                        ) : item.status === 'active' ? (
                                            <span className="text-teal-500">Live</span>
                                        ) : (
                                            <span>{item.status}</span>
                                        )}
                                    </p>
                                </div>
                                <div className="block shrink-0">
                                    {item.status === 'pending' ? (
                                        <div className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)] animate-pulse"></div>
                                    ) : (
                                        <div className={`w-2.5 h-2.5 rounded-full ${item.status === 'active' ? 'bg-teal-500 shadow-[0_0_8px_rgba(20,184,166,0.4)]' : 'bg-slate-300'}`}></div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>

                    <Link href="/admin/moderation" className={`relative z-10 mt-6 sm:mt-8 flex items-center justify-center gap-2 py-3 sm:py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm ${(pendingCount ?? 0) > 0
                        ? 'bg-moriones-red/10 border border-moriones-red/30 text-moriones-red hover:bg-moriones-red hover:text-white hover:border-moriones-red'
                        : 'bg-slate-50 border border-slate-200 text-slate-500 hover:text-slate-800 hover:border-slate-300 hover:bg-slate-100'
                        }`}>
                        {(pendingCount ?? 0) > 0 && <span className="material-symbols-outlined text-sm">flag</span>}
                        {(pendingCount ?? 0) > 0 ? `Review ${pendingCount} Pending Listing${pendingCount === 1 ? '' : 's'}` : 'Moderate Marketplace'}
                    </Link>
                </section>

            </div>

            {/* Boat Listing Approvals */}
            <section className="bg-white rounded-[2rem] sm:rounded-[3rem] border border-slate-200 p-6 sm:p-8 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-50 blur-3xl rounded-full pointer-events-none" />
                <div className="flex justify-between items-center mb-6 relative z-10">
                    <div>
                        <h3 className="font-black text-xs uppercase tracking-[0.2em] text-cyan-600">Island Hopping — Boat Approvals</h3>
                        {pendingBoats > 0 && (
                            <span className="text-[10px] font-black text-amber-500">
                                {pendingBoats} pending approval
                            </span>
                        )}
                    </div>
                    <span className="text-xl">🏝️</span>
                </div>
                <BoatApprovalList boats={boatServices ?? []} />
            </section>

            {/* Database Health Monitor */}
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

            {/* Contact Inbox */}
            <section className="bg-white rounded-[2rem] sm:rounded-[3rem] border border-slate-200 p-6 sm:p-8 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-violet-50 blur-3xl rounded-full pointer-events-none" />
                <div className="flex justify-between items-center mb-6 relative z-10">
                    <div>
                        <h3 className="font-black text-xs uppercase tracking-[0.2em] text-violet-600">Contact Inbox</h3>
                        {contactMessages && contactMessages.filter(m => !m.is_read).length > 0 && (
                            <span className="text-[10px] font-black text-violet-500">
                                {contactMessages.filter(m => !m.is_read).length} unread
                            </span>
                        )}
                    </div>
                    <span className="material-symbols-outlined text-slate-300">mail</span>
                </div>

                {!contactMessages || contactMessages.length === 0 ? (
                    <p className="text-sm text-slate-400 font-medium text-center py-8 relative z-10">No messages yet.</p>
                ) : (
                    <div className="flex flex-col gap-3 relative z-10">
                        {contactMessages.map(msg => (
                            <div
                                key={msg.id}
                                className={`rounded-2xl border p-4 transition-all ${msg.is_read
                                    ? 'bg-slate-50 border-slate-100'
                                    : 'bg-violet-50/60 border-violet-200'
                                    }`}
                            >
                                <div className="flex items-start justify-between gap-3 mb-1">
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-black text-slate-800 truncate">{msg.name}</p>
                                        <p className="text-[11px] text-slate-400 truncate">{msg.email}</p>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        {!msg.is_read && (
                                            <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
                                        )}
                                        <span className="text-[10px] text-slate-400 font-bold whitespace-nowrap">
                                            {new Date(msg.created_at).toLocaleDateString('en-PH', { month: 'short', day: 'numeric' })}
                                        </span>
                                    </div>
                                </div>
                                <p className="text-[11px] font-black uppercase tracking-widest text-violet-600 mb-1">{msg.subject}</p>
                                <p className="text-[13px] text-slate-600 leading-relaxed whitespace-pre-wrap">{msg.message}</p>
                            </div>
                        ))}
                    </div>
                )}
            </section>

        </div>
    );
}
